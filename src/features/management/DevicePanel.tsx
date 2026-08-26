'use client';

import React, { useRef, useState } from 'react';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useSelectionStore } from '@/stores/useSelectionStore';
import { useVisibilityStore } from '@/stores/useVisibilityStore';
import { useCameraStore } from '@/stores/useCameraStore';
import { controlDevice } from '@/services/deviceCommands';
import { useActiveBuildingConfig } from '@/stores/useBuildingStore';
import { formatDeviceLabel } from '@/lib/deviceLabels';
import {
  Thermometer, Lock, LockOpen, Video, Eye,
  Wind, Sun, DoorOpen, DoorClosed, Power, WifiOff, MapPin, Activity,
  Fan, Gauge, Lightbulb, Snowflake,
} from 'lucide-react';

interface DevicePanelProps {
  embedded?: boolean; // When true, renders as a flat panel (no absolute positioning / shadow)
}

export const DevicePanel: React.FC<DevicePanelProps> = ({ embedded = false }) => {
  const selectedDeviceId = useDeviceStore((s) => s.selectedDeviceId);
  const definitions = useDeviceStore((s) => s.definitions);
  const states = useDeviceStore((s) => s.states);
  const selectDevice = useDeviceStore((s) => s.selectDevice);
  const callElevator = useDeviceStore((s) => s.callElevator);
  const selectFloor = useSelectionStore((s) => s.selectFloor);
  const setFloorMode = useVisibilityStore((s) => s.setFloorMode);
  const issueCameraCommand = useCameraStore((s) => s.issueCommand);
  const setCctvState = useDeviceStore((s) => s.setCctvState);
  const setAcState = useDeviceStore((s) => s.setAcState);
  const setLightState = useDeviceStore((s) => s.setLightState);
  const setDeviceStatus = useDeviceStore((s) => s.setDeviceStatus);
  const [draftTemperature, setDraftTemperature] = useState<Record<string, number>>({});
  const [draftBrightness, setDraftBrightness] = useState<Record<string, number>>({});
  const [draftColorTemp, setDraftColorTemp] = useState<Record<string, number>>({});
  const dragBaseline = useRef<import('@/types/devices').DeviceState | null>(null);
  const isDragging = useRef(false);
  const building = useActiveBuildingConfig();

  if (!selectedDeviceId) return null;
  const def = definitions[selectedDeviceId];
  const deviceState = states[selectedDeviceId];

  if (!def || !deviceState) return null;

  const beginDrag = () => {
    isDragging.current = true;
    dragBaseline.current = useDeviceStore.getState().states[def.id] ?? null;
  };

  const commitDrag = (command: string, args: Record<string, unknown>) => {
    const baseline = dragBaseline.current;
    dragBaseline.current = null;
    isDragging.current = false;
    if (!baseline) return;
    void controlDevice({ deviceId: def.id, command, args, previousState: baseline, optimistic: false });
  };

  const resolvedFloor = deviceState.type === 'elevator'
    ? building.floors[deviceState.state.currentFloor - 1] ?? building.floors[0]
    : building.floors.find((item) => item.id === def.floorId);
  const floor = resolvedFloor;
  const room = deviceState.type === 'elevator'
    ? floor?.rooms[0]
    : floor?.rooms.find((item) => item.id === def.roomId);
  const typeLabel = def.type === 'ac' ? 'Climate control' : def.type === 'light' ? 'Lighting' : def.type === 'door' ? 'Access point' : def.type === 'cctv' ? 'Security camera' : def.type === 'sensor' ? 'Environment sensor' : 'Vertical transport';

  const isPoweredOff = (deviceState.type === 'ac' || deviceState.type === 'light') && !deviceState.state.power;
  const relatedAc = deviceState.type === 'sensor'
    ? Object.values(definitions).find((device) => device.type === 'ac' && device.roomId === def.roomId)
    : null;
  const relatedAcState = relatedAc ? states[relatedAc.id] : null;
  const statusColor =
    isPoweredOff ? 'text-rose-600 bg-rose-50 border-rose-200'
    : def.status === 'warning' ? 'text-amber-600 bg-amber-50 border-amber-200'
    : def.status === 'offline' ? 'text-slate-500 bg-slate-100 border-slate-200'
    : def.status === 'active' ? 'text-blue-600 bg-blue-50 border-blue-200'
    : 'text-emerald-600 bg-emerald-50 border-emerald-200';

  if (embedded) {
    return (
      <div className="p-4 space-y-4">
      {/* Header */}
      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
        <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600">
              {def.type === 'ac' ? <Snowflake className="w-4 h-4" /> : def.type === 'light' ? <Lightbulb className="w-4 h-4" /> : def.type === 'door' ? (deviceState.type === 'door' && deviceState.state.open ? <DoorOpen className="w-4 h-4" /> : <DoorClosed className="w-4 h-4" />) : def.type === 'cctv' ? <Eye className="w-4 h-4" /> : def.type === 'sensor' ? <Gauge className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
            </div>
            <div>
            <h3 className="text-sm font-bold text-slate-900">{def.name}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">{typeLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide ${statusColor}`}>
              {isPoweredOff ? 'off' : def.status}
            </span>
             <span className="text-[10px] font-mono text-slate-400">{formatDeviceLabel(def.id)}</span>
          </div>
        </div>
        <button
          onClick={() => selectDevice(null)}
          className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer shrink-0"
        >
          ✕
        </button>
        </div>
        <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-500">
          <MapPin className="w-3 h-3 text-indigo-500" />
          <span>{floor?.name ?? def.floorId}</span>
          <span className="text-slate-300">/</span>
           <span>{deviceState.type === 'elevator' ? 'Elevator Landing' : room?.name ?? 'Shared area'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live status</div>
          <div className={`text-xs font-bold mt-1 capitalize ${isPoweredOff ? 'text-rose-800' : 'text-emerald-800'}`}>{isPoweredOff ? 'off' : def.status}</div>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-indigo-700 font-medium"><Activity className="w-3 h-3" />Current reading</div>
          <div className="text-xs font-bold text-indigo-800 mt-1">
            {deviceState.type === 'ac' ? `${deviceState.state.temperature}°C` : deviceState.type === 'light' ? `${deviceState.state.brightness}%` : deviceState.type === 'sensor' ? `${deviceState.state.value.toFixed(1)} ${deviceState.state.unit}` : deviceState.type === 'door' ? (deviceState.state.open ? 'Open' : 'Closed') : 'Ready'}
          </div>
        </div>
      </div>

      {/* ── AC Controls ──────────────────────────────────────────────────── */}
      {deviceState.type === 'ac' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Power</span>
            <button
              onClick={() => { void controlDevice({ deviceId: def.id, command: 'SET_POWER', args: { power: !deviceState.state.power } }); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${deviceState.state.power ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <Power className="w-3 h-3" />
              {deviceState.state.power ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600">
              <span className="font-medium flex items-center gap-1"><Thermometer className="w-3 h-3" />Set Temperature</span>
               <span className="font-bold text-slate-900">{draftTemperature[def.id] ?? deviceState.state.temperature}°C</span>
            </div>
            <input
              type="range" min={16} max={30} step={1}
               value={draftTemperature[def.id] ?? deviceState.state.temperature}
               disabled={!deviceState.state.power}
               onPointerDown={beginDrag}
               onFocus={beginDrag}
               onChange={(e) => { const value = +e.target.value; setDraftTemperature((draft) => ({ ...draft, [def.id]: value })); setAcState(def.id, { temperature: value }); }}
               onPointerUp={(e) => commitDrag('SET_TEMPERATURE', { temperature: +(e.currentTarget as HTMLInputElement).value })}
               onBlur={(e) => commitDrag('SET_TEMPERATURE', { temperature: +(e.currentTarget as HTMLInputElement).value })}
              className="w-full h-1.5 rounded-full appearance-none bg-slate-200 accent-indigo-600 disabled:opacity-40 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400"><span>16°C</span><span>30°C</span></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium flex items-center gap-1"><Wind className="w-3 h-3" />Mode</span>
            <div className="flex gap-1">
              {(['cool','heat','fan','auto'] as const).map((m) => (
                <button
                  key={m}
                  disabled={!deviceState.state.power}
                  onClick={() => { void controlDevice({ deviceId: def.id, command: 'SET_MODE', args: { mode: m } }); }}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold capitalize cursor-pointer transition-all disabled:opacity-40 ${deviceState.state.mode === m ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600">
              <span className="font-medium flex items-center gap-1"><Fan className="w-3 h-3" />Fan speed</span>
              <span className="font-semibold text-indigo-700 capitalize">{deviceState.state.fanSpeed}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(['low', 'medium', 'high', 'auto'] as const).map((speed) => (
                <button
                  key={speed}
                  disabled={!deviceState.state.power}
                   onClick={() => { void controlDevice({ deviceId: def.id, command: 'SET_FAN_SPEED', args: { fanSpeed: speed } }); }}
                  className={`py-1.5 rounded-lg text-[10px] font-semibold capitalize cursor-pointer transition-all disabled:opacity-40 ${deviceState.state.fanSpeed === speed ? 'bg-sky-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Light Controls ───────────────────────────────────────────────── */}
      {deviceState.type === 'light' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Power</span>
            <button
               onClick={() => { void controlDevice({ deviceId: def.id, command: 'SET_POWER', args: { power: !deviceState.state.power } }); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${deviceState.state.power ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <Sun className="w-3 h-3" />
              {deviceState.state.power ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600">
              <span className="font-medium">Brightness</span>
               <span className="font-bold text-slate-900">{draftBrightness[def.id] ?? deviceState.state.brightness}%</span>
            </div>
            <input
              type="range" min={5} max={100} step={5}
               value={draftBrightness[def.id] ?? deviceState.state.brightness}
               disabled={!deviceState.state.power}
               onPointerDown={beginDrag}
               onFocus={beginDrag}
               onChange={(e) => { const value = +e.target.value; setDraftBrightness((draft) => ({ ...draft, [def.id]: value })); setLightState(def.id, { brightness: value }); }}
               onPointerUp={(e) => commitDrag('SET_BRIGHTNESS', { brightness: +(e.currentTarget as HTMLInputElement).value })}
               onBlur={(e) => commitDrag('SET_BRIGHTNESS', { brightness: +(e.currentTarget as HTMLInputElement).value })}
              className="w-full h-1.5 rounded-full appearance-none bg-slate-200 accent-amber-500 disabled:opacity-40 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600">
              <span className="font-medium">Color Temperature</span>
               <span className="font-bold text-slate-900">{draftColorTemp[def.id] ?? deviceState.state.colorTemp}K</span>
            </div>
            <input
              type="range" min={2700} max={6500} step={100}
               value={draftColorTemp[def.id] ?? deviceState.state.colorTemp}
               disabled={!deviceState.state.power}
               onPointerDown={beginDrag}
               onFocus={beginDrag}
               onChange={(e) => { const value = +e.target.value; setDraftColorTemp((draft) => ({ ...draft, [def.id]: value })); setLightState(def.id, { colorTemp: value }); }}
               onPointerUp={(e) => commitDrag('SET_COLOR_TEMP', { colorTemp: +(e.currentTarget as HTMLInputElement).value })}
               onBlur={(e) => commitDrag('SET_COLOR_TEMP', { colorTemp: +(e.currentTarget as HTMLInputElement).value })}
              className="w-full h-1.5 rounded-full appearance-none bg-gradient-to-r from-orange-300 to-blue-300 accent-slate-600 disabled:opacity-40 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400"><span>Warm 2700K</span><span>Cool 6500K</span></div>
          </div>
        </div>
      )}

      {/* ── Door Controls ─────────────────────────────────────────────────── */}
      {deviceState.type === 'door' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Door State</span>
            <button
               onClick={() => { void controlDevice({ deviceId: def.id, command: 'SET_OPEN', args: { open: !deviceState.state.open } }); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${deviceState.state.open ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {deviceState.state.open ? <DoorOpen className="w-3 h-3" /> : <DoorClosed className="w-3 h-3" />}
              {deviceState.state.open ? 'Open' : 'Closed'}
            </button>
          </div>

          {def.capabilities.includes('lockable') && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">Lock</span>
              <button
                disabled={deviceState.state.open}
                 onClick={() => { void controlDevice({ deviceId: def.id, command: 'SET_LOCKED', args: { locked: !deviceState.state.locked } }); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 ${deviceState.state.locked ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {deviceState.state.locked ? <Lock className="w-3 h-3" /> : <LockOpen className="w-3 h-3" />}
                {deviceState.state.locked ? 'Locked' : 'Unlocked'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── CCTV Controls ─────────────────────────────────────────────────── */}
      {deviceState.type === 'cctv' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Feed</span>
            <button
              onClick={() => setCctvState(def.id, { online: !deviceState.state.online, recording: !deviceState.state.online && deviceState.state.recording })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${deviceState.state.online ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              {deviceState.state.online ? <Eye className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {deviceState.state.online ? 'Online' : 'Offline'}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Recording</span>
            <button
              disabled={!deviceState.state.online}
              onClick={() => setCctvState(def.id, { recording: !deviceState.state.recording })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 ${deviceState.state.recording ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              <Video className="w-3 h-3" />
              {deviceState.state.recording ? 'REC' : 'Idle'}
            </button>
          </div>
        </div>
      )}

      {/* ── Sensor (read-only) ────────────────────────────────────────────── */}
      {deviceState.type === 'sensor' && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1.5 border-b border-slate-50">
            <span className="text-slate-500 text-xs font-medium">Reading</span>
            <span className="font-bold text-slate-900">{deviceState.state.value.toFixed(1)} {deviceState.state.unit}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-500 text-xs font-medium">Alert Status</span>
            <span className={`text-xs font-bold ${deviceState.state.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>
               {deviceState.state.status === 'warning' ? 'Warning' : 'Normal'}
            </span>
          </div>
           <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
             <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700">Diagnosis</p>
             <p className="mt-1 text-xs font-semibold text-amber-900">{deviceState.state.value > 27 ? 'Room temperature is above the safe threshold.' : deviceState.state.value > 26 ? 'Temperature is recovering toward the safe range.' : 'Temperature is within the safe range.'}</p>
             <div className="mt-2 space-y-1 text-[10px] text-amber-800">
               <div className="flex justify-between"><span>Warning threshold</span><strong>27°C</strong></div>
               <div className="flex justify-between"><span>Recommended target</span><strong>22°C</strong></div>
              {relatedAc && relatedAcState?.type === 'ac' && <div className="flex justify-between"><span>{relatedAc.name}</span><strong>{relatedAcState.state.power ? `${relatedAcState.state.temperature}°C target` : 'Off'}</strong></div>}
             </div>
             {deviceState.state.value > 27 && relatedAc && <button onClick={() => { setAcState(relatedAc.id, { power: true, temperature: 22, mode: 'cool', fanSpeed: 'high' }); setDeviceStatus(relatedAc.id, 'active'); setDeviceStatus(def.id, 'active'); selectDevice(relatedAc.id); issueCameraCommand('focusDevice', relatedAc.id); }} className="mt-3 w-full rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-700">Fix temperature automatically</button>}
             {!relatedAc && deviceState.state.value > 27 && <p className="mt-2 text-[10px] font-semibold text-amber-800">No AC found in this room. Add an AC from Edit Building to fix this alert.</p>}
           </div>
           <p className="text-[10px] text-slate-400 pt-1">Sensors are read-only. Values update via telemetry.</p>
        </div>
      )}

      {/* ── Elevator controls ─────────────────────────────────────────────── */}
      {deviceState.type === 'elevator' && (
        <div className="space-y-2">
          <div className="flex justify-between py-1.5 border-b border-slate-50">
            <span className="text-slate-500 text-xs font-medium">Current Floor</span>
            <span className="font-bold text-slate-900 text-xs">Floor {deviceState.state.currentFloor}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-50">
            <span className="text-slate-500 text-xs font-medium">Direction</span>
            <span className="font-bold text-slate-900 text-xs capitalize">{deviceState.state.direction}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-500 text-xs font-medium">Door</span>
            <span className="font-bold text-xs">{deviceState.state.doorOpen ? <span className="text-emerald-600">Open</span> : <span className="text-slate-700">Closed</span>}</span>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Go to floor</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
                {deviceState.state.phase === 'idle' ? 'Ready' : deviceState.state.phase.replace('_', ' ')}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {building.floors.map((floor) => {
                const floorNumber = floor.index + 1;
                const disabled = deviceState.state.phase !== 'idle' || floorNumber === deviceState.state.currentFloor;
                return (
                  <button
                    key={floorNumber}
                    disabled={disabled}
                    onClick={() => {
                      callElevator(def.id, floorNumber, building.floors.length);
                      window.setTimeout(() => {
                        const destination = building.floors.find((floor) => floor.index + 1 === floorNumber);
                        if (!destination) return;
                        selectFloor(destination.id);
                        setFloorMode('isolate');
                        issueCameraCommand('focusFloor', destination.id);
                      }, Math.abs(floorNumber - deviceState.state.currentFloor) * 900 + 1100);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    F{floorNumber}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  }

  // Non-embedded: floating absolute panel (legacy / direct canvas click)
  return (
    <div className="absolute top-6 right-6 z-30 w-80 bg-white/97 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-4 space-y-4 animate-in fade-in slide-in-from-right-4">
      <DevicePanel embedded />
    </div>
  );
};
