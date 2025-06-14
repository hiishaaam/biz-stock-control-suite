
-- Add a unique code field to products table for barcode/QR identification
ALTER TABLE products ADD COLUMN code TEXT UNIQUE;

-- Create an index on the code field for fast lookups
CREATE INDEX idx_products_code ON products(code) WHERE code IS NOT NULL;

-- Add a comment to document the code field purpose
COMMENT ON COLUMN products.code IS 'Unique barcode/QR code for product identification (SKU-based or custom)';

-- Update existing products to have a code based on their SKU (making it unique)
UPDATE products 
SET code = CONCAT('PRD-', sku) 
WHERE code IS NULL;
