import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the plan builder
    await page.goto('/plan')
  })

  test('should complete checkout flow successfully', async ({ page }) => {
    // Step 1: Choose Weekly Plan
    await page.click('[data-testid="plan-weekly"]')
    await page.click('button:has-text("Continue")')

    // Step 2: Choose Box Size
    await page.click('[data-testid="size-250"]')
    await page.click('button:has-text("Continue")')

    // Step 3: Set Mix
    await page.click('button:has-text("+")') // Increase fruits
    await page.click('button:has-text("Continue")')

    // Step 4: Review
    await expect(page.locator('text=Weekly')).toBeVisible()
    await expect(page.locator('text=250ml')).toBeVisible()
    await page.click('button:has-text("Proceed to Checkout")')

    // Checkout page should load
    await expect(page).toHaveURL(/\/checkout/)
    await expect(page.locator('h2:has-text("Delivery Address")')).toBeVisible()
  })

  test('should validate required fields in checkout', async ({ page }) => {
    // Navigate to checkout directly
    await page.goto('/checkout?planId=weekly&sizeMl=250&mixFruits=1&mixSprouts=1&pricePerDelivery=100&monthlyTotal=600')

    // Try to proceed without filling address
    const payButton = page.locator('button:has-text("Pay")')
    await expect(payButton).toBeDisabled()

    // Fill required address fields
    await page.fill('input[placeholder*="House/Flat number"]', '123 Main St')
    await page.fill('input[placeholder*="City"]', 'Mumbai')
    await page.fill('input[placeholder*="State"]', 'Maharashtra')
    await page.fill('input[placeholder*="Pincode"]', '400001')

    // Pay button should now be enabled
    await expect(payButton).toBeEnabled()
  })

  test('should show order summary correctly', async ({ page }) => {
    await page.goto('/checkout?planId=weekly&planName=Weekly&sizeMl=250&mixFruits=2&mixSprouts=1&pricePerDelivery=150&monthlyTotal=900')

    // Check order summary
    await expect(page.locator('text=Weekly')).toBeVisible()
    await expect(page.locator('text=250ml')).toBeVisible()
    await expect(page.locator('text=2 fruits + 1 sprouts')).toBeVisible()
    await expect(page.locator('text=₹150')).toBeVisible()
    await expect(page.locator('text=₹900')).toBeVisible()
  })
})
