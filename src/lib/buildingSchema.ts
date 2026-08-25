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
  return result.data;
}
