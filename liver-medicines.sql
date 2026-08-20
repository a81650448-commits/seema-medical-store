-- Liver Care medicines for Seema Medical Store
-- Run this once in Supabase SQL Editor.

INSERT INTO public.medicines
(name, category, price, stock, manufacturer, expiry_date)
SELECT
    v.name,
    'Liver Care',
    0,
    0,
    NULL,
    NULL
FROM (VALUES
    ('Liv.52'),
    ('Amlycure D.S.'),
    ('Hepano'),
    ('Udiliv'),
    ('Sorbiline'),
    ('Silibon')
) AS v(name)
WHERE NOT EXISTS (
    SELECT 1 FROM public.medicines m
    WHERE LOWER(m.name) = LOWER(v.name)
      AND LOWER(COALESCE(m.category, '')) = 'liver care'
);

SELECT id, name, category, price, stock, manufacturer, expiry_date
FROM public.medicines
WHERE LOWER(category) = 'liver care'
ORDER BY name;
