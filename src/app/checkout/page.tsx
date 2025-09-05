'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, MapPin, Calendar, CreditCard } from 'lucide-react'

interface CheckoutData {
  planId: string
  planName: string
  sizeMl: number
  mixFruits: number
  mixSprouts: number
  pricePerDelivery: number
  monthlyTotal: number
  savings: number
}

interface Address {
  id?: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [address, setAddress] = useState<Address>({
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [startDate, setStartDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('morning')

  const timeSlots = [
    { id: 'morning', label: 'Morning (8 AM - 12 PM)', value: 'morning' },
    { id: 'afternoon', label: 'Afternoon (12 PM - 4 PM)', value: 'afternoon' },
    { id: 'evening', label: 'Evening (4 PM - 8 PM)', value: 'evening' },
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/checkout')
      return
    }

    // Parse checkout data from URL params
    const data: CheckoutData = {
      planId: searchParams.get('planId') || '',
      planName: searchParams.get('planName') || '',
      sizeMl: parseInt(searchParams.get('sizeMl') || '250'),
      mixFruits: parseInt(searchParams.get('mixFruits') || '1'),
      mixSprouts: parseInt(searchParams.get('mixSprouts') || '1'),
      pricePerDelivery: parseInt(searchParams.get('pricePerDelivery') || '0'),
      monthlyTotal: parseInt(searchParams.get('monthlyTotal') || '0'),
      savings: parseInt(searchParams.get('savings') || '0'),
    }

    if (!data.planId) {
      router.push('/plan')
      return
    }

    setCheckoutData(data)

    // Set default start date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setStartDate(tomorrow.toISOString().split('T')[0])
  }, [searchParams, status, router])

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePayment = async () => {
    if (!checkoutData || !session?.user) return

    setLoading(true)

    try {
      // Create checkout session
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: checkoutData.planId,
          sizeMl: checkoutData.sizeMl,
          mixFruits: checkoutData.mixFruits,
          mixSprouts: checkoutData.mixSprouts,
          address,
          startDate,
          timeSlot,
        }),
      })

      const { sessionId, key } = await response.json()

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      // Initialize Razorpay
      const options = {
        key,
        amount: checkoutData.monthlyTotal * 100, // Convert to paise
        currency: 'INR',
        name: 'HealthyBowl',
        description: `${checkoutData.planName} Subscription`,
        image: '/logo.png',
        order_id: sessionId,
        handler: async function (response: any) {
          // Handle successful payment
          try {
            const verifyResponse = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: checkoutData.planId,
                sizeMl: checkoutData.sizeMl,
                mixFruits: checkoutData.mixFruits,
                mixSprouts: checkoutData.mixSprouts,
                address,
                startDate,
                timeSlot,
              }),
            })

            if (verifyResponse.ok) {
              router.push('/dashboard?success=true')
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            alert('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: session.user.name || '',
          email: session.user.email || '',
        },
        theme: {
          color: '#059669',
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!checkoutData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="text-xl font-bold text-green-600">HealthyBowl</span>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                Delivery Address
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={address.line1}
                    onChange={(e) => handleAddressChange('line1', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="House/Flat number, Street name"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={address.line2}
                    onChange={(e) => handleAddressChange('line2', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Landmark, Area"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="City"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="State"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => handleAddressChange('pincode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Pincode"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Delivery Schedule */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Delivery Schedule
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot.id} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                Payment Method
              </h2>
              
              <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">RZ</span>
                  </div>
                  <div>
                    <p className="font-semibold">Razorpay</p>
                    <p className="text-sm text-gray-600">Secure payment gateway</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-semibold">{checkoutData.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Box Size</span>
                  <span>{checkoutData.sizeMl}ml</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mix per delivery</span>
                  <span>{checkoutData.mixFruits} fruits + {checkoutData.mixSprouts} sprouts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per delivery</span>
                  <span>₹{checkoutData.pricePerDelivery}</span>
                </div>
                {checkoutData.savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Monthly savings</span>
                    <span>₹{checkoutData.savings}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{checkoutData.monthlyTotal}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || !address.line1 || !address.city || !address.state || !address.pincode}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold flex items-center justify-center ${
                  loading || !address.line1 || !address.city || !address.state || !address.pincode
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay ₹{checkoutData.monthlyTotal}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By proceeding, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
