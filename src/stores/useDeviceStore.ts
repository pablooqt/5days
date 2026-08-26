import { create } from 'zustand';
import {
  DeviceDefinition,
  DeviceState,
  AcState,
  LightState,
  DoorState,
  ElevatorState,
  CctvState,
  SensorState,
} from '@/types/devices';
import { DeviceStatus } from '@/types/domain';

// ─── Mock Device Registry ─────────────────────────────────────────────────────
// Mirrors the deviceIds defined in src/config/building.ts

export const MOCK_DEFINITIONS: DeviceDefinition[] = [
  // ── Floor 1 : Lobby ──────────────────────────────────────────────────────
  { id: 'LIGHT_LOBBY', name: 'Lobby Ceiling Light', type: 'light', roomId: 'room-lobby', floorId: 'floor-1', capabilities: ['switchable', 'dimmable'], status: 'online',  position: [0, 2.8, 0] },
  { id: 'AC_LOBBY',    name: 'Lobby AC Unit',        type: 'ac',    roomId: 'room-lobby', floorId: 'floor-1', capabilities: ['switchable', 'temperatureControl'], status: 'online',  position: [2.5, 2.5, 0] },
  { id: 'SENSOR_LOBBY',name: 'Lobby Air Quality',    type: 'sensor',roomId: 'room-lobby', floorId: 'floor-1', capabilities: ['observable'],         status: 'online',  position: [0, 2.2, 2] },
  { id: 'DOOR_LOBBY',  name: 'Lobby Main Door',      type: 'door',  roomId: 'room-lobby', floorId: 'floor-1', openingId: 'door-lobby-main', capabilities: ['openable', 'lockable'],status: 'online',  position: [0, 0, 3.5] },

  // ── Floor 1 : Room 101 ───────────────────────────────────────────────────
  { id: 'AC_101',      name: 'Room 101 AC Unit',     type: 'ac',    roomId: 'room-101', floorId: 'floor-1', capabilities: ['switchable', 'temperatureControl'], status: 'online',  position: [2.5, 2.5, 0] },
  { id: 'LIGHT_101',   name: 'Room 101 Lights',      type: 'light', roomId: 'room-101', floorId: 'floor-1', capabilities: ['switchable', 'dimmable'], status: 'online',  position: [0, 2.8, 0] },
  { id: 'DOOR_101',    name: 'Room 101 Door',        type: 'door',  roomId: 'room-101', floorId: 'floor-1', openingId: 'door-101', capabilities: ['openable', 'lockable'], status: 'online',  position: [-0.4, 0, 3.5] },
  { id: 'SENSOR_101',  name: 'Room 101 Temp Sensor', type: 'sensor',roomId: 'room-101', floorId: 'floor-1', capabilities: ['observable'],         status: 'online',  position: [-2, 2.2, 0] },

  // ── Floor 1 : Room 102 (Utility) ─────────────────────────────────────────
  { id: 'SENSOR_102',  name: 'Utility Air Sensor',   type: 'sensor',roomId: 'room-102', floorId: 'floor-1', capabilities: ['observable'],         status: 'warning', position: [0, 2.2, 0] },
  { id: 'LIGHT_102',   name: 'Utility Strip Light',  type: 'light', roomId: 'room-102', floorId: 'floor-1', capabilities: ['switchable'],          status: 'online',  position: [0, 2.8, 0] },
  { id: 'DOOR_102',    name: 'Utility Room Door',    type: 'door',  roomId: 'room-102', floorId: 'floor-1', capabilities: ['openable', 'lockable'], status: 'online', position: [0.3, 0, -2.25] },
  { id: 'AC_102',      name: 'Utility Room AC Unit', type: 'ac',    roomId: 'room-102', floorId: 'floor-1', capabilities: ['switchable', 'temperatureControl'], status: 'online', position: [-2.8, 2.5, 0] },

  // ── Floor 2 : Room 201 ───────────────────────────────────────────────────
  { id: 'AC_201',      name: 'Room 201 AC Unit',     type: 'ac',    roomId: 'room-201', floorId: 'floor-2', capabilities: ['switchable', 'temperatureControl'], status: 'online',  position: [2.5, 2.5, 0] },
  { id: 'LIGHT_201',   name: 'Room 201 Lights',      type: 'light', roomId: 'room-201', floorId: 'floor-2', capabilities: ['switchable', 'dimmable'], status: 'online',  position: [0, 2.8, 0] },
  { id: 'DOOR_201',    name: 'Room 201 Door',        type: 'door',  roomId: 'room-201', floorId: 'floor-2', openingId: 'door-201', capabilities: ['openable', 'lockable'], status: 'online',  position: [-0.4, 0, 3.5] },
  { id: 'CCTV_201',    name: 'Room 201 CCTV',        type: 'cctv',  roomId: 'room-201', floorId: 'floor-2', capabilities: ['observable'],         status: 'online',  position: [3, 2.7, -3], rotation: [0, Math.PI, 0] },
  { id: 'SENSOR_201',  name: 'Room 201 Env Sensor',  type: 'sensor',roomId: 'room-201', floorId: 'floor-2', capabilities: ['observable'],         status: 'online',  position: [-2, 2.2, 0] },

  // ── Floor 2 : Room 202 ───────────────────────────────────────────────────
  { id: 'AC_202',      name: 'Room 202 AC Unit',     type: 'ac',    roomId: 'room-202', floorId: 'floor-2', capabilities: ['switchable', 'temperatureControl'], status: 'online',  position: [2.5, 2.5, 0] },
  { id: 'LIGHT_202',   name: 'Room 202 Lights',      type: 'light', roomId: 'room-202', floorId: 'floor-2', capabilities: ['switchable', 'dimmable'], status: 'online',  position: [0, 2.8, 0] },
  { id: 'DOOR_202',    name: 'Room 202 Door',        type: 'door',  roomId: 'room-202', floorId: 'floor-2', openingId: 'door-202', capabilities: ['openable'],            status: 'online',  position: [-0.4, 0, 3.5] },
  { id: 'SENSOR_202',  name: 'Room 202 Env Sensor',  type: 'sensor',roomId: 'room-202', floorId: 'floor-2', capabilities: ['observable'],         status: 'warning', position: [-2, 2.2, 0] },

  // ── Floor 2 : Elevator ───────────────────────────────────────────────────
  { id: 'ELEVATOR_01', name: 'Main Elevator',        type: 'elevator', roomId: 'room-corr-2', floorId: 'floor-2', capabilities: ['movable'],           status: 'active',  position: [0, 0, -4.25] },

  // ── Floor 2 : Corridor ───────────────────────────────────────────────────
  { id: 'LIGHT_CORR_2', name: 'Central Skywalk Lights', type: 'light', roomId: 'room-corr-2', floorId: 'floor-2', capabilities: ['switchable'], status: 'online', position: [0, 2.8, 0] },
  { id: 'CCTV_CORR_2', name: 'Corridor 2 CCTV', type: 'cctv', roomId: 'room-corr-2', floorId: 'floor-2', capabilities: ['observable'], status: 'online', position: [3, 2.7, -1], rotation: [0, Math.PI, 0] },

  // ── Floor 1 / 3 corridor and Floor 3 office devices ─────────────────────
  { id: 'LIGHT_CORR_1', name: 'Ground Corridor Lights', type: 'light', roomId: 'room-corr-1', floorId: 'floor-1', capabilities: ['switchable'], status: 'online', position: [0, 2.8, 0] },
  { id: 'CCTV_CORR_1', name: 'Ground Corridor CCTV', type: 'cctv', roomId: 'room-corr-1', floorId: 'floor-1', capabilities: ['observable'], status: 'online', position: [3, 2.7, -1], rotation: [0, Math.PI, 0] },

  // ── Floor 3 : Room 301 ───────────────────────────────────────────────────
  { id: 'AC_301',      name: 'Room 301 AC Unit',     type: 'ac',    roomId: 'room-301', floorId: 'floor-3', capabilities: ['switchable', 'temperatureControl'], status: 'online',  position: [2.5, 2.5, 0] },
  { id: 'LIGHT_301',   name: 'Room 301 Lights',      type: 'light', roomId: 'room-301', floorId: 'floor-3', capabilities: ['switchable', 'dimmable'], status: 'online',  position: [0, 2.8, 0] },
  { id: 'DOOR_301',    name: 'Room 301 Door',        type: 'door',  roomId: 'room-301', floorId: 'floor-3', openingId: 'door-301', capabilities: ['openable', 'lockable'], status: 'online',  position: [0.7, 0, 4] },
  { id: 'SENSOR_301',  name: 'Room 301 Env Sensor',  type: 'sensor',roomId: 'room-301', floorId: 'floor-3', capabilities: ['observable'],         status: 'online',  position: [-2, 2.2, 0] },
  { id: 'CCTV_301',    name: 'Executive CCTV',       type: 'cctv',  roomId: 'room-301', floorId: 'floor-3', capabilities: ['observable'],         status: 'offline', position: [3, 2.7, -3], rotation: [0, Math.PI, 0] },
  { id: 'AC_302',      name: 'Room 302 AC Unit',     type: 'ac',    roomId: 'room-302', floorId: 'floor-3', capabilities: ['switchable', 'temperatureControl'], status: 'online', position: [2.5, 2.5, 0] },
  { id: 'LIGHT_302',   name: 'Room 302 Lights',      type: 'light', roomId: 'room-302', floorId: 'floor-3', capabilities: ['switchable', 'dimmable'], status: 'online', position: [0, 2.8, 0] },
  { id: 'DOOR_302',    name: 'Room 302 Door',        type: 'door', roomId: 'room-302', floorId: 'floor-3', openingId: 'door-302', capabilities: ['openable', 'lockable'], status: 'online', position: [-0.4, 0, 4] },
  { id: 'LIGHT_CORR_3', name: 'Sky Garden Lights', type: 'light', roomId: 'room-corr-3', floorId: 'floor-3', capabilities: ['switchable'], status: 'online', position: [0, 2.8, 0] },
  { id: 'CCTV_CORR_3', name: 'Sky Garden CCTV', type: 'cctv', roomId: 'room-corr-3', floorId: 'floor-3', capabilities: ['observable'], status: 'online', position: [3, 2.7, -1], rotation: [0, Math.PI, 0] },
];

// ─── Mock Initial States ──────────────────────────────────────────────────────

export function buildInitialStates(): Record<string, DeviceState> {
  const states: Record<string, DeviceState> = {};

  for (const def of MOCK_DEFINITIONS) {
    switch (def.type) {
      case 'ac':
        states[def.id] = { type: 'ac', state: { power: true, temperature: 23, mode: 'cool', fanSpeed: 'auto' } };
        break;
      case 'light':
        states[def.id] = { type: 'light', state: { power: true, brightness: 80, colorTemp: 4000 } };
        break;
      case 'door':
        states[def.id] = { type: 'door', state: { open: false, locked: false } };
        break;
      case 'elevator':
        states[def.id] = { type: 'elevator', state: { currentFloor: 1, targetFloor: null, direction: 'idle', doorOpen: true, phase: 'idle' } };
        break;
      case 'cctv':
        states[def.id] = { type: 'cctv', state: { online: def.status !== 'offline', recording: def.status !== 'offline' } };
        break;
      case 'sensor':
        states[def.id] = {
          type: 'sensor',
          state: {
            value: def.id.includes('LOBBY') ? 22.4 : def.id.includes('102') ? 28.7 : 23.1,
            unit: '°C',
            status: def.status,
          },
        };
        break;
    }
  }

  return states;
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface DeviceStoreState {
  // Lookup maps
  definitions: Record<string, DeviceDefinition>;
  states: Record<string, DeviceState>;
  /** deviceId[] per room */
  devicesByRoom: Record<string, string[]>;

  // Selected device
  selectedDeviceId: string | null;
  selectDevice: (id: string | null) => void;

  // Mutations
  setAcState: (id: string, partial: Partial<AcState>) => void;
  setLightState: (id: string, partial: Partial<LightState>) => void;
  setDoorState: (id: string, partial: Partial<DoorState>) => void;
  setElevatorState: (id: string, partial: Partial<ElevatorState>) => void;
  callElevator: (id: string, targetFloor: number, floorCount?: number) => void;
  setCctvState: (id: string, partial: Partial<CctvState>) => void;
  setSensorState: (id: string, partial: Partial<SensorState>) => void;
  setDeviceStatus: (id: string, status: DeviceStatus) => void;
  registerEditableDevice: (definition: DeviceDefinition, state: DeviceState) => void;
  hydrateStates: (definitions: Record<string, DeviceDefinition>, rows: Array<{ device_id: string; state: unknown }>) => void;
  applyRemoteState: (deviceId: string, state: unknown) => void;
  hydrateLocalStates: () => void;
  simulateLocalClimate: () => void;
}

export const useDeviceStore = create<DeviceStoreState>((set) => {
  const definitions: Record<string, DeviceDefinition> = {};
  const devicesByRoom: Record<string, string[]> = {};

  for (const def of MOCK_DEFINITIONS) {
    definitions[def.id] = def;
    if (!devicesByRoom[def.roomId]) devicesByRoom[def.roomId] = [];
    devicesByRoom[def.roomId].push(def.id);
  }

  return {
    definitions,
    states: buildInitialStates(),
    devicesByRoom,

    selectedDeviceId: null,
    applyRemoteState: (deviceId, state) => set((s) => {
      const current = s.states[deviceId];
      if (!current) return s;
      const states = { ...s.states, [deviceId]: { type: current.type, state: state as never } as DeviceState };
      persistPreviewStates(states);
      return { states };
    }),
    hydrateLocalStates: () => set((s) => ({ states: readPreviewStates(s.states) })),
    simulateLocalClimate: () => set((s) => {
      const states = { ...s.states };
      const definitions = { ...s.definitions };
      for (const ac of Object.values(s.definitions).filter((device) => device.type === 'ac')) {
        const acState = states[ac.id];
        if (acState?.type !== 'ac') continue;
        const sensor = Object.values(s.definitions).find((device) => device.type === 'sensor' && device.roomId === ac.roomId);
        const sensorState = sensor && states[sensor.id];
        if (!sensor || sensorState?.type !== 'sensor') continue;
        const difference = sensorState.state.value - acState.state.temperature;
        const delta = acState.state.power && acState.state.mode === 'cool'
          ? Math.max(-0.65, -Math.max(0.08, difference * 0.12))
          : 0.12;
        const value = Math.max(16, Math.min(35, sensorState.state.value + delta));
        const status = value > 27 ? 'warning' : value <= 26 ? 'online' : 'active';
        states[sensor.id] = { type: 'sensor', state: { ...sensorState.state, value, status } };
        definitions[sensor.id] = { ...definitions[sensor.id], status };
      }
      persistPreviewStates(states);
      return { states, definitions };
    }),
    hydrateStates: (remoteDefinitions, rows) => set((s) => {
      const states = { ...s.states };
      for (const row of rows) {
        const current = states[row.device_id];
        if (current) states[row.device_id] = { type: current.type, state: row.state as never } as DeviceState;
      }
      return { definitions: remoteDefinitions, states };
    }),
    selectDevice: (id) => set({ selectedDeviceId: id }),

    setAcState: (id, partial) =>
      set((s) => {
        const existing = s.states[id];
        if (!existing || existing.type !== 'ac') return s;
      const states: Record<string, DeviceState> = { ...s.states, [id]: { type: 'ac', state: { ...existing.state, ...partial } } as DeviceState };
        persistPreviewStates(states);
        return { states };
      }),

    setLightState: (id, partial) =>
      set((s) => {
        const existing = s.states[id];
        if (!existing || existing.type !== 'light') return s;
      const states: Record<string, DeviceState> = { ...s.states, [id]: { type: 'light', state: { ...existing.state, ...partial } } as DeviceState };
        persistPreviewStates(states);
        return { states };
      }),

    setDoorState: (id, partial) =>
      set((s) => {
        const existing = s.states[id];
        if (!existing || existing.type !== 'door') return s;
      const states: Record<string, DeviceState> = { ...s.states, [id]: { type: 'door', state: { ...existing.state, ...partial } } as DeviceState };
        persistPreviewStates(states);
        return { states };
      }),

    setElevatorState: (id, partial) =>
      set((s) => {
        const existing = s.states[id];
        if (!existing || existing.type !== 'elevator') return s;
        const states = { ...s.states, [id]: { type: 'elevator', state: { ...existing.state, ...partial } } as DeviceState };
        persistPreviewStates(states);
        return { states };
      }),

    callElevator: (id, targetFloor, floorCount = 3) => {
      if (typeof window === 'undefined') return;
      const current = useDeviceStore.getState().states[id];
      if (current?.type !== 'elevator' || targetFloor < 1 || targetFloor > floorCount) return;
      if (current.state.phase !== 'idle' || targetFloor === current.state.currentFloor) return;

      const direction = targetFloor > current.state.currentFloor ? 'up' : 'down';
      useDeviceStore.getState().setElevatorState(id, {
        targetFloor,
        direction,
        doorOpen: false,
        phase: 'doors_closing',
      });

      const travelMs = Math.abs(targetFloor - current.state.currentFloor) * 900;
      window.setTimeout(() => {
        useDeviceStore.getState().setElevatorState(id, { phase: 'moving' });
      }, 500);
      window.setTimeout(() => {
        useDeviceStore.getState().setElevatorState(id, {
          currentFloor: targetFloor,
          phase: 'doors_opening',
        });
      }, 500 + travelMs);
      window.setTimeout(() => {
        useDeviceStore.getState().setElevatorState(id, {
          targetFloor: null,
          direction: 'idle',
          doorOpen: true,
          phase: 'idle',
        });
      }, 1000 + travelMs);
    },

    setCctvState: (id, partial) =>
      set((s) => {
        const existing = s.states[id];
        if (!existing || existing.type !== 'cctv') return s;
         const states: Record<string, DeviceState> = { ...s.states, [id]: { type: 'cctv', state: { ...existing.state, ...partial } } as DeviceState };
        persistPreviewStates(states);
        return { states };
      }),

    setSensorState: (id, partial) =>
      set((s) => {
        const existing = s.states[id];
        if (!existing || existing.type !== 'sensor') return s;
        return { states: { ...s.states, [id]: { type: 'sensor', state: { ...existing.state, ...partial } } } };
      }),

    setDeviceStatus: (id, status) =>
      set((s) => {
        const def = s.definitions[id];
        if (!def) return s;
         return { definitions: { ...s.definitions, [id]: { ...def, status } } };
       }),

    registerEditableDevice: (definition, state) => set((current) => ({
      definitions: { ...current.definitions, [definition.id]: definition },
      states: { ...current.states, [definition.id]: state },
      devicesByRoom: definition.roomId
        ? { ...current.devicesByRoom, [definition.roomId]: [...(current.devicesByRoom[definition.roomId] ?? []).filter((id) => id !== definition.id), definition.id] }
        : current.devicesByRoom,
    })),
  };
});

const PREVIEW_STORAGE_KEY = '5days-preview-device-states';

function persistPreviewStates(states: Record<string, DeviceState>) {
  if (typeof window === 'undefined' || process.env.NEXT_PUBLIC_ENABLE_REMOTE_SYNC === 'true') return;
  window.localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(states));
}

function readPreviewStates(fallback: Record<string, DeviceState>) {
  if (typeof window === 'undefined' || process.env.NEXT_PUBLIC_ENABLE_REMOTE_SYNC === 'true') return fallback;
  try {
    const stored = JSON.parse(window.localStorage.getItem(PREVIEW_STORAGE_KEY) ?? 'null') as Record<string, DeviceState> | null;
    const merged = stored ? { ...fallback, ...stored } : fallback;
    for (const [id, deviceState] of Object.entries(merged)) {
      if (deviceState.type === 'elevator' && !deviceState.state.phase) {
        merged[id] = {
          type: 'elevator',
          state: {
            ...deviceState.state,
            targetFloor: null,
            direction: 'idle',
            doorOpen: true,
            phase: 'idle',
          },
        };
      }
    }
    return merged;
  } catch {
    return fallback;
  }
}
