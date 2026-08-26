'use client';

import React from 'react';
import { ThreeEvent } from '@react-three/fiber';
import type { LayoutObject } from '@/types/building';
import { useBuildingStore } from '@/stores/useBuildingStore';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { AcMesh } from '../devices/AcMesh';
import { LightMesh } from '../devices/LightMesh';
import { SensorMesh } from '../devices/SensorMesh';
import { CctvMesh } from '../devices/CctvMesh';
import type { DeviceState } from '@/types/devices';

export const LayoutObjectMesh: React.FC<{ object: LayoutObject }> = ({ object }) => {
  const selectedObjectId = useBuildingStore((state) => state.selectedObjectId);
  const selectObject = useBuildingStore((state) => state.selectObject);
  const selectDevice = useDeviceStore((state) => state.selectDevice);
  const editorMode = useBuildingStore((state) => state.editorMode);
  const selected = selectedObjectId === object.id;
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (editorMode) selectObject(object.id);
    if (object.deviceId) selectDevice(object.deviceId);
  };
  const material = <meshStandardMaterial color={selected ? '#6366f1' : '#c9a27b'} roughness={0.75} />;
  const deviceStatus = selected ? 'active' : 'online';
  const deviceState: DeviceState | null = object.kind === 'ac'
    ? { type: 'ac', state: { power: true, temperature: 23, mode: 'cool', fanSpeed: 'auto' } }
    : object.kind === 'light'
      ? { type: 'light', state: { power: true, brightness: 80, colorTemp: 4000 } }
      : object.kind === 'sensor'
        ? { type: 'sensor', state: { value: 23, unit: '°C', status: 'online' } }
        : object.kind === 'cctv'
          ? { type: 'cctv', state: { online: true, recording: true } }
          : null;

  let content: React.ReactNode;
  if (deviceState?.type === 'ac') content = <AcMesh state={deviceState.state} status={deviceStatus} />;
  else if (deviceState?.type === 'light') content = <LightMesh state={deviceState.state} status={deviceStatus} />;
  else if (deviceState?.type === 'sensor') content = <SensorMesh state={deviceState.state} status={deviceStatus} />;
  else if (deviceState?.type === 'cctv') content = <CctvMesh state={deviceState.state} status={deviceStatus} />;
  else if (object.kind === 'plant') content = <>
    <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.22, 0.16, 0.45, 12]} />{material}</mesh>
    <mesh position={[0, 0.8, 0]}><sphereGeometry args={[0.4, 12, 8]} /><meshStandardMaterial color="#72b99a" /></mesh>
  </>;
  else if (object.kind === 'chair') content = <>
    <mesh position={[0, 0.3, 0]}><boxGeometry args={[0.55, 0.12, 0.55]} />{material}</mesh>
    <mesh position={[0, 0.7, 0.2]}><boxGeometry args={[0.55, 0.7, 0.1]} />{material}</mesh>
  </>;
  else if (object.kind === 'sofa') content = <group>
    <mesh position={[0, 0.32, 0]}><boxGeometry args={[1.8, 0.45, 0.72]} />{material}</mesh>
    <mesh position={[0, 0.78, 0.24]}><boxGeometry args={[1.8, 0.65, 0.16]} />{material}</mesh>
    <mesh position={[-0.82, 0.55, 0]}><boxGeometry args={[0.14, 0.5, 0.82]} />{material}</mesh>
    <mesh position={[0.82, 0.55, 0]}><boxGeometry args={[0.14, 0.5, 0.82]} />{material}</mesh>
  </group>;
  else if (object.kind === 'bed') content = <group>
    <mesh position={[0, 0.32, 0]}><boxGeometry args={[1.8, 0.28, 2.2]} />{material}</mesh>
    <mesh position={[0, 0.52, 0]}><boxGeometry args={[1.65, 0.18, 2.02]} /><meshStandardMaterial color="#dbeafe" roughness={0.9} /></mesh>
    <mesh position={[0, 0.7, -0.78]}><boxGeometry args={[1.62, 0.22, 0.35]} /><meshStandardMaterial color="#f8fafc" roughness={0.9} /></mesh>
  </group>;
  else if (object.kind === 'table') content = <group>
    <mesh position={[0, 0.8, 0]}><boxGeometry args={[1.8, 0.14, 0.9]} />{material}</mesh>
    {[[-0.72, 0.4, -0.32], [0.72, 0.4, -0.32], [-0.72, 0.4, 0.32], [0.72, 0.4, 0.32]].map((position) => <mesh key={position.join('-')} position={position as [number, number, number]}><boxGeometry args={[0.1, 0.8, 0.1]} />{material}</mesh>)}
  </group>;
  else content = <mesh position={[0, 0.5, 0]}><boxGeometry args={[1, 1, 1]} />{material}</mesh>;

  return (
    <group position={object.position} rotation={object.rotation} scale={object.scale} onClick={handleClick} userData={{ kind: 'layout-object', id: object.id }}>
      {content}
    </group>
  );
};
