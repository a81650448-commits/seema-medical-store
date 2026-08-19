-- Seema Medical Store - Supabase RLS fix
-- Run this entire script once in Supabase Dashboard -> SQL Editor.
-- It fixes customer order insertion while keeping orders private from the public.

alter table public.orders enable row level security;
alter table public.customers enable row level security;

-- Customers: the public website may create a customer record.
drop policy if exists "Public can create customers" on public.customers;
create policy "Public can create customers"
on public.customers
for insert
to anon
with check (true);

-- Orders: customers can place an order, but cannot read/update orders.
drop policy if exists "Public can place orders" on public.orders;
create policy "Public can place orders"
on public.orders
for insert
to anon
with check (true);

-- Admin: only the configured admin account can view and update orders.
drop policy if exists "Admin can view orders" on public.orders;
create policy "Admin can view orders"
on public.orders
for select
to authenticated
using ((select auth.jwt()->>'email') = 'a81650448@gmail.com');

drop policy if exists "Admin can update orders" on public.orders;
create policy "Admin can update orders"
on public.orders
for update
to authenticated
using ((select auth.jwt()->>'email') = 'a81650448@gmail.com')
with check ((select auth.jwt()->>'email') = 'a81650448@gmail.com');

-- Data API permissions. RLS remains the security layer.
grant insert on public.orders to anon;
grant insert on public.customers to anon;
grant select on public.orders to authenticated;
grant update on public.orders to authenticated;

-- IMPORTANT:
-- Do not grant SELECT on orders to anon. Customer tracking should use the
-- existing track_order RPC rather than exposing the orders table directly.
