'use client';

import React from 'react';
import { RoomType } from '@/types/domain';

interface RoomInteriorProps {
  type: RoomType;
  width: number;
  depth: number;
}

const FurnitureMaterial = ({ color = '#D9B89C' }: { color?: string }) => (
  <meshStandardMaterial color={color} roughness={0.82} metalness={0.02} />
);

function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.18, 0.14, 0.28, 12]} />
        <FurnitureMaterial color="#D7A889" />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <sphereGeometry args={[0.34, 12, 8]} />
        <meshStandardMaterial color="#72B99A" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Chair({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.5, 0.08, 0.5]} />
        <FurnitureMaterial color="#8FA9B0" />
      </mesh>
      <mesh position={[0, 0.62, 0.18]}>
        <boxGeometry args={[0.5, 0.6, 0.08]} />
        <FurnitureMaterial color="#8FA9B0" />
      </mesh>
    </group>
  );
}

export const RoomInterior: React.FC<RoomInteriorProps> = ({ type, width, depth }) => {
  const groupProps = { scale: [1, 1, 1] as [number, number, number] };

  if (type === 'lobby') {
    return (
      <group {...groupProps}>
        <mesh position={[-1.6, 0.38, 0]}>
          <boxGeometry args={[2.8, 0.45, 0.75]} />
          <FurnitureMaterial color="#D7B6A3" />
        </mesh>
        <mesh position={[-1.6, 0.78, 0.27]}>
          <boxGeometry args={[2.8, 0.5, 0.12]} />
          <FurnitureMaterial color="#C99E8A" />
        </mesh>
        <mesh position={[1.3, 0.22, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 0.12, 24]} />
          <FurnitureMaterial color="#C9A27B" />
        </mesh>
        <Plant position={[3.1, 0, -1.8]} />
      </group>
    );
  }

  if (type === 'meeting') {
    return (
      <group {...groupProps}>
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[Math.min(width - 1.6, 5.8), 0.18, 1.5]} />
          <FurnitureMaterial color="#B98F70" />
        </mesh>
        {[-2.1, -0.7, 0.7, 2.1].map((x) => (
          <React.Fragment key={x}>
            <Chair position={[x, 0, -1.1]} rotation={Math.PI} />
            <Chair position={[x, 0, 1.1]} />
          </React.Fragment>
        ))}
        <Plant position={[width / 2 - 0.7, 0, depth / 2 - 0.7]} />
      </group>
    );
  }

  if (type === 'utility') {
    return (
      <group {...groupProps}>
        {[0, 0.75, 1.5].map((x) => (
          <mesh key={x} position={[x - 0.75, 0.7, 0]}>
            <boxGeometry args={[0.55, 1.25, Math.min(depth - 0.8, 2.2)]} />
            <FurnitureMaterial color="#9AA9B2" />
          </mesh>
        ))}
      </group>
    );
  }

  if (type === 'corridor') {
    return (
      <group {...groupProps}>
        <mesh position={[0, 0.24, 0]}>
          <boxGeometry args={[Math.min(width - 1.5, 8), 0.28, 0.65]} />
          <FurnitureMaterial color="#B7C8C2" />
        </mesh>
        <Plant position={[-width / 2 + 0.8, 0, 0]} />
        <Plant position={[width / 2 - 0.8, 0, 0]} />
      </group>
    );
  }

  return (
    <group {...groupProps}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[Math.min(width - 2, 4.2), 0.16, 1.2]} />
        <FurnitureMaterial color="#B89173" />
      </mesh>
      <Chair position={[0, 0, -1]} rotation={Math.PI} />
      <Chair position={[0, 0, 1]} />
      <Plant position={[width / 2 - 0.7, 0, depth / 2 - 0.7]} />
    </group>
  );
};
