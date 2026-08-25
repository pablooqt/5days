'use client';

import React from 'react';
import { CctvState } from '@/types/devices';
import { DeviceStatus } from '@/types/domain';

interface CctvMeshProps {
  state: CctvState;
  status: DeviceStatus;
}

export const CctvMesh: React.FC<CctvMeshProps> = ({ state, status }) => {
  const isOnline = state.online && status !== 'offline';
  const ledColor = !isOnline ? '#ef4444' : state.recording ? '#ef4444' : '#22c55e';

  return (
    <group>
      {/* Mount arm */}
      <mesh position={[0, 0.1, 0.04]}>
        <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Camera body */}
      <mesh position={[0, 0, 0]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.16, 0.1, 0.22]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Lens */}
      <mesh position={[0, 0, -0.1]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 0.04, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Glass lens */}
      <mesh position={[0, 0, -0.12]} rotation={[0.15, 0, 0]}>
        <circleGeometry args={[0.03, 16]} />
        <meshStandardMaterial color={isOnline ? '#7dd3fc' : '#374151'} transparent opacity={0.8} roughness={0} metalness={0.5} />
      </mesh>
      {/* Recording LED */}
      <mesh position={[0.06, 0.04, 0.11]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color={ledColor} emissive={ledColor} emissiveIntensity={isOnline ? 2 : 0.4} />
      </mesh>
    </group>
  );
};
