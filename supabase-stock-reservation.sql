-- Seema Medical Store: safe public stock reservation
-- Run this ONCE in Supabase SQL Editor.
-- It keeps the medicines table protected from public UPDATE access while allowing
-- the customer website to reserve stock atomically.

create or replace function public.reserve_medicine_stock(
  p_medicine_id bigint,
  p_quantity integer
)
returns table(id bigint, name text, stock integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_quantity is null or p_quantity <= 0 then
    return;
  end if;

  return query
  update public.medicines
     set stock = stock - p_quantity
   where medicines.id = p_medicine_id
     and stock >= p_quantity
  returning medicines.id, medicines.name, medicines.stock;
end;
$$;

create or replace function public.restore_medicine_stock(
  p_medicine_id bigint,
  p_quantity integer
)
returns table(id bigint, name text, stock integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_quantity is null or p_quantity <= 0 then
    return;
  end if;

  return query
  update public.medicines
     set stock = stock + p_quantity
   where medicines.id = p_medicine_id
  returning medicines.id, medicines.name, medicines.stock;
end;
$$;

grant execute on function public.reserve_medicine_stock(bigint, integer) to anon, authenticated;
grant execute on function public.restore_medicine_stock(bigint, integer) to anon, authenticated;
