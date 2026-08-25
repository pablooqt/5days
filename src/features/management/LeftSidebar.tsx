"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSelectionStore } from "@/stores/useSelectionStore";
import { useVisibilityStore } from "@/stores/useVisibilityStore";
import { useCameraStore } from "@/stores/useCameraStore";
import { useDeviceStore } from "@/stores/useDeviceStore";
import { demoBuildingConfig } from "@/config/building";
import {
  LayoutDashboard,
  Building2,
  Layers,
  Cpu,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

interface LeftSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mobileOpen?: boolean;
}

const NAV_ITEMS = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "floors", icon: Layers, label: "Floors" },
  { id: "rooms", icon: Building2, label: "Rooms" },
  { id: "devices", icon: Cpu, label: "Devices" },
  { id: "activity", icon: Activity, label: "Activity" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTab,
  onTabChange,
  mobileOpen = true,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const selectFloor = useSelectionStore((s) => s.selectFloor);
  const selectRoom = useSelectionStore((s) => s.selectRoom);
  const selectedFloorId = useSelectionStore((s) => s.selectedFloorId);
  const selectedRoomId = useSelectionStore((s) => s.selectedRoomId);
  const setFloorMode = useVisibilityStore((s) => s.setFloorMode);
  const issueCameraCommand = useCameraStore((s) => s.issueCommand);
  const selectDevice = useDeviceStore((s) => s.selectDevice);
  const selectedDeviceId = useDeviceStore((s) => s.selectedDeviceId);
  const definitions = useDeviceStore((s) => s.definitions);

  const allDevices = Object.values(definitions);
  const onlineCount = allDevices.filter((d) => d.status !== "offline").length;
  const warningCount = allDevices.filter((d) => d.status === "warning").length;

  return (
    <aside
      className={`${mobileOpen ? "flex" : "hidden"} md:flex flex-col shrink-0 bg-white border-r border-slate-200 transition-all duration-200 z-10 ${
        collapsed ? "w-14" : "w-56"
      }`}
    >
      {/* Nav items */}
      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            title={collapsed ? label : undefined}
            className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer group ${
              activeTab === id
                ? "bg-indigo-50 text-indigo-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon
              className={`w-4 h-4 shrink-0 ${activeTab === id ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}
            />
            {!collapsed && <span className="text-xs truncate">{label}</span>}
            {!collapsed && id === "devices" && warningCount > 0 && (
              <span className="ml-auto text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                {warningCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Panel content below nav */}
      {!collapsed && (
        <div
          className="border-t border-slate-100 overflow-y-auto"
          style={{ maxHeight: "55vh" }}
        >
          {activeTab === "overview" && (
            <div className="p-3 space-y-3">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">
                Building Status
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-bold text-emerald-700">
                    {onlineCount}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">
                    Online
                  </div>
                </div>
                <div
                  className={`${warningCount > 0 ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"} border rounded-xl p-2.5 text-center`}
                >
                  <div
                    className={`text-lg font-bold ${warningCount > 0 ? "text-amber-700" : "text-slate-400"}`}
                  >
                    {warningCount}
                  </div>
                  <div
                    className={`text-[10px] font-medium ${warningCount > 0 ? "text-amber-600" : "text-slate-400"}`}
                  >
                    Warnings
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                <div className="text-[10px] text-slate-500 mb-1 font-medium">
                  Floors Active
                </div>
                <div className="flex gap-1">
                  {demoBuildingConfig.floors.map((f) => (
                    <div
                      key={f.id}
                      className="flex-1 h-1.5 bg-indigo-400 rounded-full"
                    />
                  ))}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {demoBuildingConfig.floors.length} floors monitored
                </div>
              </div>
            </div>
          )}

          {activeTab === "floors" && (
            <div className="p-3 space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide mb-2">
                Select Floor
              </p>
              <button
                onClick={() => {
                  selectDevice(null);
                  selectRoom(null);
                  selectFloor(null);
                  setFloorMode("full");
                  issueCameraCommand("overview");
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${selectedFloorId === null ? "bg-indigo-600 text-white" : "hover:bg-slate-50 text-slate-600"}`}
              >
                All Floors
              </button>
              {demoBuildingConfig.floors.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    selectDevice(null);
                    selectRoom(null);
                    selectFloor(f.id);
                    setFloorMode("isolate");
                    issueCameraCommand("focusFloor", f.id);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${selectedFloorId === f.id ? "bg-indigo-600 text-white" : "hover:bg-slate-50 text-slate-600"}`}
                >
                  <div>{f.name}</div>
                  <div
                    className={`text-[10px] font-normal ${selectedFloorId === f.id ? "text-indigo-200" : "text-slate-400"}`}
                  >
                    {f.rooms.length} rooms · {f.elevation}m elevation
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === "rooms" && (
            <div className="p-3 space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide mb-2">
                All Rooms
              </p>
              {demoBuildingConfig.floors.flatMap((f) =>
                f.rooms.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      selectFloor(r.floorId);
                      setFloorMode("isolate");
                      selectDevice(null);
                      selectRoom(r.id);
                      issueCameraCommand("focusRoom", r.id);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${selectedRoomId === r.id ? "bg-indigo-600 text-white" : "hover:bg-slate-50 text-slate-700"}`}
                  >
                    <div className="font-semibold truncate">{r.name}</div>
                    <div
                      className={`text-[10px] ${selectedRoomId === r.id ? "text-indigo-200" : "text-slate-400"}`}
                    >
                      {r.type} · {r.deviceIds.length} devices
                    </div>
                  </button>
                )),
              )}
            </div>
          )}

          {activeTab === "devices" && (
            <div className="p-3 space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide mb-2">
                All Devices
              </p>
              {allDevices.map((def) => {
                const dotColor =
                  def.status === "warning"
                    ? "bg-amber-400"
                    : def.status === "offline"
                      ? "bg-slate-400"
                      : def.status === "active"
                        ? "bg-blue-400"
                        : "bg-emerald-400";
                const isSelected = selectedDeviceId === def.id;
                return (
                  <button
                    key={def.id}
                    onClick={() => {
                      selectFloor(def.floorId);
                      selectRoom(def.roomId);
                      setFloorMode("isolate");
                      selectDevice(def.id);
                      issueCameraCommand("focusDevice", def.id);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? "bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold shadow-xs"
                        : "hover:bg-slate-50 text-slate-700 border border-transparent"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`}
                    />
                    <span className="font-mono font-semibold truncate flex-1">
                      {def.id}
                    </span>
                    {def.status === "warning" && (
                      <span className="text-[9px] bg-amber-100 text-amber-700 px-1 py-0.5 rounded font-bold">
                        !
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="p-3 space-y-2">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide mb-2">
                Recent Activity
              </p>
              {[
                {
                  time: "Just now",
                  msg: "AC_LOBBY temperature set to 23°C",
                  type: "control",
                },
                {
                  time: "2m ago",
                  msg: "SENSOR_102 threshold warning triggered",
                  type: "alert",
                },
                {
                  time: "5m ago",
                  msg: "DOOR_201 unlocked by operator",
                  type: "control",
                },
                {
                  time: "12m ago",
                  msg: "LIGHT_LOBBY brightness set to 80%",
                  type: "control",
                },
                {
                  time: "18m ago",
                  msg: "CCTV_301 went offline",
                  type: "alert",
                },
                {
                  time: "25m ago",
                  msg: "Building digital twin synced",
                  type: "system",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-2">
                  <span
                    className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${item.type === "alert" ? "bg-amber-400" : item.type === "control" ? "bg-indigo-400" : "bg-slate-300"}`}
                  />
                  <div>
                    <div className="text-[10px] text-slate-700">{item.msg}</div>
                    <div className="text-[9px] text-slate-400">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="p-3 space-y-3">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide mb-2">
                Settings
              </p>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-slate-600">
                  Auto-focus on select
                </span>
                <div className="w-8 h-4 bg-indigo-600 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-slate-600">
                  Show device markers
                </span>
                <div className="w-8 h-4 bg-indigo-600 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-slate-600">Ambient shadows</span>
                <div className="w-8 h-4 bg-slate-200 rounded-full relative">
                  <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                </div>
              </label>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] text-slate-400">Keyboard Shortcuts</p>
                <div className="mt-1 space-y-0.5 text-[10px] text-slate-500">
                  <div className="flex justify-between">
                    <span>Esc</span>
                    <span>Deselect</span>
                  </div>
                  <div className="flex justify-between">
                    <span>F</span>
                    <span>Focus room</span>
                  </div>
                  <div className="flex justify-between">
                    <span>T</span>
                    <span>Transparent walls</span>
                  </div>
                  <div className="flex justify-between">
                    <span>0–3</span>
                    <span>Floor shortcuts</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom actions */}
      <div className="border-t border-slate-100 p-2 space-y-1">
        <Link
          href="/"
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-50 transition-all cursor-pointer ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Exit</span>}
        </Link>
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-50 transition-all cursor-pointer ${collapsed ? "justify-center" : "justify-end"}`}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
          {!collapsed && <span className="text-[10px]">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};
