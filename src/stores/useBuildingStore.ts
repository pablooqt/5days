'use client';

import { create } from 'zustand';
import { demoBuildingConfig } from '@/config/building';
import type { BuildingConfig, EditableBuildingLayout, EditorTool, LayoutObject, LayoutObjectKind } from '@/types/building';
import { useDeviceStore } from '@/stores/useDeviceStore';
import type { DeviceDefinition, DeviceState } from '@/types/devices';

const STORAGE_KEY = '5days-building-layout-v1';

interface BuildingStore {
  layout: EditableBuildingLayout;
  hydrated: boolean;
  editorMode: boolean;
  selectedObjectId: string | null;
  activeEditorFloorId: string | null;
  activeEditorRoomId: string | null;
  editorTool: EditorTool;
  pendingObjectKind: LayoutObjectKind | null;
  snapEnabled: boolean;
  hydrate: () => void;
  setEditorMode: (enabled: boolean) => void;
  setEditorFloor: (floorId: string) => void;
  setEditorRoom: (roomId: string) => void;
  setEditorTool: (tool: EditorTool) => void;
  beginPlacement: (kind: LayoutObjectKind) => void;
  placeObject: (position: [number, number, number]) => void;
  cancelPlacement: () => void;
  toggleSnap: () => void;
  selectObject: (id: string | null) => void;
  addFloor: () => void;
  addObject: (kind: LayoutObjectKind, floorId: string, roomId?: string) => void;
  addObjectAt: (kind: LayoutObjectKind, floorId: string, position: [number, number, number], roomId?: string) => void;
  updateObject: (id: string, patch: Partial<Pick<LayoutObject, 'name' | 'floorId' | 'roomId' | 'position' | 'rotation' | 'scale'>>) => void;
  deleteObject: (id: string) => void;
  resetLayout: () => void;
}

function initialLayout(): EditableBuildingLayout {
  const objects: LayoutObject[] = [];
  for (const floor of demoBuildingConfig.floors) {
    for (const room of floor.rooms) {
      if (room.type === 'lobby') {
        objects.push({ id: `interior-${room.id}-sofa`, kind: 'sofa', name: 'Lobby Sofa', floorId: floor.id, roomId: room.id, position: [-1.6, 0, 0], rotation: [0, 0, 0], scale: [1.8, 0.8, 0.8] });
        objects.push({ id: `interior-${room.id}-plant`, kind: 'plant', name: 'Lobby Plant', floorId: floor.id, roomId: room.id, position: [3.1, 0, -1.8], rotation: [0, 0, 0], scale: [0.7, 1.2, 0.7] });
      } else if (room.type === 'meeting') {
        objects.push({ id: `interior-${room.id}-table`, kind: 'table', name: 'Meeting Table', floorId: floor.id, roomId: room.id, position: [0, 0, 0], rotation: [0, 0, 0], scale: [2.8, 0.75, 0.9] });
      } else if (room.type === 'office') {
        objects.push({ id: `interior-${room.id}-table`, kind: 'table', name: 'Office Table', floorId: floor.id, roomId: room.id, position: [0, 0, 0], rotation: [0, 0, 0], scale: [2.1, 0.75, 0.9] });
        objects.push({ id: `interior-${room.id}-plant`, kind: 'plant', name: 'Office Plant', floorId: floor.id, roomId: room.id, position: [room.width / 2 - 0.7, 0, room.depth / 2 - 0.7], rotation: [0, 0, 0], scale: [0.7, 1.2, 0.7] });
      }
    }
  }
  return { building: demoBuildingConfig, objects };
}

function persist(layout: EditableBuildingLayout) {
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function cloneId(prefix: string, floorIndex: number, roomId: string, sourceId: string) {
  const safe = `${prefix}_${roomId}_${sourceId}`.replace(/[^a-zA-Z0-9_]/g, '_');
  return `${safe}_F${floorIndex + 1}`;
}

function cloneFloorStructure(source: EditableBuildingLayout['building']['floors'][number], index: number, floorId: string) {
  const roomIdMap = new Map<string, string>();
  const rooms = source.rooms.map((room) => {
    const roomId = makeId(`room-${index + 1}`);
    roomIdMap.set(room.id, roomId);
    return {
      ...room,
      id: roomId,
      floorId,
      deviceIds: [],
      doors: room.doors?.map((door) => ({ ...door, id: `${door.id}-floor-${index + 1}` })),
      windows: room.windows?.map((window) => ({ ...window, id: `${window.id}-floor-${index + 1}` })),
    };
  });
  return {
    floor: {
      id: floorId,
      index,
      name: `Floor ${index + 1}`,
      elevation: index * 3.4,
      rooms,
      cores: source.cores?.map((core) => ({ ...core, id: `${core.id}-floor-${index + 1}` })),
    },
    roomIdMap,
  };
}

function objectDefaults(kind: LayoutObjectKind) {
  const defaults: Record<LayoutObjectKind, { name: string; scale: [number, number, number] }> = {
    ac: { name: 'Air Conditioner', scale: [1, 1, 1] },
    light: { name: 'Ceiling Light', scale: [1, 1, 1] },
    sensor: { name: 'Sensor', scale: [0.5, 0.5, 0.5] },
    cctv: { name: 'CCTV Camera', scale: [0.7, 0.7, 0.7] },
    sofa: { name: 'Sofa', scale: [1.8, 0.8, 0.8] },
    bed: { name: 'Bed', scale: [1.8, 0.45, 2.2] },
    table: { name: 'Table', scale: [1.4, 0.75, 0.9] },
    chair: { name: 'Chair', scale: [0.6, 1, 0.6] },
    plant: { name: 'Plant', scale: [0.7, 1.2, 0.7] },
  };
  return defaults[kind];
}

export const useBuildingStore = create<BuildingStore>((set, get) => ({
  layout: initialLayout(),
  hydrated: false,
  editorMode: false,
  selectedObjectId: null,
  activeEditorFloorId: null,
  activeEditorRoomId: null,
  editorTool: 'select',
  pendingObjectKind: null,
  snapEnabled: true,
  hydrate: () => {
    if (typeof window === 'undefined') return;
    try {
      const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null') as EditableBuildingLayout | null;
      let layout = parsed?.building?.floors?.length ? parsed : initialLayout();
      const floors = layout.building.floors.map((floor, index, allFloors) => {
        if (index < 3 || floor.rooms.length > 0) return floor;
        const source = allFloors[index - 1];
        if (!source?.rooms.length) return floor;
        return cloneFloorStructure(source, index, floor.id).floor;
      });
      layout = { ...layout, building: { ...layout.building, floors } };
      const definitions = useDeviceStore.getState().definitions;
      const states = useDeviceStore.getState().states;
      const normalizedFloors = layout.building.floors.map((floor) => ({
        ...floor,
        rooms: floor.rooms.map((room) => {
          const deviceIds = [...new Set(room.deviceIds)];
          for (const opening of room.doors ?? []) {
            const matchingId = deviceIds.find((id) => definitions[id]?.type === 'door' && definitions[id]?.openingId === opening.id)
              ?? deviceIds.find((id) => definitions[id]?.type === 'door' && id.toLowerCase().includes(opening.id.replace('door-', '')));
            if (matchingId) continue;
            const id = `DOOR_${room.id}_${opening.id}`.replace(/[^a-zA-Z0-9_]/g, '_');
            deviceIds.push(id);
            const definition = { id, name: `${room.name} Door`, type: 'door' as const, roomId: room.id, floorId: floor.id, openingId: opening.id, capabilities: ['openable' as const, 'lockable' as const], status: 'online' as const, position: [0, 0, 0] as [number, number, number] };
            definitions[id] = definition;
            states[id] = { type: 'door', state: { open: false, locked: false } };
          }
          return { ...room, deviceIds };
        }),
      }));
      layout = { ...layout, building: { ...layout.building, floors: normalizedFloors } };
      useDeviceStore.setState({
        definitions,
        states,
        devicesByRoom: Object.fromEntries(normalizedFloors.flatMap((floor) => floor.rooms.map((room) => [room.id, [...new Set(room.deviceIds)]]))),
      });
      persist(layout);
      const firstFloorId = layout.building.floors[0]?.id ?? null;
      set({ layout, hydrated: true, activeEditorFloorId: firstFloorId, activeEditorRoomId: layout.building.floors[0]?.rooms[0]?.id ?? null, selectedObjectId: null, editorTool: 'select', pendingObjectKind: null });
    } catch {
      const layout = initialLayout();
      set({ layout, hydrated: true, activeEditorFloorId: layout.building.floors[0]?.id ?? null, activeEditorRoomId: layout.building.floors[0]?.rooms[0]?.id ?? null, selectedObjectId: null, editorTool: 'select', pendingObjectKind: null });
    }
  },
  setEditorMode: (editorMode) => set((state) => ({
    editorMode,
    selectedObjectId: editorMode ? state.selectedObjectId : null,
    activeEditorFloorId: editorMode ? state.activeEditorFloorId ?? state.layout.building.floors[0]?.id ?? null : null,
    activeEditorRoomId: editorMode ? state.activeEditorRoomId ?? state.layout.building.floors[0]?.rooms[0]?.id ?? null : null,
    editorTool: editorMode ? 'select' : 'select',
    pendingObjectKind: null,
  })),
  setEditorFloor: (activeEditorFloorId) => set((state) => ({ activeEditorFloorId, activeEditorRoomId: state.layout.building.floors.find((floor) => floor.id === activeEditorFloorId)?.rooms[0]?.id ?? null, selectedObjectId: null, editorTool: 'select', pendingObjectKind: null })),
  setEditorRoom: (activeEditorRoomId) => set({ activeEditorRoomId, selectedObjectId: null, editorTool: 'select', pendingObjectKind: null }),
  setEditorTool: (editorTool) => set({ editorTool, pendingObjectKind: editorTool === 'place' ? get().pendingObjectKind : null }),
  beginPlacement: (kind) => set({ editorTool: 'place', pendingObjectKind: kind, selectedObjectId: null }),
  cancelPlacement: () => set({ editorTool: 'select', pendingObjectKind: null }),
  placeObject: (position) => {
    const state = get();
    if (state.editorTool !== 'place' || !state.pendingObjectKind || !state.activeEditorFloorId) return;
    const room = state.layout.building.floors
      .find((floor) => floor.id === state.activeEditorFloorId)
      ?.rooms.find((candidate) => candidate.id === state.activeEditorRoomId);
    if (room) {
      const margin = 0.45;
      if (Math.abs(position[0]) > room.width / 2 - margin || Math.abs(position[2]) > room.depth / 2 - margin) return;
    }
    state.addObjectAt(state.pendingObjectKind, state.activeEditorFloorId, position, state.activeEditorRoomId ?? undefined);
  },
  toggleSnap: () => set((state) => ({ snapEnabled: !state.snapEnabled })),
  selectObject: (selectedObjectId) => set({ selectedObjectId }),
  addFloor: () => set((state) => {
    const floors = state.layout.building.floors;
    const index = floors.length;
    const sourceFloor = floors[floors.length - 1];
    if (!sourceFloor) return state;
      const roomIdMap = new Map<string, string>();
      const deviceIdMap = new Map<string, string>();
      const openingIdMap = new Map<string, string>();
    const cloneRoom = (room: (typeof sourceFloor.rooms)[number]) => {
      const roomId = cloneId('ROOM', index, sourceFloor.id, room.id);
      roomIdMap.set(room.id, roomId);
      return {
        ...room,
        id: roomId,
        floorId: makeId(`floor-ref-${index + 1}`),
        deviceIds: room.deviceIds.map((deviceId) => {
          const clonedId = deviceId.startsWith('DOOR')
            ? cloneId('DOOR', index, roomId, deviceId)
            : cloneId('DEVICE', index, roomId, deviceId);
          deviceIdMap.set(deviceId, clonedId);
          return clonedId;
        }),
        doors: room.doors?.map((door) => {
          const id = cloneId('OPENING', index, roomId, door.id);
          openingIdMap.set(door.id, id);
          return { ...door, id };
        }),
        windows: room.windows?.map((window) => ({ ...window, id: cloneId('WINDOW', index, roomId, window.id) })),
      };
    };
    const floorId = makeId('floor');
    const rooms = sourceFloor.rooms.map((room) => ({ ...cloneRoom(room), floorId }));
    const floor = {
      id: floorId,
      index,
      name: `Floor ${index + 1}`,
      elevation: index * state.layout.building.floorHeight,
      rooms,
      cores: sourceFloor.cores?.map((core) => ({ ...core, id: cloneId('CORE', index, floorId, core.id) })),
    };
    const clonedObjects = state.layout.objects
      .filter((object) => object.floorId === sourceFloor.id)
      .map((object) => ({
        ...object,
        id: makeId(`interior-${index + 1}`),
        floorId,
        roomId: object.roomId ? roomIdMap.get(object.roomId) : undefined,
        deviceId: object.deviceId ? deviceIdMap.get(object.deviceId) : undefined,
      }));
    const sourceDefinitions = useDeviceStore.getState().definitions;
    const sourceStates = useDeviceStore.getState().states;
    const clonedDevices = sourceFloor.rooms.flatMap((room) => room.deviceIds.map((sourceId) => {
      const definition = sourceDefinitions[sourceId];
      const clonedId = deviceIdMap.get(sourceId);
      const clonedRoomId = roomIdMap.get(room.id);
      if (!definition || !clonedId || !clonedRoomId) return null;
      return {
        definition: { ...definition, id: clonedId, roomId: clonedRoomId, floorId, openingId: definition.openingId ? openingIdMap.get(definition.openingId) : undefined, position: [...definition.position] as [number, number, number] },
        state: sourceStates[sourceId],
      };
    }).filter(Boolean));
    const layout = {
      ...state.layout,
      building: { ...state.layout.building, floors: [...floors, floor] },
      objects: [...state.layout.objects, ...clonedObjects],
    };
    persist(layout);
    for (const clonedDevice of clonedDevices) {
      if (clonedDevice) useDeviceStore.getState().registerEditableDevice(clonedDevice.definition, clonedDevice.state);
    }
    return {
      layout,
      activeEditorFloorId: floorId,
      activeEditorRoomId: rooms[0]?.id ?? null,
      selectedObjectId: null,
      editorTool: 'select',
      pendingObjectKind: null,
    };
  }),
  addObject: (kind, floorId) => set((state) => {
    const defaults = objectDefaults(kind);
    const floorObjectCount = state.layout.objects.filter((object) => object.floorId === floorId).length;
    const column = floorObjectCount % 4;
    const row = Math.floor(floorObjectCount / 4);
    const object: LayoutObject = {
      id: makeId(kind),
      kind,
      name: defaults.name,
      floorId,
      position: [-5.5 + column * 3.2, 0, -3.5 + row * 2.4],
      rotation: [0, 0, 0],
      scale: defaults.scale,
    };
    const layout = { ...state.layout, objects: [...state.layout.objects, object] };
    persist(layout);
    return { layout, selectedObjectId: object.id };
  }),
  addObjectAt: (kind, floorId, position, roomId) => set((state) => {
    const defaults = objectDefaults(kind);
    const snapped = state.snapEnabled
      ? position.map((value) => Math.round(value / 0.25) * 0.25) as [number, number, number]
      : position;
    const objectId = makeId(kind);
    const deviceKind = kind === 'ac' || kind === 'light' || kind === 'sensor' || kind === 'cctv' ? kind : null;
    const deviceId = deviceKind ? `${deviceKind.toUpperCase()}_EDIT_${objectId.replace(/[^a-zA-Z0-9]/g, '')}` : undefined;
    const object: LayoutObject = {
      id: objectId,
      kind,
      name: defaults.name,
      floorId,
      roomId,
      deviceId,
      position: snapped,
      rotation: [0, 0, 0],
      scale: defaults.scale,
    };
    const layout = { ...state.layout, objects: [...state.layout.objects, object] };
    persist(layout);
    if (deviceId && roomId && deviceKind) {
      const definition: DeviceDefinition = { id: deviceId, name: defaults.name, type: deviceKind, roomId, floorId, capabilities: deviceKind === 'ac' ? ['switchable', 'temperatureControl'] : deviceKind === 'light' ? ['switchable', 'dimmable'] : ['observable'], status: 'online', position: snapped };
      const state: DeviceState = deviceKind === 'ac'
        ? { type: 'ac', state: { power: true, temperature: 23, mode: 'cool', fanSpeed: 'auto' } }
        : deviceKind === 'light'
          ? { type: 'light', state: { power: true, brightness: 80, colorTemp: 4000 } }
          : deviceKind === 'sensor'
            ? { type: 'sensor', state: { value: 23, unit: '°C', status: 'online' } }
            : { type: 'cctv', state: { online: true, recording: true } };
      useDeviceStore.getState().registerEditableDevice(definition, state);
    }
    return { layout, selectedObjectId: object.id, editorTool: 'select', pendingObjectKind: null };
  }),
  updateObject: (id, patch) => set((state) => {
    const layout = { ...state.layout, objects: state.layout.objects.map((object) => object.id === id ? { ...object, ...patch } : object) };
    persist(layout);
    return { layout };
  }),
  deleteObject: (id) => set((state) => {
    const layout = { ...state.layout, objects: state.layout.objects.filter((object) => object.id !== id) };
    persist(layout);
    return { layout, selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId };
  }),
  resetLayout: () => {
    const layout = initialLayout();
    persist(layout);
    set({
      layout,
      selectedObjectId: null,
      activeEditorFloorId: layout.building.floors[0]?.id ?? null,
      activeEditorRoomId: layout.building.floors[0]?.rooms[0]?.id ?? null,
      editorTool: 'select',
      pendingObjectKind: null,
    });
  },
}));

export function useActiveBuildingConfig(): BuildingConfig {
  return useBuildingStore((state) => state.layout.building);
}
