import { prisma } from './db'

export interface PricingInfo {
  costPerBox: number
  pricePerBox: number
}

export interface DeliveryPricing {
  fruitsCost: number
  sproutsCost: number
  fruitsPrice: number
  sproutsPrice: number
  totalCost: number
  totalPrice: number
  margin: number
}

/**
 * Get current pricing for a product
 */
export async function getProductPricing(
  productName: string,
  sizeMl: number
): Promise<PricingInfo | null> {
  const pricing = await prisma.pricing.findFirst({
    where: {
      product: {
        name: productName,
        sizeMl: sizeMl,
        active: true,
      },
      effectiveFrom: {
        lte: new Date(),
      },
    },
    orderBy: {
      effectiveFrom: 'desc',
    },
    include: {
      product: true,
    },
  })

  if (!pricing) return null

  return {
    costPerBox: pricing.costPerBox,
    pricePerBox: pricing.pricePerBox,
  }
}

/**
 * Calculate pricing for a delivery
 */
export async function calculateDeliveryPricing(
  sizeMl: number,
  mixFruits: number,
  mixSprouts: number
): Promise<DeliveryPricing> {
  const [fruitsPricing, sproutsPricing] = await Promise.all([
    getProductPricing('Fruits', sizeMl),
    getProductPricing('Sprouts', sizeMl),
  ])

  if (!fruitsPricing || !sproutsPricing) {
    throw new Error('Pricing not found for products')
  }

  const fruitsCost = fruitsPricing.costPerBox * mixFruits
  const sproutsCost = sproutsPricing.costPerBox * mixSprouts
  const fruitsPrice = fruitsPricing.pricePerBox * mixFruits
  const sproutsPrice = sproutsPricing.pricePerBox * mixSprouts

  const totalCost = fruitsCost + sproutsCost
  const totalPrice = fruitsPrice + sproutsPrice
  const margin = totalPrice - totalCost

  return {
    fruitsCost,
    sproutsCost,
    fruitsPrice,
    sproutsPrice,
    totalCost,
    totalPrice,
    margin,
  }
}

/**
 * Calculate subscription pricing with plan discounts
 */
export async function calculateSubscriptionPricing(
  planId: string,
  sizeMl: number,
  mixFruits: number,
  mixSprouts: number
): Promise<{
  pricePerDelivery: number
  monthlyTotal: number
  savings: number
}> {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  })

  if (!plan) {
    throw new Error('Plan not found')
  }

  const deliveryPricing = await calculateDeliveryPricing(sizeMl, mixFruits, mixSprouts)
  
  // Apply monthly discount (10% for monthly plans)
  const discount = plan.name === 'Monthly' ? 0.1 : 0
  const pricePerDelivery = Math.round(deliveryPricing.totalPrice * (1 - discount))
  
  const monthlyTotal = pricePerDelivery * plan.deliveriesPerCycle
  const savings = Math.round(deliveryPricing.totalPrice * plan.deliveriesPerCycle * discount)

  return {
    pricePerDelivery,
    monthlyTotal,
    savings,
  }
}

/**
 * Get all active pricing for admin
 */
export async function getAllPricing() {
  return await prisma.pricing.findMany({
    where: {
      effectiveFrom: {
        lte: new Date(),
      },
    },
    include: {
      product: true,
    },
    orderBy: {
      product: {
        name: 'asc',
      },
    },
  })
}

/**
 * Update pricing for a product
 */
export async function updatePricing(
  productId: string,
  costPerBox: number,
  pricePerBox: number
) {
  return await prisma.pricing.create({
    data: {
      productId,
      costPerBox,
      pricePerBox,
      effectiveFrom: new Date(),
    },
  })
}
