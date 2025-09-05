-- HealthyBowl Database Schema for Supabase
-- This file contains all the necessary tables for the HealthyBowl website

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CORE TABLES
-- =============================================

-- Users table (for customer accounts)
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    newsletter_subscribed BOOLEAN DEFAULT FALSE
);

-- Customer addresses
CREATE TABLE customer_addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    pincode VARCHAR(10) NOT NULL,
    city VARCHAR(100) DEFAULT 'Mumbai',
    state VARCHAR(100) DEFAULT 'Maharashtra',
    country VARCHAR(100) DEFAULT 'India',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product catalog (subscription plans)
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    size_ml INTEGER NOT NULL, -- 250 or 500
    plan_type VARCHAR(50) NOT NULL, -- 'Weekly' or 'Monthly'
    price_weekly DECIMAL(10,2) NOT NULL,
    price_monthly DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons table
CREATE TABLE coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed'
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_first_name VARCHAR(100) NOT NULL,
    customer_last_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    
    -- Billing address (stored as JSON for flexibility)
    billing_address JSONB NOT NULL,
    
    -- Order details
    subtotal DECIMAL(10,2) NOT NULL,
    gst_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Coupon information
    coupon_id UUID REFERENCES coupons(id),
    coupon_code VARCHAR(50),
    
    -- Order status
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, preparing, out_for_delivery, delivered, cancelled
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
    
    -- Payment information
    payment_method VARCHAR(50),
    payment_id VARCHAR(255), -- Razorpay payment ID
    payment_reference VARCHAR(255),
    
    -- Delivery information
    delivery_instructions TEXT,
    delivery_date DATE,
    delivery_time_slot VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- Order items
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    product_size_ml INTEGER NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages
CREATE TABLE contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    newsletter_subscribed BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'new', -- new, in_progress, resolved, closed
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery areas
CREATE TABLE delivery_areas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pincode VARCHAR(10) UNIQUE NOT NULL,
    area_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    delivery_charge DECIMAL(10,2) DEFAULT 0,
    estimated_delivery_days INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Orders indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Order items indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Contact messages indexes
CREATE INDEX idx_contact_messages_email ON contact_messages(email);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);

-- Delivery areas indexes
CREATE INDEX idx_delivery_areas_pincode ON delivery_areas(pincode);
CREATE INDEX idx_delivery_areas_is_active ON delivery_areas(is_active);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
    counter INTEGER;
BEGIN
    -- Get current date in YYYYMMDD format
    SELECT TO_CHAR(NOW(), 'YYYYMMDD') INTO order_num;
    
    -- Get counter for today
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 9) AS INTEGER)), 0) + 1
    INTO counter
    FROM orders
    WHERE order_number LIKE order_num || '%';
    
    -- Format as HB-YYYYMMDD-XXXX
    order_num := 'HB-' || order_num || '-' || LPAD(counter::TEXT, 4, '0');
    
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_customer_addresses_updated_at
    BEFORE UPDATE ON customer_addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Insert sample products
INSERT INTO products (name, description, size_ml, plan_type, price_weekly, price_monthly) VALUES
('250ml Fresh Fruits & Sprouts', 'Perfect portion size with fresh fruits and sprouts', 250, 'Weekly', 300.00, 1200.00),
('250ml Fresh Fruits & Sprouts', 'Perfect portion size with fresh fruits and sprouts', 250, 'Monthly', 300.00, 1200.00),
('500ml Fresh Fruits & Sprouts', 'Generous portion with premium fruits and sprouts', 500, 'Weekly', 480.00, 1920.00),
('500ml Fresh Fruits & Sprouts', 'Generous portion with premium fruits and sprouts', 500, 'Monthly', 480.00, 1920.00);

-- Insert sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, usage_limit, valid_until) VALUES
('WELCOME10', '10% off on first order', 'percentage', 10.00, 0.00, 1000, NOW() + INTERVAL '1 year'),
('HEALTHY20', '20% off on orders above ₹2000', 'percentage', 20.00, 2000.00, 500, NOW() + INTERVAL '6 months'),
('FREESHIP', 'Free delivery', 'fixed', 0.00, 0.00, 1000, NOW() + INTERVAL '1 year');

-- Insert Mumbai delivery areas
INSERT INTO delivery_areas (pincode, area_name, city, state, delivery_charge, estimated_delivery_days) VALUES
('400001', 'Fort', 'Mumbai', 'Maharashtra', 0.00, 1),
('400002', 'Marine Lines', 'Mumbai', 'Maharashtra', 0.00, 1),
('400003', 'Ballard Estate', 'Mumbai', 'Maharashtra', 0.00, 1),
('400004', 'Cuffe Parade', 'Mumbai', 'Maharashtra', 0.00, 1),
('400005', 'Colaba', 'Mumbai', 'Maharashtra', 0.00, 1),
('400006', 'Malabar Hill', 'Mumbai', 'Maharashtra', 0.00, 1),
('400007', 'Parel', 'Mumbai', 'Maharashtra', 0.00, 1),
('400008', 'Worli', 'Mumbai', 'Maharashtra', 0.00, 1),
('400009', 'Byculla', 'Mumbai', 'Maharashtra', 0.00, 1),
('400010', 'Mazgaon', 'Mumbai', 'Maharashtra', 0.00, 1),
('400011', 'Dadar', 'Mumbai', 'Maharashtra', 0.00, 1),
('400012', 'Matunga', 'Mumbai', 'Maharashtra', 0.00, 1),
('400013', 'Sion', 'Mumbai', 'Maharashtra', 0.00, 1),
('400014', 'Kurla', 'Mumbai', 'Maharashtra', 0.00, 1),
('400015', 'Vidyavihar', 'Mumbai', 'Maharashtra', 0.00, 1),
('400016', 'Ghatkopar', 'Mumbai', 'Maharashtra', 0.00, 1),
('400017', 'Vikhroli', 'Mumbai', 'Maharashtra', 0.00, 1),
('400018', 'Kanjurmarg', 'Mumbai', 'Maharashtra', 0.00, 1),
('400019', 'Bhandup', 'Mumbai', 'Maharashtra', 0.00, 1),
('400020', 'Mulund', 'Mumbai', 'Maharashtra', 0.00, 1),
('400021', 'Nahur', 'Mumbai', 'Maharashtra', 0.00, 1),
('400022', 'Thane West', 'Thane', 'Maharashtra', 0.00, 1),
('400023', 'Thane East', 'Thane', 'Maharashtra', 0.00, 1),
('400024', 'Dombivli West', 'Dombivli', 'Maharashtra', 0.00, 1),
('400025', 'Dombivli East', 'Dombivli', 'Maharashtra', 0.00, 1),
('421201', 'Kalyan West', 'Kalyan', 'Maharashtra', 0.00, 1),
('421202', 'Kalyan East', 'Kalyan', 'Maharashtra', 0.00, 1),
('421203', 'Dombivli West', 'Dombivli', 'Maharashtra', 0.00, 1),
('421204', 'Dombivli East', 'Dombivli', 'Maharashtra', 0.00, 1),
('421205', 'Thane West', 'Thane', 'Maharashtra', 0.00, 1);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Customer addresses policies
CREATE POLICY "Users can view own addresses" ON customer_addresses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON customer_addresses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON customer_addresses
    FOR UPDATE USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Contact messages are public for insertion
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Admin policies (for authenticated admin users)
CREATE POLICY "Admins can view all data" ON users
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view all orders" ON orders
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view all contact messages" ON contact_messages
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- Order summary view
CREATE VIEW order_summary AS
SELECT 
    o.id,
    o.order_number,
    o.customer_email,
    o.customer_first_name,
    o.customer_last_name,
    o.status,
    o.payment_status,
    o.total_amount,
    o.created_at,
    COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, o.customer_email, o.customer_first_name, o.customer_last_name, o.status, o.payment_status, o.total_amount, o.created_at;

-- Product catalog view
CREATE VIEW product_catalog AS
SELECT 
    id,
    name,
    description,
    size_ml,
    plan_type,
    CASE 
        WHEN plan_type = 'Weekly' THEN price_weekly
        WHEN plan_type = 'Monthly' THEN price_monthly
    END as price,
    is_active
FROM products
WHERE is_active = true;

-- =============================================
-- FUNCTIONS FOR API ENDPOINTS
-- =============================================

-- Function to create order with items
CREATE OR REPLACE FUNCTION create_order_with_items(
    p_user_id UUID,
    p_customer_email TEXT,
    p_customer_first_name TEXT,
    p_customer_last_name TEXT,
    p_customer_phone TEXT,
    p_billing_address JSONB,
    p_subtotal DECIMAL,
    p_gst_amount DECIMAL,
    p_discount_amount DECIMAL DEFAULT 0,
    p_coupon_id UUID DEFAULT NULL,
    p_coupon_code TEXT DEFAULT NULL,
    p_delivery_instructions TEXT DEFAULT NULL,
    p_order_items JSONB
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
        delivery_instructions
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
        p_delivery_instructions
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
            total_price
        ) VALUES (
            v_order_id,
            v_item->>'name',
            (v_item->>'size')::INTEGER,
            v_item->>'period',
            (v_item->>'quantity')::INTEGER,
            (v_item->>'price')::DECIMAL,
            (v_item->>'price')::DECIMAL * (v_item->>'quantity')::INTEGER
        );
    END LOOP;
    
    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check delivery availability
CREATE OR REPLACE FUNCTION check_delivery_availability(p_pincode TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM delivery_areas 
        WHERE pincode = p_pincode AND is_active = true
    );
END;
$$ LANGUAGE plpgsql;

-- Function to validate coupon
CREATE OR REPLACE FUNCTION validate_coupon(
    p_coupon_code TEXT,
    p_order_amount DECIMAL
)
RETURNS JSONB AS $$
DECLARE
    v_coupon RECORD;
    v_discount_amount DECIMAL;
BEGIN
    SELECT * INTO v_coupon
    FROM coupons
    WHERE code = p_coupon_code 
    AND is_active = true 
    AND (valid_until IS NULL OR valid_until > NOW())
    AND (usage_limit IS NULL OR used_count < usage_limit)
    AND p_order_amount >= min_order_amount;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'message', 'Invalid or expired coupon');
    END IF;
    
    -- Calculate discount
    IF v_coupon.discount_type = 'percentage' THEN
        v_discount_amount := p_order_amount * (v_coupon.discount_value / 100);
        IF v_coupon.max_discount_amount IS NOT NULL AND v_discount_amount > v_coupon.max_discount_amount THEN
            v_discount_amount := v_coupon.max_discount_amount;
        END IF;
    ELSE
        v_discount_amount := v_coupon.discount_value;
    END IF;
    
    RETURN jsonb_build_object(
        'valid', true,
        'discount_amount', v_discount_amount,
        'description', v_coupon.description
    );
END;
$$ LANGUAGE plpgsql;
