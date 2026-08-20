-- Seema Medical Store: Diabetes category
-- IMPORTANT: Prices and opening stock are intentionally 0 until the store confirms its own selling price and physical stock.
-- These are prescription medicines; keep pharmacist verification / prescription rules enabled.

INSERT INTO public.medicines (name, category, price, stock, manufacturer, expiry_date)
SELECT v.name, 'Diabetes', 0, 0, v.manufacturer, NULL
FROM (VALUES
  ('Glycomet GP1', 'USV Pvt Ltd'),
  ('Amaryl', 'Sanofi India Ltd'),
  ('Galvus', 'Novartis India Ltd'),
  ('Forxiga', 'AstraZeneca'),
  ('Glycomet-GP', 'USV Pvt Ltd'),
  ('Lantus', 'Sanofi India Ltd')
) AS v(name, manufacturer)
WHERE NOT EXISTS (
  SELECT 1 FROM public.medicines m
  WHERE LOWER(m.name) = LOWER(v.name)
    AND LOWER(COALESCE(m.category,'')) = 'diabetes'
);

-- Verify
SELECT id, name, category, price, stock, manufacturer, expiry_date
FROM public.medicines
WHERE LOWER(category) = 'diabetes'
ORDER BY name;
