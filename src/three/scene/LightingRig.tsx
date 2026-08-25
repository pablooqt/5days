'use client';

import React from 'react';
import { ContactShadows } from '@react-three/drei';

interface LightingRigProps {
  shadows?: boolean;
}

export const LightingRig: React.FC<LightingRigProps> = ({ shadows = true }) => {
  return (
    <group name="lighting-rig">
      {/* Ambient Fill Light */}
      <ambientLight intensity={0.85} color="#FFFFFF" />

      {/* Hemisphere Light for soft architectural sky-to-ground bounce */}
      <hemisphereLight
        args={['#E8F6FA', '#B7C9D3', 0.8]}
        position={[0, 50, 0]}
      />

      {/* Primary Key Directional Light (Single shadow-caster) */}
      <directionalLight
        position={[25, 40, 20]}
        intensity={1.5}
        castShadow={shadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005}
        shadow-radius={2}
      />

      {/* Secondary Soft Fill Light (No shadows) */}
      <directionalLight
        position={[-20, 25, -15]}
        intensity={0.5}
        color="#E2E8F0"
      />

      {/* Contact shadow for soft ground realism */}
      <ContactShadows
        position={[0, -0.2, 0]}
        opacity={0.4}
        scale={40}
        blur={2.5}
        far={15}
      />
    </group>
  );
};
