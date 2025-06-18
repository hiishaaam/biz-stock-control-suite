
-- Add missing fields to products table for better stock management
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS reserved_stock INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reorder_point INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS max_stock INTEGER;

-- Create stock movements table for audit trail
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'reserved', 'released')),
  quantity INTEGER NOT NULL,
  reference_type TEXT CHECK (reference_type IN ('order', 'adjustment', 'initial', 'return')),
  reference_id UUID,
  reason TEXT,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on stock_movements
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for stock_movements
CREATE POLICY "Authenticated users can view stock movements" 
  ON public.stock_movements 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can create stock movements" 
  ON public.stock_movements 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Create function for safe stock reduction with transaction support
CREATE OR REPLACE FUNCTION public.process_order_with_stock_reduction(
  p_order_id UUID,
  p_order_items JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  item JSONB;
  product_record RECORD;
  insufficient_stock JSONB[] := '{}';
  stock_updates JSONB[] := '{}';
  movement_record RECORD;
BEGIN
  -- Start transaction (implicit in function)
  
  -- First pass: Check stock availability for all items
  FOR item IN SELECT * FROM jsonb_array_elements(p_order_items)
  LOOP
    SELECT id, name, stock, reserved_stock, low_stock_threshold
    INTO product_record
    FROM public.products 
    WHERE id = (item->>'product_id')::UUID
    FOR UPDATE; -- Lock the row for this transaction
    
    IF NOT FOUND THEN
      insufficient_stock := insufficient_stock || jsonb_build_object(
        'product_id', item->>'product_id',
        'error', 'Product not found'
      );
      CONTINUE;
    END IF;
    
    -- Check if we have enough available stock
    IF (product_record.stock - product_record.reserved_stock) < (item->>'quantity')::INTEGER THEN
      insufficient_stock := insufficient_stock || jsonb_build_object(
        'product_id', item->>'product_id',
        'product_name', product_record.name,
        'requested', (item->>'quantity')::INTEGER,
        'available', product_record.stock - product_record.reserved_stock,
        'error', 'Insufficient stock'
      );
    END IF;
  END LOOP;
  
  -- If any items have insufficient stock, return error
  IF array_length(insufficient_stock, 1) > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient stock for some items',
      'insufficient_items', insufficient_stock
    );
  END IF;
  
  -- Second pass: Update stock levels and create movements
  FOR item IN SELECT * FROM jsonb_array_elements(p_order_items)
  LOOP
    SELECT id, name, stock, reserved_stock INTO product_record
    FROM public.products 
    WHERE id = (item->>'product_id')::UUID
    FOR UPDATE;
    
    -- Update product stock
    UPDATE public.products 
    SET 
      stock = stock - (item->>'quantity')::INTEGER,
      updated_at = now()
    WHERE id = (item->>'product_id')::UUID;
    
    -- Record stock movement
    INSERT INTO public.stock_movements (
      product_id,
      movement_type,
      quantity,
      reference_type,
      reference_id,
      reason,
      previous_stock,
      new_stock,
      created_by
    ) VALUES (
      (item->>'product_id')::UUID,
      'out',
      (item->>'quantity')::INTEGER,
      'order',
      p_order_id,
      'Order fulfillment',
      product_record.stock,
      product_record.stock - (item->>'quantity')::INTEGER,
      auth.uid()
    );
    
    stock_updates := stock_updates || jsonb_build_object(
      'product_id', item->>'product_id',
      'previous_stock', product_record.stock,
      'new_stock', product_record.stock - (item->>'quantity')::INTEGER,
      'quantity_reduced', (item->>'quantity')::INTEGER
    );
  END LOOP;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Order processed successfully',
    'stock_updates', stock_updates
  );
END;
$$;

-- Create function to check low stock items
CREATE OR REPLACE FUNCTION public.get_low_stock_products()
RETURNS TABLE (
  product_id UUID,
  product_name TEXT,
  current_stock INTEGER,
  threshold INTEGER,
  available_stock INTEGER
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    p.id,
    p.name,
    p.stock,
    p.low_stock_threshold,
    p.stock - COALESCE(p.reserved_stock, 0) as available_stock
  FROM public.products p
  WHERE p.stock <= p.low_stock_threshold
  ORDER BY (p.stock - p.low_stock_threshold) ASC;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON public.stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_reference ON public.stock_movements(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON public.stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_products_stock_levels ON public.products(stock, low_stock_threshold);

-- Add updated_at trigger for stock_movements
CREATE TRIGGER update_stock_movements_updated_at 
  BEFORE UPDATE ON public.stock_movements 
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_updated_at();
