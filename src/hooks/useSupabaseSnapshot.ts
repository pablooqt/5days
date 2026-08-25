'use client';

import { useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser';
import { useDeviceStore, MOCK_DEFINITIONS } from '@/stores/useDeviceStore';
import type { DeviceStatus } from '@/types/domain';
import { useUIStore } from '@/stores/useUIStore';
import { logClientError } from '@/lib/logger';

export function useSupabaseSnapshot() {
  const hydrateStates = useDeviceStore((s) => s.hydrateStates);
  const hydrateLocalStates = useDeviceStore((s) => s.hydrateLocalStates);
  const simulateLocalClimate = useDeviceStore((s) => s.simulateLocalClimate);
  const addToast = useUIStore((s) => s.addToast);
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_REMOTE_SYNC !== 'true') {
      hydrateLocalStates();
      const interval = window.setInterval(simulateLocalClimate, 10000);
      return () => window.clearInterval(interval);
    }
    let cancelled = false;
    async function load() {
      const client = getSupabaseBrowserClient();
      const [{ data: devices, error: devicesError }, { data: states, error: statesError }] = await Promise.all([
        client.from('devices').select('id, metadata'),
        client.from('device_states').select('device_id, state'),
      ]);
      if (devicesError) throw devicesError;
      if (statesError) throw statesError;
      if (cancelled) return;
      if (devices?.length) {
        const definitions = Object.fromEntries(MOCK_DEFINITIONS.map((d) => {
          const remote = devices.find((item: { id: string; metadata: unknown }) => item.id === d.id);
          const status = remote && typeof remote.metadata === 'object' && remote.metadata !== null
            ? (remote.metadata as { status?: DeviceStatus }).status
            : undefined;
          return [d.id, status ? { ...d, status } : d];
        }));
        hydrateStates(definitions, states ?? []);
      }
    }
    load().catch((error: unknown) => {
      logClientError(error, { source: 'snapshot' });
      addToast({ type: 'warning', title: 'Using local preview data', message: 'The remote device snapshot could not be loaded.' });
    });
    return () => { cancelled = true; };
  }, [addToast, hydrateLocalStates, hydrateStates, simulateLocalClimate]);
}
