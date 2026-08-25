'use client';

import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useCameraStore } from '@/stores/useCameraStore';

interface IsometricCameraProps {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enablePan?: boolean;
  enableZoom?: boolean;
  enableRotate?: boolean;
  minDistance?: number;
  maxDistance?: number;
}

export const IsometricCamera: React.FC<IsometricCameraProps> = ({
  autoRotate = false,
  autoRotateSpeed = 0.5,
  enablePan = true,
  enableZoom = true,
  enableRotate = true,
  minDistance = 1.5,
  maxDistance = 80,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const cameraCommand = useCameraStore((s) => s.command);

  const desiredPosition = useRef(new THREE.Vector3(18, 19, 18));
  const desiredTarget = useRef(new THREE.Vector3(0, 0.5, 0));
  const isTransitioning = useRef(false);

  // Set initial position
  useEffect(() => {
    camera.position.set(18, 19, 18);
    camera.lookAt(0, 0.5, 0);
  }, [camera]);

  // Unlock transition when user manually interacts
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const handleStart = () => {
      isTransitioning.current = false;
    };
    controls.addEventListener('start', handleStart);
    return () => {
      controls.removeEventListener('start', handleStart);
    };
  }, []);

  // When command changes, set new targets and activate smooth lerp transition
  useEffect(() => {
    const { position, target } = cameraCommand;
    if (position && target) {
      desiredPosition.current.set(...position);
      desiredTarget.current.set(...target);
      isTransitioning.current = true;
    }
  }, [cameraCommand]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioning.current) {
      const lerpSpeed = Math.min(delta * 5.0, 0.15);

      camera.position.lerp(desiredPosition.current, lerpSpeed);
      controlsRef.current.target.lerp(desiredTarget.current, lerpSpeed);

      const posDist = camera.position.distanceTo(desiredPosition.current);
      const targetDist = controlsRef.current.target.distanceTo(desiredTarget.current);

      if (posDist < 0.05 && targetDist < 0.05) {
        camera.position.copy(desiredPosition.current);
        controlsRef.current.target.copy(desiredTarget.current);
        isTransitioning.current = false;
      }
      controlsRef.current.update();
    } else {
      controlsRef.current.update();
    }

    const distToTarget = camera.position.distanceTo(controlsRef.current.target);
    const zoomedIn = distToTarget < 16;
    if (useCameraStore.getState().isZoomedIn !== zoomedIn) {
      useCameraStore.getState().setIsZoomedIn(zoomedIn);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      enablePan={enablePan}
      enableZoom={enableZoom}
      enableRotate={enableRotate}
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={Math.PI / 6} // clamp overhead
      maxPolarAngle={Math.PI / 2.15} // prevent going below ground
      dampingFactor={0.05}
      enableDamping
    />
  );
};
