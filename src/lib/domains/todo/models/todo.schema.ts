/**
 * Todo domain Zod validation schemas
 *
 * This file contains Zod schemas for runtime validation of todo data.
 * These schemas are used for form validation and API request validation.
 */

import { z } from 'zod';

/**
 * Zod schema for creating a new todo
 * Validates that the title is between 2 and 100 characters
 */
export const createTodoSchema = z.object({
	title: z
		.string()
		.min(2, 'Title must be at least 2 characters')
		.max(100, 'Title must be less than 100 characters')
});

/**
 * Zod schema for updating an existing todo
 * All fields are optional to support partial updates
 */
export const updateTodoSchema = z.object({
	title: z
		.string()
		.min(2, 'Title must be at least 2 characters')
		.max(100, 'Title must be less than 100 characters')
		.optional(),
	completed: z.boolean().optional()
});

/**
 * TypeScript type inferred from createTodoSchema
 * Use this type for type-safe form handling
 */
export type CreateTodoSchema = z.infer<typeof createTodoSchema>;

/**
 * TypeScript type inferred from updateTodoSchema
 * Use this type for type-safe form handling
 */
export type UpdateTodoSchema = z.infer<typeof updateTodoSchema>;
