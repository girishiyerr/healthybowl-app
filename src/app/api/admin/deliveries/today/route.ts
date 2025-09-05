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

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get today's date range
    const today = new Date()
    const startOfDay = new Date(today)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(today)
    endOfDay.setHours(23, 59, 59, 999)

    // Fetch today's deliveries
    const deliveries = await prisma.delivery.findMany({
      where: {
        scheduledFor: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        subscription: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            address: {
              select: {
                line1: true,
                city: true,
                pincode: true,
              },
            },
          },
        },
      },
      orderBy: {
        scheduledFor: 'asc',
      },
    })

    return NextResponse.json({ deliveries })
  } catch (error) {
    console.error('Error fetching today\'s deliveries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deliveries' },
      { status: 500 }
    )
  }
}
