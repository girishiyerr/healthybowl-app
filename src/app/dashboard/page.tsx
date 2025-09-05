'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Calendar, Package, MapPin, Pause, SkipForward, Edit, Settings } from 'lucide-react'

interface Subscription {
  id: string
  plan: {
    name: string
    deliveriesPerCycle: number
  }
  status: string
  sizeMl: number
  mixFruits: number
  mixSprouts: number
  pricePerDelivery: number
  nextBillingDate: string
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
  }
  deliveries: Array<{
    id: string
    scheduledFor: string
    status: string
    fruitsBoxes: number
    sproutsBoxes: number
  }>
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [upcomingDeliveries, setUpcomingDeliveries] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchSubscription()
    }
  }, [status, router])

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/dashboard/subscription')
      if (response.ok) {
        const data = await response.json()
        setSubscription(data.subscription)
        setUpcomingDeliveries(data.upcomingDeliveries)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePauseSubscription = async () => {
    if (!subscription) return

    try {
      const response = await fetch('/api/dashboard/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription.id }),
      })

      if (response.ok) {
        setSubscription(prev => prev ? { ...prev, status: 'PAUSED' } : null)
      }
    } catch (error) {
      console.error('Error pausing subscription:', error)
    }
  }

  const handleSkipNextDelivery = async () => {
    if (!subscription) return

    try {
      const response = await fetch('/api/dashboard/skip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription.id }),
      })

      if (response.ok) {
        fetchSubscription() // Refresh data
      }
    } catch (error) {
      console.error('Error skipping delivery:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Active Subscription</h1>
            <p className="text-gray-600 mb-8">
              You don't have an active subscription yet. Start your healthy journey today!
            </p>
            <button
              onClick={() => router.push('/plan')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Start Subscription
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="text-xl font-bold text-green-600">HealthyBowl</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {session?.user?.name}</span>
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subscription Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">My Subscription</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              subscription.status === 'ACTIVE' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {subscription.status}
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Plan Details</h3>
              <p className="text-gray-600">Plan: {subscription.plan.name}</p>
              <p className="text-gray-600">Box Size: {subscription.sizeMl}ml</p>
              <p className="text-gray-600">
                Mix: {subscription.mixFruits} fruits + {subscription.mixSprouts} sprouts
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pricing</h3>
              <p className="text-gray-600">Price per delivery: ₹{subscription.pricePerDelivery}</p>
              <p className="text-gray-600">
                Monthly total: ₹{subscription.pricePerDelivery * subscription.plan.deliveriesPerCycle}
              </p>
              <p className="text-gray-600">
                Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Address</h3>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                <div className="text-gray-600">
                  <p>{subscription.address.line1}</p>
                  {subscription.address.line2 && <p>{subscription.address.line2}</p>}
                  <p>{subscription.address.city}, {subscription.address.state} - {subscription.address.pincode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <button
              onClick={handlePauseSubscription}
              disabled={subscription.status === 'PAUSED'}
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Pause className="w-5 h-5 mr-2" />
              {subscription.status === 'PAUSED' ? 'Resume' : 'Pause'}
            </button>

            <button
              onClick={handleSkipNextDelivery}
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <SkipForward className="w-5 h-5 mr-2" />
              Skip Next
            </button>

            <button
              onClick={() => router.push('/dashboard/address')}
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Edit className="w-5 h-5 mr-2" />
              Change Address
            </button>

            <button
              onClick={() => router.push('/dashboard/settings')}
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Upcoming Deliveries */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Upcoming Deliveries
          </h2>

          {upcomingDeliveries.length === 0 ? (
            <p className="text-gray-600">No upcoming deliveries scheduled.</p>
          ) : (
            <div className="space-y-4">
              {upcomingDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {new Date(delivery.scheduledFor).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {delivery.fruitsBoxes} fruits + {delivery.sproutsBoxes} sprouts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      delivery.status === 'SCHEDULED' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {delivery.status}
                    </span>
                    <button className="text-green-600 hover:text-green-700 text-sm">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
