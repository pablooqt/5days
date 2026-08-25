import { create } from 'zustand';
import { FloorVisibilityMode } from '@/types/domain';

interface VisibilityState {
  floorMode: FloorVisibilityMode;
  transparentWalls: boolean;
  isolatedFloorId: string | null;
  setFloorMode: (mode: FloorVisibilityMode) => void;
  setTransparentWalls: (transparent: boolean) => void;
  toggleTransparentWalls: () => void;
  setIsolatedFloorId: (floorId: string | null) => void;
}

export const useVisibilityStore = create<VisibilityState>((set) => ({
  floorMode: 'isolate',
  transparentWalls: false,
  isolatedFloorId: null,
  setFloorMode: (mode) => set({ floorMode: mode }),
  setTransparentWalls: (transparent) => set({ transparentWalls: transparent }),
  toggleTransparentWalls: () => set((s) => ({ transparentWalls: !s.transparentWalls })),
  setIsolatedFloorId: (floorId) => set({ isolatedFloorId: floorId }),
}));
