import 'dotenv/config';
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { demoBuildingConfig } from '../src/config/building';
import { buildInitialStates, MOCK_DEFINITIONS } from '../src/stores/useDeviceStore';
import { getServerEnv } from '../src/lib/env';

loadEnv({ path: '.env.local', override: true });

type Json = Record<string, unknown> | unknown[];

function assertSeedCoverage() {
  const configDeviceIds = new Set(
    demoBuildingConfig.floors.flatMap((floor) => floor.rooms.flatMap((room) => room.deviceIds)),
  );
  const registryDeviceIds = new Set(MOCK_DEFINITIONS.map((device) => device.id));
  const missingFromRegistry = [...configDeviceIds].filter((id) => !registryDeviceIds.has(id));
  if (missingFromRegistry.length) {
    throw new Error(
      `Seed device coverage mismatch. Missing registry: ${missingFromRegistry.join(', ')}`,
    );
  }
}

async function upsertOrThrow<T extends Json>(label: string, table: string, rows: T[], onConflict: string) {
  const { data, error } = await supabase.from(table).upsert(rows, { onConflict }).select();
  if (error) throw new Error(`${label} seed failed: ${error.message}`);
  return data;
}

const env = getServerEnv();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seed() {
  assertSeedCoverage();

  await upsertOrThrow('building', 'buildings', [{
    id: demoBuildingConfig.id,
    name: demoBuildingConfig.name,
    config: demoBuildingConfig as unknown as Json,
  }], 'id');

  await upsertOrThrow('floors', 'floors', demoBuildingConfig.floors.map((floor) => ({
    id: floor.id,
    building_id: demoBuildingConfig.id,
    idx: floor.index,
    name: floor.name,
    elevation: floor.elevation,
  })), 'id');

  await upsertOrThrow('rooms', 'rooms', demoBuildingConfig.floors.flatMap((floor) => floor.rooms.map((room) => ({
    id: room.id,
    floor_id: room.floorId,
    name: room.name,
    type: room.type,
    position: room.position,
    width: room.width,
    depth: room.depth,
    height: room.height,
    status: 'vacant',
  }))), 'id');

  await upsertOrThrow('devices', 'devices', MOCK_DEFINITIONS.map((device) => ({
    id: device.id,
    building_id: demoBuildingConfig.id,
    floor_id: device.floorId,
    room_id: device.roomId || null,
    type: device.type,
    name: device.name,
    position: device.position,
    rotation_y: device.rotation?.[1] ?? 0,
    capabilities: device.capabilities,
    metadata: { status: device.status },
  })), 'id');

  const states = buildInitialStates();
  await upsertOrThrow('device states', 'device_states', Object.entries(states).map(([deviceId, deviceState]) => ({
    device_id: deviceId,
    state: deviceState,
  })), 'device_id');

  console.log(`Seed complete: 1 building, ${demoBuildingConfig.floors.length} floors, ${demoBuildingConfig.floors.reduce((total, floor) => total + floor.rooms.length, 0)} rooms, ${MOCK_DEFINITIONS.length} devices.`);
}

seed().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
