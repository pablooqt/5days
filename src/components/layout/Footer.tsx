import React from 'react';
import Link from 'next/link';
import { Building2, Shield, Activity, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4F6BED] flex items-center justify-center text-white shadow-xs">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                OmniTwin
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Interactive 3D Digital Twin & Smart Building Management platform. Real-time telemetry, procedural architecture, and spatial control.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>3D Engine Online (WebGL 2.0)</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Core Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/app" className="hover:text-indigo-600 transition-colors">
                  Management Mode
                </Link>
              </li>
              <li>
                <Link href="/app?tab=devices" className="hover:text-indigo-600 transition-colors">
                  Device Telemetry
                </Link>
              </li>
              <li>
                <Link href="/app?tab=rooms" className="hover:text-indigo-600 transition-colors">
                  Spatial Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Architecture
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                <span>Procedural Three.js / R3F</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                 <span>Realtime Building Synchronizer</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>PostgreSQL & RLS Governance</span>
              </li>
            </ul>
          </div>

          {/* Workspace */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Workspace
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
               <li>
                 <span className="text-slate-400">Public 3D Preview</span>
              </li>
              <li>
                <span className="text-slate-400">Enterprise Audit Logging</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 OmniTwin Digital Twin Technologies. Built according to PRD specifications.</p>
          <div className="flex items-center gap-6">
            <span>Desktop & Tablet Optimized</span>
            <span>Version 1.0 (MVP)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
