# 🚀 Deployment Guide - HealthyBowl App

This guide will help you deploy the HealthyBowl app to Netlify using Git.

## 📋 Prerequisites

- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) (v14 or higher)
- [GitHub](https://github.com/) account
- [Netlify](https://netlify.com/) account
- [Supabase](https://supabase.com/) account

## 🔧 Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)
```bash
cd /Users/girishiyer/Documents/SDE\ Projects\ :\ Side\ Business/healthybowl-app
git init
```

### 1.2 Add all files to Git
```bash
git add .
git commit -m "Initial commit: Complete HealthyBowl app with admin dashboard"
```

### 1.3 Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name: `healthybowl-app`
4. Description: `Complete Food Delivery Platform with Admin Dashboard`
5. Make it **Public** (for free Netlify hosting)
6. Don't initialize with README (we already have one)
7. Click "Create repository"

### 1.4 Connect Local Repository to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/healthybowl-app.git
git branch -M main
git push -u origin main
```

## 🗄️ Step 2: Set Up Supabase Database

### 2.1 Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Project name: `healthybowl-app`
5. Database password: (generate a strong password)
6. Region: Choose closest to your users
7. Click "Create new project"

### 2.2 Set Up Database Schema
1. Wait for project to be ready (2-3 minutes)
2. Go to "SQL Editor" in your Supabase dashboard
3. Copy the entire contents of `database-schema-updated.sql`
4. Paste in the SQL Editor
5. Click "Run" to execute the schema

### 2.3 Get Supabase Credentials
1. Go to "Settings" → "API"
2. Copy your:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## 🌐 Step 3: Deploy to Netlify

### 3.1 Connect Repository to Netlify
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Choose "GitHub" as your Git provider
4. Authorize Netlify to access your GitHub
5. Select your `healthybowl-app` repository
6. Click "Deploy site"

### 3.2 Configure Build Settings
- **Build command**: Leave empty (static site)
- **Publish directory**: `/` (root directory)
- Click "Deploy site"

### 3.3 Set Environment Variables
1. Go to "Site settings" → "Environment variables"
2. Add the following variables:
   ```
   SUPABASE_URL = https://your-project.supabase.co
   SUPABASE_ANON_KEY = eyJ... (your anon key)
   ```

### 3.4 Update Supabase Configuration
1. Go to your deployed site
2. Open `supabase-config.js` in the browser
3. Update the URL and key with your actual Supabase credentials
4. Commit and push the changes:
   ```bash
   git add supabase-config.js
   git commit -m "Update Supabase configuration"
   git push
   ```

## 🔧 Step 4: Configure Custom Domain (Optional)

### 4.1 Add Custom Domain
1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain (e.g., `healthybowl.in`)
4. Follow the DNS configuration instructions

### 4.2 SSL Certificate
- Netlify automatically provides SSL certificates
- Your site will be available at `https://your-domain.com`

## ✅ Step 5: Verify Deployment

### 5.1 Test All Pages
Visit your deployed site and test:
- [ ] Landing page (`/simple-demo.html`)
- [ ] About Us (`/about-us.html`)
- [ ] Contact Us (`/contact-us.html`)
- [ ] Shopping Cart (`/cart.html`)
- [ ] Checkout (`/checkout-with-db.html`)
- [ ] Order Tracking (`/order-tracking.html`)
- [ ] Admin Dashboard (`/admin-dashboard.html`)

### 5.2 Test Database Integration
1. Go to `/setup-database.html`
2. Test database connection
3. Create a sample order
4. Test order tracking

### 5.3 Test Admin Dashboard
1. Go to `/admin-dashboard.html`
2. Verify all order statuses work
3. Test status updates
4. Check sales summary

## 🔄 Step 6: Continuous Deployment

### 6.1 Automatic Deployments
- Every push to `main` branch will automatically deploy
- Netlify will show deployment status
- You can view deployment logs in Netlify dashboard

### 6.2 Manual Deployments
```bash
# Make changes to your code
git add .
git commit -m "Your changes"
git push origin main
# Netlify will automatically deploy
```

## 🛠️ Step 7: Maintenance

### 7.1 Monitor Performance
- Use Netlify Analytics (if enabled)
- Monitor site speed and uptime
- Check error logs in Netlify dashboard

### 7.2 Database Management
- Monitor Supabase dashboard for database usage
- Set up database backups
- Monitor API usage and limits

### 7.3 Security
- Keep Supabase credentials secure
- Regularly update dependencies
- Monitor for security vulnerabilities

## 🚨 Troubleshooting

### Common Issues

**1. Supabase Connection Failed**
- Check if environment variables are set correctly
- Verify Supabase project is active
- Check if database schema is properly set up

**2. Build Failed**
- Check Netlify build logs
- Ensure all files are committed to Git
- Verify `netlify.toml` configuration

**3. Pages Not Loading**
- Check if all HTML files are in the root directory
- Verify file paths are correct
- Check browser console for errors

**4. Admin Dashboard Not Working**
- Ensure Supabase RLS policies are set up
- Check if admin functions are working
- Verify database permissions

### Getting Help
- Check [Netlify Documentation](https://docs.netlify.com/)
- Check [Supabase Documentation](https://supabase.com/docs)
- Create an issue in your GitHub repository

## 📊 Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] Database connection works
- [ ] Order tracking functions
- [ ] Admin dashboard is accessible
- [ ] Contact form works (if using Netlify Forms)
- [ ] Mobile responsiveness works
- [ ] SSL certificate is active
- [ ] Custom domain is configured (if applicable)
- [ ] Analytics are set up (if desired)
- [ ] Backup strategy is in place

## 🎉 Success!

Your HealthyBowl app is now live and ready to accept orders! 

**Your live URL**: `https://your-site-name.netlify.app`

Remember to:
- Monitor the site regularly
- Keep dependencies updated
- Backup your database regularly
- Monitor performance and user feedback

---

**Need help?** Check the [README.md](README.md) for more detailed information about the project.
