'use client';

import React, { useMemo } from 'react';
import { DoorOpeningConfig, WindowOpeningConfig, WallSide } from '@/types/building';
import { materials } from '../materials/catalog';

interface WallSideProps {
  side: WallSide;
  length: number;
  height: number;
  thickness: number;
  position: [number, number, number];
  rotationY: number;
  door?: DoorOpeningConfig;
  window?: WindowOpeningConfig;
  isTransparent?: boolean;
  isSelected?: boolean;
}

export const WallSideMesh: React.FC<WallSideProps> = ({
  length,
  height,
  thickness,
  position,
  rotationY,
  door,
  window: win,
  isTransparent = false,
  isSelected = false,
}) => {
  const wallMaterial = useMemo(() => {
    if (isSelected) return materials.wallSelectedMaterial;
    if (isTransparent) return materials.wallTransparentMaterial;
    return materials.wallMaterial;
  }, [isSelected, isTransparent]);

  // Segment generation for openings
  const segments = useMemo(() => {
    const list: React.ReactNode[] = [];

    if (!door && !win) {
      // Solid Wall
      list.push(
        <mesh
          key="solid"
          position={[0, height / 2, 0]}
          castShadow={!isTransparent}
          receiveShadow
          material={wallMaterial}
        >
          <boxGeometry args={[length, height, thickness]} />
        </mesh>
      );
      return list;
    }

    if (door) {
      const doorStart = Math.max(0, door.offset);
      const doorWidth = Math.min(door.width, length - doorStart);
      const doorHeight = Math.min(door.height, height);

      // Left segment
      if (doorStart > 0.05) {
        const leftW = doorStart;
        const leftCenterX = -length / 2 + leftW / 2;
        list.push(
          <mesh
            key="door-left"
            position={[leftCenterX, height / 2, 0]}
            castShadow={!isTransparent}
            receiveShadow
            material={wallMaterial}
          >
            <boxGeometry args={[leftW, height, thickness]} />
          </mesh>
        );
      }

      // Right segment
      const rightStart = doorStart + doorWidth;
      if (length - rightStart > 0.05) {
        const rightW = length - rightStart;
        const rightCenterX = -length / 2 + rightStart + rightW / 2;
        list.push(
          <mesh
            key="door-right"
            position={[rightCenterX, height / 2, 0]}
            castShadow={!isTransparent}
            receiveShadow
            material={wallMaterial}
          >
            <boxGeometry args={[rightW, height, thickness]} />
          </mesh>
        );
      }

      // Lintel / Top header above door
      if (height - doorHeight > 0.05) {
        const headerH = height - doorHeight;
        const headerCenterX = -length / 2 + doorStart + doorWidth / 2;
        const headerCenterY = doorHeight + headerH / 2;
        list.push(
          <mesh
            key="door-lintel"
            position={[headerCenterX, headerCenterY, 0]}
            castShadow={!isTransparent}
            receiveShadow
            material={wallMaterial}
          >
            <boxGeometry args={[doorWidth, headerH, thickness]} />
          </mesh>
        );
      }

      // Door Frame outline
      const frameCenterX = -length / 2 + doorStart + doorWidth / 2;
      list.push(
        <group key="door-frame" position={[frameCenterX, 0, 0]}>
          {/* Frame sides */}
          <mesh position={[-doorWidth / 2, doorHeight / 2, 0]} material={materials.frameMaterial}>
            <boxGeometry args={[0.04, doorHeight, thickness + 0.01]} />
          </mesh>
          <mesh position={[doorWidth / 2, doorHeight / 2, 0]} material={materials.frameMaterial}>
            <boxGeometry args={[0.04, doorHeight, thickness + 0.01]} />
          </mesh>
          <mesh position={[0, doorHeight, 0]} material={materials.frameMaterial}>
            <boxGeometry args={[doorWidth, 0.04, thickness + 0.01]} />
          </mesh>
        </group>
      );
    } else if (win) {
      const winStart = Math.max(0, win.offset);
      const winWidth = Math.min(win.width, length - winStart);
      const winElev = Math.min(win.elevation, height - 0.2);
      const winHeight = Math.min(win.height, height - winElev);

      // Left segment
      if (winStart > 0.05) {
        const leftW = winStart;
        const leftCenterX = -length / 2 + leftW / 2;
        list.push(
          <mesh
            key="win-left"
            position={[leftCenterX, height / 2, 0]}
            castShadow={!isTransparent}
            receiveShadow
            material={wallMaterial}
          >
            <boxGeometry args={[leftW, height, thickness]} />
          </mesh>
        );
      }

      // Right segment
      const rightStart = winStart + winWidth;
      if (length - rightStart > 0.05) {
        const rightW = length - rightStart;
        const rightCenterX = -length / 2 + rightStart + rightW / 2;
        list.push(
          <mesh
            key="win-right"
            position={[rightCenterX, height / 2, 0]}
            castShadow={!isTransparent}
            receiveShadow
            material={wallMaterial}
          >
            <boxGeometry args={[rightW, height, thickness]} />
          </mesh>
        );
      }

      // Sill (bottom)
      if (winElev > 0.05) {
        const sillCenterX = -length / 2 + winStart + winWidth / 2;
        list.push(
          <mesh
            key="win-sill"
            position={[sillCenterX, winElev / 2, 0]}
            castShadow={!isTransparent}
            receiveShadow
            material={wallMaterial}
          >
            <boxGeometry args={[winWidth, winElev, thickness]} />
          </mesh>
        );
      }

      // Lintel (top)
      const topStart = winElev + winHeight;
      if (height - topStart > 0.05) {
        const lintelH = height - topStart;
        const lintelCenterX = -length / 2 + winStart + winWidth / 2;
        const lintelCenterY = topStart + lintelH / 2;
        list.push(
          <mesh
            key="win-lintel"
            position={[lintelCenterX, lintelCenterY, 0]}
            castShadow={!isTransparent}
            receiveShadow
            material={wallMaterial}
          >
            <boxGeometry args={[winWidth, lintelH, thickness]} />
          </mesh>
        );
      }

      // Glass Pane
      const winCenterX = -length / 2 + winStart + winWidth / 2;
      const winCenterY = winElev + winHeight / 2;
      list.push(
        <group key="win-glass" position={[winCenterX, winCenterY, 0]}>
          <mesh material={materials.glassMaterial}>
            <boxGeometry args={[winWidth - 0.02, winHeight - 0.02, 0.02]} />
          </mesh>
          {/* Glass frame */}
          <mesh position={[0, -winHeight / 2, 0]} material={materials.frameMaterial}>
            <boxGeometry args={[winWidth, 0.03, thickness + 0.005]} />
          </mesh>
          <mesh position={[0, winHeight / 2, 0]} material={materials.frameMaterial}>
            <boxGeometry args={[winWidth, 0.03, thickness + 0.005]} />
          </mesh>
          <mesh position={[-winWidth / 2, 0, 0]} material={materials.frameMaterial}>
            <boxGeometry args={[0.03, winHeight, thickness + 0.005]} />
          </mesh>
          <mesh position={[winWidth / 2, 0, 0]} material={materials.frameMaterial}>
            <boxGeometry args={[0.03, winHeight, thickness + 0.005]} />
          </mesh>
        </group>
      );
    }

    return list;
  }, [door, win, length, height, thickness, wallMaterial, isTransparent]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {segments}
    </group>
  );
};

interface RoomWallsProps {
  width: number;
  depth: number;
  height: number;
  wallThickness?: number;
  doors?: DoorOpeningConfig[];
  windows?: WindowOpeningConfig[];
  isTransparent?: boolean;
  isSelected?: boolean;
}

export const RoomWalls: React.FC<RoomWallsProps> = ({
  width,
  depth,
  height,
  wallThickness = 0.12,
  doors = [],
  windows = [],
  isTransparent = false,
  isSelected = false,
}) => {
  const getDoor = (wall: WallSide) => doors.find((d) => d.wall === wall);
  const getWindow = (wall: WallSide) => windows.find((w) => w.wall === wall);

  return (
    <group>
      {/* North Wall (Z = -depth / 2) */}
      <WallSideMesh
        side="north"
        length={width}
        height={height}
        thickness={wallThickness}
        position={[0, 0, -depth / 2]}
        rotationY={0}
        door={getDoor('north')}
        window={getWindow('north')}
        isTransparent={isTransparent}
        isSelected={isSelected}
      />

      {/* South Wall (Z = depth / 2) */}
      <WallSideMesh
        side="south"
        length={width}
        height={height}
        thickness={wallThickness}
        position={[0, 0, depth / 2]}
        rotationY={Math.PI}
        door={getDoor('south')}
        window={getWindow('south')}
        isTransparent={isTransparent}
        isSelected={isSelected}
      />

      {/* West Wall (X = -width / 2) */}
      <WallSideMesh
        side="west"
        length={depth}
        height={height}
        thickness={wallThickness}
        position={[-width / 2, 0, 0]}
        rotationY={Math.PI / 2}
        door={getDoor('west')}
        window={getWindow('west')}
        isTransparent={isTransparent}
        isSelected={isSelected}
      />

      {/* East Wall (X = width / 2) */}
      <WallSideMesh
        side="east"
        length={depth}
        height={height}
        thickness={wallThickness}
        position={[width / 2, 0, 0]}
        rotationY={-Math.PI / 2}
        door={getDoor('east')}
        window={getWindow('east')}
        isTransparent={isTransparent}
        isSelected={isSelected}
      />
    </group>
  );
};
