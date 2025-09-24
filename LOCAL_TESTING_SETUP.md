# Local Testing Setup Guide

## 🚀 Quick Local Testing (No Netlify Credits Used!)

### **Step 1: Start Local Server**

```bash
# Navigate to your project directory
cd /Users/girishiyer/Documents/SDE\ Projects\ :\ Side\ Business/healthybowl-app

# Start local HTTP server
python3 -m http.server 8000

# OR if you have Node.js
npx http-server -p 8000

# OR if you have PHP
php -S localhost:8000
```

### **Step 2: Open Test Page**

Open your browser and go to:
```
http://localhost:8000/test-local.html
```

### **Step 3: Run Tests**

1. Click **"Run Local Tests"** button
2. Check results - should show green for passing tests
3. Fix any issues before deploying

---

## 🧪 What the Local Tests Check:

### **✅ Supabase Connection**
- Tests database connectivity
- Verifies API keys work
- Checks if tables exist

### **✅ Borzo Integration Setup**
- Tests if BorzoIntegration class loads
- Verifies all methods exist
- Tests callback processing

### **✅ Admin Dashboard Integration**
- Checks if admin functions are available
- Tests status update triggers

### **✅ Order Tracking Integration**
- Verifies tracking functions exist
- Tests Borzo tracking display

---

## 🔧 Troubleshooting Local Issues:

### **Issue: "Supabase not initialized"**
**Solution**: Refresh the page, wait 2-3 seconds, then run tests

### **Issue: "Database connection failed"**
**Solution**: Check your Supabase URL and API key

### **Issue: "BorzoIntegration class not found"**
**Solution**: Make sure `borzo-integration.js` is in the same directory

### **Issue: CORS errors**
**Solution**: This is expected for Borzo API - local tests skip actual API calls

---

## 📋 Local Test Checklist:

- [ ] Local server running on port 8000
- [ ] Test page opens without errors
- [ ] Supabase connection test passes
- [ ] Borzo integration class loads
- [ ] All functions are available
- [ ] No JavaScript errors in console

---

## 🚀 After Local Tests Pass:

1. **Fix any issues** found in local testing
2. **Commit changes** to Git
3. **Deploy to production** only when everything works locally
4. **Test on production** with real API calls

---

## 💡 Pro Tips:

- **Always test locally first** to save Netlify credits
- **Use browser dev tools** (F12) to see detailed errors
- **Check console** for JavaScript errors
- **Test one component at a time** for easier debugging

This way you can test everything locally without wasting any deployment credits!
