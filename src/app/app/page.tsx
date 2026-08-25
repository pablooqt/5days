'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SceneCanvas } from '@/three/scene/SceneCanvas';
import { LeftSidebar } from '@/features/management/LeftSidebar';
import { RightPanel } from '@/features/management/RightPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useSelectionStore } from '@/stores/useSelectionStore';
import { useVisibilityStore } from '@/stores/useVisibilityStore';
import { useCameraStore } from '@/stores/useCameraStore';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useUIStore } from '@/stores/useUIStore';
import { demoBuildingConfig } from '@/config/building';
import {
  Building2,
  Eye,
  EyeOff,
  RotateCcw,
  ChevronLeft,
  Activity,
  Thermometer,
  Lightbulb,
} from 'lucide-react';
import Link from 'next/link';
import { useSupabaseSnapshot } from '@/hooks/useSupabaseSnapshot';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';

// ─── Deep-link handler (P4-3) ───────────────────────────────────────────────
function DeepLinkHandler() {
  const searchParams = useSearchParams();
  const selectDevice = useDeviceStore((s) => s.selectDevice);
  const selectFloor = useSelectionStore((s) => s.selectFloor);
  const setFloorMode = useVisibilityStore((s) => s.setFloorMode);
  const selectRoom   = useSelectionStore((s) => s.selectRoom);
  const issueCameraCommand = useCameraStore((s) => s.issueCommand);

  useEffect(() => {
    const deviceId = searchParams.get('device');
    const roomId   = searchParams.get('room');
    if (deviceId) {
      selectDevice(deviceId);
      const device = useDeviceStore.getState().definitions[deviceId];
      if (device) {
        selectFloor(device.floorId);
        selectRoom(device.roomId);
        setFloorMode('isolate');
        issueCameraCommand('focusDevice', deviceId);
      }
    }
    if (roomId) {
      const room = demoBuildingConfig.floors
        .flatMap((floor) => floor.rooms)
        .find((candidate) => candidate.id === roomId);
      if (room) {
        selectFloor(room.floorId);
        setFloorMode('isolate');
      }
      selectRoom(roomId);
      issueCameraCommand('focusRoom', roomId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return null;
}

// ─── Floor Selector HUD ──────────────────────────────────────────────────────
function FloorSelectorHUD() {
  const selectedFloorId = useSelectionStore((s) => s.selectedFloorId);
  const selectFloor  = useSelectionStore((s) => s.selectFloor);
  const selectRoom   = useSelectionStore((s) => s.selectRoom);
  const selectDevice = useDeviceStore((s) => s.selectDevice);
  const floorMode    = useVisibilityStore((s) => s.floorMode);
  const setFloorMode = useVisibilityStore((s) => s.setFloorMode);
  const issueCameraCommand = useCameraStore((s) => s.issueCommand);

  return (
    <div className="absolute bottom-5 left-5 z-20 flex flex-col gap-2">
      {/* Floor pills */}
      <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-lg flex items-center gap-1">
        <button
          aria-label="Show all floors"
          onClick={() => {
            selectDevice(null);
            selectRoom(null);
            selectFloor(null);
            setFloorMode('full');
            issueCameraCommand('overview');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedFloorId === null ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All
        </button>
        {demoBuildingConfig.floors.map((f) => (
          <button
            key={f.id}
            aria-label={`Show ${f.name}`}
            onClick={() => {
              selectDevice(null);
              selectRoom(null);
              selectFloor(f.id);
              setFloorMode('isolate');
              issueCameraCommand('focusFloor', f.id);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedFloorId === f.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            F{f.index + 1}
          </button>
        ))}
      </div>

      {/* Visibility mode pills */}
      {selectedFloorId && (
        <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-200 shadow-md flex items-center gap-1 text-[11px] animate-in fade-in">
          {(['selected', 'hideUpper', 'isolate'] as const).map((mode) => (
            <button
              key={mode}
              aria-label={mode === 'selected' ? 'Highlight selected floor' : mode === 'hideUpper' ? 'Hide upper floors' : 'Isolate selected floor'}
              onClick={() => setFloorMode(mode)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                floorMode === mode ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {mode === 'selected' ? 'Highlight' : mode === 'hideUpper' ? 'Hide Upper' : 'Isolate'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── View Controls HUD ───────────────────────────────────────────────────────
function ViewControlsHUD() {
  const clearSelection  = useSelectionStore((s) => s.clearSelection);
  const setFloorMode    = useVisibilityStore((s) => s.setFloorMode);
  const transparentWalls     = useVisibilityStore((s) => s.transparentWalls);
  const toggleTransparentWalls = useVisibilityStore((s) => s.toggleTransparentWalls);
  const issueCameraCommand    = useCameraStore((s) => s.issueCommand);

  return (
    <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={toggleTransparentWalls}
        aria-label={transparentWalls ? 'Disable transparent walls' : 'Enable transparent walls'}
        className={`bg-white/95 backdrop-blur-md shadow-md text-xs font-medium gap-1.5 h-9 cursor-pointer ${
          transparentWalls ? 'border-indigo-500 text-indigo-600 bg-indigo-50/70' : ''
        }`}
      >
        {transparentWalls ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        <span>X-Ray [T]</span>
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => { clearSelection(); setFloorMode('full'); issueCameraCommand('reset'); }}
        aria-label="Reset building view"
        className="bg-white/95 backdrop-blur-md shadow-md text-xs font-medium gap-1.5 h-9 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset [0]</span>
      </Button>
    </div>
  );
}

function SceneStatusHUD() {
  const selectedFloorId = useSelectionStore((s) => s.selectedFloorId);
  const definitions = useDeviceStore((s) => s.definitions);
  const states = useDeviceStore((s) => s.states);
  const selectedFloor = demoBuildingConfig.floors.find((floor) => floor.id === selectedFloorId);
  const floorDeviceIds = Object.values(definitions).filter((device) => device.floorId === selectedFloorId);
  const onlineCount = floorDeviceIds.filter((device) => device.status !== 'offline').length;
  const warnings = floorDeviceIds.filter((device) => device.status === 'warning').length;
  const temperature = floorDeviceIds
    .map((device) => states[device.id])
    .find((state) => state?.type === 'sensor');
  const activeLights = floorDeviceIds.filter((device) => {
    const state = states[device.id];
    return state?.type === 'light' && state.state.power;
  }).length;

  if (!selectedFloor) return null;

  return (
    <div className="absolute top-4 left-4 z-20 max-w-[calc(100%-2rem)]">
      <div className="rounded-2xl border border-white/80 bg-white/90 backdrop-blur-md shadow-lg shadow-slate-300/20 px-3.5 py-3">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-indigo-500">Active view</p>
            <h2 className="text-sm font-bold text-slate-900 mt-0.5">{selectedFloor.name}</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Monitoring one floor · {selectedFloor.rooms.length} rooms</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
            <Activity className="w-3 h-3" /> Live
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{onlineCount} online</span>
          <span className="flex items-center gap-1"><Thermometer className="w-3 h-3 text-sky-500" />{temperature?.type === 'sensor' ? `${temperature.state.value.toFixed(1)}°C` : 'Stable'}</span>
          <span className="flex items-center gap-1"><Lightbulb className="w-3 h-3 text-amber-500" />{activeLights} lights on</span>
          {warnings > 0 && <span className="text-amber-600 font-semibold">{warnings} alert</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Management Page ─────────────────────────────────────────────────────────
export default function ManagementPage() {
  useSupabaseSnapshot();
  useRealtimeSync();
  const [sidebarTab, setSidebarTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const clearSelection = useSelectionStore((s) => s.clearSelection);
  const selectFloor    = useSelectionStore((s) => s.selectFloor);
  const selectedRoomId = useSelectionStore((s) => s.selectedRoomId);
  const setFloorMode   = useVisibilityStore((s) => s.setFloorMode);
  const toggleTransparentWalls = useVisibilityStore((s) => s.toggleTransparentWalls);
  const issueCameraCommand  = useCameraStore((s) => s.issueCommand);

  // Keyboard shortcuts (PRD §21.3 / P4-3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when user is typing in an input/slider
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      if (e.key === 'Escape') {
        clearSelection();
      } else if ((e.key === 'f' || e.key === 'F') && selectedRoomId) {
        issueCameraCommand('focusRoom', selectedRoomId);
      } else if (e.key === '0') {
        selectFloor(null); setFloorMode('full'); issueCameraCommand('overview');
      } else if (e.key === '1') {
        selectFloor('floor-1'); setFloorMode('isolate'); issueCameraCommand('focusFloor', 'floor-1');
      } else if (e.key === '2') {
        selectFloor('floor-2'); setFloorMode('isolate'); issueCameraCommand('focusFloor', 'floor-2');
      } else if (e.key === '3') {
        selectFloor('floor-3'); setFloorMode('isolate'); issueCameraCommand('focusFloor', 'floor-3');
      } else if (e.key === 't' || e.key === 'T') {
        toggleTransparentWalls();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection, selectedRoomId, selectFloor, setFloorMode, issueCameraCommand, toggleTransparentWalls]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F7F8FA] select-none text-slate-900">

      {/* ── TopBar (PRD §9.2) ─────────────────────────────────────────── */}
      <header className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-sm text-slate-900">{demoBuildingConfig.name}</span>
            <Badge variant="accent" className="text-[10px] py-0 px-2">Management Mode</Badge>
          </div>
        </div>

         <div className="flex items-center gap-3">
           <RealtimeStatusBadge />
         </div>
      </header>

      {/* ── Main app body ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar (PRD §9.2) */}
         <button aria-label="Open management navigation" onClick={() => setMobileSidebarOpen(true)} className="md:hidden absolute left-3 top-3 z-30 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg border border-slate-200">Menu</button>
         <LeftSidebar activeTab={sidebarTab} onTabChange={(tab) => { setSidebarTab(tab); setMobileSidebarOpen(false); }} mobileOpen={mobileSidebarOpen} />

        {/* 3D Viewport (always dominant) */}
        <div className="relative flex-1 overflow-hidden">
          <Suspense fallback={null}>
            <DeepLinkHandler />
          </Suspense>

          <SceneCanvas
            autoRotate={false}
            interactive={true}
            className="w-full h-full"
          />

           <FloorSelectorHUD />
           <SceneStatusHUD />
           <ViewControlsHUD />
        </div>

        {/* Right Contextual Panel (PRD §9.2) */}
        <RightPanel />
      </div>
    </div>
  );
}

function RealtimeStatusBadge() {
  const status = useUIStore((s) => s.realtimeStatus);
  const connected = status === 'connected';
  const preview = status === 'preview';
  const reconnecting = status === 'connecting' || status === 'reconnecting';
  return (
    <div className={`hidden sm:flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full border ${connected ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : reconnecting ? 'text-amber-700 bg-amber-50 border-amber-100' : preview ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : 'text-slate-500 bg-slate-100 border-slate-200'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : reconnecting ? 'bg-amber-500 animate-pulse' : preview ? 'bg-indigo-500' : 'bg-slate-400'}`} />
      <span>{connected ? 'Digital Twin Synced' : reconnecting ? 'Reconnecting…' : preview ? 'Preview Mode' : 'Realtime Offline'}</span>
    </div>
  );
}
