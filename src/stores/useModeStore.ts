import { create } from 'zustand';
import { AppMode } from '@/types/domain';

interface ModeState {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const useModeStore = create<ModeState>((set) => ({
  mode: 'landing',
  setMode: (mode) => set({ mode }),
}));
