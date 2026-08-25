'use client';

import { useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useUIStore } from '@/stores/useUIStore';
import { refetchDeviceSnapshot } from '@/services/realtimeSnapshot';

export function useRealtimeSync() {
  const hydrateStates = useDeviceStore((s) => s.hydrateStates);
  const applyRemoteState = useDeviceStore((s) => s.applyRemoteState);
  const setStatus = useUIStore((s) => s.setRealtimeStatus);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_REMOTE_SYNC !== 'true') {
      setStatus('preview');
      return;
    }
    const client = getSupabaseBrowserClient();
    let channel: ReturnType<typeof client.channel> | null = null;
    let simulator: number | undefined;
    let cancelled = false;

    async function connect() {
      if (cancelled) return;
      channel = client.channel('5days-device-sync');
      setStatus('connecting');

      channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'device_states' }, (payload) => {
        const row = payload.new as { device_id?: string; state?: unknown };
        if (row.device_id && row.state) applyRemoteState(row.device_id, row.state);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'device_events' }, () => {
        useUIStore.getState().addToast({ type: 'info', title: 'Activity updated', message: 'A device event was received.', durationMs: 2500 });
      })
        .subscribe((status) => {
        if (status === 'SUBSCRIBED') setStatus('connected');
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setStatus('reconnecting');
          refetchDeviceSnapshot().catch(() => undefined);
        }
        else if (status === 'CLOSED') setStatus('disconnected');
        });

      simulator = process.env.NEXT_PUBLIC_ENABLE_DEVICE_SIMULATOR === 'true'
      ? window.setInterval(() => {
        const sensor = Object.values(useDeviceStore.getState().definitions).find((item) => item.type === 'sensor');
        const current = sensor && useDeviceStore.getState().states[sensor.id];
        if (sensor && current?.type === 'sensor') {
          useDeviceStore.getState().applyRemoteState(sensor.id, {
            ...current.state,
            value: Math.max(16, Math.min(32, current.state.value + (Math.random() - 0.5) * 0.4)),
          });
        }
      }, 30000)
        : undefined;
    }
    void connect();

    return () => {
      cancelled = true;
      if (simulator) window.clearInterval(simulator);
      if (channel) void client.removeChannel(channel);
    };
  }, [applyRemoteState, hydrateStates, setStatus]);
}
