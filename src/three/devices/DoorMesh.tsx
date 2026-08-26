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
  const panelWidth = Math.max(width - 0.08, 0.12);
  const panelHeight = Math.max(height - 0.08, 0.12);
  const panelDepth = 0.055;
  const panelOffset = 0.07;

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
      {/* The wall opening owns the frame; this device owns only the moving leaf. */}
      <group ref={panelRef} position={[-width / 2 + 0.04, 0, panelOffset]}>
        <mesh position={[panelWidth / 2, panelHeight / 2 + 0.04, 0]}>
          <boxGeometry args={[panelWidth, panelHeight, panelDepth]} />
          <meshStandardMaterial
            color={panelColor}
            roughness={0.4}
            metalness={0.1}
            transparent={state.open}
            opacity={state.open ? 0.58 : 1}
          />
        </mesh>
        {/* Handle */}
        <mesh position={[panelWidth - 0.16, panelHeight / 2 + 0.04, panelDepth / 2 + 0.02]}>
          <cylinderGeometry args={[0.018, 0.018, 0.12, 8]} rotation-x={Math.PI / 2} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      {/* Lock indicator LED */}
      <mesh position={[width / 2 - 0.12, height / 2, panelOffset + panelDepth / 2 + 0.02]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshStandardMaterial
          color={state.locked ? '#ef4444' : state.open ? '#22c55e' : frameColor}
          emissive={state.locked ? '#ef4444' : state.open ? '#22c55e' : '#000000'}
          emissiveIntensity={1.2}
        />
      </mesh>
    </group>
  );
};
