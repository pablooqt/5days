'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ElevatorState } from '@/types/devices';
import type { DeviceStatus } from '@/types/domain';

interface ElevatorMeshProps {
  state: ElevatorState;
  status: DeviceStatus;
  floorHeight?: number;
}

export const ElevatorMesh: React.FC<ElevatorMeshProps> = ({ state, status, floorHeight = 3.4 }) => {
  const cabinRef = useRef<THREE.Group>(null);
  const leftDoorRef = useRef<THREE.Mesh>(null);
  const rightDoorRef = useRef<THREE.Mesh>(null);
  const targetFloor = state.targetFloor ?? state.currentFloor;
  // ElevatorMesh is mounted at the building root, so these are world-space Y values.
  const targetY = (targetFloor - 1) * floorHeight + 1.5;
  const cabinY = (state.currentFloor - 1) * floorHeight + 1.5;
  const moving = state.phase === 'moving';
  const doorAmount = state.phase === 'doors_closing' ? 0.02 : state.doorOpen || state.phase === 'doors_opening' ? 0.42 : 0.02;

  useFrame((_, delta) => {
    if (cabinRef.current) {
      const desiredY = moving ? targetY : cabinY;
      cabinRef.current.position.y = THREE.MathUtils.damp(cabinRef.current.position.y, desiredY, 5, delta);
    }
    if (leftDoorRef.current) leftDoorRef.current.position.x = THREE.MathUtils.damp(leftDoorRef.current.position.x, -0.22 - doorAmount, 8, delta);
    if (rightDoorRef.current) rightDoorRef.current.position.x = THREE.MathUtils.damp(rightDoorRef.current.position.x, 0.22 + doorAmount, 8, delta);
  });

  return (
    <group ref={cabinRef} position={[0, cabinY, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.15, 2.9, 2.15]} />
        <meshStandardMaterial color="#64748b" transparent opacity={0.25} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.45, 0]}>
        <boxGeometry args={[2.25, 0.08, 2.25]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh ref={leftDoorRef} position={[-0.22, 0, 1.1]}>
        <boxGeometry args={[0.42, 2.25, 0.08]} />
        <meshStandardMaterial color={status === 'offline' ? '#64748b' : '#94a3b8'} metalness={0.35} roughness={0.28} />
      </mesh>
      <mesh ref={rightDoorRef} position={[0.22, 0, 1.1]}>
        <boxGeometry args={[0.42, 2.25, 0.08]} />
        <meshStandardMaterial color={status === 'offline' ? '#64748b' : '#94a3b8'} metalness={0.35} roughness={0.28} />
      </mesh>
      <mesh position={[0, 1.9, 1.15]}>
        <boxGeometry args={[0.3, 0.08, 0.03]} />
        <meshBasicMaterial color={state.direction === 'idle' ? '#22c55e' : '#f59e0b'} />
      </mesh>
    </group>
  );
};
