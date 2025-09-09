-- Update billing addresses for existing orders
-- This script adds detailed address information to specific orders

-- Update HB-20250905-0002 (Mumbai address)
UPDATE orders 
SET billing_address = '{
    "street": "123, Shivaji Park, Dr. Ambedkar Road, Near Shiv Sena Bhavan, Dadar West",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400028",
    "landmark": "Opposite to Shivaji Park Ground, Next to McDonald's, Above State Bank of India"
}'::jsonb
WHERE order_number = 'HB-20250905-0002';

-- Update HB-20250905-0001 (Bangalore address)
UPDATE orders 
SET billing_address = '{
    "street": "456, 2nd Floor, Brigade Gateway, Dr. Rajkumar Road, Rajajinagar, Near Orion Mall",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560055",
    "landmark": "Above Reliance Digital Store, Next to Metro Station, Opposite to Forum Mall, Near Manyata Tech Park"
}'::jsonb
WHERE order_number = 'HB-20250905-0001';

-- Verify the updates
SELECT 
    order_number,
    customer_first_name,
    customer_last_name,
    billing_address->>'street' as street,
    billing_address->>'city' as city,
    billing_address->>'state' as state,
    billing_address->>'pincode' as pincode,
    billing_address->>'landmark' as landmark
FROM orders 
WHERE order_number IN ('HB-20250905-0001', 'HB-20250905-0002')
ORDER BY order_number;

-- Alternative: If you want to update by order_id instead of order_number
-- UPDATE orders 
-- SET billing_address = '{
--     "street": "123, Shivaji Park, Dr. Ambedkar Road, Near Shiv Sena Bhavan, Dadar West",
--     "city": "Mumbai",
--     "state": "Maharashtra",
--     "pincode": "400028",
--     "landmark": "Opposite to Shivaji Park Ground, Next to McDonald's, Above State Bank of India"
-- }'::jsonb
-- WHERE id = 'b5d35488-1def-4f93-8ade-12199878fcc1';

-- UPDATE orders 
-- SET billing_address = '{
--     "street": "456, 2nd Floor, Brigade Gateway, Dr. Rajkumar Road, Rajajinagar, Near Orion Mall",
--     "city": "Bangalore",
--     "state": "Karnataka",
--     "pincode": "560055",
--     "landmark": "Above Reliance Digital Store, Next to Metro Station, Opposite to Forum Mall, Near Manyata Tech Park"
-- }'::jsonb
-- WHERE id = 'f0c48692-7bd3-44e2-9d57-198940884f79';
