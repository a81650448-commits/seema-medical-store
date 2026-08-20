-- Seema Medical Store: Cardiac Care category
-- Prices and opening stock are intentionally 0 until the store confirms the actual selling price and physical stock.
-- These medicines may require prescription and pharmacist verification.

INSERT INTO public.medicines (name, category, price, stock, manufacturer, expiry_date)
SELECT v.name, 'Cardiac Care', 0, 0, v.manufacturer, NULL
FROM (VALUES
  ('Atorva 10', 'Zydus Lifesciences'),
  ('Telma', 'Glenmark Pharmaceuticals'),
  ('Amlong', 'Micro Labs Ltd'),
  ('Rosuvas', 'Sun Pharmaceutical Industries Ltd'),
  ('Ecosprin', 'USV Pvt Ltd'),
  ('Lasix', 'Sanofi India Ltd'),
  ('Aldactone', 'RPG Life Sciences Ltd')
) AS v(name, manufacturer)
WHERE NOT EXISTS (
  SELECT 1 FROM public.medicines m
  WHERE LOWER(m.name) = LOWER(v.name)
    AND LOWER(COALESCE(m.category,'')) = 'cardiac care'
);

-- Verify
SELECT id, name, category, price, stock, manufacturer, expiry_date
FROM public.medicines
WHERE LOWER(category) = 'cardiac care'
ORDER BY name;
