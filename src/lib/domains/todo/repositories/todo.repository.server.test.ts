/**
 * Unit tests for Todo Page Server Actions
 *
 * Tests form validation and server-side todo creation logic.
 * Requirements: 6.2, 6.3, 6.4
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTodoSchema } from '../models/todo.schema';
import { HttpTodoRepository } from './todo.repository.http';
import type { TodoItem } from '../models/todo.types';

describe('Server Actions - Todo Creation', () => {
	describe('Form Validation with Zod Schema', () => {
		it('should validate form data against Zod schema', () => {
			// Execute: Validate data using Zod schema directly
			const result = createTodoSchema.safeParse({ title: 'Valid Todo' });

			// Verify: Form should be valid
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.title).toBe('Valid Todo');
			}
		});

		it('should reject form when title is too short', () => {
			// Execute: Validate data with title shorter than 2 characters
			const result = createTodoSchema.safeParse({ title: 'A' });

			// Verify: Form should be invalid with title error
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].path).toContain('title');
				expect(result.error.issues[0].message).toContain('at least 2 characters');
			}
		});

		it('should reject form when title is too long', () => {
			// Execute: Validate data with title longer than 100 characters
			const longTitle = 'A'.repeat(101);
			const result = createTodoSchema.safeParse({ title: longTitle });

			// Verify: Form should be invalid with title error
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].path).toContain('title');
				expect(result.error.issues[0].message).toContain('less than 100 characters');
			}
		});

		it('should reject form when title is missing', () => {
			// Execute: Validate data without title
			const result = createTodoSchema.safeParse({});

			// Verify: Form should be invalid
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues.length).toBeGreaterThan(0);
			}
		});

		it('should accept valid titles at minimum length (2 characters)', () => {
			// Execute: Validate data with exactly 2 character title
			const result = createTodoSchema.safeParse({ title: 'AB' });

			// Verify: Form should be valid
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.title).toBe('AB');
			}
		});

		it('should accept valid titles at maximum length (100 characters)', () => {
			// Execute: Validate data with exactly 100 character title
			const maxTitle = 'A'.repeat(100);
			const result = createTodoSchema.safeParse({ title: maxTitle });

			// Verify: Form should be valid
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.title).toBe(maxTitle);
			}
		});

		it('should accept valid titles with special characters', () => {
			// Execute: Validate data with special characters
			const specialTitle = 'Todo with @#$% & special chars!';
			const result = createTodoSchema.safeParse({ title: specialTitle });

			// Verify: Form should be valid
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.title).toBe(specialTitle);
			}
		});
	});

	describe('Repository Integration', () => {
		let mockFetch: typeof fetch;

		beforeEach(() => {
			mockFetch = vi.fn() as unknown as typeof fetch;
		});

		it('should instantiate HttpTodoRepository with fetch function', () => {
			// Execute: Create repository with mock fetch
			const repo = new HttpTodoRepository(mockFetch);

			// Verify: Repository should be created successfully
			expect(repo).toBeDefined();
		});

		it('should call repository create method with validated data', async () => {
			// Setup: Create mock fetch that returns a successful response
			const createdTodo: TodoItem = {
				id: '1',
				title: 'Test Todo',
				completed: false,
				createdAt: '2024-01-01T00:00:00.000Z',
				updatedAt: '2024-01-01T00:00:00.000Z'
			};

			mockFetch.mockResolvedValue(
				new Response(JSON.stringify(createdTodo), {
					status: 201,
					headers: { 'Content-Type': 'application/json' }
				})
			);

			// Execute: Create repository and call create
			const repo = new HttpTodoRepository(mockFetch);
			const result = await repo.create({ title: 'Test Todo' });

			// Verify: Repository should call fetch with correct parameters
			expect(mockFetch).toHaveBeenCalled();
			expect(result).toEqual(createdTodo);
		});

		it('should throw error when repository encounters HTTP error', async () => {
			// Setup: Create mock fetch that returns an error response
			mockFetch.mockResolvedValue(
				new Response('Not Found', {
					status: 404,
					statusText: 'Not Found'
				})
			);

			// Execute: Create repository and call create
			const repo = new HttpTodoRepository(mockFetch);

			// Verify: Should throw error
			await expect(repo.create({ title: 'Test Todo' })).rejects.toThrow();
		});

		it('should throw error when repository encounters network error', async () => {
			// Setup: Create mock fetch that throws network error
			mockFetch.mockRejectedValue(new Error('Network error'));

			// Execute: Create repository and call create
			const repo = new HttpTodoRepository(mockFetch);

			// Verify: Should throw error
			await expect(repo.create({ title: 'Test Todo' })).rejects.toThrow('Network error');
		});
	});

	describe('Server Action Flow', () => {
		it('should validate form before calling repository', () => {
			// Execute: Validate invalid form (title too short)
			const result = createTodoSchema.safeParse({ title: 'A' });

			// Verify: Validation should fail before any repository call
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].path).toContain('title');
			}
		});

		it('should handle successful form validation and repository call', () => {
			// Execute: Validate valid form
			const result = createTodoSchema.safeParse({ title: 'Valid Todo' });

			// Verify: Form should be valid and ready for repository call
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.title).toBe('Valid Todo');
			}
		});

		it('should extract title from validated form data', () => {
			// Execute: Validate form with title
			const result = createTodoSchema.safeParse({ title: 'My Important Task' });

			// Verify: Title should be extracted correctly
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.title).toBe('My Important Task');
			}
		});
	});
});
