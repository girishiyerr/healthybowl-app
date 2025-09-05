import Link from 'next/link'
import { ArrowRight, CheckCircle, Truck, Leaf, Heart, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-600">HealthyBowl</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#plans" className="text-gray-600 hover:text-green-600">Plans</Link>
              <Link href="#features" className="text-gray-600 hover:text-green-600">Features</Link>
              <Link href="#faq" className="text-gray-600 hover:text-green-600">FAQ</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="text-gray-600 hover:text-green-600">
                Sign In
              </Link>
              <Link 
                href="/plan" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Marquee */}
      <div className="bg-green-600 text-white py-2 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="mx-8">🍎 Fresh Fruits Daily</span>
          <span className="mx-8">🌱 Organic Sprouts</span>
          <span className="mx-8">🚚 Free Delivery</span>
          <span className="mx-8">💚 100% Natural</span>
          <span className="mx-8">⏰ Timely Delivery</span>
          <span className="mx-8">🏠 Doorstep Service</span>
          <span className="mx-8">💰 Best Prices</span>
          <span className="mx-8">📱 Easy Management</span>
          <span className="mx-8">🔄 Flexible Plans</span>
          <span className="mx-8">⭐ 5-Star Rated</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Daily Fresh{' '}
            <span className="text-green-600">Fruits & Sprouts</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get the freshest fruits and organic sprouts delivered to your doorstep every day. 
            Start your healthy journey with our flexible subscription plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/plan"
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              Start Subscription
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="#features"
              className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-green-600 mb-2" />
              <span className="font-semibold">100% Fresh</span>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-12 h-12 text-green-600 mb-2" />
              <span className="font-semibold">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="w-12 h-12 text-green-600 mb-2" />
              <span className="font-semibold">Healthy Choice</span>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 text-green-600 mb-2" />
              <span className="font-semibold">Quality Assured</span>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600">
              Flexible subscription plans to fit your lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Weekly Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-green-200 transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Weekly Plan</h3>
                <p className="text-gray-600">6 deliveries per week</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-green-600">₹299</span>
                  <span className="text-gray-600 ml-2">/week</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>6 fresh deliveries per week</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Choose 250ml or 500ml boxes</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Mix of fruits and sprouts</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Free delivery</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Pause or skip anytime</span>
                </div>
              </div>

              <Link 
                href="/plan?plan=weekly"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center block"
              >
                Choose Weekly Plan
              </Link>
            </div>

            {/* Monthly Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly Plan</h3>
                <p className="text-gray-600">24 deliveries per month</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-green-600">₹999</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <div className="text-sm text-green-600 font-semibold mt-2">
                  Save ₹197/month (10% off)
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>24 fresh deliveries per month</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Choose 250ml or 500ml boxes</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Mix of fruits and sprouts</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Free delivery</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Pause or skip anytime</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>10% discount on monthly billing</span>
                </div>
              </div>

              <Link 
                href="/plan?plan=monthly"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center block"
              >
                Choose Monthly Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose HealthyBowl?
            </h2>
            <p className="text-xl text-gray-600">
              We make healthy eating convenient and affordable
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh & Organic</h3>
              <p className="text-gray-600">
                Sourced directly from local farms, ensuring the freshest and most nutritious produce.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Convenient Delivery</h3>
              <p className="text-gray-600">
                Free delivery to your doorstep at your preferred time slot, 6 days a week.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Plans</h3>
              <p className="text-gray-600">
                Pause, skip, or modify your subscription anytime. Your convenience is our priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">How does the subscription work?</h3>
              <p className="text-gray-600">
                Choose between weekly (6 deliveries) or monthly (24 deliveries) plans. 
                You can customize your mix of fruits and sprouts for each delivery.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">Can I pause or skip deliveries?</h3>
              <p className="text-gray-600">
                Yes! You can pause your subscription, skip individual deliveries, or reschedule them 
                through your dashboard.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">What if I'm not satisfied?</h3>
              <p className="text-gray-600">
                We offer a 100% satisfaction guarantee. If you're not happy with your delivery, 
                contact us and we'll make it right.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">How do I change my delivery address?</h3>
              <p className="text-gray-600">
                You can update your delivery address anytime through your dashboard. 
                Changes will apply to future deliveries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Healthy Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of satisfied customers who trust HealthyBowl for their daily nutrition.
          </p>
          <Link 
            href="/plan"
            className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Start Your Subscription
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">HealthyBowl</span>
              </div>
              <p className="text-gray-400">
                Fresh fruits and sprouts delivered daily to your doorstep.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/plan" className="hover:text-white">Plans</Link></li>
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/refund" className="hover:text-white">Refund Policy</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 support@healthybowl.com</li>
                <li>📱 +91 98765 43210</li>
                <li>📍 Mumbai, India</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HealthyBowl. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
