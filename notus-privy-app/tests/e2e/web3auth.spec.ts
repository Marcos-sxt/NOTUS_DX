/**
 * 🧪 Web3Auth E2E Tests
 * Testes end-to-end para a página Web3Auth
 */

import { test, expect } from '@playwright/test'

test.describe('Web3Auth Page', () => {
  test('should load Web3Auth page successfully', async ({ page }) => {
    await page.goto('/web3auth')
    
    // Check if the main title is visible
    await expect(page.getByText('Web3Auth + Notus API Integration')).toBeVisible()
    
    // Check if login button is visible
    await expect(page.getByText('Sign In with Web3Auth')).toBeVisible()
    
    // Check if back link is visible
    await expect(page.getByText('← Back to Privy')).toBeVisible()
  })

  test('should navigate back to main page', async ({ page }) => {
    await page.goto('/web3auth')
    
    // Click on back link
    await page.getByText('← Back to Privy').click()
    
    // Check if we're back on the main page
    await expect(page).toHaveURL('/')
    await expect(page.getByText('Notus DX Research')).toBeVisible()
  })

  test('should show login form when not authenticated', async ({ page }) => {
    await page.goto('/web3auth')
    
    // Check if login form elements are visible
    await expect(page.getByText('Teste legítimo de autenticação social com smart wallets')).toBeVisible()
    await expect(page.getByText('Sign In with Web3Auth')).toBeVisible()
  })

  test('should handle login button click', async ({ page }) => {
    await page.goto('/web3auth')
    
    // Click on login button
    await page.getByText('Sign In with Web3Auth').click()
    
    // Note: In a real test, we would mock the Web3Auth response
    // For now, we just verify the button is clickable
    await expect(page.getByText('Sign In with Web3Auth')).toBeVisible()
  })

  test('should have proper styling and layout', async ({ page }) => {
    await page.goto('/web3auth')
    
    // Check if the page has the correct background gradient
    const body = page.locator('body')
    await expect(body).toHaveClass(/bg-gradient-to-br/)
    
    // Check if the main container is visible
    await expect(page.locator('.max-w-4xl')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/web3auth')
    
    // Check if content is visible on mobile
    await expect(page.getByText('Web3Auth + Notus API Integration')).toBeVisible()
    await expect(page.getByText('Sign In with Web3Auth')).toBeVisible()
  })
})
