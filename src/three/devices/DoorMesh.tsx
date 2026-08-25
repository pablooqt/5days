'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DoorState } from '@/types/devices';
import { DeviceStatus } from '@/types/domain';

interface DoorMeshProps {
  state: DoorState;
  status: DeviceStatus;
  width?: number;
  height?: number;
}

export const DoorMesh: React.FC<DoorMeshProps> = ({ state, status, width = 0.9, height = 1.1 }) => {
  const panelRef = useRef<THREE.Group>(null);
  const targetAngle = state.open ? -Math.PI / 2 : 0;
  const frameWidth = Math.max(width, 0.7);
  const frameHeight = Math.max(height, 1.8);
  const frameSide = 0.06;

  useFrame((_, delta) => {
    if (!panelRef.current) return;
    const current = panelRef.current.rotation.y;
    const diff = targetAngle - current;
    panelRef.current.rotation.y += diff * Math.min(delta * 4, 1);
  });

  const frameColor = status === 'offline' ? '#6b7280' : '#475569';
  const panelColor = state.locked ? '#fca5a5' : state.open ? '#86efac' : '#e2e8f0';

  return (
    <group>
      {/* Door frame top */}
      <mesh position={[0, frameHeight, 0]}>
        <boxGeometry args={[frameWidth + frameSide, 0.08, 0.12]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>
      {/* Frame left */}
      <mesh position={[-frameWidth / 2, frameHeight / 2, 0]}>
        <boxGeometry args={[frameSide, frameHeight, 0.12]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>
      {/* Frame right */}
      <mesh position={[frameWidth / 2, frameHeight / 2, 0]}>
        <boxGeometry args={[frameSide, frameHeight, 0.12]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>
      {/* Door panel (pivots from left edge) */}
      <group ref={panelRef} position={[-frameWidth / 2 + frameSide / 2, 0, 0]}>
        <mesh position={[frameWidth / 2 - frameSide / 2, frameHeight / 2, 0]}>
          <boxGeometry args={[frameWidth - frameSide, frameHeight, 0.06]} />
          <meshStandardMaterial color={panelColor} roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Handle */}
        <mesh position={[frameWidth - 0.16, frameHeight / 2, 0.04]}>
          <cylinderGeometry args={[0.018, 0.018, 0.12, 8]} rotation-x={Math.PI / 2} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      {/* Lock indicator LED */}
      <mesh position={[frameWidth / 2 - 0.08, frameHeight / 2, 0.1]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshStandardMaterial
          color={state.locked ? '#ef4444' : '#22c55e'}
          emissive={state.locked ? '#ef4444' : '#22c55e'}
          emissiveIntensity={1.2}
        />
      </mesh>
    </group>
  );
};
