-- Update create_order_with_items function to accept payment_status parameter
-- This ensures all orders are created with "paid" status since customers can only order after payment

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
    p_payment_status TEXT DEFAULT 'paid' -- Move payment_status to end with other default parameters
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
        payment_status -- Add payment_status to INSERT
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
        p_payment_status -- Use the payment_status parameter
    ) RETURNING id INTO v_order_id;
    
    -- Insert order items
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
            ((v_item->>'price')::DECIMAL * (v_item->>'quantity')::INTEGER),
            v_item->>'fruitMix',
            v_item->>'fruitMixName'
        );
    END LOOP;
    
    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql;

-- Update existing orders to have "paid" status since they were placed after payment
UPDATE orders SET payment_status = 'paid' WHERE payment_status = 'pending';

-- Show the updated orders
SELECT order_number, status, payment_status, total_amount, created_at 
FROM orders 
ORDER BY created_at DESC;
