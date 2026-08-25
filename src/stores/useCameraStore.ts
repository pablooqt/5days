import { create } from 'zustand';
import { demoBuildingConfig } from '@/config/building';

export type CameraCommandType =
  | 'overview'
  | 'focusFloor'
  | 'focusRoom'
  | 'focusDevice'
  | 'reset';

export interface CameraCommand {
  type: CameraCommandType;
  targetId?: string;
  position: [number, number, number];
  target: [number, number, number];
  nonce: number;
}

interface CameraState {
  command: CameraCommand;
  issueCommand: (type: CameraCommandType, targetId?: string) => void;
  setCustomTarget: (position: [number, number, number], target: [number, number, number]) => void;
}

const DEFAULT_POSITION: [number, number, number] = [24, 22, 24];
const DEFAULT_TARGET: [number, number, number] = [0, 0.8, 0];
const INITIAL_POSITION: [number, number, number] = [18, 19, 18];
const INITIAL_TARGET: [number, number, number] = [0, 0.5, 0];

export const useCameraStore = create<CameraState>((set) => ({
  command: {
    type: 'focusFloor',
    targetId: 'floor-1',
    position: INITIAL_POSITION,
    target: INITIAL_TARGET,
    nonce: 1,
  },
  issueCommand: (type, targetId) => {
    let position: [number, number, number] = DEFAULT_POSITION;
    let target: [number, number, number] = DEFAULT_TARGET;

    if (type === 'focusFloor' && targetId) {
      const floor = demoBuildingConfig.floors.find((f) => f.id === targetId);
      if (floor) {
        target = [0, floor.elevation + 0.5, 0];
        position = [18, floor.elevation + 19, 18];
      }
    } else if (type === 'focusRoom' && targetId) {
      for (const floor of demoBuildingConfig.floors) {
        const room = floor.rooms.find((r) => r.id === targetId);
        if (room) {
          const worldY = floor.elevation + room.position[1];
          const worldX = room.position[0];
          const worldZ = room.position[2];
          target = [worldX, worldY + 1.0, worldZ];
          position = [worldX + 11, worldY + 9, worldZ + 11];
          break;
        }
      }
    }

    set({
      command: {
        type,
        targetId,
        position,
        target,
        nonce: Date.now(),
      },
    });
  },
  setCustomTarget: (position, target) =>
    set({
      command: {
        type: 'focusDevice',
        position,
        target,
        nonce: Date.now(),
      },
    }),
}));
