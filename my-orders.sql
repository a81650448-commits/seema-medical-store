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
