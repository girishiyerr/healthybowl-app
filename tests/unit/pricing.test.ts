import { calculateDeliveryPricing } from '@/lib/pricing'

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    pricing: {
      findFirst: jest.fn(),
    },
  },
}))

describe('Pricing Calculations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should calculate delivery pricing correctly', async () => {
    const { prisma } = require('@/lib/db')
    
    // Mock pricing data
    prisma.pricing.findFirst
      .mockResolvedValueOnce({
        costPerBox: 27,
        pricePerBox: 50,
      })
      .mockResolvedValueOnce({
        costPerBox: 22,
        pricePerBox: 50,
      })

    const result = await calculateDeliveryPricing(250, 2, 1)

    expect(result).toEqual({
      fruitsCost: 54, // 2 * 27
      sproutsCost: 22, // 1 * 22
      fruitsPrice: 100, // 2 * 50
      sproutsPrice: 50, // 1 * 50
      totalCost: 76, // 54 + 22
      totalPrice: 150, // 100 + 50
      margin: 74, // 150 - 76
    })
  })

  it('should handle missing pricing data', async () => {
    const { prisma } = require('@/lib/db')
    
    prisma.pricing.findFirst.mockResolvedValue(null)

    await expect(calculateDeliveryPricing(250, 1, 1))
      .rejects.toThrow('Pricing not found for products')
  })
})
