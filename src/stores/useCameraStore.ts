import { create } from 'zustand';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { getDoorTransform } from '@/lib/doorGeometry';
import { useBuildingStore } from '@/stores/useBuildingStore';
import { getElevatorLocation } from '@/lib/elevatorLocation';

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
  isZoomedIn: boolean;
  setIsZoomedIn: (val: boolean) => void;
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
  isZoomedIn: false,
  setIsZoomedIn: (val) => set({ isZoomedIn: val }),
  issueCommand: (type, targetId) => {
    let position: [number, number, number] = DEFAULT_POSITION;
    let target: [number, number, number] = DEFAULT_TARGET;

    if (type === 'focusFloor' && targetId) {
       const floors = useBuildingStore.getState().layout.building.floors;
       const floor = floors.find((f) => f.id === targetId);
      if (floor) {
        target = [0, floor.elevation + 0.5, 0];
        position = [18, floor.elevation + 19, 18];
      }
    } else if (type === 'focusRoom' && targetId) {
       for (const floor of useBuildingStore.getState().layout.building.floors) {
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
    } else if (type === 'focusDevice' && targetId) {
      const device = useDeviceStore.getState().definitions[targetId];
      if (device) {
        if (device.type === 'elevator') {
          const elevatorState = useDeviceStore.getState().states[device.id];
          if (elevatorState?.type === 'elevator') {
            const location = getElevatorLocation(useBuildingStore.getState().layout.building, elevatorState.state);
            if (location) {
              const worldX = location.core.position[0];
              const worldY = location.floor.elevation + location.core.height / 2;
              const worldZ = location.core.position[2];
              target = [worldX, worldY, worldZ];
              position = [worldX + 8, worldY + 7, worldZ + 8];
            }
          }
        }
        const floor = useBuildingStore.getState().layout.building.floors.find((f) => f.id === device.floorId);
        const room = floor?.rooms.find((r) => r.id === device.roomId);
        if (floor && room && device.type !== 'elevator') {
           const doorTransform = device.type === 'door' ? getDoorTransform(room, device.id, device.openingId) : null;
           const devX = doorTransform?.position[0] ?? device.position?.[0] ?? 0;
           const devY = doorTransform?.position[1] ?? device.position?.[1] ?? 1.5;
           const devZ = doorTransform?.position[2] ?? device.position?.[2] ?? 0;
          const worldX = room.position[0] + devX;
          const worldY = floor.elevation + room.position[1] + devY;
          const worldZ = room.position[2] + devZ;
          target = [worldX, worldY, worldZ];
          position = [worldX + 4.5, worldY + 3.8, worldZ + 4.5];
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
