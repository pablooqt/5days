'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RoomType } from '@/types/domain';
import { materials } from '../materials/catalog';

interface FloorSurfaceProps {
  width: number;
  depth: number;
  type: RoomType;
  isSelected?: boolean;
  isHovered?: boolean;
}

export const FloorSurface: React.FC<FloorSurfaceProps> = ({
  width,
  depth,
  type,
  isSelected = false,
  isHovered = false,
}) => {
  const material = useMemo(() => {
    if (isSelected) return materials.selectionAccentMaterial;
    if (isHovered) return materials.hoverMaterial;
    return materials.floorMaterials[type] || materials.floorMaterials.office;
  }, [type, isSelected, isHovered]);

  const borderGeometry = useMemo(() => {
    const halfW = width / 2;
    const halfD = depth / 2;
    const points = [
      new THREE.Vector3(-halfW, 0.015, -halfD),
      new THREE.Vector3(halfW, 0.015, -halfD),
      new THREE.Vector3(halfW, 0.015, halfD),
      new THREE.Vector3(-halfW, 0.015, halfD),
      new THREE.Vector3(-halfW, 0.015, -halfD),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [width, depth]);

  return (
    <group position={[0, 0.01, 0]}>
      {/* Floor surface box with slight thickness to prevent z-fighting */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={material}
      >
        <planeGeometry args={[width - 0.04, depth - 0.04]} />
      </mesh>

      {/* Room boundary edge lines */}
      <lineLoop geometry={borderGeometry}>
        <lineBasicMaterial
          color={isSelected ? '#4F6BED' : '#D1D5DB'}
          linewidth={isSelected ? 2 : 1}
          transparent
          opacity={isSelected ? 0.9 : 0.4}
        />
      </lineLoop>
    </group>
  );
};
