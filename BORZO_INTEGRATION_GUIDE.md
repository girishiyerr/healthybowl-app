# Borzo Integration Guide for HealthyBowl

## Overview

This guide explains how the Borzo delivery service integration works in your HealthyBowl application. The integration provides automated delivery management with real-time tracking capabilities.

## How It Works

### Two-Tier Tracking System

1. **Internal Tracking** (Your System)
   - Order status: pending → confirmed → preparing → out_for_delivery → delivered
   - Managed through your admin dashboard
   - Customer uses order number to track

2. **Borzo Tracking** (External Delivery Partner)
   - Real-time delivery tracking from Borzo's delivery partners
   - Live location updates and ETA
   - Automatic status updates via callback URL

### Optimized Integration Flow (Half-Way Solution)

```
1. Customer places order → Status: "pending"
2. Admin confirms order → Status: "confirmed"
3. Admin starts preparation → Status: "preparing"
4. Admin marks half ready → Status: "half_ready" + Borzo SCHEDULED delivery request created
5. Admin marks ready for delivery → Status: "out_for_delivery" + Borzo IMMEDIATE delivery request created
6. Delivery partner arrives for pickup → Real-time tracking begins
7. Borzo sends status updates → Your callback URL receives updates
8. Delivery completed → Status: "delivered"
```

### Why This Half-Way Approach is Perfect:

**❌ Old Way (Too Slow):**
- Order ready → Create Borzo request → Wait for partner → Wait for pickup → Delivery
- **Total additional time: 30-105 minutes**

**✅ Half-Way Way (Optimal):**
- Order half ready → Start finding delivery partner → Order ready → Immediate pickup
- **Total additional time: 5-15 minutes**
- **Perfect timing**: Borzo finds partner while you finish preparing

## Files Added/Modified

### New Files Created:
- `borzo-integration.js` - Main Borzo API integration service
- `borzo-callback.html` - Callback URL handler for status updates
- `migration-add-borzo-fields.sql` - Database migration script
- `BORZO_INTEGRATION_GUIDE.md` - This guide

### Modified Files:
- `database-schema-updated.sql` - Added Borzo tracking fields
- `admin-dashboard.html` - Added Borzo integration script
- `admin-dashboard.js` - Enhanced status update to trigger Borzo delivery
- `order-tracking.html` - Added Borzo tracking display and refresh functionality

## Database Changes

### New Fields Added to `orders` Table:
```sql
-- Borzo delivery integration
borzo_order_id VARCHAR(255), -- Borzo's order ID
borzo_tracking_url TEXT, -- Borzo's tracking URL
borzo_status VARCHAR(50), -- Current Borzo delivery status
borzo_status_text TEXT, -- Human readable Borzo status
borzo_estimated_delivery TIMESTAMP WITH TIME ZONE, -- Borzo's estimated delivery time
borzo_delivery_notes TEXT -- Notes from Borzo delivery
```

### To Apply Database Changes:
```bash
# Run the migration script
psql -d your_database -f migration-add-borzo-fields.sql
```

## API Configuration

### Borzo API Details:
- **API Key**: `0C103815F71635F077C5A79A04ED7725F0A35152`
- **Base URL**: `https://robotapitest-bxjyfrjzba-uc.a.run.app` (Test environment)
- **Callback URL**: `https://healthybowl.in/borzo-callback.html`
- **Callback Token**: `095B396436F61688AA44AC771A38839E4067021C`

### Important Notes:
- Currently using **test environment** - change to production URL when ready
- Update your business address coordinates in `borzo-integration.js`
- Update your business phone number in the integration

## Setup Instructions

### 1. Database Setup
```bash
# Apply the migration to add Borzo fields
psql -d your_database -f migration-add-borzo-fields.sql
```

### 2. Configure Business Details
Edit `borzo-integration.js` and update:
```javascript
// Update these with your actual business details
address: {
    street: 'Your Business Address',
    house: 'Building Name',
    city: 'Mumbai',
    lat: 19.0760, // Your business coordinates
    lng: 72.8777
},
contact_person: {
    name: 'HealthyBowl Team',
    phone: '+919876543210' // Your business phone
}
```

### 3. Deploy Callback URL
- Upload `borzo-callback.html` to your web server
- Ensure it's accessible at: `https://healthybowl.in/borzo-callback.html`
- The callback URL is already configured in the integration

### 4. Test the Integration
1. Create a test order
2. In admin dashboard, change status to "out_for_delivery"
3. Check if Borzo delivery request is created
4. Verify callback URL receives updates

## How to Use

### For Admins:
1. **Order Management**: Use admin dashboard as usual
2. **Trigger Delivery**: When order is ready, change status to "out_for_delivery"
3. **Monitor**: Check Borzo tracking information in order details
4. **Status Updates**: Borzo will automatically update delivery status

### For Customers:
1. **Track Order**: Enter order number in order tracking page
2. **View Status**: See both internal order status and live delivery tracking
3. **Live Updates**: Click "Refresh Status" to get latest delivery updates
4. **External Tracking**: Click "Track on Borzo" for detailed delivery partner tracking

## Borzo Status Mapping

| Borzo Status | Internal Status | Description |
|-------------|----------------|-------------|
| new | out_for_delivery | Delivery request created |
| accepted | out_for_delivery | Delivery partner accepted |
| picked_up | out_for_delivery | Package picked up |
| in_progress | out_for_delivery | In transit to customer |
| delivered | delivered | Successfully delivered |
| cancelled | cancelled | Delivery cancelled |
| failed | cancelled | Delivery failed |

## Troubleshooting

### Common Issues:

1. **Borzo API Errors**
   - Check API key validity
   - Verify network connectivity
   - Check API endpoint URL

2. **Callback Not Working**
   - Ensure callback URL is publicly accessible
   - Check server logs for errors
   - Verify callback URL format

3. **Database Errors**
   - Run migration script to add Borzo fields
   - Check database permissions
   - Verify field names match

4. **Status Not Updating**
   - Check Borzo integration script is loaded
   - Verify order has Borzo order ID
   - Test callback URL manually

### Debug Mode:
Enable console logging by opening browser developer tools to see detailed error messages.

## Production Deployment

### Before Going Live:
1. **Change API URL**: Update to production Borzo API endpoint
2. **Update Callback URL**: Use your production domain
3. **Test Thoroughly**: Verify all functionality works
4. **Monitor Logs**: Set up logging for delivery requests and callbacks

### Security Considerations:
- Keep API key secure
- Use HTTPS for callback URL
- **Callback token verification is implemented** - ensures only Borzo can send updates
- Validate callback data before processing
- Implement rate limiting for API calls

## Support

For issues with:
- **Borzo API**: Contact Borzo support
- **Integration Code**: Check this guide and code comments
- **Database Issues**: Verify migration was applied correctly

## API Reference

### Borzo Integration Methods:
- `createDeliveryRequest(orderData, deliveryAddress)` - Create new delivery
- `getDeliveryStatus(borzoOrderId)` - Get current delivery status
- `cancelDelivery(borzoOrderId)` - Cancel delivery request
- `processCallback(callbackData)` - Process status updates from Borzo

### Callback Data Format:
```javascript
{
    order_id: "borzo_order_id",
    status: "delivered",
    status_text: "Package delivered successfully",
    timestamp: "2024-01-01T12:00:00Z"
}
```

---

**Note**: This integration is currently configured for testing. Update API endpoints and business details before production use.
