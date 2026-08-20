-- Seema Medical Store: safe public stock reservation
-- Run this ONCE in Supabase SQL Editor.
-- Uses fully-qualified column references to avoid the "column reference stock is ambiguous" error.

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
  update public.medicines AS m
     set stock = m.stock - p_quantity
   where m.id = p_medicine_id
     and m.stock >= p_quantity
  returning m.id, m.name, m.stock;
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
  update public.medicines AS m
     set stock = m.stock + p_quantity
   where m.id = p_medicine_id
  returning m.id, m.name, m.stock;
end;
$$;

grant execute on function public.reserve_medicine_stock(bigint, integer) to anon, authenticated;
grant execute on function public.restore_medicine_stock(bigint, integer) to anon, authenticated;
