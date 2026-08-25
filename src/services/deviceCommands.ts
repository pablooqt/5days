import { getSupabaseBrowserClient } from '@/lib/supabase/browser';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useUIStore } from '@/stores/useUIStore';
import type { DeviceState } from '@/types/devices';
import { logClientError } from '@/lib/logger';
import { getErrorMessage } from '@/lib/logger';

type DeviceCommand = {
  deviceId: string;
  command: string;
  args: Record<string, unknown>;
  previousState?: DeviceState;
  optimistic?: boolean;
};

export async function controlDevice({ deviceId, command, args, previousState, optimistic = true }: DeviceCommand) {
  const store = useDeviceStore.getState();
  const previous = previousState ?? store.states[deviceId];
  if (!previous) throw new Error('Device state not found');

  const next = optimisticState(previous, command, args);
  if (optimistic && next) store.applyRemoteState(deviceId, next);

  if (process.env.NEXT_PUBLIC_ENABLE_REMOTE_SYNC !== 'true') {
    return next;
  }

  const { data, error } = await getSupabaseBrowserClient().rpc('control_device', {
    p_device_id: deviceId,
    p_command: command,
    p_args: args,
  });

  if (error) {
    logClientError(error, { source: 'control_device', deviceId, command });
    store.applyRemoteState(deviceId, previous.state);
    const message = getErrorMessage(error);
    const isMissingRpc = message.includes('PGRST202') || message.includes('Could not find the function');
    useUIStore.getState().addToast({
      type: 'error',
      title: isMissingRpc ? 'Supabase RPC belum aktif' : 'Device command failed',
      message: isMissingRpc
        ? 'Jalankan migration supabase/migrations/0002_roles_and_control_device.sql di Supabase SQL Editor.'
        : message,
    });
    return null;
  }

  if (data) store.applyRemoteState(deviceId, data);
  return data;
}

function optimisticState(device: DeviceState, command: string, args: Record<string, unknown>) {
  const state = { ...device.state } as Record<string, unknown>;
  if (command === 'SET_POWER' && typeof args.power === 'boolean') state.power = args.power;
  if (command === 'SET_TEMPERATURE' && typeof args.temperature === 'number') state.temperature = args.temperature;
  if (command === 'SET_MODE' && typeof args.mode === 'string') state.mode = args.mode;
  if (command === 'SET_FAN_SPEED' && typeof args.fanSpeed === 'string') state.fanSpeed = args.fanSpeed;
  if (command === 'SET_BRIGHTNESS' && typeof args.brightness === 'number') state.brightness = args.brightness;
  if (command === 'SET_COLOR_TEMP' && typeof args.colorTemp === 'number') state.colorTemp = args.colorTemp;
  if (command === 'SET_OPEN' && typeof args.open === 'boolean') state.open = args.open;
  if (command === 'SET_LOCKED' && typeof args.locked === 'boolean') state.locked = args.locked;
  return state;
}
