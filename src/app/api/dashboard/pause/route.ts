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

    // Toggle pause/resume
    const newStatus = subscription.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED'

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: newStatus },
    })

    return NextResponse.json({ 
      success: true, 
      status: newStatus,
      message: newStatus === 'PAUSED' ? 'Subscription paused' : 'Subscription resumed'
    })
  } catch (error) {
    console.error('Error pausing subscription:', error)
    return NextResponse.json(
      { error: 'Failed to pause subscription' },
      { status: 500 }
    )
  }
}
