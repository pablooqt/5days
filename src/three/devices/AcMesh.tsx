'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AcState } from '@/types/devices';
import { DeviceStatus } from '@/types/domain';

interface AcMeshProps {
  state: AcState;
  status: DeviceStatus;
}

export const AcMesh: React.FC<AcMeshProps> = ({ state, status }) => {
  const fanRef = useRef<THREE.Mesh>(null);
  const airflowRefs = useRef<THREE.Mesh[]>([]);
  const airflowGroupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  const temperatureDemand = Math.min(1, Math.abs(state.temperature - 23) / 7);
  const fanFactor = state.fanSpeed === 'high' ? 1 : state.fanSpeed === 'medium' ? 0.72 : state.fanSpeed === 'low' ? 0.42 : 0.58;

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (fanRef.current && state.power && status !== 'offline') {
      const speed = 2 + fanFactor * 7 + temperatureDemand * 2;
      fanRef.current.rotation.y += delta * speed;
    }
    if (state.power && status !== 'offline') {
      airflowRefs.current.forEach((mesh, index) => {
        if (!mesh) return;
        const phase = timeRef.current * (1.2 + fanFactor * 3 + temperatureDemand) + index * 1.8;
        mesh.position.x = -0.28 + ((mesh.position.x + delta * (0.18 + fanFactor * 0.35)) + 0.56) % 0.56;
        mesh.position.y = -0.16 - Math.sin(phase) * 0.025;
        mesh.scale.y = 0.7 + temperatureDemand * 0.55 + Math.sin(phase) * 0.18;
        mesh.scale.x = 0.65 + fanFactor * 0.35;
      });
      if (airflowGroupRef.current) {
        airflowGroupRef.current.scale.setScalar(0.82 + temperatureDemand * 0.28);
      }
    }
  });

  const isActive = state.power && status !== 'offline';
  const bodyColor = isActive ? '#b8d4f5' : '#94a3b8';
  const ledColor = isActive ? '#3b82f6' : '#ef4444';

  return (
    <group>
      {/* Main unit body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.7, 0.2, 0.2]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.5} />
      </mesh>
      {/* LED indicator */}
      <mesh position={[0.28, 0.05, 0.11]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={ledColor} emissive={isActive ? '#3b82f6' : '#000000'} emissiveIntensity={isActive ? 1.5 : 0} />
      </mesh>
      {/* Fan disc */}
      <mesh ref={fanRef} position={[0, 0, 0.12]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.06, 0.015, 6, 16]} />
        <meshStandardMaterial color={isActive ? '#93c5fd' : '#6b7280'} />
      </mesh>
      {/* Vent slats */}
      {[-0.15, 0, 0.15].map((x) => (
        <mesh key={x} position={[x, -0.07, 0.11]}>
          <boxGeometry args={[0.06, 0.015, 0.02]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      ))}
      {/* Small moving air ribbons communicate cooling without overwhelming the scene. */}
      {isActive && state.mode !== 'heat' && (
        <group ref={airflowGroupRef}>
          {[0, 1, 2].map((index) => (
            <mesh
              key={`airflow-${index}`}
              ref={(mesh) => {
                if (mesh) airflowRefs.current[index] = mesh;
              }}
              position={[-0.28 + index * 0.2, -0.16, 0.12]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <planeGeometry args={[0.08, 0.3]} />
              <meshBasicMaterial color="#7DD3FC" transparent opacity={0.24 + temperatureDemand * 0.16} depthWrite={false} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
