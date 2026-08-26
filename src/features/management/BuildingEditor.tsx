'use client';

import React, { useState } from 'react';
import { useSelectionStore } from '@/stores/useSelectionStore';
import { useActiveBuildingConfig, useBuildingStore } from '@/stores/useBuildingStore';
import { useCameraStore } from '@/stores/useCameraStore';
import { useVisibilityStore } from '@/stores/useVisibilityStore';
import type { LayoutObject, LayoutObjectKind } from '@/types/building';

const CATALOG: Array<[LayoutObjectKind, string]> = [
  ['ac', 'AC'], ['light', 'Lamp'], ['sensor', 'Sensor'], ['cctv', 'CCTV'],
  ['sofa', 'Sofa'], ['bed', 'Bed'], ['table', 'Table'], ['chair', 'Chair'], ['plant', 'Plant'],
];

export function EditorToggle() {
  const editorMode = useBuildingStore((state) => state.editorMode);
  const setEditorMode = useBuildingStore((state) => state.setEditorMode);
  const setEditorFloor = useBuildingStore((state) => state.setEditorFloor);
  const building = useActiveBuildingConfig();
  return (
    <button onClick={() => { if (!editorMode) setEditorFloor(building.floors[0]?.id ?? ''); setEditorMode(!editorMode); }} className={`pointer-events-auto rounded-xl border px-3 py-2 text-xs font-bold shadow-md ${editorMode ? 'border-slate-800 bg-slate-900 text-white' : 'border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50'}`}>
      {editorMode ? 'Exit Editor' : 'Edit Building'}
    </button>
  );
}

export function BuildingEditorToolbar() {
  const editorMode = useBuildingStore((state) => state.editorMode);
  const addFloor = useBuildingStore((state) => state.addFloor);
  const resetLayout = useBuildingStore((state) => state.resetLayout);
  const selectedFloorId = useSelectionStore((state) => state.selectedFloorId);
  const building = useActiveBuildingConfig();
  const floorId = selectedFloorId ?? building.floors[0]?.id;
  const activeEditorFloorId = useBuildingStore((state) => state.activeEditorFloorId);
  const activeEditorRoomId = useBuildingStore((state) => state.activeEditorRoomId);
  const setEditorFloor = useBuildingStore((state) => state.setEditorFloor);
  const setEditorRoom = useBuildingStore((state) => state.setEditorRoom);
  const beginPlacement = useBuildingStore((state) => state.beginPlacement);
  const snapEnabled = useBuildingStore((state) => state.snapEnabled);
  const toggleSnap = useBuildingStore((state) => state.toggleSnap);
  const issueCameraCommand = useCameraStore((state) => state.issueCommand);
  const setFloorMode = useVisibilityStore((state) => state.setFloorMode);

  if (!editorMode) return null;
  return (
    <div className="pointer-events-auto mt-2 flex max-w-[calc(100vw-1.5rem)] flex-wrap items-center gap-1.5 rounded-2xl border border-indigo-200 bg-white/95 p-2 shadow-lg backdrop-blur-md">
      <button onClick={() => { addFloor(); const next = useBuildingStore.getState().activeEditorFloorId; if (next) { useSelectionStore.getState().selectFloor(next); setFloorMode('isolate'); issueCameraCommand('focusFloor', next); } }} className="rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[11px] font-bold text-white">+ Floor</button>
      <select value={activeEditorFloorId ?? floorId ?? ''} onChange={(event) => { const nextFloorId = event.target.value; setEditorFloor(nextFloorId); useSelectionStore.getState().selectFloor(nextFloorId); setFloorMode('isolate'); issueCameraCommand('focusFloor', nextFloorId); }} className="max-w-28 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-semibold text-slate-700" aria-label="Editor floor">
        {building.floors.map((floor) => <option key={floor.id} value={floor.id}>{floor.name}</option>)}
      </select>
      <select value={activeEditorRoomId ?? ''} onChange={(event) => { setEditorRoom(event.target.value); useSelectionStore.getState().selectRoom(event.target.value); }} className="max-w-36 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-semibold text-slate-700" aria-label="Editor room">
        {building.floors.find((floor) => floor.id === activeEditorFloorId)?.rooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
      </select>
      {CATALOG.map(([kind, label]) => <button key={kind} disabled={!activeEditorFloorId && !floorId} onClick={() => beginPlacement(kind)} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700 disabled:opacity-40">+ {label}</button>)}
      <button onClick={toggleSnap} className={`rounded-lg border px-2 py-1.5 text-[11px] font-semibold ${snapEnabled ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500'}`}>Snap {snapEnabled ? 'On' : 'Off'}</button>
      <button onClick={() => { resetLayout(); const firstFloor = useBuildingStore.getState().layout.building.floors[0]; if (firstFloor) { useSelectionStore.getState().selectFloor(firstFloor.id); setFloorMode('isolate'); issueCameraCommand('focusFloor', firstFloor.id); } }} className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1.5 text-[11px] font-semibold text-rose-700">Reset</button>
    </div>
  );
}

export function BuildingEditorPanel() {
  const editorMode = useBuildingStore((state) => state.editorMode);
  const selectedObjectId = useBuildingStore((state) => state.selectedObjectId);
  const layout = useBuildingStore((state) => state.layout);
  const updateObject = useBuildingStore((state) => state.updateObject);
  const deleteObject = useBuildingStore((state) => state.deleteObject);
  const activeFloorId = useBuildingStore((state) => state.activeEditorFloorId);
  const activeRoomId = useBuildingStore((state) => state.activeEditorRoomId);
  const selectObject = useBuildingStore((state) => state.selectObject);
  const roomObjects = layout.objects.filter((item) => item.floorId === activeFloorId && item.roomId === activeRoomId);
  const object = roomObjects.find((item) => item.id === selectedObjectId);
  if (!editorMode) return null;
  return (
    <div className="pointer-events-auto absolute right-3 top-3 z-30 w-72 rounded-2xl border border-indigo-200 bg-white/95 p-3 shadow-xl backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-wide text-indigo-600">Interior manager</p><p className="text-[10px] text-slate-500">{roomObjects.length} object{roomObjects.length === 1 ? '' : 's'}</p></div></div>
      <div className="mb-3 max-h-36 space-y-1 overflow-y-auto border-b border-slate-100 pb-2">
        {roomObjects.length === 0 && <p className="py-2 text-[10px] text-slate-400">No interior in this room yet.</p>}
        {roomObjects.map((item) => <div key={item.id} className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 ${item.id === selectedObjectId ? 'border-indigo-200 bg-indigo-50' : 'border-transparent bg-slate-50'}`}><button onClick={() => selectObject(item.id)} className="min-w-0 flex-1 truncate text-left text-[11px] font-semibold text-slate-700">{item.name}</button><button onClick={() => deleteObject(item.id)} aria-label={`Delete ${item.name}`} className="px-1 text-[10px] font-bold text-rose-600">Delete</button></div>)}
      </div>
      {object ? <EditorObjectForm key={object.id} object={object} layout={layout} deleteObject={deleteObject} updateObject={updateObject} /> : <p className="text-[10px] text-slate-400">Select an interior object to edit its properties.</p>}
    </div>
  );
}

function EditorObjectForm({ object, layout, deleteObject, updateObject }: { object: LayoutObject; layout: ReturnType<typeof useBuildingStore.getState>['layout']; deleteObject: (id: string) => void; updateObject: (id: string, patch: Partial<Pick<LayoutObject, 'name' | 'floorId' | 'roomId' | 'position' | 'rotation' | 'scale'>>) => void }) {
  const [draft, setDraft] = useState(object);

  const updateVector = (key: 'position' | 'rotation' | 'scale', index: number, value: number) => {
    const vector = [...draft[key]] as [number, number, number];
    vector[index] = value;
    setDraft({ ...draft, [key]: vector });
  };

  const applyChanges = () => {
    updateObject(object.id, {
      name: draft.name,
      floorId: draft.floorId,
      roomId: draft.roomId,
      position: draft.position,
      rotation: draft.rotation,
      scale: draft.scale,
    });
  };

  return (
    <div className="pointer-events-auto absolute right-3 top-3 z-30 w-64 rounded-2xl border border-indigo-200 bg-white/95 p-3 shadow-xl backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-wide text-indigo-600">Selected object</p><p className="text-xs font-bold text-slate-900">{draft.name}</p></div><button onClick={() => deleteObject(object.id)} className="text-[10px] font-bold text-rose-600">Delete</button></div>
      <label className="mb-2 block text-[10px] font-semibold text-slate-500">Room<select value={draft.roomId ?? ''} onChange={(event) => setDraft({ ...draft, roomId: event.target.value || undefined })} className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700">{layout.building.floors.find((floor) => floor.id === draft.floorId)?.rooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}</select></label>
      {(['position', 'rotation', 'scale'] as const).map((key) => <div key={key} className="mb-2"><p className="mb-1 text-[10px] font-semibold capitalize text-slate-500">{key}</p><div className="grid grid-cols-3 gap-1">{draft[key].map((value, index) => <input key={`${key}-${index}`} type="number" step="0.1" value={value} onChange={(event) => updateVector(key, index, Number(event.target.value))} className="w-full rounded-md border border-slate-200 px-1.5 py-1 text-[10px]" aria-label={`${key} ${index + 1}`} />)}</div></div>)}
      <div className="mt-3 flex gap-1.5 border-t border-slate-100 pt-2"><button onClick={applyChanges} className="flex-1 rounded-lg bg-indigo-600 px-2 py-1.5 text-[11px] font-bold text-white">Apply</button><button onClick={() => setDraft(object)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-[11px] font-semibold text-slate-600">Cancel</button></div>
    </div>
  );
}
