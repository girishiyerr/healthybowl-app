# HealthyBowl - Healthy Food Delivery Platform

A complete food delivery platform for healthy meals with subscription plans, order management, and admin dashboard.

## 🚀 Live Demo

[View Live Website](https://your-netlify-url.netlify.app)

## 📋 Features

### Customer Features
- **Landing Page**: Beautiful homepage with subscription plans
- **About Us**: Company information and team details
- **Contact Us**: Contact form with validation
- **Shopping Cart**: Add to cart functionality with quantity limits
- **Checkout**: Complete checkout process with order tracking
- **Order Tracking**: Track orders using tracking ID
- **Responsive Design**: Works on all devices

### Admin Features
- **Order Management**: View and manage all orders
- **Status Updates**: Update order status (Pending → Confirmed → Preparing → Out for Delivery → Delivered)
- **Sales Analytics**: Track total sales and delivered orders
- **Real-time Updates**: Live order status updates
- **Tabbed Interface**: Easy navigation between order statuses

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Netlify
- **Icons**: Heroicons

## 📁 Project Structure

```
healthybowl-app/
├── simple-demo.html          # Main landing page
├── about-us.html             # About us page
├── contact-us.html           # Contact page
├── cart.html                 # Shopping cart page
├── checkout.html             # Checkout page
├── checkout-with-db.html     # Database-integrated checkout
├── order-tracking.html       # Order tracking page
├── admin-dashboard.html      # Admin dashboard
├── privacy-policy.html       # Privacy policy
├── terms-of-service.html     # Terms of service
├── shipping-policy.html      # Shipping policy
├── refund-policy.html        # Refund policy
├── setup-database.html       # Database setup helper
├── database-schema.sql       # Database schema
├── database-schema-updated.sql # Updated database schema
├── supabase-config.js        # Supabase configuration
├── package.json              # Project dependencies
├── netlify.toml              # Netlify configuration
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Git
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/healthybowl-app.git
   cd healthybowl-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project on [Supabase](https://supabase.com)
   - Run the SQL from `database-schema-updated.sql` in your Supabase SQL editor
   - Update `supabase-config.js` with your project credentials

4. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Deploy automatically on every push

## 🗄️ Database Setup

1. **Create Supabase Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Schema**
   - Copy the contents of `database-schema-updated.sql`
   - Paste in Supabase SQL Editor
   - Click "Run" to create all tables and functions

3. **Update Configuration**
   - Open `supabase-config.js`
   - Replace with your Supabase URL and anon key

## 📱 Pages Overview

### Customer Pages
- **Landing Page** (`simple-demo.html`): Main homepage with subscription plans
- **About Us** (`about-us.html`): Company information and team
- **Contact** (`contact-us.html`): Contact form and information
- **Cart** (`cart.html`): Shopping cart with quantity management
- **Checkout** (`checkout-with-db.html`): Order placement with database integration
- **Order Tracking** (`order-tracking.html`): Track orders using tracking ID

### Admin Pages
- **Admin Dashboard** (`admin-dashboard.html`): Complete order management system
- **Database Setup** (`setup-database.html`): Helper for database configuration

### Legal Pages
- **Privacy Policy** (`privacy-policy.html`): Privacy policy and data handling
- **Terms of Service** (`terms-of-service.html`): Terms and conditions
- **Shipping Policy** (`shipping-policy.html`): Shipping information
- **Refund Policy** (`refund-policy.html`): Refund and cancellation policy

## 🎨 Design Features

- **Modern UI**: Clean, professional design with Tailwind CSS
- **Responsive**: Mobile-first responsive design
- **Animations**: Smooth transitions and hover effects
- **Color Scheme**: Green theme for healthy food branding
- **Typography**: Clean, readable fonts
- **Icons**: Consistent iconography throughout

## 🔧 Configuration

### Environment Variables
Create a `.env` file (not included in repo):
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Configuration
Update `supabase-config.js`:
```javascript
const supabaseUrl = 'your_supabase_url'
const supabaseAnonKey = 'your_supabase_anon_key'
```

## 📊 Admin Dashboard Features

- **Order Management**: View orders by status (Pending, Confirmed, Preparing, Out for Delivery, Delivered, Cancelled)
- **Status Updates**: Change order status with notes
- **Sales Analytics**: Track total sales and delivered orders
- **Real-time Updates**: Live order status updates
- **Responsive Design**: Works on all devices

## 🚀 Deployment

### Netlify Deployment

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**
   - Build command: `npm run build` (or leave empty for static site)
   - Publish directory: `/` (root directory)

3. **Environment Variables**
   - Add your Supabase credentials in Netlify dashboard
   - Go to Site settings → Environment variables

4. **Deploy**
   - Click "Deploy site"
   - Your site will be live at `https://your-site-name.netlify.app`

## 🔒 Security

- **Row Level Security**: Supabase RLS policies protect data
- **Input Validation**: Client-side form validation
- **HTTPS**: Automatic HTTPS with Netlify
- **Environment Variables**: Sensitive data in environment variables

## 📈 Performance

- **Optimized Images**: Compressed and optimized images
- **Minified CSS**: Tailwind CSS for minimal bundle size
- **CDN**: Netlify CDN for fast global delivery
- **Caching**: Proper cache headers for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@healthybowl.in or create an issue in the repository.

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com) for styling
- [Supabase](https://supabase.com) for backend services
- [Heroicons](https://heroicons.com) for icons
- [Netlify](https://netlify.com) for hosting

---

**Made with ❤️ for healthy living**
