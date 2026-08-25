'use client';

import React, { useSyncExternalStore, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { LightingRig } from './LightingRig';
import { IsometricCamera } from '../camera/IsometricCamera';
import { Building } from '../building/Building';
import { BuildingConfig } from '@/types/building';
import { useSelectionStore } from '@/stores/useSelectionStore';

interface SceneCanvasProps {
  config?: BuildingConfig;
  autoRotate?: boolean;
  interactive?: boolean;
  className?: string;
}

const emptySubscribe = () => () => {};

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  config,
  autoRotate = false,
  interactive = true,
  className = 'w-full h-full',
}) => {
  const clearSelection = useSelectionStore((s) => s.clearSelection);

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const hasWebGL = useSyncExternalStore(
    emptySubscribe,
    () => checkWebGLSupport(),
    () => true
  );

  const handlePointerMissed = useCallback(() => {
    clearSelection();
    document.body.style.cursor = 'auto';
  }, [clearSelection]);

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center bg-[#F7F8FA] ${className}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-500">Initializing Digital Twin 3D Engine...</span>
        </div>
      </div>
    );
  }

  if (!hasWebGL) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center bg-slate-100 rounded-2xl border border-slate-200 ${className}`}>
        <div className="w-12 h-12 mb-4 text-amber-600 bg-amber-100 rounded-full flex items-center justify-center font-bold">
          !
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">WebGL Not Available</h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Your browser or hardware graphics acceleration is disabled. Please enable hardware acceleration in browser settings to interact with the 3D building.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
         camera={{
           position: [18, 19, 18],
           fov: 38,
           near: 0.5,
           far: 200,
         }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        className="touch-none"
        onPointerMissed={handlePointerMissed}
      >
        <color attach="background" args={['#EEF2F4']} />
        <fog attach="fog" args={['#EEF2F4', 55, 120]} />

        <LightingRig shadows />

         <Building config={config} />

        <IsometricCamera
          autoRotate={autoRotate}
          enableRotate={interactive}
          enableZoom={interactive}
          enablePan={interactive}
        />
      </Canvas>
    </div>
  );
};
