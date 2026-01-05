-- Decrement Stock Function for SunStyle Fashion Store
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- Function to safely decrement stock when an order is placed
CREATE OR REPLACE FUNCTION decrement_stock(p_variant_id INT, p_quantity INT)
RETURNS BOOLEAN AS $$
DECLARE
  current_stock INT;
BEGIN
  -- Get current stock
  SELECT stock_quantity INTO current_stock
  FROM product_variants
  WHERE id = p_variant_id;

  -- Check if enough stock
  IF current_stock IS NULL THEN
    RAISE EXCEPTION 'Variant not found: %', p_variant_id;
  END IF;

  IF current_stock < p_quantity THEN
    RAISE EXCEPTION 'Insufficient stock. Available: %, Requested: %', current_stock, p_quantity;
  END IF;

  -- Decrement stock
  UPDATE product_variants
  SET stock_quantity = stock_quantity - p_quantity
  WHERE id = p_variant_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users and anon
GRANT EXECUTE ON FUNCTION decrement_stock(INT, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_stock(INT, INT) TO anon;

-- Optional: Function to increment stock (for refunds/cancellations)
CREATE OR REPLACE FUNCTION increment_stock(p_variant_id INT, p_quantity INT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE product_variants
  SET stock_quantity = stock_quantity + p_quantity
  WHERE id = p_variant_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_stock(INT, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_stock(INT, INT) TO anon;

-- Verification: Test the function
-- SELECT decrement_stock(1, 1); -- Should work if variant ID 1 exists with stock
