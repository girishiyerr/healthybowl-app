import { prisma } from './db'
import { addDays, startOfWeek, isWeekend } from 'date-fns'

/**
 * Generate delivery schedule for a subscription
 */
export async function generateDeliverySchedule(
  subscriptionId: string,
  startDate: Date,
  deliveriesPerCycle: number
) {
  const deliveries = []
  let currentDate = new Date(startDate)
  let deliveryCount = 0

  // Skip to next Monday if start date is weekend
  if (isWeekend(currentDate)) {
    currentDate = startOfWeek(addDays(currentDate, 1), { weekStartsOn: 1 })
  }

  while (deliveryCount < deliveriesPerCycle) {
    // Skip Sundays (delivery only Mon-Sat)
    if (currentDate.getDay() !== 0) {
      deliveries.push({
        subscriptionId,
        scheduledFor: currentDate,
        status: 'SCHEDULED' as const,
        fruitsBoxes: 0, // Will be updated from subscription
        sproutsBoxes: 0, // Will be updated from subscription
      })
      deliveryCount++
    }
    currentDate = addDays(currentDate, 1)
  }

  return await prisma.delivery.createMany({
    data: deliveries,
  })
}

/**
 * Get deliveries for a specific date
 */
export async function getDeliveriesForDate(date: Date) {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  return await prisma.delivery.findMany({
    where: {
      scheduledFor: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: 'SCHEDULED',
    },
    include: {
      subscription: {
        include: {
          user: true,
          address: true,
          plan: true,
        },
      },
    },
  })
}

/**
 * Group deliveries by pincode for route planning
 */
export async function groupDeliveriesByRoute(date: Date) {
  const deliveries = await getDeliveriesForDate(date)
  
  const routeGroups = deliveries.reduce((groups, delivery) => {
    const pincode = delivery.subscription.address.pincode
    if (!groups[pincode]) {
      groups[pincode] = []
    }
    groups[pincode].push(delivery)
    return groups
  }, {} as Record<string, typeof deliveries>)

  return routeGroups
}

/**
 * Pause a subscription
 */
export async function pauseSubscription(subscriptionId: string) {
  return await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status: 'PAUSED' },
  })
}

/**
 * Resume a subscription
 */
export async function resumeSubscription(subscriptionId: string) {
  return await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status: 'ACTIVE' },
  })
}

/**
 * Skip next delivery
 */
export async function skipNextDelivery(subscriptionId: string) {
  const nextDelivery = await prisma.delivery.findFirst({
    where: {
      subscriptionId,
      status: 'SCHEDULED',
    },
    orderBy: {
      scheduledFor: 'asc',
    },
  })

  if (nextDelivery) {
    return await prisma.delivery.update({
      where: { id: nextDelivery.id },
      data: { status: 'SKIPPED' },
    })
  }

  return null
}

/**
 * Reschedule a delivery
 */
export async function rescheduleDelivery(
  deliveryId: string,
  newDate: Date
) {
  return await prisma.delivery.update({
    where: { id: deliveryId },
    data: { scheduledFor: newDate },
  })
}

/**
 * Mark delivery as completed
 */
export async function markDeliveryCompleted(deliveryId: string) {
  return await prisma.delivery.update({
    where: { id: deliveryId },
    data: { status: 'DELIVERED' },
  })
}
