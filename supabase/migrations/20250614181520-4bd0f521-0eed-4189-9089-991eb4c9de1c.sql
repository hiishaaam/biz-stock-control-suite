
-- Add cost column to products table to differentiate from selling price
ALTER TABLE products ADD COLUMN cost NUMERIC;

-- Update existing products to have a default cost of 0 if needed
UPDATE products SET cost = 0 WHERE cost IS NULL;
