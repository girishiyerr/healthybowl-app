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

    // Get current month date range
    const currentMonth = new Date()
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    // Fetch stats in parallel
    const [
      activeSubscriptions,
      totalCustomers,
      todaysDeliveries,
      monthlyRevenue,
    ] = await Promise.all([
      // Active subscriptions count
      prisma.subscription.count({
        where: { status: 'ACTIVE' },
      }),
      
      // Total customers count
      prisma.user.count({
        where: { role: 'CUSTOMER' },
      }),
      
      // Today's deliveries count
      prisma.delivery.count({
        where: {
          scheduledFor: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: 'SCHEDULED',
        },
      }),
      
      // Monthly revenue calculation
      prisma.invoice.aggregate({
        where: {
          paid: true,
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ])

    return NextResponse.json({
      activeSubscriptions,
      totalCustomers,
      todaysDeliveries,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
