-- Seema Medical Store: connect orders to the logged-in customer
-- Run this once in Supabase SQL Editor.

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS orders_user_id_idx
ON public.orders(user_id);

CREATE OR REPLACE FUNCTION public.set_order_user_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_set_user_id ON public.orders;

CREATE TRIGGER orders_set_user_id
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.set_order_user_id();

-- Attach older orders to a customer when the order phone matches the
-- phone saved in that customer's Supabase Auth metadata. Only unambiguous
-- one-customer matches are updated.
WITH matches AS (
  SELECT o.order_id, MIN(u.id) AS user_id
  FROM public.orders o
  JOIN auth.users u
    ON regexp_replace(COALESCE(o.phone,''), '\D', '', 'g') =
       regexp_replace(COALESCE(u.raw_user_meta_data->>'phone',''), '\D', '', 'g')
  WHERE o.user_id IS NULL
    AND regexp_replace(COALESCE(o.phone,''), '\D', '', 'g') <> ''
    AND regexp_replace(COALESCE(u.raw_user_meta_data->>'phone',''), '\D', '', 'g') <> ''
  GROUP BY o.order_id
  HAVING COUNT(u.id) = 1
)
UPDATE public.orders o
SET user_id = m.user_id
FROM matches m
WHERE o.order_id = m.order_id
  AND o.user_id IS NULL;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.orders TO authenticated;

DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;

CREATE POLICY "Customers can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING ((select auth.uid()) IS NOT NULL AND (select auth.uid()) = user_id);

-- IMPORTANT:
-- Keep your existing INSERT policy for public order placement and your existing
-- Admin Panel policies. The trigger above automatically attaches the logged-in
-- customer's Auth user ID when a customer is signed in.