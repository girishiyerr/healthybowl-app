#!/bin/bash

# HealthyBowl App - Git Setup Script
# This script helps you initialize Git and prepare for deployment

echo "🚀 HealthyBowl App - Git Setup"
echo "================================"

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    echo "   Download from: https://git-scm.com/"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "simple-demo.html" ]; then
    echo "❌ Please run this script from the healthybowl-app directory"
    exit 1
fi

echo "✅ Git is installed"
echo "✅ In correct directory"

# Initialize Git repository
echo ""
echo "📁 Initializing Git repository..."
git init

# Add all files
echo "📝 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Complete HealthyBowl app with admin dashboard

Features included:
- Landing page with subscription plans
- About Us, Contact Us pages
- Shopping cart and checkout
- Order tracking system
- Admin dashboard with order management
- Database integration with Supabase
- Responsive design with Tailwind CSS"

echo ""
echo "🎉 Git repository initialized successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Create a GitHub repository:"
echo "   - Go to https://github.com"
echo "   - Click 'New repository'"
echo "   - Name: healthybowl-app"
echo "   - Make it Public"
echo "   - Don't initialize with README"
echo ""
echo "2. Connect to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/healthybowl-app.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Netlify:"
echo "   - Go to https://netlify.com"
echo "   - Connect your GitHub repository"
echo "   - Deploy automatically"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🔧 To start development server:"
echo "   npm install"
echo "   npm run dev"
