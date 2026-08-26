'use client';

import React, { useCallback, useMemo } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { RoomConfig } from '@/types/building';
import { useSelectionStore } from '@/stores/useSelectionStore';
import { useVisibilityStore } from '@/stores/useVisibilityStore';
import { useCameraStore } from '@/stores/useCameraStore';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { FloorSurface } from './FloorSurface';
import { RoomWalls } from './Wall';
import { RoomLabel } from './RoomLabel';
import { DeviceObject } from '../devices/DeviceObject';
import { getDoorTransform } from '@/lib/doorGeometry';
import { getAcTransform } from '@/lib/deviceGeometry';
import { useBuildingStore } from '@/stores/useBuildingStore';
import { LayoutObjectMesh } from '../building/LayoutObjectMesh';

interface RoomProps {
  room: RoomConfig;
  elevation?: number;
  wallThickness?: number;
  isFloorDimmed?: boolean;
  showLabel?: boolean;
  showDevices?: boolean;
}

export const Room: React.FC<RoomProps> = ({
  room,
  elevation = 0,
  wallThickness = 0.12,
  isFloorDimmed = false,
  showLabel = true,
  showDevices = true,
}) => {
  const selectedRoomId = useSelectionStore((s) => s.selectedRoomId);
  const hoveredId = useSelectionStore((s) => s.hoveredId);
  const selectRoom = useSelectionStore((s) => s.selectRoom);
  const selectFloor = useSelectionStore((s) => s.selectFloor);
  const setHovered = useSelectionStore((s) => s.setHovered);
  const issueCameraCommand = useCameraStore((s) => s.issueCommand);

  const transparentWalls = useVisibilityStore((s) => s.transparentWalls);
  const setFloorMode = useVisibilityStore((s) => s.setFloorMode);

  // Device data for this room
  const selectDevice = useDeviceStore((s) => s.selectDevice);
  const definitions = useDeviceStore((s) => s.definitions);
  const states = useDeviceStore((s) => s.states);
  const devicesByRoom = useDeviceStore((s) => s.devicesByRoom);
  const roomDeviceIds = devicesByRoom[room.id] ?? [];
  const allLayoutObjects = useBuildingStore((s) => s.layout.objects);
  const layoutObjects = useMemo(
    () => allLayoutObjects.filter((object) => object.roomId === room.id),
    [allLayoutObjects, room.id],
  );

  const isSelected = selectedRoomId === room.id;
  const isHovered = hoveredId === room.id;
  const isTransparent = transparentWalls || isFloorDimmed;

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered('room', room.id);
      document.body.style.cursor = 'pointer';
    },
    [room.id, setHovered]
  );

  const handlePointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (hoveredId === room.id) {
        setHovered(null, null);
      }
      document.body.style.cursor = 'auto';
    },
    [room.id, hoveredId, setHovered]
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      selectFloor(room.floorId);
      setFloorMode('isolate');
      selectDevice(null);
      selectRoom(isSelected ? null : room.id);
    },
    [room.floorId, room.id, isSelected, selectFloor, selectRoom, setFloorMode, selectDevice]
  );

  const handleDoubleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      selectFloor(room.floorId);
      setFloorMode('isolate');
      selectDevice(null);
      selectRoom(room.id);
      issueCameraCommand('focusRoom', room.id);
    },
    [room.floorId, room.id, selectFloor, selectRoom, setFloorMode, issueCameraCommand, selectDevice]
  );

  return (
    <group
      position={room.position}
      userData={{ kind: 'room', id: room.id }}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Room metadata label */}
      <RoomLabel
        room={room}
        elevation={elevation}
        isVisible={showLabel && !isFloorDimmed}
        isSelected={isSelected}
        isHovered={isHovered}
      />

      {/* Floor surface */}
      <FloorSurface
        width={room.width}
        depth={room.depth}
        type={room.type}
        isSelected={isSelected}
        isHovered={isHovered}
      />

      {layoutObjects.map((object) => (
        <LayoutObjectMesh key={object.id} object={object} />
      ))}

      {/* Walls */}
      <RoomWalls
        width={room.width}
        depth={room.depth}
        height={room.height}
        wallThickness={wallThickness}
        doors={room.doors}
        windows={room.windows}
        isTransparent={isTransparent}
        isSelected={isSelected}
      />

      {/* Devices (only when room is not dimmed) */}
      {showDevices && !isFloorDimmed && roomDeviceIds.map((deviceId, markerIndex) => {
        const def = definitions[deviceId];
        const deviceState = states[deviceId];
        // The elevator cabin is rendered once at building level so it can travel
        // through every floor instead of being trapped inside Floor 2.
        if (!def || !deviceState || def.type === 'elevator') return null;
        return (
         <DeviceObject
            key={`${room.id}-${deviceId}`}
            definition={def}
            deviceState={deviceState}
            showMarkers={isSelected || isTransparent}
             {...(def.type === 'door' ? (() => {
              const transform = getDoorTransform(room, deviceId, def.openingId);
              return transform ? {
                position: transform.position,
                rotation: transform.rotation,
                doorWidth: transform.width,
                doorHeight: transform.height,
              } : null;
             })() : def.type === 'ac' ? getAcTransform(room, def.position) : null)}
            markerIndex={markerIndex}
            markerCount={roomDeviceIds.length}
          />
        );
      })}
    </group>
  );
};
