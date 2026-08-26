import type { BuildingConfig, CoreConfig, FloorConfig } from '@/types/building';
import type { ElevatorState } from '@/types/devices';

export function getElevatorLocation(building: BuildingConfig, state: ElevatorState): { floor: FloorConfig; core: CoreConfig } | null {
  const floor = building.floors[state.currentFloor - 1] ?? building.floors[0];
  const core = floor?.cores?.find((item) => item.type === 'elevator');
  return floor && core ? { floor, core } : null;
}
