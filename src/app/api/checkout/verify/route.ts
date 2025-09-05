import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { prisma } from '@/lib/db'
import { generateDeliverySchedule } from '@/lib/schedule'
import { sendOrderConfirmation } from '@/lib/notifications'

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
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      sizeMl,
      mixFruits,
      mixSprouts,
      address,
      startDate,
      timeSlot,
    } = body

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
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
          isDefault: true,
        },
      })
    }

    // Calculate next billing date
    const startDateObj = new Date(startDate)
    const nextBillingDate = new Date(startDateObj)
    nextBillingDate.setDate(nextBillingDate.getDate() + plan.cycleDays)

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        addressId: addressRecord.id,
        startDate: startDateObj,
        status: 'ACTIVE',
        sizeMl,
        mixFruits,
        mixSprouts,
        pricePerDelivery: 0, // Will be calculated
        nextBillingDate,
      },
    })

    // Generate delivery schedule
    await generateDeliverySchedule(
      subscription.id,
      startDateObj,
      plan.deliveriesPerCycle
    )

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        subscriptionId: subscription.id,
        amount: 0, // Will be calculated
        currency: 'INR',
        paid: true,
        gateway: 'razorpay',
        gatewayRef: razorpay_payment_id,
      },
    })

    // Update subscription with calculated pricing
    const totalAmount = mixFruits * 50 + mixSprouts * 50 // Base pricing
    const discount = plan.name === 'Monthly' ? 0.1 : 0
    const finalAmount = Math.round(totalAmount * (1 - discount) * plan.deliveriesPerCycle)

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        pricePerDelivery: Math.round(totalAmount * (1 - discount)),
      },
    })

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        amount: finalAmount,
      },
    })

    // Send confirmation email
    try {
      await sendOrderConfirmation(user.email, {
        planName: plan.name,
        sizeMl,
        mixFruits,
        mixSprouts,
        pricePerDelivery: Math.round(totalAmount * (1 - discount)),
        startDate: startDateObj.toLocaleDateString(),
        address: `${address.line1}, ${address.city}, ${address.state} - ${address.pincode}`,
      })
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
    }

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      invoiceId: invoice.id,
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}
