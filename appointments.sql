create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  appointment_id text not null unique,
  patient_name text not null,
  phone text not null,
  email text,
  appointment_date date not null,
  appointment_time time not null,
  doctor text not null,
  reason text,
  status text not null default 'Pending',
  admin_notes text,
  created_at timestamptz not null default now()
);

alter table public.appointments enable row level security;

drop policy if exists "appointments_public_insert" on public.appointments;
drop policy if exists "appointments_admin_select" on public.appointments;
drop policy if exists "appointments_admin_update" on public.appointments;
drop policy if exists "appointments_admin_delete" on public.appointments;

create policy "appointments_public_insert" on public.appointments for insert to anon, authenticated with check (true);
create policy "appointments_admin_select" on public.appointments for select to authenticated using ((auth.jwt() ->> 'email') = 'a81650448@gmail.com');
create policy "appointments_admin_update" on public.appointments for update to authenticated using ((auth.jwt() ->> 'email') = 'a81650448@gmail.com') with check ((auth.jwt() ->> 'email') = 'a81650448@gmail.com');
create policy "appointments_admin_delete" on public.appointments for delete to authenticated using ((auth.jwt() ->> 'email') = 'a81650448@gmail.com');

create table if not exists public.patient_profiles (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  phone text not null unique,
  email text,
  first_appointment_date date,
  last_appointment_date date,
  total_appointments integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.patient_profiles enable row level security;
drop policy if exists "patient_profiles_admin_select" on public.patient_profiles;
create policy "patient_profiles_admin_select" on public.patient_profiles for select to authenticated using ((auth.jwt() ->> 'email') = 'a81650448@gmail.com');

drop function if exists public.sync_patient_profile();
create or replace function public.sync_patient_profile()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.patient_profiles (patient_name, phone, email, first_appointment_date, last_appointment_date, total_appointments, updated_at)
  values (new.patient_name, new.phone, new.email, new.appointment_date, new.appointment_date, 1, now())
  on conflict (phone) do update set
    patient_name = excluded.patient_name,
    email = coalesce(excluded.email, patient_profiles.email),
    first_appointment_date = least(patient_profiles.first_appointment_date, excluded.first_appointment_date),
    last_appointment_date = greatest(patient_profiles.last_appointment_date, excluded.last_appointment_date),
    total_appointments = patient_profiles.total_appointments + 1,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists appointments_sync_patient_profile on public.appointments;
create trigger appointments_sync_patient_profile after insert on public.appointments for each row execute function public.sync_patient_profile();
