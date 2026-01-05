-- Run this SQL in Supabase SQL Editor to force delete ALL data
-- This bypasses RLS policies and foreign key checks temporarily

BEGIN;

-- Temporarily disable triggers
SET session_replication_role = replica;

-- Delete in correct order
DELETE FROM cart_items;
DELETE FROM reviews;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM product_variants;
DELETE FROM products;
DELETE FROM categories;

-- Re-enable triggers
SET session_replication_role = DEFAULT;

COMMIT;

-- Verify deletion
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'product_variants', COUNT(*) FROM product_variants
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'cart_items', COUNT(*) FROM cart_items
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews;
