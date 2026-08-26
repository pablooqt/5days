'use client';

import React from 'react';
import { useSelectionStore } from '@/stores/useSelectionStore';
import { useVisibilityStore } from '@/stores/useVisibilityStore';
import { useCameraStore } from '@/stores/useCameraStore';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useActiveBuildingConfig } from '@/stores/useBuildingStore';
import { formatDeviceLabel } from '@/lib/deviceLabels';
import { DevicePanel } from './DevicePanel';
import { Building2, Focus, Layers, X } from 'lucide-react';

export const RightPanel: React.FC = () => {
  const selectedRoomId  = useSelectionStore((s) => s.selectedRoomId);
  const selectedFloorId = useSelectionStore((s) => s.selectedFloorId);
  const selectRoom  = useSelectionStore((s) => s.selectRoom);
  const selectFloor = useSelectionStore((s) => s.selectFloor);
  const issueCameraCommand = useCameraStore((s) => s.issueCommand);
  const setFloorMode = useVisibilityStore((s) => s.setFloorMode);

  const selectedDeviceId = useDeviceStore((s) => s.selectedDeviceId);
  const selectDevice = useDeviceStore((s) => s.selectDevice);
  const deviceDefinitions = useDeviceStore((s) => s.definitions);
  const devicesByRoom = useDeviceStore((s) => s.devicesByRoom);
  const building = useActiveBuildingConfig();

  const selectedRoom = selectedRoomId
     ? building.floors.flatMap((f) => f.rooms).find((r) => r.id === selectedRoomId)
    : null;

  const selectedFloor = selectedFloorId
     ? building.floors.find((f) => f.id === selectedFloorId)
    : null;

  // ── Device panel ─────────────────────────────────────────────────────────
  if (selectedDeviceId) {
    return (
       <div className="w-full max-h-[38vh] shrink-0 overflow-y-auto border-t border-slate-200 bg-white shadow-2xl md:static md:max-h-none md:w-80 md:border-l md:border-t-0 md:shadow-none">
        <DevicePanel embedded />
      </div>
    );
  }

  // ── Room panel ────────────────────────────────────────────────────────────
  if (selectedRoom) {
    const roomDeviceIds = devicesByRoom[selectedRoom.id] ?? [];
    const onlineCount = roomDeviceIds.filter((id) => deviceDefinitions[id]?.status !== 'offline').length;

    return (
       <div className="w-full max-h-[38vh] shrink-0 overflow-y-auto border-t border-slate-200 bg-white shadow-2xl md:static md:max-h-none md:w-80 md:border-l md:border-t-0 md:shadow-none">
        <div className="p-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">{selectedRoom.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                  {selectedRoom.type}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{selectedRoom.id}</span>
              </div>
            </div>
          </div>
          <button onClick={() => selectRoom(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dimensions */}
        <div className="p-4 space-y-2 border-b border-slate-50">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Room Dimensions</p>
          {[
            { label: 'Floor Plan Area', value: `${selectedRoom.width}m × ${selectedRoom.depth}m (${(selectedRoom.width * selectedRoom.depth).toFixed(1)} m²)` },
            { label: 'Ceiling Height', value: `${selectedRoom.height}m` },
             { label: 'Floor', value: building.floors.find((f) => f.id === selectedRoom.floorId)?.name ?? selectedRoom.floorId },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-xs">
              <span className="text-slate-500">{label}</span>
              <span className="font-semibold text-slate-800">{value}</span>
            </div>
          ))}
        </div>

        {/* Camera action */}
        <div className="p-4 border-b border-slate-50">
          <button
            onClick={() => issueCameraCommand('focusRoom', selectedRoom.id)}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <Focus className="w-3.5 h-3.5" />
            Focus Camera on Room [F]
          </button>
        </div>

        {/* Device chips */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase font-bold text-slate-400">Spatial Devices</p>
            <span className="text-[10px] font-semibold text-emerald-600">{onlineCount}/{roomDeviceIds.length} Online</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {roomDeviceIds.map((id) => {
              const def = deviceDefinitions[id];
              if (!def) return null;
              const dotColor = def.status === 'warning' ? 'bg-amber-400' : def.status === 'offline' ? 'bg-slate-400' : def.status === 'active' ? 'bg-blue-400' : 'bg-emerald-400';
              return (
                <button
                  key={id}
                  onClick={() => {
                    selectDevice(id);
                    issueCameraCommand('focusDevice', id);
                  }}
                  className="flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-1 rounded-lg border bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all cursor-pointer"
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                  {id}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Floor panel ───────────────────────────────────────────────────────────
  if (selectedFloor) {
    const floorRooms = selectedFloor.rooms;
    const allFloorDeviceIds = floorRooms.flatMap((r) => devicesByRoom[r.id] ?? []);
    const onlineCount = allFloorDeviceIds.filter((id) => deviceDefinitions[id]?.status !== 'offline').length;
    const warningCount = allFloorDeviceIds.filter((id) => deviceDefinitions[id]?.status === 'warning').length;

    return (
       <div className="w-full max-h-[38vh] shrink-0 overflow-y-auto border-t border-slate-200 bg-white shadow-2xl md:static md:max-h-none md:w-80 md:border-l md:border-t-0 md:shadow-none">
        <div className="p-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-500 text-white flex items-center justify-center shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">{selectedFloor.name}</h3>
              <span className="text-[10px] font-mono text-slate-400">{selectedFloor.id} · {selectedFloor.elevation}m</span>
            </div>
          </div>
          <button onClick={() => { selectFloor(null); setFloorMode('full'); issueCameraCommand('overview'); }} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 border-b border-slate-50">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-center">
              <div className="text-base font-bold text-slate-800">{floorRooms.length}</div>
              <div className="text-[9px] text-slate-500">Rooms</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 text-center">
              <div className="text-base font-bold text-emerald-700">{onlineCount}</div>
              <div className="text-[9px] text-emerald-600">Online</div>
            </div>
            <div className={`${warningCount > 0 ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'} border rounded-xl p-2.5 text-center`}>
              <div className={`text-base font-bold ${warningCount > 0 ? 'text-amber-700' : 'text-slate-400'}`}>{warningCount}</div>
              <div className={`text-[9px] ${warningCount > 0 ? 'text-amber-600' : 'text-slate-400'}`}>Warnings</div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Rooms on this floor</p>
          {floorRooms.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                selectFloor(selectedFloor.id);
                setFloorMode('isolate');
                selectDevice(null);
                selectRoom(r.id);
                issueCameraCommand('focusRoom', r.id);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs hover:bg-slate-50 text-slate-700 transition-all cursor-pointer border border-transparent hover:border-slate-200"
            >
              <div className="font-semibold">{r.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{r.type} · {r.deviceIds.length} devices</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Overview panel (nothing selected) ────────────────────────────────────
  const allDevices = Object.values(deviceDefinitions);
  const totalOnline  = allDevices.filter((d) => d.status !== 'offline').length;
  const totalWarning = allDevices.filter((d) => d.status === 'warning').length;
  const totalRooms   = building.floors.reduce((acc, f) => acc + f.rooms.length, 0);

  return (
    <div className="w-full max-h-[38vh] shrink-0 overflow-y-auto border-t border-slate-200 bg-white shadow-2xl md:static md:max-h-none md:w-80 md:border-l md:border-t-0 md:shadow-none">
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-xs font-bold text-slate-900">Building Overview</h3>
        <p className="text-[10px] text-slate-400 mt-0.5">{building.name}</p>
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[
             { label: 'Floors',   value: building.floors.length, color: 'text-slate-800', bg: 'bg-slate-50 border-slate-100' },
            { label: 'Rooms',    value: totalRooms, color: 'text-slate-800', bg: 'bg-slate-50 border-slate-100' },
            { label: 'Online',   value: totalOnline, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
            { label: 'Warnings', value: totalWarning, color: totalWarning > 0 ? 'text-amber-700' : 'text-slate-400', bg: totalWarning > 0 ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} border rounded-xl p-3 text-center`}>
              <div className={`text-xl font-bold ${color}`}>{value}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {totalWarning > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
             <p className="text-[10px] font-bold text-amber-700 mb-1.5">Active Warnings</p>
            {allDevices.filter((d) => d.status === 'warning').map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  selectFloor(d.floorId);
                  selectRoom(d.roomId);
                  setFloorMode('isolate');
                  selectDevice(d.id);
                  issueCameraCommand('focusDevice', d.id);
                }}
                className="w-full text-left flex items-center gap-2 py-1 cursor-pointer hover:opacity-80"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                 <span className="text-[10px] font-mono font-semibold text-amber-800">{formatDeviceLabel(d.id)}</span>
                <span className="text-[10px] text-amber-600 ml-auto capitalize">{d.type}</span>
              </button>
            ))}
          </div>
        )}

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
          <p className="text-[10px] text-slate-400 font-medium mb-1.5">Click any room or device in the 3D scene to inspect it here.</p>
          <p className="text-[10px] text-slate-400">Double-click to focus the camera. Press <kbd className="bg-slate-200 px-1 rounded text-slate-600">F</kbd> to focus selected room.</p>
        </div>
      </div>
    </div>
  );
};
