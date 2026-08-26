import { DeviceType, DeviceStatus, Capability } from './domain';

// ─── Device Capability Payloads ───────────────────────────────────────────────

export interface AcState {
  power: boolean;
  temperature: number;   // target °C
  mode: 'cool' | 'heat' | 'fan' | 'auto';
  fanSpeed: 'low' | 'medium' | 'high' | 'auto';
}

export interface LightState {
  power: boolean;
  brightness: number;  // 0–100 %
  colorTemp: number;   // 2700–6500 K
}

export interface DoorState {
  open: boolean;
  locked: boolean;
}

export interface ElevatorState {
  currentFloor: number;   // 1-indexed
  targetFloor: number | null;
  direction: 'up' | 'down' | 'idle';
  doorOpen: boolean;
  phase: 'idle' | 'doors_closing' | 'moving' | 'doors_opening';
}

export interface CctvState {
  online: boolean;
  recording: boolean;
}

export interface SensorState {
  value: number;
  unit: string;           // e.g. '°C', '%RH', 'lux', 'ppm'
  status: DeviceStatus;
}

export type DeviceState =
  | { type: 'ac';       state: AcState }
  | { type: 'light';    state: LightState }
  | { type: 'door';     state: DoorState }
  | { type: 'elevator'; state: ElevatorState }
  | { type: 'cctv';    state: CctvState }
  | { type: 'sensor';   state: SensorState };

// ─── Device Definition ────────────────────────────────────────────────────────

export interface DeviceDefinition {
  id: string;
  name: string;
  type: DeviceType;
  roomId: string;
  floorId: string;
  openingId?: string;
  capabilities: Capability[];
  status: DeviceStatus;
  /** Local position relative to room center [x, y, z] */
  position: [number, number, number];
  /** Euler rotation in radians [x, y, z] */
  rotation?: [number, number, number];
}
