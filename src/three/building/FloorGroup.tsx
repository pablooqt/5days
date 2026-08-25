'use client';

import React from 'react';
import { FloorConfig, BuildingFootprint } from '@/types/building';
import { useSelectionStore } from '@/stores/useSelectionStore';
import { useVisibilityStore } from '@/stores/useVisibilityStore';
import { Slab } from './Slab';
import { Room } from '../rooms/Room';
import { materials } from '../materials/catalog';

interface FloorGroupProps {
  floor: FloorConfig;
  footprint: BuildingFootprint;
  wallThickness?: number;
}

export const FloorGroup: React.FC<FloorGroupProps> = ({
  floor,
  footprint,
  wallThickness = 0.12,
}) => {
  const selectedFloorId = useSelectionStore((s) => s.selectedFloorId);
  const floorMode = useVisibilityStore((s) => s.floorMode);
  const isolatedFloorId = useVisibilityStore((s) => s.isolatedFloorId);

  // Visibility logic
  const isSelected = selectedFloorId === floor.id;
  const isIsolated = isolatedFloorId ? isolatedFloorId === floor.id : true;

  let isVisible = true;
  let isDimmed = false;

  if (floorMode === 'isolate') {
    isVisible = selectedFloorId ? isSelected : isIsolated;
  } else if (floorMode === 'hideUpper' && selectedFloorId) {
    // If a floor is selected, hide any floor above it
    // Find index of selected floor
    // We can infer: if floor.id !== selectedFloorId and floor.index > selected index, hide it
    // Let's pass or compare index
  } else if (floorMode === 'selected' && selectedFloorId) {
    if (!isSelected) {
      isDimmed = true;
    }
  }

  if (!isVisible) {
    return null;
  }

  return (
    <group
      position={[0, floor.elevation, 0]}
      userData={{ kind: 'floor', id: floor.id }}
    >
      {/* Floor Slab */}
      <Slab
        width={footprint.width}
        depth={footprint.depth}
        isTransparent={isDimmed}
      />

      {/* Vertical Cores (Elevator / Stairs) */}
      {floor.cores?.map((core) => (
        <group key={core.id} position={core.position}>
          <mesh
            position={[0, core.height / 2, 0]}
            material={materials.coreMaterial}
            castShadow={!isDimmed}
            receiveShadow
          >
            <boxGeometry args={[core.width, core.height, core.depth]} />
          </mesh>
          {/* Shaft door aperture indicator */}
          <mesh
            position={[0, core.height / 2, core.depth / 2 + 0.01]}
            material={materials.doorMaterial}
          >
            <planeGeometry args={[1.2, 2.2]} />
          </mesh>
        </group>
      ))}

      {/* Rooms on this floor */}
      {floor.rooms.map((room) => (
        <Room
          key={room.id}
          room={room}
          elevation={floor.elevation}
          wallThickness={wallThickness}
          isFloorDimmed={isDimmed}
        />
      ))}
    </group>
  );
};
