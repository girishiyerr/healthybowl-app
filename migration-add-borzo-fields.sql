-- Migration: Add Borzo delivery integration fields to orders table
-- Run this script to add Borzo tracking fields to existing orders table

-- Add Borzo delivery integration fields
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS borzo_order_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS borzo_tracking_url TEXT,
ADD COLUMN IF NOT EXISTS borzo_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS borzo_status_text TEXT,
ADD COLUMN IF NOT EXISTS borzo_estimated_delivery TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS borzo_delivery_notes TEXT,
ADD COLUMN IF NOT EXISTS half_ready_at TIMESTAMP WITH TIME ZONE;

-- Add index for Borzo order ID for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_borzo_order_id ON orders(borzo_order_id);

-- Add index for Borzo status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_borzo_status ON orders(borzo_status);

-- Add comments for documentation
COMMENT ON COLUMN orders.borzo_order_id IS 'Borzo delivery service order ID';
COMMENT ON COLUMN orders.borzo_tracking_url IS 'Borzo tracking URL for customer tracking';
COMMENT ON COLUMN orders.borzo_status IS 'Current Borzo delivery status (new, accepted, picked_up, in_progress, delivered, cancelled, failed)';
COMMENT ON COLUMN orders.borzo_status_text IS 'Human readable Borzo status description';
COMMENT ON COLUMN orders.borzo_estimated_delivery IS 'Borzo estimated delivery time';
COMMENT ON COLUMN orders.borzo_delivery_notes IS 'Additional notes from Borzo delivery process';
