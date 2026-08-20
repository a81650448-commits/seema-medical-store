-- Seema Medical Store: Stomach Care category
-- Prices and opening stock are intentionally 0 until the store confirms actual selling price and physical stock.
-- These medicines may require prescription/pharmacist verification where applicable.

INSERT INTO public.medicines (name, category, price, stock, manufacturer, expiry_date)
SELECT v.name, 'Stomach Care', 0, 0, NULL, NULL
FROM (VALUES
  ('Digene'),
  ('Pantocid DSR'),
  ('Pan-D'),
  ('Omez-D'),
  ('Unienzyme'),
  ('Cremaffin'),
  ('Vizylac'),
  ('Enterogermina')
) AS v(name)
WHERE NOT EXISTS (
  SELECT 1 FROM public.medicines m
  WHERE LOWER(m.name) = LOWER(v.name)
    AND LOWER(COALESCE(m.category,'')) = 'stomach care'
);

-- Verify
SELECT id, name, category, price, stock, manufacturer, expiry_date
FROM public.medicines
WHERE LOWER(category) = 'stomach care'
ORDER BY name;
