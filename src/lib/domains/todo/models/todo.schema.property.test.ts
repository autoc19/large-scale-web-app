import { describe, it, expect } from 'vitest';
import { createTodoSchema, updateTodoSchema } from './todo.schema';

/**
 * Property 9: Form Validation Rejection
 * 
 * For any CreateTodoDto with a title shorter than 2 characters or longer than 100 characters,
 * the Zod schema should reject it with a validation error.
 * 
 * **Feature: todo-management, Property 9: Form Validation Rejection**
 * **Validates: Requirements 1.4**
 * 
 * This property test validates that the createTodoSchema correctly enforces
 * the title length constraints (minimum 2 characters, maximum 100 characters)
 * across various invalid inputs.
 */
describe('Property 9: Form Validation Rejection', () => {
	it('should reject titles shorter than 2 characters', () => {
		expect.assertions(2);
		
		// Property: For any title with length < 2, validation should fail
		const invalidTitles = [
			'',      // Empty string
			'a'      // Single character
		];

		for (const title of invalidTitles) {
			const result = createTodoSchema.safeParse({ title });
			
			// Property: Validation should fail for short titles
			expect(result.success).toBe(false);
		}
	});

	it('should reject titles longer than 100 characters', () => {
		expect.assertions(3);
		
		// Property: For any title with length > 100, validation should fail
		const invalidTitles = [
			'a'.repeat(101),  // Exactly 101 characters
			'a'.repeat(150),  // 150 characters
			'a'.repeat(1000)  // Very long string
		];

		for (const title of invalidTitles) {
			const result = createTodoSchema.safeParse({ title });
			
			// Property: Validation should fail for long titles
			expect(result.success).toBe(false);
		}
	});

	it('should accept titles with exactly 2 characters (boundary)', () => {
		expect.assertions(1);
		
		// Property: Title with exactly 2 characters should be valid (lower boundary)
		const result = createTodoSchema.safeParse({ title: 'ab' });
		expect(result.success).toBe(true);
	});

	it('should accept titles with exactly 100 characters (boundary)', () => {
		expect.assertions(1);
		
		// Property: Title with exactly 100 characters should be valid (upper boundary)
		const result = createTodoSchema.safeParse({ title: 'a'.repeat(100) });
		expect(result.success).toBe(true);
	});

	it('should accept valid titles of various lengths', () => {
		expect.assertions(10);
		
		// Property: For any title with 2 <= length <= 100, validation should succeed
		const validTitles = [
			'ab',                           // Minimum valid length (2)
			'abc',                          // 3 characters
			'Buy groceries',                // Normal length
			'Complete project documentation', // Longer normal length
			'A'.repeat(50),                 // Mid-range length
			'B'.repeat(99),                 // Near maximum
			'C'.repeat(100),                // Maximum valid length
			'Todo with numbers 123',        // With numbers
			'Todo with special chars!@#',   // With special characters
			'Unicode todo 你好世界'          // With unicode
		];

		for (const title of validTitles) {
			const result = createTodoSchema.safeParse({ title });
			
			// Property: Validation should succeed for valid titles
			expect(result.success).toBe(true);
		}
	});

	it('should reject non-string title values', () => {
		expect.assertions(5);
		
		// Property: For any non-string value, validation should fail
		const invalidValues = [
			{ title: 123 },           // Number
			{ title: true },          // Boolean
			{ title: null },          // Null
			{ title: undefined },     // Undefined
			{ title: { nested: 'value' } }  // Object
		];

		for (const value of invalidValues) {
			const result = createTodoSchema.safeParse(value);
			
			// Property: Validation should fail for non-string types
			expect(result.success).toBe(false);
		}
	});

	it('should reject missing title field', () => {
		expect.assertions(1);
		
		// Property: For any object without a title field, validation should fail
		const result = createTodoSchema.safeParse({});
		expect(result.success).toBe(false);
	});

	it('should provide descriptive error messages for validation failures', () => {
		expect.assertions(4);
		
		// Property: For any validation failure, a descriptive error message should be provided
		
		// Test empty string
		const emptyResult = createTodoSchema.safeParse({ title: '' });
		expect(emptyResult.success).toBe(false);
		if (!emptyResult.success) {
			expect(emptyResult.error.issues[0].message).toContain('at least 2 characters');
		}
		
		// Test too long string
		const longResult = createTodoSchema.safeParse({ title: 'a'.repeat(101) });
		expect(longResult.success).toBe(false);
		if (!longResult.success) {
			expect(longResult.error.issues[0].message).toContain('less than 100 characters');
		}
	});

	it('should handle whitespace-only titles correctly', () => {
		expect.assertions(3);
		
		// Property: Whitespace-only strings should be validated based on their length
		const whitespaceTests = [
			{ title: ' ', shouldPass: false },      // Single space (length 1)
			{ title: '  ', shouldPass: true },      // Two spaces (length 2)
			{ title: '   ', shouldPass: true }      // Three spaces (length 3)
		];

		for (const { title, shouldPass } of whitespaceTests) {
			const result = createTodoSchema.safeParse({ title });
			
			// Property: Whitespace strings should be validated by length
			expect(result.success).toBe(shouldPass);
		}
	});

	it('should validate titles with leading/trailing whitespace', () => {
		expect.assertions(3);
		
		// Property: Titles with leading/trailing whitespace should be validated by total length
		const titlesWithWhitespace = [
			' ab',      // Leading space (length 3)
			'ab ',      // Trailing space (length 3)
			' ab '      // Both (length 4)
		];

		for (const title of titlesWithWhitespace) {
			const result = createTodoSchema.safeParse({ title });
			
			// Property: Whitespace is counted in length validation
			expect(result.success).toBe(true);
		}
	});
});

/**
 * Additional property tests for updateTodoSchema
 * 
 * These tests ensure that the update schema correctly handles optional fields
 * and applies the same validation rules when fields are provided.
 */
describe('Property 9: Update Schema Validation', () => {
	it('should accept empty update objects (all fields optional)', () => {
		expect.assertions(1);
		
		// Property: For any empty update object, validation should succeed
		const result = updateTodoSchema.safeParse({});
		expect(result.success).toBe(true);
	});

	it('should apply same title validation rules when title is provided', () => {
		expect.assertions(4);
		
		// Property: When title is provided in update, same validation rules apply
		
		// Too short
		const shortResult = updateTodoSchema.safeParse({ title: 'a' });
		expect(shortResult.success).toBe(false);
		
		// Too long
		const longResult = updateTodoSchema.safeParse({ title: 'a'.repeat(101) });
		expect(longResult.success).toBe(false);
		
		// Valid
		const validResult = updateTodoSchema.safeParse({ title: 'Valid title' });
		expect(validResult.success).toBe(true);
		
		// Boundary
		const boundaryResult = updateTodoSchema.safeParse({ title: 'ab' });
		expect(boundaryResult.success).toBe(true);
	});

	it('should accept valid completed boolean values', () => {
		expect.assertions(2);
		
		// Property: For any boolean value in completed field, validation should succeed
		const trueResult = updateTodoSchema.safeParse({ completed: true });
		expect(trueResult.success).toBe(true);
		
		const falseResult = updateTodoSchema.safeParse({ completed: false });
		expect(falseResult.success).toBe(true);
	});

	it('should reject non-boolean completed values', () => {
		expect.assertions(3);
		
		// Property: For any non-boolean value in completed field, validation should fail
		// Note: undefined is allowed because the field is optional
		const invalidValues = [
			{ completed: 'true' },    // String
			{ completed: 1 },         // Number
			{ completed: null }       // Null
		];

		for (const value of invalidValues) {
			const result = updateTodoSchema.safeParse(value);
			
			// Property: Non-boolean completed values should be rejected
			expect(result.success).toBe(false);
		}
	});

	it('should accept updates with both title and completed', () => {
		expect.assertions(1);
		
		// Property: For any valid combination of title and completed, validation should succeed
		const result = updateTodoSchema.safeParse({
			title: 'Updated title',
			completed: true
		});
		expect(result.success).toBe(true);
	});

	it('should accept updates with only completed field', () => {
		expect.assertions(1);
		
		// Property: For any update with only completed field, validation should succeed
		const result = updateTodoSchema.safeParse({ completed: true });
		expect(result.success).toBe(true);
	});

	it('should accept updates with only title field', () => {
		expect.assertions(1);
		
		// Property: For any update with only valid title field, validation should succeed
		const result = updateTodoSchema.safeParse({ title: 'New title' });
		expect(result.success).toBe(true);
	});
});
