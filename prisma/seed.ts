import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create subscription plans
  const weeklyPlan = await prisma.subscriptionPlan.upsert({
    where: { name: 'Weekly' },
    update: {},
    create: {
      name: 'Weekly',
      deliveriesPerCycle: 6,
      cycleDays: 7,
      active: true,
    },
  })

  const monthlyPlan = await prisma.subscriptionPlan.upsert({
    where: { name: 'Monthly' },
    update: {},
    create: {
      name: 'Monthly',
      deliveriesPerCycle: 24,
      cycleDays: 28,
      active: true,
    },
  })

  console.log('✅ Created subscription plans')

  // Create products
  const fruits250 = await prisma.product.upsert({
    where: { name_sizeMl: { name: 'Fruits', sizeMl: 250 } },
    update: {},
    create: {
      name: 'Fruits',
      sizeMl: 250,
      active: true,
    },
  })

  const fruits500 = await prisma.product.upsert({
    where: { name_sizeMl: { name: 'Fruits', sizeMl: 500 } },
    update: {},
    create: {
      name: 'Fruits',
      sizeMl: 500,
      active: true,
    },
  })

  const sprouts250 = await prisma.product.upsert({
    where: { name_sizeMl: { name: 'Sprouts', sizeMl: 250 } },
    update: {},
    create: {
      name: 'Sprouts',
      sizeMl: 250,
      active: true,
    },
  })

  const sprouts500 = await prisma.product.upsert({
    where: { name_sizeMl: { name: 'Sprouts', sizeMl: 500 } },
    update: {},
    create: {
      name: 'Sprouts',
      sizeMl: 500,
      active: true,
    },
  })

  console.log('✅ Created products')

  // Create pricing
  const pricingData = [
    { productId: fruits250.id, costPerBox: 27, pricePerBox: 50 },
    { productId: fruits500.id, costPerBox: 38, pricePerBox: 80 },
    { productId: sprouts250.id, costPerBox: 22, pricePerBox: 50 },
    { productId: sprouts500.id, costPerBox: 32, pricePerBox: 80 },
  ]

  for (const pricing of pricingData) {
    await prisma.pricing.upsert({
      where: {
        productId_effectiveFrom: {
          productId: pricing.productId,
          effectiveFrom: new Date('2024-01-01'),
        },
      },
      update: {},
      create: {
        productId: pricing.productId,
        costPerBox: pricing.costPerBox,
        pricePerBox: pricing.pricePerBox,
        effectiveFrom: new Date('2024-01-01'),
      },
    })
  }

  console.log('✅ Created pricing')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@healthybowl.com' },
    update: {},
    create: {
      email: 'admin@healthybowl.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  console.log('✅ Created admin user')

  // Create sample announcements
  await prisma.announcement.upsert({
    where: { id: 'welcome-announcement' },
    update: {},
    create: {
      id: 'welcome-announcement',
      title: 'Welcome to HealthyBowl!',
      content: 'Get fresh fruits and sprouts delivered daily to your doorstep. Start your healthy journey today!',
      active: true,
    },
  })

  // Create sample seasonal fruits
  const seasonalFruits = [
    { name: 'Mango', image: '/images/mango.jpg' },
    { name: 'Watermelon', image: '/images/watermelon.jpg' },
    { name: 'Papaya', image: '/images/papaya.jpg' },
    { name: 'Banana', image: '/images/banana.jpg' },
  ]

  for (const fruit of seasonalFruits) {
    await prisma.seasonalFruit.upsert({
      where: { name: fruit.name },
      update: {},
      create: {
        name: fruit.name,
        image: fruit.image,
        active: true,
      },
    })
  }

  console.log('✅ Created seasonal fruits')

  console.log('🎉 Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
