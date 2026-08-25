-- 5days Phase 5 / P5-4 + P5-5

create or replace function public.apply_device_command(
  device_type text,
  capabilities text[],
  current_state jsonb,
  command_name text,
  args jsonb
)
returns jsonb
language plpgsql
immutable
as $$
declare next_state jsonb := current_state;
begin
  if device_type = 'ac' and command_name = 'SET_POWER' and 'switchable' = any(capabilities) then
    next_state := jsonb_set(current_state, '{power}', to_jsonb((args->>'power')::boolean));
  elsif device_type = 'ac' and command_name = 'SET_TEMPERATURE' and 'temperatureControl' = any(capabilities) then
    if (args->>'temperature')::numeric not between 16 and 30 then raise exception 'invalid_value'; end if;
    next_state := jsonb_set(current_state, '{temperature}', to_jsonb((args->>'temperature')::numeric));
  elsif device_type = 'ac' and command_name = 'SET_MODE' then
    if (args->>'mode') not in ('cool', 'heat', 'fan', 'auto') then raise exception 'invalid_value'; end if;
    next_state := jsonb_set(current_state, '{mode}', to_jsonb(args->>'mode'));
  elsif device_type = 'ac' and command_name = 'SET_FAN_SPEED' then
    if (args->>'fanSpeed') not in ('low', 'medium', 'high', 'auto') then raise exception 'invalid_value'; end if;
    next_state := jsonb_set(current_state, '{fanSpeed}', to_jsonb(args->>'fanSpeed'));
  elsif device_type = 'light' and command_name = 'SET_POWER' and 'switchable' = any(capabilities) then
    next_state := jsonb_set(current_state, '{power}', to_jsonb((args->>'power')::boolean));
  elsif device_type = 'light' and command_name = 'SET_BRIGHTNESS' and 'dimmable' = any(capabilities) then
    if (args->>'brightness')::numeric not between 0 and 100 then raise exception 'invalid_value'; end if;
    next_state := jsonb_set(current_state, '{brightness}', to_jsonb((args->>'brightness')::integer));
  elsif device_type = 'light' and command_name = 'SET_COLOR_TEMP' then
    if (args->>'colorTemp')::numeric not between 2700 and 6500 then raise exception 'invalid_value'; end if;
    next_state := jsonb_set(current_state, '{colorTemp}', to_jsonb((args->>'colorTemp')::integer));
  elsif device_type = 'door' and command_name = 'SET_LOCKED' and 'lockable' = any(capabilities) then
    next_state := jsonb_set(current_state, '{locked}', to_jsonb((args->>'locked')::boolean));
  elsif device_type = 'door' and command_name = 'SET_OPEN' and 'openable' = any(capabilities) then
    if coalesce((current_state->>'locked')::boolean, false) then raise exception 'door_locked'; end if;
    next_state := jsonb_set(current_state, '{open}', to_jsonb((args->>'open')::boolean));
  else
    raise exception 'invalid_command';
  end if;
  return next_state;
end;
$$;

create or replace function public.control_device(p_device_id text, p_command text, p_args jsonb)
returns jsonb language plpgsql security definer set search_path = public
as $$
declare device_row public.devices; old_state jsonb; new_state jsonb;
begin
  if not (public.is_role('operator') or public.is_role('admin')) then raise exception 'permission_denied'; end if;
  select * into device_row from public.devices where id = p_device_id;
  if not found then raise exception 'device_not_found'; end if;
  select state into old_state from public.device_states where device_id = p_device_id;
  new_state := public.apply_device_command(device_row.type, device_row.capabilities, coalesce(old_state, '{}'::jsonb), p_command, coalesce(p_args, '{}'::jsonb));
  insert into public.device_states(device_id, state, updated_at, updated_by) values (p_device_id, new_state, now(), auth.uid())
    on conflict (device_id) do update set state = excluded.state, updated_at = excluded.updated_at, updated_by = excluded.updated_by;
  insert into public.device_events(device_id, event_type, payload, actor) values (p_device_id, 'command', jsonb_build_object('command', p_command, 'args', p_args), auth.uid());
  insert into public.audit_logs(actor, action, target, payload) values (auth.uid(), 'device.command', p_device_id, jsonb_build_object('command', p_command, 'args', p_args));
  return new_state;
end;
$$;

revoke all on function public.control_device(text, text, jsonb) from public;
grant execute on function public.control_device(text, text, jsonb) to authenticated;
