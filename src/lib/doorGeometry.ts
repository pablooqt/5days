import type { RoomConfig, WallSide } from '@/types/building';

export interface DoorTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
}

export function getDoorTransform(room: RoomConfig, deviceId: string, openingId?: string): DoorTransform | null {
  if (room.type === 'corridor' || !room.doors?.length || !deviceId.startsWith('DOOR')) return null;

  const opening = (openingId ? room.doors.find((door) => door.id === openingId) : undefined)
    ?? room.doors.find((door) => deviceId.toLowerCase().includes(door.id.replace('door-', '')))
    ?? room.doors[0];
  const isHorizontal = opening.wall === 'north' || opening.wall === 'south';
  const wallLength = isHorizontal ? room.width : room.depth;
  const alongWall = -wallLength / 2 + opening.offset + opening.width / 2;
  // Keep the device in the same local wall basis used by RoomWalls. South and
  // west walls are rotated, so their local X axis reverses in world space.
  const position: [number, number, number] =
    opening.wall === 'north'
      ? [room.position[0] + alongWall, 0, room.position[2] - room.depth / 2]
      : opening.wall === 'south'
        ? [room.position[0] - alongWall, 0, room.position[2] + room.depth / 2]
        : opening.wall === 'west'
          ? [room.position[0] - room.width / 2, 0, room.position[2] - alongWall]
          : [room.position[0] + room.width / 2, 0, room.position[2] + alongWall];

  return {
    position: [position[0] - room.position[0], position[1], position[2] - room.position[2]],
    rotation: [0, getDoorRotation(opening.wall), 0],
    width: opening.width,
    height: opening.height,
  };
}

function getDoorRotation(wall: WallSide) {
  return wall === 'west' ? Math.PI / 2 : wall === 'east' ? -Math.PI / 2 : 0;
}
