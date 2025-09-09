-- Migration Script: Add Fruit Mix Selection to Order Items
-- Run this script to add fruit mix functionality to existing HealthyBowl database
-- Date: 2025-01-27

-- =============================================
-- ADD NEW COLUMNS TO ORDER_ITEMS TABLE
-- =============================================

-- Add fruit mix columns to existing order_items table
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS fruit_mix VARCHAR(50);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS fruit_mix_name VARCHAR(255);

-- Add comments for documentation
COMMENT ON COLUMN order_items.fruit_mix IS 'Stores the fruit mix selection value (classic-apple, antioxidant-power, citrus-fresh, sweet-crunchy, premium-exotic)';
COMMENT ON COLUMN order_items.fruit_mix_name IS 'Stores the display name of the selected fruit mix for order details';

-- =============================================
-- UPDATE EXISTING FUNCTION
-- =============================================

-- Update the create_order_with_items function to include fruit mix data
CREATE OR REPLACE FUNCTION create_order_with_items(
    p_user_id UUID,
    p_customer_email TEXT,
    p_customer_first_name TEXT,
    p_customer_last_name TEXT,
    p_customer_phone TEXT,
    p_billing_address JSONB,
    p_subtotal DECIMAL,
    p_gst_amount DECIMAL,
    p_order_items JSONB,
    p_discount_amount DECIMAL DEFAULT 0,
    p_coupon_id UUID DEFAULT NULL,
    p_coupon_code TEXT DEFAULT NULL,
    p_delivery_instructions TEXT DEFAULT NULL,
    p_payment_status TEXT DEFAULT 'paid'
)
RETURNS UUID AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
BEGIN
    -- Create order
    INSERT INTO orders (
        user_id,
        customer_email,
        customer_first_name,
        customer_last_name,
        customer_phone,
        billing_address,
        subtotal,
        gst_amount,
        discount_amount,
        total_amount,
        coupon_id,
        coupon_code,
        delivery_instructions,
        payment_status
    ) VALUES (
        p_user_id,
        p_customer_email,
        p_customer_first_name,
        p_customer_last_name,
        p_customer_phone,
        p_billing_address,
        p_subtotal,
        p_gst_amount,
        p_discount_amount,
        p_subtotal + p_gst_amount - p_discount_amount,
        p_coupon_id,
        p_coupon_code,
        p_delivery_instructions,
        p_payment_status
    ) RETURNING id INTO v_order_id;
    
    -- Insert order items with fruit mix data
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_order_items)
    LOOP
        INSERT INTO order_items (
            order_id,
            product_name,
            product_size_ml,
            plan_type,
            quantity,
            unit_price,
            total_price,
            fruit_mix,
            fruit_mix_name
        ) VALUES (
            v_order_id,
            v_item->>'name',
            (v_item->>'size')::INTEGER,
            v_item->>'period',
            (v_item->>'quantity')::INTEGER,
            (v_item->>'price')::DECIMAL,
            (v_item->>'price')::DECIMAL * (v_item->>'quantity')::INTEGER,
            v_item->>'fruitMix',
            v_item->>'fruitMixName'
        );
    END LOOP;
    
    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- CREATE NEW VIEW FOR ORDER DETAILS
-- =============================================

-- Create order details view with fruit mix information
CREATE OR REPLACE VIEW order_details AS
SELECT 
    o.id as order_id,
    o.order_number,
    o.customer_email,
    o.customer_first_name,
    o.customer_last_name,
    o.status,
    o.payment_status,
    o.total_amount,
    o.created_at,
    oi.id as item_id,
    oi.product_name,
    oi.product_size_ml,
    oi.plan_type,
    oi.quantity,
    oi.unit_price,
    oi.total_price,
    oi.fruit_mix,
    oi.fruit_mix_name
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
ORDER BY o.created_at DESC, oi.created_at ASC;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify the new columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'order_items' 
AND column_name IN ('fruit_mix', 'fruit_mix_name');

-- Test the new view
SELECT * FROM order_details LIMIT 5;

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================

-- Example of how to insert an order with fruit mix data
-- (This is just for reference - don't run unless testing)
/*
INSERT INTO orders (
    customer_email, customer_first_name, customer_last_name,
    billing_address, subtotal, gst_amount, total_amount
) VALUES (
    'test@example.com', 'John', 'Doe',
    '{"address_line1": "123 Test St", "pincode": "400001", "city": "Mumbai"}',
    300.00, 54.00, 354.00
);

INSERT INTO order_items (
    order_id, product_name, product_size_ml, plan_type,
    quantity, unit_price, total_price, fruit_mix, fruit_mix_name
) VALUES (
    (SELECT id FROM orders WHERE customer_email = 'test@example.com' LIMIT 1),
    '250ml Fresh Fruits & Sprouts', 250, 'Weekly',
    1, 300.00, 300.00, 'classic-apple', 'Option 1: Classic Apple Mix (Apple, Orange, Green Grapes, Pomegranate)'
);
*/

-- =============================================
-- UPDATE EXISTING ORDERS WITH SAMPLE FRUIT MIX DATA
-- =============================================

-- Update existing orders with sample fruit mix selections
UPDATE order_items 
SET 
    fruit_mix = 'classic-apple',
    fruit_mix_name = 'Option 1: Classic Apple Mix (Apple, Orange, Green Grapes, Pomegranate)'
WHERE order_id = 'b5d35488-1def-4f93-8ade-12199878fcc1';

UPDATE order_items 
SET 
    fruit_mix = 'antioxidant-power',
    fruit_mix_name = 'Option 2: Antioxidant Power Bowl (Pomegranate, Apple, Green Grapes, Kiwi)'
WHERE order_id = 'f0c48692-7bd3-44e2-9d57-198940884f79';

-- Verify the updates
SELECT 
    order_number,
    product_name,
    fruit_mix,
    fruit_mix_name
FROM order_details 
WHERE order_id IN ('b5d35488-1def-4f93-8ade-12199878fcc1', 'f0c48692-7bd3-44e2-9d57-198940884f79');

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

-- This migration adds fruit mix selection functionality to your existing database
-- The new columns will be NULL for existing orders, but new orders will include fruit mix data
-- You can now use the order_details view to see fruit mix selections in order details
