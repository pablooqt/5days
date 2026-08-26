import type { RoomConfig } from '@/types/building';

export function getAcTransform(room: RoomConfig, sourcePosition: [number, number, number]) {
  const nearEast = sourcePosition[0] >= 0;
  const nearNorth = Math.abs(sourcePosition[2]) > room.depth / 2 - 1;
  const y = room.height - 0.42;

  if (nearNorth) {
    return {
      position: [Math.max(-room.width / 2 + 0.45, Math.min(room.width / 2 - 0.45, sourcePosition[0])), y, -room.depth / 2 + 0.18] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
    };
  }

  if (nearEast) {
    return {
      position: [room.width / 2 - 0.18, y, Math.max(-room.depth / 2 + 0.45, Math.min(room.depth / 2 - 0.45, sourcePosition[2]))] as [number, number, number],
      rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    };
  }

  return {
    position: [-room.width / 2 + 0.18, y, Math.max(-room.depth / 2 + 0.45, Math.min(room.depth / 2 - 0.45, sourcePosition[2]))] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  };
}
