/**
 * Todo domain type definitions
 *
 * This file contains all TypeScript interfaces and types for the Todo domain.
 * These types define the data contracts used throughout the domain.
 */

/**
 * Represents a todo item in the system
 */
export interface TodoItem {
	/** Unique identifier for the todo */
	id: string;
	/** Title/description of the todo */
	title: string;
	/** Whether the todo is completed */
	completed: boolean;
	/** ISO 8601 timestamp when the todo was created */
	createdAt: string;
	/** ISO 8601 timestamp when the todo was last updated */
	updatedAt: string;
}

/**
 * Data Transfer Object for creating a new todo
 */
export interface CreateTodoDto {
	/** Title/description of the new todo */
	title: string;
}

/**
 * Data Transfer Object for updating an existing todo
 */
export interface UpdateTodoDto {
	/** Optional new title for the todo */
	title?: string;
	/** Optional new completion status */
	completed?: boolean;
}
