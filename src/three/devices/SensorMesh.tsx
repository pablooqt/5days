'use client';

import React from 'react';
import { SensorState } from '@/types/devices';
import { DeviceStatus } from '@/types/domain';
import { Html } from '@react-three/drei';

interface SensorMeshProps {
  state: SensorState;
  status: DeviceStatus;
}

export const SensorMesh: React.FC<SensorMeshProps> = ({ state, status }) => {
  const isOnline = status !== 'offline';
  const statusColor =
    status === 'warning' ? '#f59e0b'
    : status === 'offline' ? '#6b7280'
    : '#22c55e';

  return (
    <group>
      {/* Sensor housing disc */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.055, 0.04, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Status LED ring */}
      <mesh position={[0, 0.022, 0]}>
        <torusGeometry args={[0.045, 0.008, 6, 24]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={isOnline ? 1.5 : 0}
        />
      </mesh>
      {/* Floating value chip */}
      {isOnline && (
        <Html
          position={[0, 0.12, 0]}
          center
          distanceFactor={18}
          zIndexRange={[5, 0]}
        >
          <div className="bg-slate-900/90 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap shadow-sm border border-slate-700/50">
            {state.value.toFixed(1)}{state.unit}
          </div>
        </Html>
      )}
    </group>
  );
};
