'use client';

import React, { useMemo } from 'react';
import { BuildingConfig } from '@/types/building';
import { useSelectionStore } from '@/stores/useSelectionStore';
import { useVisibilityStore } from '@/stores/useVisibilityStore';
import { FloorGroup } from './FloorGroup';
import { demoBuildingConfig } from '@/config/building';
import { materials } from '../materials/catalog';
import { DeviceObject } from '../devices/DeviceObject';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useBuildingStore } from '@/stores/useBuildingStore';

interface BuildingProps {
  config?: BuildingConfig;
}

export const Building: React.FC<BuildingProps> = ({
  config = demoBuildingConfig,
}) => {
  const selectedFloorId = useSelectionStore((s) => s.selectedFloorId);
  const selectedDeviceId = useDeviceStore((s) => s.selectedDeviceId);
  const floorMode = useVisibilityStore((s) => s.floorMode);
  const editorMode = useBuildingStore((s) => s.editorMode);
  const activeEditorFloorId = useBuildingStore((s) => s.activeEditorFloorId);
  const activeEditorRoomId = useBuildingStore((s) => s.activeEditorRoomId);
  const elevatorDefinition = useDeviceStore((s) => s.definitions.ELEVATOR_01);
  const elevatorState = useDeviceStore((s) => s.states.ELEVATOR_01);

  // Determine selected floor index for hideUpper mode
  const selectedFloorIndex = useMemo(() => {
    if (!selectedFloorId) return null;
    const found = config.floors.find((f) => f.id === selectedFloorId);
    return found ? found.index : null;
  }, [config.floors, selectedFloorId]);

  const visibleFloors = useMemo(() => {
    return config.floors.filter((floor) => {
      if (editorMode) return floor.id === activeEditorFloorId;
      if (floorMode === 'hideUpper' && selectedFloorIndex !== null) {
        return floor.index <= selectedFloorIndex;
      }
      if (floorMode === 'isolate' && selectedFloorId) {
        return floor.id === selectedFloorId;
      }
      return true;
    });
  }, [activeEditorFloorId, config.floors, editorMode, floorMode, selectedFloorId, selectedFloorIndex]);

  const elevatorCore = useMemo(() => {
    const elevatorFloorIndex = elevatorState?.type === 'elevator' ? Math.max(0, elevatorState.state.currentFloor - 1) : 0;
    const floor = config.floors[elevatorFloorIndex] ?? config.floors[0];
    return floor?.cores?.find((item) => item.type === 'elevator') ?? null;
  }, [config.floors, elevatorState]);

  return (
    <group name="building-root" userData={{ kind: 'building', id: config.id }}>
      {/* Ground Foundation Slab */}
      <mesh
        position={[0, -0.4, 0]}
        receiveShadow
        material={materials.groundMaterial}
      >
        <boxGeometry
          args={[
            config.footprint.width + 12,
            0.4,
            config.footprint.depth + 12,
          ]}
        />
      </mesh>

      {/* Floors */}
      {visibleFloors.map((floor) => (
        <FloorGroup
          key={floor.id}
          floor={floor}
          footprint={config.footprint}
          wallThickness={config.wallThickness}
        />
      ))}

      {editorMode && activeEditorFloorId && activeEditorRoomId && (() => {
        const floor = config.floors.find((item) => item.id === activeEditorFloorId);
        const room = floor?.rooms.find((item) => item.id === activeEditorRoomId);
        if (!floor || !room) return null;
        return <EditorPlacementSurface
          width={room.width}
          depth={room.depth}
          position={room.position}
          elevation={floor.elevation}
          onPlace={(position) => useBuildingStore.getState().placeObject(position)}
        />;
      })()}

      {/* Runtime cabin lives at building level so it can animate through every floor. */}
      {!editorMode && elevatorDefinition && elevatorState && elevatorCore && (
        <group position={[elevatorCore.position[0], 0, elevatorCore.position[2]]}>
          <DeviceObject
            definition={elevatorDefinition}
            deviceState={elevatorState}
            position={[0, 0, 0]}
            floorHeight={config.floorHeight}
            showMarkers={selectedDeviceId === 'ELEVATOR_01' || (Boolean(selectedFloorId) && floorMode !== 'isolate')}
            markerIndex={0}
            markerCount={1}
          />
        </group>
      )}
    </group>
  );
};

function EditorPlacementSurface({ width, depth, position, elevation, onPlace }: { width: number; depth: number; position: [number, number, number]; elevation: number; onPlace: (position: [number, number, number]) => void }) {
  const editorTool = useBuildingStore((state) => state.editorTool);
  const snapEnabled = useBuildingStore((state) => state.snapEnabled);
  const placementActive = editorTool === 'place';

  return (
    <group position={[position[0], elevation + 0.025, position[2]]}>
      <gridHelper args={[Math.max(width, depth), Math.max(width, depth) * 4, '#94a3b8', '#dbe4ee']} position={[0, 0, 0]} />
      <mesh
        visible={placementActive}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={(event) => {
          event.stopPropagation();
          const point: [number, number, number] = [event.point.x - position[0], 0, event.point.z - position[2]];
          onPlace(snapEnabled ? point.map((value) => Math.round(value / 0.25) * 0.25) as [number, number, number] : point);
        }}
      >
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial transparent opacity={0.02} depthWrite={false} />
      </mesh>
    </group>
  );
}
