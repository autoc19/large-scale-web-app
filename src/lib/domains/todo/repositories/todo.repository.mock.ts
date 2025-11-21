/**
 * Mock Todo Repository Implementation
 *
 * This is an in-memory implementation of the TodoRepository interface
 * for testing purposes. It stores todos in memory and simulates async operations.
 *
 * Use this for:
 * - Service layer unit tests
 * - Component tests that need a repository
 * - Development without a real API
 */

import type { TodoRepository } from './todo.repository';
import type { TodoItem, CreateTodoDto, UpdateTodoDto } from '../models/todo.types';

/**
 * In-memory mock implementation of TodoRepository
 */
export class MockTodoRepository implements TodoRepository {
	private items: TodoItem[] = [];
	private nextId = 1;

	/**
	 * Create a mock repository with optional initial data
	 * @param initialData - Optional array of todos to initialize with
	 */
	constructor(initialData: TodoItem[] = []) {
		this.items = [...initialData];
		// Set nextId to be higher than any existing ID
		if (initialData.length > 0) {
			const maxId = Math.max(...initialData.map((item) => parseInt(item.id, 10) || 0));
			this.nextId = maxId + 1;
		}
	}

	/**
	 * Fetch all todos from memory
	 */
	async getAll(): Promise<TodoItem[]> {
		// Simulate async operation
		return Promise.resolve([...this.items]);
	}

	/**
	 * Fetch a single todo by ID
	 * @throws Error if todo not found
	 */
	async getById(id: string): Promise<TodoItem> {
		const item = this.items.find((todo) => todo.id === id);
		if (!item) {
			throw new Error(`Todo with id ${id} not found`);
		}
		return Promise.resolve({ ...item });
	}

	/**
	 * Create a new todo in memory
	 */
	async create(dto: CreateTodoDto): Promise<TodoItem> {
		const now = new Date().toISOString();
		const newItem: TodoItem = {
			id: String(this.nextId++),
			title: dto.title,
			completed: false,
			createdAt: now,
			updatedAt: now
		};
		this.items.push(newItem);
		return Promise.resolve({ ...newItem });
	}

	/**
	 * Update an existing todo in memory
	 * @throws Error if todo not found
	 */
	async update(id: string, dto: UpdateTodoDto): Promise<TodoItem> {
		const index = this.items.findIndex((todo) => todo.id === id);
		if (index === -1) {
			throw new Error(`Todo with id ${id} not found`);
		}

		const updatedItem: TodoItem = {
			...this.items[index],
			...(dto.title !== undefined && { title: dto.title }),
			...(dto.completed !== undefined && { completed: dto.completed }),
			updatedAt: new Date().toISOString()
		};

		this.items[index] = updatedItem;
		return Promise.resolve({ ...updatedItem });
	}

	/**
	 * Delete a todo from memory
	 * @throws Error if todo not found
	 */
	async delete(id: string): Promise<void> {
		const index = this.items.findIndex((todo) => todo.id === id);
		if (index === -1) {
			throw new Error(`Todo with id ${id} not found`);
		}
		this.items.splice(index, 1);
		return Promise.resolve();
	}

	/**
	 * Utility method to clear all todos (useful for test cleanup)
	 */
	clear(): void {
		this.items = [];
		this.nextId = 1;
	}

	/**
	 * Utility method to get the current count of todos
	 */
	count(): number {
		return this.items.length;
	}
}
