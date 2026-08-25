'use client';

import React from 'react';
import { materials } from '../materials/catalog';

interface SlabProps {
  width: number;
  depth: number;
  thickness?: number;
  isTransparent?: boolean;
}

export const Slab: React.FC<SlabProps> = ({
  width,
  depth,
  thickness = 0.3,
  isTransparent = false,
}) => {
  return (
    <mesh
      position={[0, -thickness / 2, 0]}
      receiveShadow
      castShadow={!isTransparent}
      material={isTransparent ? materials.wallTransparentMaterial : materials.slabMaterial}
    >
      <boxGeometry args={[width, thickness, depth]} />
    </mesh>
  );
};
