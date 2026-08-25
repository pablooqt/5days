import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Wind,
  Lightbulb,
  ArrowUpDown,
  Video,
  Activity,
  Lock,
} from 'lucide-react';

const devices = [
  {
    type: 'HVAC Air Conditioner',
    id: 'AC_201',
    room: 'Executive Suite 201',
    status: 'online',
    stateSummary: '22.0°C · Cooling · Auto Fan',
    icon: Wind,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
    capabilities: ['Power', 'Setpoint [16-30°C]', 'Mode Control'],
  },
  {
    type: 'Intelligent Lighting',
    id: 'LIGHT_LOBBY',
    room: 'Main Lobby & Lounge',
    status: 'online',
    stateSummary: 'Power ON · 90% Brightness',
    icon: Lightbulb,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    capabilities: ['Switchable', 'Dimming 0-100%', 'Dynamic Emissive'],
  },
  {
    type: 'Smart Access Door',
    id: 'DOOR_101',
    room: 'Operations Room 101',
    status: 'online',
    stateSummary: 'Locked & Closed',
    icon: Lock,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    capabilities: ['Open/Close Pivot', 'Access Lockout', 'Permission Guard'],
  },
  {
    type: 'Smart Elevator Core',
    id: 'ELEV_01',
    room: 'Central Shaft',
    status: 'online',
    stateSummary: 'Floor 2 (Idle) · Doors Closed',
    icon: ArrowUpDown,
    color: 'text-violet-600 bg-violet-50 border-violet-100',
    capabilities: ['Dispatch Call', 'Kinematic Platform', 'Cross-Client Sync'],
  },
  {
    type: 'CCTV Surveillance',
    id: 'CCTV_CORR_2',
    room: 'Skywalk Corridor 2',
    status: 'online',
    stateSummary: 'Online · Recording 1080p',
    icon: Video,
    color: 'text-rose-600 bg-rose-50 border-rose-100',
    capabilities: ['Status Feed', 'Field of View Cone', 'Audit Trail'],
  },
  {
    type: 'Air Quality & IAQ Sensor',
    id: 'SENSOR_301',
    room: 'Summit Boardroom 301',
    status: 'online',
    stateSummary: '415 ppm CO₂ · 22.4°C · Normal',
    icon: Activity,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    capabilities: ['Telemetry Streaming', 'Multi-Metric', 'Alert Trigger'],
  },
];

export const DeviceShowcaseSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-y border-slate-200/80" id="devices">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            Device Ecosystem
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Generic & extensible device telemetry.
          </p>
          <p className="mt-3 text-base text-slate-600">
            Every interactive fixture is mapped to a stable identifier across 3D meshes, UI controls, and PostgreSQL state stores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device, idx) => {
            const Icon = device.icon;
            return (
              <Card
                key={idx}
                hoverEffect
                className="p-6 border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center ${device.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="success" dot>
                      {device.status}
                    </Badge>
                  </div>

                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-mono font-semibold text-indigo-600">
                      {device.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {device.type}
                    </h3>
                    <p className="text-xs text-slate-500">{device.room}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                    <span className="text-[11px] font-medium text-slate-700 block">
                      Live Telemetry:
                    </span>
                    <span className="text-xs font-semibold text-slate-900">
                      {device.stateSummary}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Capabilities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {device.capabilities.map((cap, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
