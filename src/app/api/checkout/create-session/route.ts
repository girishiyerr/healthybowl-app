import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Razorpay from 'razorpay'
import { prisma } from '@/lib/db'
import { calculateSubscriptionPricing } from '@/lib/pricing'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      planId,
      sizeMl,
      mixFruits,
      mixSprouts,
      address,
      startDate,
      timeSlot,
    } = body

    // Validate required fields
    if (!planId || !sizeMl || !mixFruits || !mixSprouts || !address || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get plan details
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    })

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Calculate pricing
    const pricing = await calculateSubscriptionPricing(
      planId,
      sizeMl,
      mixFruits,
      mixSprouts
    )

    // Create or get address
    let addressRecord = await prisma.address.findFirst({
      where: {
        userId: user.id,
        line1: address.line1,
        city: address.city,
        pincode: address.pincode,
      },
    })

    if (!addressRecord) {
      addressRecord = await prisma.address.create({
        data: {
          userId: user.id,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          isDefault: true, // Set as default for new subscriptions
        },
      })
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: pricing.monthlyTotal * 100, // Convert to paise
      currency: 'INR',
      receipt: `sub_${Date.now()}`,
      notes: {
        userId: user.id,
        planId,
        sizeMl: sizeMl.toString(),
        mixFruits: mixFruits.toString(),
        mixSprouts: mixSprouts.toString(),
        addressId: addressRecord.id,
        startDate,
        timeSlot,
      },
    })

    return NextResponse.json({
      sessionId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
