'use client';

import React, { useCallback } from 'react';
import { Html } from '@react-three/drei';
import { DeviceDefinition, DeviceState } from '@/types/devices';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useSelectionStore } from '@/stores/useSelectionStore';
import { useVisibilityStore } from '@/stores/useVisibilityStore';
import { useCameraStore } from '@/stores/useCameraStore';
import { useActiveBuildingConfig } from '@/stores/useBuildingStore';
import { getElevatorLocation } from '@/lib/elevatorLocation';
import { formatDeviceLabel } from '@/lib/deviceLabels';

interface DeviceMarkerProps {
  definition: DeviceDefinition;
  deviceState: DeviceState;
  isSelected: boolean;
  markerIndex?: number;
  markerCount?: number;
}

const STATUS_COLORS: Record<string, string> = {
  online:  'bg-emerald-500',
  active:  'bg-blue-500',
  warning: 'bg-amber-500',
  offline: 'bg-slate-500',
};

export const DeviceMarker: React.FC<DeviceMarkerProps> = ({
  definition,
  deviceState,
  isSelected,
  markerIndex = 0,
  markerCount = 1,
}) => {
  const selectDevice = useDeviceStore((s) => s.selectDevice);
  const selectedDeviceId = useDeviceStore((s) => s.selectedDeviceId);
  const selectFloor = useSelectionStore((s) => s.selectFloor);
  const selectRoom = useSelectionStore((s) => s.selectRoom);
  const setFloorMode = useVisibilityStore((s) => s.setFloorMode);
  const issueCameraCommand = useCameraStore((s) => s.issueCommand);
  const isZoomedIn = useCameraStore((s) => s.isZoomedIn);
  const building = useActiveBuildingConfig();

  const shouldHide = (isZoomedIn && !isSelected) || Boolean(selectedDeviceId && !isSelected);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const willSelect = !isSelected;
      selectDevice(willSelect ? definition.id : null);
      if (willSelect) {
        const elevatorLocation = deviceState.type === 'elevator' ? getElevatorLocation(building, deviceState.state) : null;
        selectFloor(elevatorLocation?.floor.id ?? definition.floorId);
        selectRoom(elevatorLocation ? null : definition.roomId);
        setFloorMode('isolate');
        issueCameraCommand('focusDevice', definition.id);
      }
    },
    [building, definition.floorId, definition.roomId, definition.id, deviceState, isSelected, selectDevice, selectFloor, selectRoom, setFloorMode, issueCameraCommand]
  );

  const isPoweredOff = (deviceState.type === 'ac' || deviceState.type === 'light') && !deviceState.state.power;
  const isCctvOffline = deviceState.type === 'cctv' && !deviceState.state.online;
  const statusDot = isPoweredOff || isCctvOffline ? 'bg-rose-500' : STATUS_COLORS[definition.status] ?? 'bg-slate-400';

  // Derive a quick status label from state
  let statusLabel: string = definition.status;
  if (deviceState.type === 'ac') statusLabel = deviceState.state.power ? `${deviceState.state.temperature}°C` : 'Off';
  else if (deviceState.type === 'light') statusLabel = deviceState.state.power ? `${deviceState.state.brightness}%` : 'Off';
  else if (deviceState.type === 'door') statusLabel = deviceState.state.open ? 'Open' : deviceState.state.locked ? 'Locked' : 'Closed';
  else if (deviceState.type === 'cctv') statusLabel = deviceState.state.recording ? 'REC' : deviceState.state.online ? 'Live' : 'Offline';
  else if (deviceState.type === 'sensor') statusLabel = `${deviceState.state.value.toFixed(1)}${deviceState.state.unit}`;
  else if (deviceState.type === 'elevator') statusLabel = `Floor ${deviceState.state.currentFloor}`;

  const baseYOffset =
    definition.type === 'ac' ? 0.75
    : definition.type === 'door' ? 1.45
    : definition.type === 'elevator' ? 1.65
    : definition.type === 'light' ? 0.65
    : definition.type === 'cctv' ? 0.65
    : 0.60;
  const row = markerIndex % 3;
  const column = Math.floor(markerIndex / 3);
  const markerXOffset = markerCount > 1 ? (row - 1) * 0.24 : 0;
  const yOffset = baseYOffset + row * 0.22 + column * 0.08;

  return (
    <Html
      position={[markerXOffset, yOffset, 0]}
      center
      zIndexRange={[20, 10]}
      className={`transition-opacity duration-300 select-none ${
        shouldHide ? 'opacity-0 pointer-events-none' : 'pointer-events-auto'
      }`}
    >
      <div
        onClick={handleClick}
        className={`relative group flex max-w-[10rem] items-center gap-1.5 rounded-xl border px-2 py-1 shadow-md transition-all duration-150 cursor-pointer ${
          isSelected
            ? 'bg-slate-900 border-slate-700 text-white shadow-indigo-500/30 ring-2 ring-indigo-400'
            : isPoweredOff || isCctvOffline
            ? 'bg-rose-50/95 backdrop-blur-sm border-rose-200 text-rose-800 hover:bg-rose-100 hover:border-rose-300 hover:scale-105'
            : 'bg-white/95 backdrop-blur-sm border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300 hover:scale-105'
        }`}
      >
        <span className="truncate text-[10px] font-bold tracking-tight leading-none">{formatDeviceLabel(definition.id)}</span>
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot}`} />
        <span className={`text-[9px] font-mono leading-none whitespace-nowrap ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
          {statusLabel}
        </span>
      </div>
    </Html>
  );
};
