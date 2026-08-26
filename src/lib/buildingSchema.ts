import { z } from 'zod';

export const WallSideSchema = z.enum(['north', 'south', 'east', 'west']);

export const DoorOpeningSchema = z.object({
  id: z.string().min(1),
  wall: WallSideSchema,
  offset: z.number().nonnegative(),
  width: z.number().positive(),
  height: z.number().positive(),
});

export const WindowOpeningSchema = z.object({
  id: z.string().min(1),
  wall: WallSideSchema,
  offset: z.number().nonnegative(),
  elevation: z.number().nonnegative(),
  width: z.number().positive(),
  height: z.number().positive(),
});

export const RoomTypeSchema = z.enum(['office', 'meeting', 'lobby', 'utility', 'corridor']);

export const RoomSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: RoomTypeSchema,
  floorId: z.string().min(1),
  position: z.tuple([z.number(), z.number(), z.number()]),
  width: z.number().positive(),
  depth: z.number().positive(),
  height: z.number().positive(),
  doors: z.array(DoorOpeningSchema).optional(),
  windows: z.array(WindowOpeningSchema).optional(),
  deviceIds: z.array(z.string()).default([]),
});

export const CoreSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['elevator', 'stairs']),
  position: z.tuple([z.number(), z.number(), z.number()]),
  width: z.number().positive(),
  depth: z.number().positive(),
  height: z.number().positive(),
});

export const FloorSchema = z.object({
  id: z.string().min(1),
  index: z.number().int().nonnegative(),
  name: z.string().min(1),
  elevation: z.number().nonnegative(),
  rooms: z.array(RoomSchema),
  cores: z.array(CoreSchema).optional(),
});

export const BuildingFootprintSchema = z.object({
  width: z.number().positive(),
  depth: z.number().positive(),
});

export const BuildingConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  footprint: BuildingFootprintSchema,
  floorHeight: z.number().positive(),
  wallThickness: z.number().positive().default(0.12),
  floors: z.array(FloorSchema).min(1),
});

interface SpatialBox {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
}

const MIN_ROOM_CLEARANCE = 0.7;
const MIN_DOOR_CLEARANCE = 0.6;

function boxesOverlap(a: SpatialBox, b: SpatialBox, padding = 0.08) {
  return (
    Math.abs(a.x - b.x) < (a.width + b.width) / 2 - padding &&
    Math.abs(a.z - b.z) < (a.depth + b.depth) / 2 - padding
  );
}

function getBoxGap(a: SpatialBox, b: SpatialBox) {
  const xGap = Math.max(0, Math.abs(a.x - b.x) - (a.width + b.width) / 2);
  const zGap = Math.max(0, Math.abs(a.z - b.z) - (a.depth + b.depth) / 2);
  return Math.max(xGap, zGap);
}

function getDoorPoint(room: z.infer<typeof RoomSchema>, door: z.infer<typeof DoorOpeningSchema>) {
  const horizontal = door.wall === 'north' || door.wall === 'south';
  const wallLength = horizontal ? room.width : room.depth;
  const alongWall = -wallLength / 2 + door.offset + door.width / 2;
  return horizontal
    ? { x: room.position[0] + alongWall, z: room.position[2] + (door.wall === 'north' ? -room.depth / 2 : room.depth / 2) }
    : { x: room.position[0] + (door.wall === 'west' ? -room.width / 2 : room.width / 2), z: room.position[2] + alongWall };
}

function validateSpatialLayout(config: z.infer<typeof BuildingConfigSchema>) {
  for (const floor of config.floors) {
    const rooms = floor.rooms.map((room) => ({
      id: room.id,
      x: room.position[0],
      z: room.position[2],
      width: room.width,
      depth: room.depth,
    }));

    for (let index = 0; index < rooms.length; index += 1) {
      for (let otherIndex = index + 1; otherIndex < rooms.length; otherIndex += 1) {
        if (boxesOverlap(rooms[index], rooms[otherIndex])) {
          throw new Error(
            `[BuildingConfig Error] Rooms ${rooms[index].id} and ${rooms[otherIndex].id} overlap on ${floor.id}`,
          );
        }
        if (getBoxGap(rooms[index], rooms[otherIndex]) < MIN_ROOM_CLEARANCE) {
          throw new Error(
            `[BuildingConfig Error] Rooms ${rooms[index].id} and ${rooms[otherIndex].id} need at least ${MIN_ROOM_CLEARANCE}m clearance on ${floor.id}`,
          );
        }
      }
    }

    const doors = floor.rooms.flatMap((room) =>
      (room.doors ?? []).map((door) => ({ roomId: room.id, point: getDoorPoint(room, door) })),
    );
    for (let index = 0; index < doors.length; index += 1) {
      for (let otherIndex = index + 1; otherIndex < doors.length; otherIndex += 1) {
        if (doors[index].roomId === doors[otherIndex].roomId) continue;
        const distance = Math.hypot(
          doors[index].point.x - doors[otherIndex].point.x,
          doors[index].point.z - doors[otherIndex].point.z,
        );
        if (distance < MIN_DOOR_CLEARANCE) {
          throw new Error(
            `[BuildingConfig Error] Door openings in ${doors[index].roomId} and ${doors[otherIndex].roomId} need at least ${MIN_DOOR_CLEARANCE}m clearance on ${floor.id}`,
          );
        }
      }
    }

    for (const core of floor.cores ?? []) {
      const coreBox = {
        id: core.id,
        x: core.position[0],
        z: core.position[2],
        width: core.width,
        depth: core.depth,
      };
      const overlappingRoom = rooms.find((room) => boxesOverlap(room, coreBox));
      if (overlappingRoom) {
        throw new Error(
          `[BuildingConfig Error] Core ${core.id} overlaps room ${overlappingRoom.id} on ${floor.id}`,
        );
      }
    }
  }
}

export function validateBuildingConfig(config: unknown) {
  const result = BuildingConfigSchema.safeParse(config);
  if (!result.success) {
    const errorDetails = result.error.issues
      ? result.error.issues
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join('; ')
      : String(result.error);
    throw new Error(`[BuildingConfig Error] Invalid building configuration: ${errorDetails}`);
  }
  validateSpatialLayout(result.data);
  return result.data;
}
