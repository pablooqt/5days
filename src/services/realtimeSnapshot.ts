import { getSupabaseBrowserClient } from '@/lib/supabase/browser';

export async function refetchDeviceSnapshot() {
  const client = getSupabaseBrowserClient();
  const [{ data: devices, error: devicesError }, { data: states, error: statesError }] = await Promise.all([
    client.from('devices').select('id, metadata'),
    client.from('device_states').select('device_id, state'),
  ]);
  if (devicesError) throw devicesError;
  if (statesError) throw statesError;
  return { devices: devices ?? [], states: states ?? [] };
}
