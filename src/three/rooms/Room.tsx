'use client';

import React, { useCallback } from 'react';
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
import { RoomInterior } from './RoomInterior';

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
  const definitions = useDeviceStore((s) => s.definitions);
  const states = useDeviceStore((s) => s.states);
  const devicesByRoom = useDeviceStore((s) => s.devicesByRoom);
  const roomDeviceIds = devicesByRoom[room.id] ?? [];

  const isSelected = selectedRoomId === room.id;
  const isHovered = hoveredId === room.id;
  const isTransparent = transparentWalls || isFloorDimmed;

  const getDoorTransform = (deviceId: string) => {
    if (room.type === 'corridor' || !room.doors?.length || !deviceId.startsWith('DOOR')) return null;
    const opening = room.doors.find((door) => deviceId.toLowerCase().includes(door.id.replace('door-', '')))
      ?? room.doors[0];
    const isHorizontal = opening.wall === 'north' || opening.wall === 'south';
    const wallLength = isHorizontal ? room.width : room.depth;
    const alongWall = -wallLength / 2 + opening.offset + opening.width / 2;
    const wallPosition: [number, number, number] = isHorizontal
      ? [alongWall, 0, opening.wall === 'north' ? -room.depth / 2 : room.depth / 2]
      : [opening.wall === 'west' ? -room.width / 2 : room.width / 2, 0, alongWall];
    const rotationY = opening.wall === 'west' ? Math.PI / 2 : opening.wall === 'east' ? -Math.PI / 2 : 0;
    return {
      position: wallPosition,
      rotation: [0, rotationY, 0] as [number, number, number],
      doorWidth: opening.width,
      doorHeight: opening.height,
    };
  };

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
      selectRoom(isSelected ? null : room.id);
    },
    [room.floorId, room.id, isSelected, selectFloor, selectRoom, setFloorMode]
  );

  const handleDoubleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      selectFloor(room.floorId);
      setFloorMode('isolate');
      selectRoom(room.id);
      issueCameraCommand('focusRoom', room.id);
    },
    [room.floorId, room.id, selectFloor, selectRoom, setFloorMode, issueCameraCommand]
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

      <RoomInterior
        type={room.type}
        width={room.width}
        depth={room.depth}
      />

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
      {showDevices && !isFloorDimmed && roomDeviceIds.map((deviceId) => {
        const def = definitions[deviceId];
        const deviceState = states[deviceId];
        if (!def || !deviceState) return null;
        return (
         <DeviceObject
            key={deviceId}
            definition={def}
            deviceState={deviceState}
            showMarkers={isSelected || isTransparent}
            {...(def.type === 'door' ? getDoorTransform(deviceId) : null)}
          />
        );
      })}
    </group>
  );
};
