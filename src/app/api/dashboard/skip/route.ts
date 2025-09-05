import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify subscription belongs to user
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: user.id,
      },
    })

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    // Find next scheduled delivery
    const nextDelivery = await prisma.delivery.findFirst({
      where: {
        subscriptionId: subscriptionId,
        status: 'SCHEDULED',
        scheduledFor: {
          gte: new Date(),
        },
      },
      orderBy: {
        scheduledFor: 'asc',
      },
    })

    if (!nextDelivery) {
      return NextResponse.json({ error: 'No upcoming delivery found' }, { status: 404 })
    }

    // Skip the delivery
    await prisma.delivery.update({
      where: { id: nextDelivery.id },
      data: { status: 'SKIPPED' },
    })

    return NextResponse.json({ 
      success: true,
      message: 'Next delivery skipped successfully'
    })
  } catch (error) {
    console.error('Error skipping delivery:', error)
    return NextResponse.json(
      { error: 'Failed to skip delivery' },
      { status: 500 }
    )
  }
}
