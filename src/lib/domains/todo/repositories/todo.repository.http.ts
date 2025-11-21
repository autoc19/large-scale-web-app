/**
 * HTTP Todo Repository Implementation
 *
 * This implementation uses HTTP requests to interact with a REST API.
 * It accepts a fetch function for SSR compatibility.
 *
 * Error handling: Throws standard Error objects with descriptive messages.
 */

import { publicConfig } from '$lib/config/env.public';
import type { TodoRepository } from './todo.repository';
import type { TodoItem, CreateTodoDto, UpdateTodoDto } from '../models/todo.types';

/**
 * HTTP-based implementation of TodoRepository
 * Uses the configured API base URL and fetch function for SSR compatibility
 */
export class HttpTodoRepository implements TodoRepository {
	/**
	 * @param fetchFn - Fetch function to use (SvelteKit's fetch for SSR compatibility)
	 */
	constructor(private fetchFn: typeof fetch) {}

	/**
	 * Fetch all todos from the API
	 */
	async getAll(): Promise<TodoItem[]> {
		const res = await this.fetchFn(`${publicConfig.apiBase}/todos`);

		if (!res.ok) {
			throw new Error(`Failed to fetch todos: ${res.status} ${res.statusText}`);
		}

		return res.json();
	}

	/**
	 * Fetch a single todo by ID from the API
	 */
	async getById(id: string): Promise<TodoItem> {
		const res = await this.fetchFn(`${publicConfig.apiBase}/todos/${id}`);

		if (!res.ok) {
			throw new Error(`Failed to fetch todo: ${res.status} ${res.statusText}`);
		}

		return res.json();
	}

	/**
	 * Create a new todo via POST request
	 */
	async create(dto: CreateTodoDto): Promise<TodoItem> {
		const res = await this.fetchFn(`${publicConfig.apiBase}/todos`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(dto)
		});

		if (!res.ok) {
			throw new Error(`Failed to create todo: ${res.status} ${res.statusText}`);
		}

		return res.json();
	}

	/**
	 * Update an existing todo via PUT request
	 */
	async update(id: string, dto: UpdateTodoDto): Promise<TodoItem> {
		const res = await this.fetchFn(`${publicConfig.apiBase}/todos/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(dto)
		});

		if (!res.ok) {
			throw new Error(`Failed to update todo: ${res.status} ${res.statusText}`);
		}

		return res.json();
	}

	/**
	 * Delete a todo via DELETE request
	 */
	async delete(id: string): Promise<void> {
		const res = await this.fetchFn(`${publicConfig.apiBase}/todos/${id}`, {
			method: 'DELETE'
		});

		if (!res.ok) {
			throw new Error(`Failed to delete todo: ${res.status} ${res.statusText}`);
		}
	}
}
