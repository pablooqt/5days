import { RoomType } from './domain';

export type WallSide = 'north' | 'south' | 'east' | 'west';

export interface DoorOpeningConfig {
  id: string;
  wall: WallSide;
  offset: number; // offset along wall from bottom-left corner in meters
  width: number;
  height: number;
}

export interface WindowOpeningConfig {
  id: string;
  wall: WallSide;
  offset: number;
  elevation: number; // height above floor level
  width: number;
  height: number;
}

export interface RoomConfig {
  id: string;
  name: string;
  type: RoomType;
  floorId: string;
  position: [number, number, number]; // center [x, y, z] relative to floor origin
  width: number; // along X
  depth: number; // along Z
  height: number; // along Y
  doors?: DoorOpeningConfig[];
  windows?: WindowOpeningConfig[];
  deviceIds: string[];
}

export interface CoreConfig {
  id: string;
  type: 'elevator' | 'stairs';
  position: [number, number, number];
  width: number;
  depth: number;
  height: number;
}

export interface FloorConfig {
  id: string;
  index: number;
  name: string;
  elevation: number; // meters above ground
  rooms: RoomConfig[];
  cores?: CoreConfig[];
}

export interface BuildingFootprint {
  width: number;
  depth: number;
}

export interface BuildingConfig {
  id: string;
  name: string;
  footprint: BuildingFootprint;
  floorHeight: number;
  wallThickness: number;
  floors: FloorConfig[];
}
