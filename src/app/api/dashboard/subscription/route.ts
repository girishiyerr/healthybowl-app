import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ['ACTIVE', 'PAUSED'] },
      },
      include: {
        plan: true,
        address: true,
        deliveries: {
          where: {
            status: 'SCHEDULED',
            scheduledFor: {
              gte: new Date(),
            },
          },
          orderBy: {
            scheduledFor: 'asc',
          },
          take: 10,
        },
      },
    })

    if (!subscription) {
      return NextResponse.json({ subscription: null, upcomingDeliveries: [] })
    }

    // Get upcoming deliveries
    const upcomingDeliveries = await prisma.delivery.findMany({
      where: {
        subscriptionId: subscription.id,
        status: 'SCHEDULED',
        scheduledFor: {
          gte: new Date(),
        },
      },
      orderBy: {
        scheduledFor: 'asc',
      },
      take: 10,
    })

    return NextResponse.json({
      subscription,
      upcomingDeliveries,
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}
