'use client';

import React, { useMemo } from 'react';
import { BuildingConfig } from '@/types/building';
import { useSelectionStore } from '@/stores/useSelectionStore';
import { useVisibilityStore } from '@/stores/useVisibilityStore';
import { FloorGroup } from './FloorGroup';
import { demoBuildingConfig } from '@/config/building';
import { materials } from '../materials/catalog';

interface BuildingProps {
  config?: BuildingConfig;
}

export const Building: React.FC<BuildingProps> = ({
  config = demoBuildingConfig,
}) => {
  const selectedFloorId = useSelectionStore((s) => s.selectedFloorId);
  const floorMode = useVisibilityStore((s) => s.floorMode);

  // Determine selected floor index for hideUpper mode
  const selectedFloorIndex = useMemo(() => {
    if (!selectedFloorId) return null;
    const found = config.floors.find((f) => f.id === selectedFloorId);
    return found ? found.index : null;
  }, [config.floors, selectedFloorId]);

  const visibleFloors = useMemo(() => {
    return config.floors.filter((floor) => {
      if (floorMode === 'hideUpper' && selectedFloorIndex !== null) {
        return floor.index <= selectedFloorIndex;
      }
      if (floorMode === 'isolate' && selectedFloorId) {
        return floor.id === selectedFloorId;
      }
      return true;
    });
  }, [config.floors, floorMode, selectedFloorId, selectedFloorIndex]);

  return (
    <group name="building-root" userData={{ kind: 'building', id: config.id }}>
      {/* Ground Foundation Slab */}
      <mesh
        position={[0, -0.4, 0]}
        receiveShadow
        material={materials.groundMaterial}
      >
        <boxGeometry
          args={[
            config.footprint.width + 12,
            0.4,
            config.footprint.depth + 12,
          ]}
        />
      </mesh>

      {/* Floors */}
      {visibleFloors.map((floor) => (
        <FloorGroup
          key={floor.id}
          floor={floor}
          footprint={config.footprint}
          wallThickness={config.wallThickness}
        />
      ))}
    </group>
  );
};
