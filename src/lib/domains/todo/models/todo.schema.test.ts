/**
 * Unit tests for todo validation schemas
 *
 * Tests the Zod schemas for creating and updating todos.
 * Validates: Requirements 1.4, 1.5
 */

import { describe, it, expect } from 'vitest';
import { createTodoSchema, updateTodoSchema } from './todo.schema';

describe('createTodoSchema', () => {
	describe('title validation', () => {
		it('should reject titles shorter than 2 characters', () => {
			// Test empty string
			const emptyResult = createTodoSchema.safeParse({ title: '' });
			expect(emptyResult.success).toBe(false);
			if (!emptyResult.success) {
				expect(emptyResult.error.issues[0].message).toBe('Title must be at least 2 characters');
			}

			// Test single character
			const singleCharResult = createTodoSchema.safeParse({ title: 'a' });
			expect(singleCharResult.success).toBe(false);
			if (!singleCharResult.success) {
				expect(singleCharResult.error.issues[0].message).toBe('Title must be at least 2 characters');
			}
		});

		it('should reject titles longer than 100 characters', () => {
			const longTitle = 'a'.repeat(101);
			const result = createTodoSchema.safeParse({ title: longTitle });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Title must be less than 100 characters');
			}
		});

		it('should accept valid titles', () => {
			// Test minimum valid length (2 characters)
			const minResult = createTodoSchema.safeParse({ title: 'ab' });
			expect(minResult.success).toBe(true);
			if (minResult.success) {
				expect(minResult.data.title).toBe('ab');
			}

			// Test normal length
			const normalResult = createTodoSchema.safeParse({ title: 'Buy groceries' });
			expect(normalResult.success).toBe(true);
			if (normalResult.success) {
				expect(normalResult.data.title).toBe('Buy groceries');
			}

			// Test maximum valid length (100 characters)
			const maxTitle = 'a'.repeat(100);
			const maxResult = createTodoSchema.safeParse({ title: maxTitle });
			expect(maxResult.success).toBe(true);
			if (maxResult.success) {
				expect(maxResult.data.title).toBe(maxTitle);
			}
		});

		it('should reject missing title field', () => {
			const result = createTodoSchema.safeParse({});
			expect(result.success).toBe(false);
		});

		it('should reject non-string title', () => {
			const result = createTodoSchema.safeParse({ title: 123 });
			expect(result.success).toBe(false);
		});
	});
});

describe('updateTodoSchema', () => {
	describe('optional fields', () => {
		it('should accept empty object (all fields optional)', () => {
			const result = updateTodoSchema.safeParse({});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual({});
			}
		});

		it('should accept only title field', () => {
			const result = updateTodoSchema.safeParse({ title: 'Updated title' });
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.title).toBe('Updated title');
				expect(result.data.completed).toBeUndefined();
			}
		});

		it('should accept only completed field', () => {
			const result = updateTodoSchema.safeParse({ completed: true });
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.completed).toBe(true);
				expect(result.data.title).toBeUndefined();
			}
		});

		it('should accept both title and completed fields', () => {
			const result = updateTodoSchema.safeParse({
				title: 'Updated title',
				completed: true
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.title).toBe('Updated title');
				expect(result.data.completed).toBe(true);
			}
		});
	});

	describe('title validation when provided', () => {
		it('should reject titles shorter than 2 characters when provided', () => {
			const result = updateTodoSchema.safeParse({ title: 'a' });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Title must be at least 2 characters');
			}
		});

		it('should reject titles longer than 100 characters when provided', () => {
			const longTitle = 'a'.repeat(101);
			const result = updateTodoSchema.safeParse({ title: longTitle });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Title must be less than 100 characters');
			}
		});

		it('should accept valid titles when provided', () => {
			const result = updateTodoSchema.safeParse({ title: 'Valid title' });
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.title).toBe('Valid title');
			}
		});
	});

	describe('completed validation when provided', () => {
		it('should accept true value', () => {
			const result = updateTodoSchema.safeParse({ completed: true });
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.completed).toBe(true);
			}
		});

		it('should accept false value', () => {
			const result = updateTodoSchema.safeParse({ completed: false });
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.completed).toBe(false);
			}
		});

		it('should reject non-boolean completed value', () => {
			const result = updateTodoSchema.safeParse({ completed: 'true' });
			expect(result.success).toBe(false);
		});
	});
});
