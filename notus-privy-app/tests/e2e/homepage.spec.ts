/**
 * 🧪 Homepage E2E Tests
 * Testes end-to-end para a página principal
 */

import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check if the main title is visible
    await expect(page.getByText('Notus DX Research')).toBeVisible()
    
    // Check if authentication options are visible
    await expect(page.getByText('Choose your authentication method:')).toBeVisible()
    await expect(page.getByText('Sign In with Privy')).toBeVisible()
    await expect(page.getByText('Sign In with Web3Auth')).toBeVisible()
    await expect(page.getByText('Connect MetaMask')).toBeVisible()
  })

  test('should navigate to Web3Auth page', async ({ page }) => {
    await page.goto('/')
    
    // Click on Web3Auth link
    await page.getByText('Sign In with Web3Auth').click()
    
    // Check if we're on the Web3Auth page
    await expect(page).toHaveURL('/web3auth')
    await expect(page.getByText('Web3Auth + Notus API Integration')).toBeVisible()
  })

  test('should navigate to MetaMask page', async ({ page }) => {
    await page.goto('/')
    
    // Click on MetaMask link
    await page.getByText('Connect MetaMask').click()
    
    // Check if we're on the MetaMask page
    await expect(page).toHaveURL('/metamask')
    await expect(page.getByText('MetaMask + Notus API Integration')).toBeVisible()
  })

  test('should navigate to Webhooks page', async ({ page }) => {
    await page.goto('/')
    
    // Click on Webhooks link
    await page.getByText('Configure Webhooks').click()
    
    // Check if we're on the Webhooks page
    await expect(page).toHaveURL('/webhooks')
    await expect(page.getByText('🔗 Webhooks Configuration')).toBeVisible()
  })

  test('should navigate to Analytics page', async ({ page }) => {
    await page.goto('/')
    
    // Click on Analytics link
    await page.getByText('View Analytics').click()
    
    // Check if we're on the Analytics page
    await expect(page).toHaveURL('/analytics')
    await expect(page.getByText('📊 Analytics Dashboard')).toBeVisible()
  })

  test('should navigate to KYC page', async ({ page }) => {
    await page.goto('/')
    
    // Click on KYC link
    await page.getByText('KYC & Ramp').click()
    
    // Check if we're on the KYC page
    await expect(page).toHaveURL('/kyc')
    await expect(page.getByText('🆔 KYC & Ramp')).toBeVisible()
  })

  test('should have responsive design', async ({ page }) => {
    await page.goto('/')
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText('Notus DX Research')).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByText('Notus DX Research')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByText('Notus DX Research')).toBeVisible()
  })
})
