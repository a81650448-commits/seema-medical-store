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

create policy "appointments_public_insert"
on public.appointments for insert
to anon, authenticated
with check (true);

create policy "appointments_admin_select"
on public.appointments for select
to authenticated
using ((auth.jwt() ->> 'email') = 'a81650448@gmail.com');

create policy "appointments_admin_update"
on public.appointments for update
to authenticated
using ((auth.jwt() ->> 'email') = 'a81650448@gmail.com')
with check ((auth.jwt() ->> 'email') = 'a81650448@gmail.com');

create policy "appointments_admin_delete"
on public.appointments for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'a81650448@gmail.com');
