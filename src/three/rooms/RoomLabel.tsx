'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import { RoomConfig } from '@/types/building';
import { useSelectionStore } from '@/stores/useSelectionStore';
import { useCameraStore } from '@/stores/useCameraStore';
import { useDeviceStore } from '@/stores/useDeviceStore';
import {
  Briefcase,
  Users,
  Building2,
  Wrench,
  Navigation,
} from 'lucide-react';

interface RoomLabelProps {
  room: RoomConfig;
  elevation: number;
  isVisible: boolean;
  isSelected: boolean;
  isHovered: boolean;
}

const RoomTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'office':
      return <Briefcase className="w-3 h-3 text-indigo-600" />;
    case 'meeting':
      return <Users className="w-3 h-3 text-emerald-600" />;
    case 'lobby':
      return <Building2 className="w-3 h-3 text-amber-600" />;
    case 'utility':
      return <Wrench className="w-3 h-3 text-slate-600" />;
    default:
      return <Navigation className="w-3 h-3 text-slate-400" />;
  }
};

export const RoomLabel: React.FC<RoomLabelProps> = ({
  room,
  isVisible,
  isSelected,
  isHovered,
}) => {
  const selectRoom = useSelectionStore((s) => s.selectRoom);
  const issueCameraCommand = useCameraStore((s) => s.issueCommand);
  const selectDevice = useDeviceStore((s) => s.selectDevice);
  const selectedDeviceId = useDeviceStore((s) => s.selectedDeviceId);
  const isZoomedIn = useCameraStore((s) => s.isZoomedIn);
  const isDeviceActive = Boolean(selectedDeviceId);
  const shouldHide = isZoomedIn || isDeviceActive;

  if (!isVisible) return null;

  return (
    <Html
      position={[0, 0.45, 0]}
      center
      distanceFactor={18}
      zIndexRange={[10, 0]}
      className={`transition-opacity duration-300 select-none ${
        shouldHide ? 'opacity-0 pointer-events-none' : 'pointer-events-auto'
      }`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          selectDevice(null);
          selectRoom(isSelected ? null : room.id);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          selectDevice(null);
          selectRoom(room.id);
          issueCameraCommand('focusRoom', room.id);
        }}
        className={`group flex items-center gap-1.5 px-2 py-1 rounded-xl border shadow-sm transition-all duration-200 cursor-pointer ${
          isSelected
            ? 'bg-[#B8F0DE] border-[#70D2B0] text-slate-800 shadow-emerald-200/70 scale-105'
            : isHovered
            ? 'bg-white border-emerald-300 text-slate-900 shadow-lg scale-105'
            : 'bg-white/90 backdrop-blur-xs border-white text-slate-700 hover:bg-white hover:border-slate-200'
        }`}
      >
        <span className={`p-0.5 rounded-full ${isSelected ? 'bg-white/20' : 'bg-slate-100'}`}>
          <RoomTypeIcon type={room.type} />
        </span>
        <span className="text-[10px] font-semibold tracking-tight whitespace-nowrap">
          {room.name.split('&')[0].trim()}
        </span>
        {room.deviceIds.length > 0 && (
          <span
            className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
              isSelected
                ? 'bg-white/70 text-emerald-800'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {room.deviceIds.length}
          </span>
        )}
      </div>
    </Html>
  );
};
