import { create } from 'zustand';
import { ObjectInteractionKind } from '@/types/domain';

interface SelectionState {
  selectedBuildingId: string | null;
  selectedFloorId: string | null;
  selectedRoomId: string | null;
  selectedDeviceId: string | null;
  hoveredKind: ObjectInteractionKind | null;
  hoveredId: string | null;
  selectFloor: (floorId: string | null) => void;
  selectRoom: (roomId: string | null) => void;
  selectDevice: (deviceId: string | null) => void;
  setHovered: (kind: ObjectInteractionKind | null, id: string | null) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedBuildingId: 'omnitwin-one',
  selectedFloorId: 'floor-1',
  selectedRoomId: null,
  selectedDeviceId: null,
  hoveredKind: null,
  hoveredId: null,
  selectFloor: (floorId) =>
    set({
      selectedFloorId: floorId,
      selectedRoomId: null,
      selectedDeviceId: null,
    }),
  selectRoom: (roomId) =>
    set({
      selectedRoomId: roomId,
      selectedDeviceId: null,
    }),
  selectDevice: (deviceId) =>
    set({
      selectedDeviceId: deviceId,
    }),
  setHovered: (kind, id) =>
    set({
      hoveredKind: kind,
      hoveredId: id,
    }),
  clearSelection: () =>
    set({
      selectedFloorId: null,
      selectedRoomId: null,
      selectedDeviceId: null,
      hoveredKind: null,
      hoveredId: null,
    }),
}));
