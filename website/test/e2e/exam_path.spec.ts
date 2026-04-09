import { test, expect } from '@playwright/test'

const SIMPLE_SOLUTION_CODE = `function solution() {
  return 42;
}`

test.describe('Exam Path', () => {
  test('exam entry page loads', async ({ page }) => {
    await page.goto('/exam')
    
    // Verify exam entry page elements
    await expect(page.locator('text=模拟考试').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button:has-text("开始考试")')).toBeVisible({ timeout: 10000 })
    
    // Verify rules section is visible
    await expect(page.locator('text=当前考试规则').first()).toBeVisible({ timeout: 10000 })
    
    // Verify available questions section
    await expect(page.locator('text=可用题库').first()).toBeVisible({ timeout: 10000 })
  })

  test('start exam and verify session loads', async ({ page }) => {
    await page.goto('/exam')
    
    // Click start exam button
    await page.locator('button:has-text("开始考试")').click()
    
    // Verify exam session page loads with code editor
    await expect(page.locator('[data-testid="case-panel"]')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('.monaco-editor').first()).toBeVisible({ timeout: 15000 })
    
    // Verify navigation buttons are present
    await expect(page.locator('button:has-text("运行")').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button:has-text("提交")').first()).toBeVisible({ timeout: 10000 })
  })

  test('run code in exam session', async ({ page }) => {
    await page.goto('/exam')
    
    // Click start exam button
    await page.locator('button:has-text("开始考试")').click()
    
    // Wait for exam session to load
    await page.locator('.monaco-editor').first().waitFor({ state: 'visible', timeout: 15000 })
    
    // Set some solution code
    await page.evaluate((code) => {
      const editor = (window as any).monaco?.editor?.getEditors?.()?.[0]
      if (editor) {
        editor.setValue(code)
      }
    }, SIMPLE_SOLUTION_CODE)
    
    // Click Run button
    await page.locator('[data-testid="run-button"]').click()
    
    // Wait for results to appear
    await expect(page.locator('[data-testid="case-panel"]')).toBeVisible({ timeout: 15000 })
  })

  test('submit problem and navigate between problems', async ({ page }) => {
    await page.goto('/exam')
    
    // Click start exam button
    await page.locator('button:has-text("开始考试")').click()
    
    // Wait for exam session to load
    await page.locator('.monaco-editor').first().waitFor({ state: 'visible', timeout: 15000 })
    
    // Set some solution code
    await page.evaluate((code) => {
      const editor = (window as any).monaco?.editor?.getEditors?.()?.[0]
      if (editor) {
        editor.setValue(code)
      }
    }, SIMPLE_SOLUTION_CODE)
    
    // Click Submit button
    await page.locator('[data-testid="submit-button"]').click()
    
    // Wait for submission to complete
    await expect(page.locator('[data-testid="case-panel"]')).toBeVisible({ timeout: 15000 })
    
    // Try to navigate to next problem if available
    const nextButton = page.locator('button:has-text("下一题")')
    const isEnabled = await nextButton.isEnabled().catch(() => false)
    if (isEnabled) {
      await nextButton.click()
      await page.locator('.monaco-editor').first().waitFor({ state: 'visible', timeout: 15000 })
      
      // Verify we're on a different problem
      await expect(page.locator('.monaco-editor').first()).toBeVisible({ timeout: 15000 })
    }
  })

  test('start exam and verify timer', async ({ page }) => {
    await page.goto('/exam')
    
    // Click start exam button
    await page.locator('button:has-text("开始考试")').click()
    
    // Wait for exam session to load
    await page.locator('.monaco-editor').first().waitFor({ state: 'visible', timeout: 15000 })
    
    // Verify timer is visible in header (format: MM:SS)
    await expect(page.locator('text=/\\d{2}:\\d{2}/').first()).toBeVisible({ timeout: 10000 })
    
    // Set some solution code
    await page.evaluate((code) => {
      const editor = (window as any).monaco?.editor?.getEditors?.()?.[0]
      if (editor) {
        editor.setValue(code)
      }
    }, SIMPLE_SOLUTION_CODE)
    
    // Handle confirmation dialog when submitting
    page.on('dialog', async dialog => {
      if (dialog.message().includes('交卷') || dialog.message().includes('确认')) {
        await dialog.accept()
      }
    })
    
    // Click Submit button
    await page.locator('[data-testid="submit-button"]').click()
    
    // Wait a moment for submission
    await expect(page.locator('[data-testid="case-panel"]')).toBeVisible({ timeout: 15000 })
  })
})
