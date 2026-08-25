export type AppMode = 'landing' | 'management';

export type UserRole = 'viewer' | 'operator' | 'admin';

export type RoomType = 'office' | 'meeting' | 'lobby' | 'utility' | 'corridor';

export type RoomStatus = 'occupied' | 'vacant' | 'warning' | 'offline';

export type DeviceType = 'ac' | 'light' | 'door' | 'elevator' | 'cctv' | 'sensor';

export type Capability =
  | 'switchable'
  | 'dimmable'
  | 'temperatureControl'
  | 'lockable'
  | 'openable'
  | 'movable'
  | 'observable';

export type DeviceStatus = 'online' | 'offline' | 'warning' | 'active';

export type FloorVisibilityMode = 'full' | 'selected' | 'hideUpper' | 'isolate';

export type ObjectInteractionKind = 'building' | 'floor' | 'room' | 'device';
