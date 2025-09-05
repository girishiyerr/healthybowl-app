# HealthyBowl Database Setup Guide

This guide will help you set up the database for the HealthyBowl website using Supabase.

## 📋 Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Node.js**: Install Node.js (version 16 or higher)
3. **Git**: For version control

## 🚀 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `healthybowl-database`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users (Asia Pacific for India)
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## 🗄️ Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `database-schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema
6. Verify that all tables are created successfully

## 🔑 Step 3: Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## ⚙️ Step 4: Configure Environment

1. Open `supabase-config.js`
2. Replace the placeholder values:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL' // Replace with your Project URL
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY' // Replace with your anon key
   ```

## 📦 Step 5: Install Dependencies

1. Open terminal in your project directory
2. Run the following commands:
   ```bash
   npm install
   ```

## 🧪 Step 6: Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser to `http://localhost:3000`
3. Test the following features:
   - Add items to cart
   - Proceed to checkout
   - Fill out the checkout form
   - Submit contact form

## 📊 Database Tables Overview

### Core Tables
- **users**: Customer accounts and profiles
- **customer_addresses**: Customer delivery addresses
- **products**: Subscription plan catalog
- **orders**: Order information and status
- **order_items**: Individual items in each order
- **contact_messages**: Contact form submissions
- **coupons**: Discount codes and promotions
- **delivery_areas**: Available delivery locations

### Key Features
- **Automatic order numbering**: Orders get unique numbers like `HB-20241201-0001`
- **Row Level Security**: Users can only see their own data
- **Real-time updates**: Built-in Supabase real-time features
- **Data validation**: Database-level constraints and triggers
- **Analytics ready**: Views for reporting and analytics

## 🔒 Security Features

1. **Row Level Security (RLS)**: Enabled on all sensitive tables
2. **User isolation**: Users can only access their own data
3. **Admin access**: Separate policies for admin users
4. **Data validation**: Database-level constraints
5. **Secure authentication**: Supabase Auth integration

## 📈 Sample Data Included

The schema includes sample data:
- **4 Product variants**: 250ml/500ml × Weekly/Monthly
- **3 Coupon codes**: WELCOME10, HEALTHY20, FREESHIP
- **30+ Delivery areas**: Mumbai and Thane pincodes

## 🛠️ Customization Options

### Adding New Products
```sql
INSERT INTO products (name, description, size_ml, plan_type, price_weekly, price_monthly) 
VALUES ('New Product', 'Description', 300, 'Weekly', 350.00, 1400.00);
```

### Adding New Coupons
```sql
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount) 
VALUES ('NEWCODE', 'New discount', 'percentage', 15.00, 1000.00);
```

### Adding Delivery Areas
```sql
INSERT INTO delivery_areas (pincode, area_name, city, state) 
VALUES ('400099', 'New Area', 'Mumbai', 'Maharashtra');
```

## 🔧 Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check that you've replaced the placeholder values in `supabase-config.js`
   - Verify the API key is correct

2. **"Table doesn't exist" error**
   - Make sure you've run the complete `database-schema.sql` file
   - Check the Supabase SQL editor for any errors

3. **"Permission denied" error**
   - Verify RLS policies are set up correctly
   - Check that users are properly authenticated

4. **Cart not saving**
   - Check browser console for JavaScript errors
   - Verify Supabase connection is working

### Getting Help

1. Check the Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
2. Review the browser console for error messages
3. Check the Supabase dashboard logs
4. Verify all environment variables are set correctly

## 📱 Next Steps

Once the database is set up:

1. **Test all functionality** thoroughly
2. **Set up email templates** for order confirmations
3. **Configure payment integration** with Razorpay
4. **Set up admin dashboard** for order management
5. **Implement real-time notifications**
6. **Add analytics and reporting**

## 🎯 Production Checklist

Before going live:

- [ ] Replace test API keys with production keys
- [ ] Set up proper domain and SSL
- [ ] Configure email service for notifications
- [ ] Set up payment gateway (Razorpay)
- [ ] Test all user flows end-to-end
- [ ] Set up monitoring and logging
- [ ] Create admin user accounts
- [ ] Backup database
- [ ] Set up CDN for static assets

## 📞 Support

For technical support:
- Email: support@healthybowl.in
- Phone: (+91) 78876 40076

---

**Happy coding! 🚀**
