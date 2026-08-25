'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LightState } from '@/types/devices';
import { DeviceStatus } from '@/types/domain';

interface LightMeshProps {
  state: LightState;
  status: DeviceStatus;
}

export const LightMesh: React.FC<LightMeshProps> = ({ state, status }) => {
  const isActive = state.power && status !== 'offline';
  const intensity = isActive ? (state.brightness / 100) * 2.0 : 0;
  // Map color temperature 2700–6500K to warm/cool color
  const t = Math.max(0, Math.min(1, (state.colorTemp - 2700) / 3800));
  const r = Math.round(255 * (1 - t * 0.2));
  const g = Math.round(200 + t * 55);
  const b = Math.round(150 + t * 105);
  const emissiveColor = `rgb(${r},${g},${b})`;
  const glowScale = isActive ? 0.35 + (state.brightness / 100) * 0.65 : 0;
  const glowRef = useRef<THREE.Mesh>(null);
  const bulbRef = useRef<THREE.MeshStandardMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const targetGlow = isActive ? 0.35 + (state.brightness / 100) * 0.65 : 0;
    const pulse = isActive ? 1 + Math.sin(clock.elapsedTime * 2.2) * 0.035 : 0.9;
    if (glowRef.current) glowRef.current.scale.setScalar(targetGlow * pulse);
    if (bulbRef.current) bulbRef.current.emissiveIntensity = isActive ? 1.5 + (state.brightness / 100) * 1.2 : 0;
    if (lightRef.current) lightRef.current.intensity = isActive ? intensity * pulse : 0;
  });

  return (
    <group>
      {/* Fixture housing */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.06, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Bulb / emissive lens */}
      <mesh position={[0, -0.04, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial
            ref={bulbRef}
          color={isActive ? emissiveColor : '#94a3b8'}
          emissive={isActive ? emissiveColor : '#000000'}
          emissiveIntensity={isActive ? 1.8 : 0}
          transparent
          opacity={isActive ? 0.95 : 0.5}
        />
      </mesh>
      {/* Soft light pool makes brightness changes readable in the scene. */}
      {isActive && (
        <mesh ref={glowRef} position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={glowScale}>
          <circleGeometry args={[0.85, 32]} />
          <meshBasicMaterial
            color={emissiveColor}
            transparent
            opacity={0.08 + (state.brightness / 100) * 0.12}
            depthWrite={false}
          />
        </mesh>
      )}
      {/* Point light */}
      {isActive && (
        <pointLight
          ref={lightRef}
          position={[0, -0.15, 0]}
          intensity={intensity}
          distance={6}
          color={emissiveColor}
          castShadow={false}
        />
      )}
    </group>
  );
};
