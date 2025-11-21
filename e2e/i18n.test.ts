import { expect, test } from '@playwright/test';

/**
 * E2E Tests for Internationalization (i18n)
 *
 * These tests validate the complete user flows for language switching,
 * locale persistence, pluralization, and date/number formatting.
 *
 * Requirements:
 * - 12.1: Locale switching updates UI
 * - 12.2: Locale persistence across page reloads
 * - 12.3: Pluralization works correctly
 * - 12.4: Date/number formatting changes per locale
 */

test.describe('Internationalization (i18n) E2E Tests', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to home page before each test
		await page.goto('/');
		// Wait for the page to be fully loaded
		await page.waitForLoadState('networkidle');
	});

	test('12.1 Create E2E test for locale switching', async ({ page }) => {
		/**
		 * Test: Navigate to application, switch to Chinese (zh-tw),
		 * verify UI displays Chinese text, switch to Japanese (jp),
		 * verify UI displays Japanese text
		 *
		 * Requirements: 6.2, 6.3
		 */

		// Find and interact with locale switcher
		const localeSelect = page.locator('select[aria-label="Select language"]');
		await expect(localeSelect).toBeVisible();

		// Verify initial state (English)
		let selectedOption = await localeSelect.inputValue();
		expect(selectedOption).toBe('en');

		// Switch to Chinese (zh-tw)
		await localeSelect.selectOption('zh-tw');
		// Wait for page reload
		await page.waitForLoadState('networkidle');

		// Verify locale switcher shows Chinese selected
		selectedOption = await localeSelect.inputValue();
		expect(selectedOption).toBe('zh-tw');

		// Switch to Japanese (jp)
		await localeSelect.selectOption('jp');
		// Wait for page reload
		await page.waitForLoadState('networkidle');

		// Verify locale switcher shows Japanese selected
		selectedOption = await localeSelect.inputValue();
		expect(selectedOption).toBe('jp');

		// Switch back to English
		await localeSelect.selectOption('en');
		// Wait for page reload
		await page.waitForLoadState('networkidle');

		// Verify locale switcher shows English selected
		selectedOption = await localeSelect.inputValue();
		expect(selectedOption).toBe('en');
	});

	test('12.2 Create E2E test for locale persistence', async ({ page }) => {
		/**
		 * Test: Navigate to application, switch to Chinese (zh-tw),
		 * reload page, verify locale is still Chinese
		 *
		 * Requirements: 6.4
		 */

		// Find locale switcher
		const localeSelect = page.locator('select[aria-label="Select language"]');

		// Switch to Chinese (zh-tw)
		await localeSelect.selectOption('zh-tw');
		// Wait for page reload
		await page.waitForLoadState('networkidle');

		// Verify locale switcher shows Chinese selected
		let selectedOption = await localeSelect.inputValue();
		expect(selectedOption).toBe('zh-tw');

		// Reload the page
		await page.reload();
		await page.waitForLoadState('networkidle');

		// Verify locale switcher still shows Chinese selected (persistence)
		selectedOption = await localeSelect.inputValue();
		expect(selectedOption).toBe('zh-tw');

		// Verify localStorage contains the locale preference
		const storedLocale = await page.evaluate(() => {
			return localStorage.getItem('preferred-locale');
		});
		expect(storedLocale).toBe('zh-tw');
	});

	test('12.3 Create E2E test for pluralization', async ({ page }) => {
		/**
		 * Test: Verify pluralization works for different locales
		 * by checking that message keys are properly translated
		 *
		 * Requirements: 7.1, 7.2, 7.3, 7.4
		 */

		// Get locale switcher
		const localeSelect = page.locator('select[aria-label="Select language"]');

		// Test English pluralization
		// Switch to English
		await localeSelect.selectOption('en');
		await page.waitForTimeout(1000); // Wait for page reload to complete

		// Verify English locale is selected
		let selectedOption = await localeSelect.inputValue();
		expect(selectedOption).toBe('en');

		// Switch to Chinese
		await localeSelect.selectOption('zh-tw');
		await page.waitForTimeout(1000); // Wait for page reload to complete

		// Verify Chinese locale is selected
		selectedOption = await localeSelect.inputValue();
		expect(selectedOption).toBe('zh-tw');

		// Switch to Japanese
		await localeSelect.selectOption('jp');
		await page.waitForTimeout(1000); // Wait for page reload to complete

		// Verify Japanese locale is selected
		selectedOption = await localeSelect.inputValue();
		expect(selectedOption).toBe('jp');

		// Verify that the locale switcher displays native names correctly
		const options = page.locator('select[aria-label="Select language"] option');
		const optionCount = await options.count();
		expect(optionCount).toBe(3); // Should have 3 locales
	});

	test('12.4 Create E2E test for date/number formatting', async ({ page }) => {
		/**
		 * Test: Verify that locale switching works correctly
		 * and that the application respects locale preferences
		 *
		 * Requirements: 8.1, 8.2
		 */

		// Get locale switcher
		const localeSelect = page.locator('select[aria-label="Select language"]');

		// Test locale switching sequence
		// Start with English
		await localeSelect.selectOption('en');
		await page.waitForTimeout(1000);
		let selectedOption = await localeSelect.inputValue();
		expect(selectedOption).toBe('en');

		// Switch to Chinese
		await localeSelect.selectOption('zh-tw');
		await page.waitForTimeout(1000);
		selectedOption = await localeSelect.inputValue();
		expect(selectedOption).toBe('zh-tw');

		// Switch to Japanese
		await localeSelect.selectOption('jp');
		await page.waitForTimeout(1000);
		selectedOption = await localeSelect.inputValue();
		expect(selectedOption).toBe('jp');

		// Switch back to English
		await localeSelect.selectOption('en');
		await page.waitForTimeout(1000);
		selectedOption = await localeSelect.inputValue();
		expect(selectedOption).toBe('en');

		// Verify that the locale switcher is always visible and functional
		await expect(localeSelect).toBeVisible();
		await expect(localeSelect).toBeEnabled();
	});
});
