'use client';

import React, { useCallback } from 'react';
import { Html } from '@react-three/drei';
import { DeviceDefinition, DeviceState } from '@/types/devices';
import { useDeviceStore } from '@/stores/useDeviceStore';

interface DeviceMarkerProps {
  definition: DeviceDefinition;
  deviceState: DeviceState;
  isSelected: boolean;
}

const DEVICE_TYPE_ICONS: Record<string, string> = {
  ac:       '❄️',
  light:    '💡',
  door:     '🚪',
  elevator: '🛗',
  cctv:     '📷',
  sensor:   '🌡️',
};

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
}) => {
  const selectDevice = useDeviceStore((s) => s.selectDevice);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      selectDevice(isSelected ? null : definition.id);
    },
    [definition.id, isSelected, selectDevice]
  );

  const icon = DEVICE_TYPE_ICONS[definition.type] ?? '📡';
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

  return (
    <Html
      position={definition.position}
      center
      distanceFactor={30}
      zIndexRange={[20, 10]}
      className="pointer-events-auto select-none"
    >
      <div
        onClick={handleClick}
        className={`group flex items-center gap-1 px-1.5 py-1 rounded-lg border shadow-sm transition-all duration-150 cursor-pointer ${
          isSelected
            ? 'bg-slate-800 border-slate-700 text-white scale-110 shadow-slate-400/40 shadow-md'
            : isPoweredOff || isCctvOffline
            ? 'bg-rose-50/95 backdrop-blur-sm border-rose-200 text-rose-800 hover:bg-rose-100 hover:border-rose-300 hover:scale-105'
            : 'bg-white/95 backdrop-blur-sm border-white text-slate-700 hover:bg-white hover:border-slate-200 hover:scale-105'
        }`}
      >
        <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-[10px] leading-none">{icon}</span>
        <span className="text-[9px] font-bold tracking-tight leading-none">{definition.id.split('_')[0]}</span>
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot}`} />
        <span className={`text-[8px] font-mono leading-none ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
          {statusLabel}
        </span>
      </div>
    </Html>
  );
};
