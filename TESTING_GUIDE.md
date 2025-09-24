# Borzo Integration Testing Guide

## 🧪 Complete Testing Checklist

### **Prerequisites**
- [ ] Database migration applied (`migration-add-borzo-fields.sql`)
- [ ] `borzo-callback.html` deployed to your server
- [ ] All files updated with latest changes

---

## **Phase 1: Database Setup Testing**

### 1.1 Apply Database Migration
```bash
# Connect to your database and run:
psql -d your_database_name -f migration-add-borzo-fields.sql
```

### 1.2 Verify Database Changes
```sql
-- Check if new fields were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name LIKE '%borzo%' OR column_name = 'half_ready_at';

-- Should show:
-- borzo_order_id, borzo_tracking_url, borzo_status, 
-- borzo_status_text, borzo_estimated_delivery, 
-- borzo_delivery_notes, half_ready_at
```

---

## **Phase 2: Admin Dashboard Testing**

### 2.1 Test Order Status Updates
1. **Open Admin Dashboard**: `admin-dashboard.html`
2. **Find a test order** (or create one)
3. **Test Status Flow**:
   ```
   pending → confirmed → preparing → half_ready → out_for_delivery → delivered
   ```

### 2.2 Test Half-Ready Status (Key Test)
1. **Change status to "half_ready"**
2. **Check browser console** for:
   ```
   ✅ Borzo delivery created for order HB-XXXX: [borzo_order_id]
   ```
3. **Verify database** has Borzo fields populated:
   ```sql
   SELECT order_number, borzo_order_id, borzo_status, borzo_status_text 
   FROM orders 
   WHERE status = 'half_ready';
   ```

### 2.3 Test Out-for-Delivery Status
1. **Change status to "out_for_delivery"**
2. **Check console** for immediate delivery request
3. **Verify** both scheduled and immediate requests are created

---

## **Phase 3: Order Tracking Testing**

### 3.1 Test Customer Tracking
1. **Open Order Tracking**: `order-tracking.html`
2. **Enter order number** from admin dashboard
3. **Verify timeline shows**:
   - ✅ Order Placed
   - ✅ Order Confirmed  
   - ✅ Preparing Your Order
   - ✅ Half Ready - Finding Delivery Partner (if status is half_ready+)
   - ✅ Out for Delivery (if status is out_for_delivery+)

### 3.2 Test Borzo Tracking Section
1. **For orders with Borzo data**, verify:
   - Blue "Live Delivery Tracking" section appears
   - Shows delivery partner status
   - Shows estimated delivery time
   - "Track on Borzo" button works
   - "Refresh Status" button works

---

## **Phase 4: Borzo API Testing**

### 4.1 Test API Connection
1. **Open browser developer tools** (F12)
2. **Go to Network tab**
3. **Change order status to "half_ready"**
4. **Look for API calls** to Borzo endpoints
5. **Check response** for success/error

### 4.2 Test Callback URL
1. **Visit**: `https://healthybowl.in/borzo-callback.html`
2. **Should show**: "Waiting for callback data..."
3. **Test with sample data**:
   ```
   https://healthybowl.in/borzo-callback.html?order_id=test123&status=new&token=095B396436F61688AA44AC771A38839E4067021C
   ```

---

## **Phase 5: End-to-End Testing**

### 5.1 Complete Order Flow Test
1. **Create test order** (or use existing)
2. **Follow complete flow**:
   ```
   pending → confirmed → preparing → half_ready → out_for_delivery → delivered
   ```
3. **At each step, verify**:
   - Status updates correctly
   - Database timestamps are set
   - Borzo requests are created (for half_ready+)
   - Customer tracking shows correct status

### 5.2 Test Error Handling
1. **Test with invalid order numbers**
2. **Test network failures** (disconnect internet)
3. **Test with missing Borzo data**
4. **Verify error messages** are user-friendly

---

## **Phase 6: Production Testing**

### 6.1 Test with Real Borzo API
1. **Use test environment first**
2. **Create real delivery request**
3. **Monitor callback URL** for updates
4. **Test with actual delivery partner**

### 6.2 Performance Testing
1. **Test multiple orders** simultaneously
2. **Check response times**
3. **Monitor database performance**
4. **Test under load**

---

## **🔍 Debugging Tips**

### Common Issues & Solutions

#### **Issue: Borzo API calls failing**
```javascript
// Check in browser console:
console.log('Borzo API Key:', '0C103815F71635F077C5A79A04ED7725F0A35152');
console.log('Callback URL:', 'https://healthybowl.in/borzo-callback.html');
```

#### **Issue: Database fields not updating**
```sql
-- Check if migration was applied:
SELECT * FROM orders WHERE borzo_order_id IS NOT NULL LIMIT 1;
```

#### **Issue: Callback not receiving data**
1. Check if `borzo-callback.html` is accessible
2. Verify callback URL in Borzo integration
3. Check server logs for errors

#### **Issue: Status not showing in tracking**
1. Check if order has Borzo data
2. Verify status mapping in JavaScript
3. Check browser console for errors

---

## **📊 Test Results Checklist**

### **Admin Dashboard Tests**
- [ ] Status updates work correctly
- [ ] Half-ready status triggers Borzo request
- [ ] Out-for-delivery status triggers immediate request
- [ ] Error messages show properly
- [ ] Database updates correctly

### **Order Tracking Tests**
- [ ] Order lookup works
- [ ] Timeline displays correctly
- [ ] Borzo tracking section appears
- [ ] Refresh button works
- [ ] External tracking link works

### **API Integration Tests**
- [ ] Borzo API calls succeed
- [ ] Callback URL is accessible
- [ ] Token verification works
- [ ] Error handling works

### **Database Tests**
- [ ] Migration applied successfully
- [ ] New fields exist
- [ ] Data updates correctly
- [ ] Timestamps are set

---

## **🚀 Go-Live Checklist**

Before going live:
- [ ] All tests pass
- [ ] Database migration applied
- [ ] Callback URL deployed and accessible
- [ ] Business details updated in code
- [ ] API endpoints verified
- [ ] Error handling tested
- [ ] Performance tested

---

## **📞 Support Contacts**

- **Borzo API Issues**: Contact Borzo support
- **Integration Issues**: Check this guide and code comments
- **Database Issues**: Verify migration was applied correctly

---

**Note**: Start with test environment and gradually move to production testing once everything works correctly.
