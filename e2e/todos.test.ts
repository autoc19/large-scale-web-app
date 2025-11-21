import { expect, test } from '@playwright/test';

/**
 * E2E Tests for Todo Management
 *
 * These tests validate the complete user flows for todo management,
 * including creation, toggling, deletion, error handling, and form validation.
 */

test.describe('Todo Management E2E Tests', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to todos page before each test
		await page.goto('/todos');
		// Wait for the page to be fully loaded
		await page.waitForLoadState('networkidle');
	});

	test('12.1 Create E2E test for todo creation', async ({ page }) => {
		/**
		 * Test: Navigate to /todos page, fill in todo title, submit form, verify todo appears in list
		 * Requirements: Full flow testing
		 */

		// Verify we're on the todos page
		await expect(page.locator('h1')).toContainText('Todo Management');

		// Fill in the todo title
		const todoTitle = `Test Todo ${Date.now()}`;
		await page.fill('input[name="title"]', todoTitle);

		// Submit the form
		await page.click('button[type="submit"]');

		// Wait for the todo to appear in the list
		await page.waitForTimeout(500); // Brief wait for form submission

		// Verify the todo appears in the list
		await expect(page.locator(`text=${todoTitle}`)).toBeVisible();

		// Verify the todo is not marked as completed (no line-through)
		const todoElement = page.locator(`text=${todoTitle}`);
		await expect(todoElement).not.toHaveClass(/line-through/);
	});

	test('12.2 Create E2E test for todo toggle', async ({ page }) => {
		/**
		 * Test: Navigate to /todos page, create a todo, click toggle button,
		 * verify line-through styling applied, click toggle again, verify line-through removed
		 * Requirements: Full flow testing
		 */

		// Create a todo
		const todoTitle = `Toggle Test ${Date.now()}`;
		await page.fill('input[name="title"]', todoTitle);
		await page.click('button[type="submit"]');
		await page.waitForTimeout(500);

		// Verify todo is created and visible
		await expect(page.locator(`text=${todoTitle}`)).toBeVisible();

		// Find the todo item and click the toggle button
		const todoItem = page.locator('div').filter({ has: page.locator(`text=${todoTitle}`) }).first();
		const toggleButton = todoItem.locator('button:has-text("Mark Complete")');

		// Click toggle to mark as complete
		await toggleButton.click();
		await page.waitForTimeout(300);

		// Verify line-through styling is applied
		const todoText = todoItem.locator(`text=${todoTitle}`);
		await expect(todoText).toHaveClass(/line-through/);

		// Click toggle again to mark as incomplete
		const toggleButtonAgain = todoItem.locator('button:has-text("Mark Incomplete")');
		await toggleButtonAgain.click();
		await page.waitForTimeout(300);

		// Verify line-through styling is removed
		await expect(todoText).not.toHaveClass(/line-through/);
	});

	test('12.3 Create E2E test for todo deletion', async ({ page }) => {
		/**
		 * Test: Navigate to /todos page, create a todo, click delete button,
		 * verify todo removed from list
		 * Requirements: Full flow testing
		 */

		// Create a todo
		const todoTitle = `Delete Test ${Date.now()}`;
		await page.fill('input[name="title"]', todoTitle);
		await page.click('button[type="submit"]');
		await page.waitForTimeout(500);

		// Verify todo is created and visible
		await expect(page.locator(`text=${todoTitle}`)).toBeVisible();

		// Find the todo item and click the delete button
		const todoItem = page.locator('div').filter({ has: page.locator(`text=${todoTitle}`) }).first();
		const deleteButton = todoItem.locator('button:has-text("Delete")');

		// Click delete button
		await deleteButton.click();
		await page.waitForTimeout(500);

		// Verify todo is removed from the list
		await expect(page.locator(`text=${todoTitle}`)).not.toBeVisible();
	});

	test('12.4 Create E2E test for error handling', async ({ page, context }) => {
		/**
		 * Test: Mock API to return error, navigate to /todos page,
		 * verify error message displays
		 * Requirements: 8.4
		 */

		// Intercept API calls and return an error
		await context.route('**/api/todos', (route) => {
			route.abort('failed');
		});

		// Navigate to todos page (this will trigger the error)
		await page.goto('/todos');
		await page.waitForLoadState('networkidle');

		// Verify error message is displayed
		const errorAlert = page.locator('[role="alert"]');
		await expect(errorAlert).toBeVisible();

		// Verify error text contains meaningful message
		await expect(errorAlert).toContainText(/error|failed/i);
	});

	test('12.5 Create E2E test for form validation', async ({ page }) => {
		/**
		 * Test: Navigate to /todos page, submit form with empty title,
		 * verify validation error displays, submit form with 1 character title,
		 * verify validation error displays
		 * Requirements: 6.7
		 */

		// Verify we're on the todos page
		await expect(page.locator('h1')).toContainText('Todo Management');

		// Test 1: Submit with empty title
		const submitButton = page.locator('button[type="submit"]');
		await submitButton.click();
		await page.waitForTimeout(300);

		// Verify validation error is displayed (HTML5 validation)
		const titleInput = page.locator('input[name="title"]');
		const validationMessage = await titleInput.evaluate((el: HTMLInputElement) => el.validationMessage);
		expect(validationMessage).toBeTruthy();

		// Test 2: Submit with 1 character title (should fail Zod validation)
		await titleInput.fill('A');
		await submitButton.click();
		await page.waitForTimeout(300);

		// Verify validation error is displayed
		const errorElement = page.locator('text=/must be at least 2 characters/i');
		await expect(errorElement).toBeVisible();

		// Test 3: Submit with valid title (should succeed)
		const validTitle = `Valid Todo ${Date.now()}`;
		await titleInput.fill(validTitle);
		await submitButton.click();
		await page.waitForTimeout(500);

		// Verify todo appears in the list
		await expect(page.locator(`text=${validTitle}`)).toBeVisible();
	});
});
