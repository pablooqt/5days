'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SceneCanvas } from '@/three/scene/SceneCanvas';
import { Button } from '@/components/ui/Button';
import {
  ChevronRight,
  Rotate3d,
  Layers,
  Sparkles,
} from 'lucide-react';

const narrativeStories = [
  { device: 'AC_201', text: 'Executive Suite → 22.0°C · Cooling Active', status: 'online' },
  { device: 'DOOR_LOBBY', text: 'Main Entrance → Secured & Monitored', status: 'online' },
  { device: 'SENSOR_301', text: 'Boardroom → 415 ppm CO₂ · Air Quality Excellent', status: 'online' },
  { device: 'ELEV_01', text: 'Elevator Shaft → Floor 2 (Idle)', status: 'online' },
  { device: 'LIGHT_CORR_2', text: 'Skywalk 2 → 85% Dynamic Illumination', status: 'online' },
];

export const HeroSection: React.FC = () => {
  const [storyIndex, setStoryIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStoryIndex((prev) => (prev + 1) % narrativeStories.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentStory = narrativeStories[storyIndex];

  return (
    <section className="relative pt-6 pb-16 lg:pt-10 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#F7F8FA] via-white to-[#F7F8FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Badge and Headlines */}
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 shadow-2xs animate-in fade-in duration-500">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-700 tracking-wide uppercase">
              Next-Gen Spatial Facility Intelligence
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Manage Your Building <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#4F6BED] via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              in Real-Time 3D.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
             OmniTwin is an interactive digital twin — monitor floors, rooms, and devices, then control them in real time from one clear 3D workspace.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <Link href="/app">
              <Button size="lg" variant="primary" className="shadow-md shadow-indigo-500/20 gap-2">
                <span>Explore Building</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Primary Interactive 3D Building Stage */}
        <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[650px] rounded-3xl border border-slate-200/90 bg-[#F7F8FA] shadow-xl shadow-slate-200/50 overflow-hidden group">
          {/* Live R3F Canvas */}
          <SceneCanvas
            autoRotate={true}
            interactive={true}
            className="w-full h-full"
          />

          {/* Overlay: Live Telemetry Story Chip */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-md flex items-center gap-3 transition-all duration-300 animate-in fade-in slide-in-from-left-4">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Live Building Event · {currentStory.device}
                </span>
                <span className="text-xs font-medium text-slate-800">
                  {currentStory.text}
                </span>
              </div>
            </div>
          </div>

          {/* Overlay: 3D Interaction Hints */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 pointer-events-none hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200/70">
            <Rotate3d className="w-3.5 h-3.5 text-indigo-600" />
            <span>Drag to rotate • Scroll to zoom • Click room to inspect</span>
          </div>

          {/* Overlay: Mode indicator pill */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>3 Floors · 10 Rooms · 1 World</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
