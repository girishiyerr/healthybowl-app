'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Leaf, Package } from 'lucide-react'
import { calculateSubscriptionPricing } from '@/lib/pricing'

interface PlanData {
  planId: string
  planName: string
  sizeMl: number
  mixFruits: number
  mixSprouts: number
  pricePerDelivery: number
  monthlyTotal: number
  savings: number
}

export default function PlanBuilder() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [planData, setPlanData] = useState<PlanData>({
    planId: '',
    planName: '',
    sizeMl: 250,
    mixFruits: 1,
    mixSprouts: 1,
    pricePerDelivery: 0,
    monthlyTotal: 0,
    savings: 0,
  })

  const steps = [
    { id: 1, title: 'Choose Plan', description: 'Select your subscription plan' },
    { id: 2, title: 'Box Size', description: 'Choose container size' },
    { id: 3, title: 'Mix Selection', description: 'Customize your mix' },
    { id: 4, title: 'Review & Pay', description: 'Review and checkout' },
  ]

  const plans = [
    {
      id: 'weekly',
      name: 'Weekly',
      deliveries: 6,
      cycle: 'week',
      price: '₹299',
      description: '6 deliveries per week',
    },
    {
      id: 'monthly',
      name: 'Monthly',
      deliveries: 24,
      cycle: 'month',
      price: '₹999',
      description: '24 deliveries per month',
      popular: true,
    },
  ]

  const boxSizes = [
    { size: 250, label: '250ml', description: 'Perfect for individuals' },
    { size: 500, label: '500ml', description: 'Great for families' },
  ]

  useEffect(() => {
    const planParam = searchParams.get('plan')
    if (planParam && (planParam === 'weekly' || planParam === 'monthly')) {
      setPlanData(prev => ({
        ...prev,
        planId: planParam,
        planName: planParam === 'weekly' ? 'Weekly' : 'Monthly',
      }))
      setCurrentStep(2)
    }
  }, [searchParams])

  useEffect(() => {
    if (planData.planId) {
      calculatePricing()
    }
  }, [planData.planId, planData.sizeMl, planData.mixFruits, planData.mixSprouts])

  const calculatePricing = async () => {
    try {
      const pricing = await calculateSubscriptionPricing(
        planData.planId,
        planData.sizeMl,
        planData.mixFruits,
        planData.mixSprouts
      )
      setPlanData(prev => ({
        ...prev,
        pricePerDelivery: pricing.pricePerDelivery,
        monthlyTotal: pricing.monthlyTotal,
        savings: pricing.savings,
      }))
    } catch (error) {
      console.error('Error calculating pricing:', error)
    }
  }

  const handlePlanSelect = (planId: string, planName: string) => {
    setPlanData(prev => ({
      ...prev,
      planId,
      planName,
    }))
    setCurrentStep(2)
  }

  const handleSizeSelect = (sizeMl: number) => {
    setPlanData(prev => ({
      ...prev,
      sizeMl,
    }))
    setCurrentStep(3)
  }

  const handleMixChange = (type: 'fruits' | 'sprouts', value: number) => {
    setPlanData(prev => ({
      ...prev,
      [`mix${type.charAt(0).toUpperCase() + type.slice(1)}`]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // Proceed to checkout
      router.push(`/checkout?${new URLSearchParams(planData as any).toString()}`)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push('/')
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return planData.planId !== ''
      case 2:
        return planData.sizeMl !== 0
      case 3:
        return planData.mixFruits > 0 || planData.mixSprouts > 0
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-green-600">HealthyBowl</span>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Steps */}
          <div className="lg:col-span-2">
            {/* Step 1: Choose Plan */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Plan</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        planData.planId === plan.id
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => handlePlanSelect(plan.id, plan.name)}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Most Popular
                          </span>
                        </div>
                      )}
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <p className="text-gray-600 mb-4">{plan.description}</p>
                        <div className="text-3xl font-bold text-green-600 mb-2">{plan.price}</div>
                        <p className="text-sm text-gray-500">per {plan.cycle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Box Size */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Box Size</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {boxSizes.map((box) => (
                    <div
                      key={box.size}
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        planData.sizeMl === box.size
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => handleSizeSelect(box.size)}
                    >
                      <div className="flex items-center mb-4">
                        <Package className="w-8 h-8 text-green-600 mr-3" />
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{box.label}</h3>
                          <p className="text-gray-600">{box.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Mix Selection */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Customize Your Mix</h2>
                <p className="text-gray-600 mb-6">
                  Choose how many boxes of fruits and sprouts you want per delivery
                </p>
                
                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-orange-600 font-bold">🍎</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Fruits</h3>
                          <p className="text-sm text-gray-600">Fresh seasonal fruits</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleMixChange('fruits', Math.max(0, planData.mixFruits - 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{planData.mixFruits}</span>
                        <button
                          onClick={() => handleMixChange('fruits', planData.mixFruits + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 font-bold">🌱</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Sprouts</h3>
                          <p className="text-sm text-gray-600">Organic sprouts mix</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleMixChange('sprouts', Math.max(0, planData.mixSprouts - 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{planData.mixSprouts}</span>
                        <button
                          onClick={() => handleMixChange('sprouts', planData.mixSprouts + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Plan</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-semibold">{planData.planName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Box Size</span>
                    <span className="font-semibold">{planData.sizeMl}ml</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Mix per delivery</span>
                    <span className="font-semibold">
                      {planData.mixFruits} fruits + {planData.mixSprouts} sprouts
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Price per delivery</span>
                    <span className="font-semibold">₹{planData.pricePerDelivery}</span>
                  </div>
                  {planData.savings > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-green-600">Monthly savings</span>
                      <span className="font-semibold text-green-600">₹{planData.savings}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 text-lg font-bold">
                    <span>Monthly total</span>
                    <span>₹{planData.monthlyTotal}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {planData.planName && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan</span>
                    <span>{planData.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Box Size</span>
                    <span>{planData.sizeMl}ml</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mix</span>
                    <span>{planData.mixFruits}F + {planData.mixSprouts}S</span>
                  </div>
                  {planData.pricePerDelivery > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Per delivery</span>
                        <span>₹{planData.pricePerDelivery}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Monthly total</span>
                        <span>₹{planData.monthlyTotal}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold flex items-center justify-center ${
                  canProceed()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentStep === 4 ? 'Proceed to Checkout' : 'Continue'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
