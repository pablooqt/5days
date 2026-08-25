'use client';

import React, { useCallback } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { DeviceDefinition, DeviceState } from '@/types/devices';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useSelectionStore } from '@/stores/useSelectionStore';
import { useVisibilityStore } from '@/stores/useVisibilityStore';
import { useCameraStore } from '@/stores/useCameraStore';
import { AcMesh } from './AcMesh';
import { LightMesh } from './LightMesh';
import { DoorMesh } from './DoorMesh';
import { CctvMesh } from './CctvMesh';
import { SensorMesh } from './SensorMesh';
import { DeviceMarker } from './DeviceMarker';

interface DeviceObjectProps {
  definition: DeviceDefinition;
  deviceState: DeviceState;
  showMarkers?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
  doorWidth?: number;
  doorHeight?: number;
}

export const DeviceObject: React.FC<DeviceObjectProps> = ({
  definition,
  deviceState,
  showMarkers = true,
  position,
  rotation,
  doorWidth,
  doorHeight,
}) => {
  const selectedDeviceId = useDeviceStore((s) => s.selectedDeviceId);
  const selectDevice = useDeviceStore((s) => s.selectDevice);
  const selectFloor = useSelectionStore((s) => s.selectFloor);
  const setFloorMode = useVisibilityStore((s) => s.setFloorMode);
  const issueCameraCommand = useCameraStore((s) => s.issueCommand);
  const isSelected = selectedDeviceId === definition.id;

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      selectFloor(definition.floorId);
      setFloorMode('isolate');
      issueCameraCommand('focusFloor', definition.floorId);
      selectDevice(isSelected ? null : definition.id);
    },
    [definition.floorId, definition.id, isSelected, selectFloor, setFloorMode, issueCameraCommand, selectDevice]
  );

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
  }, []);

  const rot = rotation ?? definition.rotation ?? [0, 0, 0];

  return (
    <group
      position={position ?? definition.position}
      rotation={rot}
      userData={{ kind: 'device', id: definition.id }}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 3D Mesh */}
      {deviceState.type === 'ac' && (
        <AcMesh state={deviceState.state} status={definition.status} />
      )}
      {deviceState.type === 'light' && (
        <LightMesh state={deviceState.state} status={definition.status} />
      )}
      {deviceState.type === 'door' && (
        <DoorMesh
          state={deviceState.state}
          status={definition.status}
          width={doorWidth}
          height={doorHeight}
        />
      )}
      {deviceState.type === 'cctv' && (
        <CctvMesh state={deviceState.state} status={definition.status} />
      )}
      {deviceState.type === 'sensor' && (
        <SensorMesh state={deviceState.state} status={definition.status} />
      )}

      {/* Floating marker badge */}
      {showMarkers && (
        <DeviceMarker
          definition={definition}
          deviceState={deviceState}
          isSelected={isSelected}
        />
      )}

      {/* Selection glow ring */}
      {isSelected && (
        <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.14, 0.19, 24]} />
          <meshStandardMaterial
            color="#6366f1"
            emissive="#6366f1"
            emissiveIntensity={1.5}
            transparent
            opacity={0.75}
          />
        </mesh>
      )}
    </group>
  );
};
