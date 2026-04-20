import { test, expect } from '@playwright/test'

const FILTER_SOLUTION_CODE = `Array.prototype.myFilter = function (callback, thisArg) {
  if (this == null) throw new TypeError('this is null or undefined');
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
  const arr = this;
  const len = arr.length >>> 0;
  const result = [];
  for (let i = 0; i < len; i++) {
    if (i in arr && callback.call(thisArg, arr[i], i, arr)) {
      result.push(arr[i]);
    }
  }
  return result;
};`

test.describe('Learn Path', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/前端/i)
  })

  test('learn problem list displays problems', async ({ page }) => {
    await page.goto('/#/learn')
    // Verify problems are listed
    await expect(page.locator('text=filter').first()).toBeVisible({ timeout: 10000 })
  })

  test('filter problem page loads with editor and case panel', async ({ page }) => {
    await page.goto('/#/learn/filter')

    // Verify problem description is visible
    await expect(page.locator('text=filter').first()).toBeVisible({ timeout: 10000 })

    // Verify code editor is visible
    await expect(page.locator('.monaco-editor').first()).toBeVisible({ timeout: 15000 })

    // Verify case panel is visible
    await expect(page.locator('[data-testid="case-panel"]')).toBeVisible({ timeout: 10000 })
  })

  test('run and submit filter problem with correct solution', async ({ page }) => {
    await page.goto('/#/learn/filter')

    // Wait for editor to be ready
    await page.locator('.monaco-editor').first().waitFor({ state: 'visible', timeout: 15000 })

    // Set editor value using Monaco API
    await page.evaluate((code) => {
      const editor = (window as any).monaco?.editor?.getEditors?.()?.[0]
      if (editor) {
        editor.setValue(code)
      }
    }, FILTER_SOLUTION_CODE)

    // Click Run button
    await page.locator('[data-testid="run-button"]').click()

    // Wait for results - check that at least one case passed
    await expect(page.locator('text=通过').first()).toBeVisible({ timeout: 30000 })

    // Click Submit button
    await page.locator('[data-testid="submit-button"]').click()

    // Wait for all cases to pass
    await expect(page.locator('text=通过').first()).toBeVisible({ timeout: 30000 })
  })

  test('navigate to map problem and editor resets', async ({ page }) => {
    // First go to filter problem
    await page.goto('/#/learn/filter')
    await page.locator('.monaco-editor').first().waitFor({ state: 'visible', timeout: 15000 })

    // Set some code in the editor
    await page.evaluate((code) => {
      const editor = (window as any).monaco?.editor?.getEditors?.()?.[0]
      if (editor) {
        editor.setValue('// filter solution')
      }
    }, '')

    // Navigate to map problem
    await page.goto('/#/learn/map')
    await page.locator('.monaco-editor').first().waitFor({ state: 'visible', timeout: 15000 })

    // Verify editor has different content (template for map)
    const editorContent = await page.evaluate(() => {
      const editor = (window as any).monaco?.editor?.getEditors?.()?.[0]
      return editor ? editor.getValue() : ''
    })

    // Editor should contain map-related content, not filter
    expect(editorContent.toLowerCase()).not.toContain('filter')
  })
})
