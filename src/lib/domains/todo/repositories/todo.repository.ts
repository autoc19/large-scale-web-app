/**
 * Todo Repository Interface
 *
 * This interface defines the contract for todo data access.
 * Different implementations (HTTP, Mock, LocalStorage) can be swapped
 * without changing business logic.
 *
 * This follows the Repository pattern and Anti-Corruption Layer principle.
 */

import type { TodoItem, CreateTodoDto, UpdateTodoDto } from '../models/todo.types';

/**
 * Repository interface for todo data access operations
 */
export interface TodoRepository {
	/**
	 * Fetch all todos from the data source
	 * @returns Promise resolving to an array of all todo items
	 * @throws Error if the fetch operation fails
	 */
	getAll(): Promise<TodoItem[]>;

	/**
	 * Fetch a single todo by its ID
	 * @param id - The unique identifier of the todo
	 * @returns Promise resolving to the todo item
	 * @throws Error if the todo is not found or fetch fails
	 */
	getById(id: string): Promise<TodoItem>;

	/**
	 * Create a new todo
	 * @param dto - Data transfer object containing the todo data
	 * @returns Promise resolving to the created todo item
	 * @throws Error if the creation fails
	 */
	create(dto: CreateTodoDto): Promise<TodoItem>;

	/**
	 * Update an existing todo
	 * @param id - The unique identifier of the todo to update
	 * @param dto - Data transfer object containing the updated fields
	 * @returns Promise resolving to the updated todo item
	 * @throws Error if the todo is not found or update fails
	 */
	update(id: string, dto: UpdateTodoDto): Promise<TodoItem>;

	/**
	 * Delete a todo
	 * @param id - The unique identifier of the todo to delete
	 * @returns Promise resolving when the deletion is complete
	 * @throws Error if the todo is not found or deletion fails
	 */
	delete(id: string): Promise<void>;
}
