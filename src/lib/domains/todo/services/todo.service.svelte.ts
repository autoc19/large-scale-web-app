/**
 * Todo Service
 *
 * Business logic class for managing todo state and operations.
 * Uses Svelte 5 Runes for reactive state management.
 *
 * This service encapsulates all todo-related business logic and state,
 * following the Logic Externalization principle.
 */

import type { TodoRepository } from '../repositories/todo.repository';
import type { TodoItem, CreateTodoDto } from '../models/todo.types';

/**
 * Service class for todo business logic and state management
 */
export class TodoService {
	// Reactive state using Svelte 5 Runes
	items = $state<TodoItem[]>([]);
	loading = $state(false);
	error = $state<string | null>(null);
	selectedId = $state<string | null>(null);

	/**
	 * Derived state: Count of completed todos
	 */
	get completedCount(): number {
		return this.items.filter((t) => t.completed).length;
	}

	/**
	 * Derived state: Count of pending (not completed) todos
	 */
	get pendingCount(): number {
		return this.items.filter((t) => !t.completed).length;
	}

	/**
	 * Derived state: Currently selected todo item
	 */
	get selectedItem(): TodoItem | undefined {
		return this.items.find((t) => t.id === this.selectedId);
	}

	/**
	 * @param repo - Repository implementation for data access
	 * @param initialData - Optional initial data to populate the service
	 */
	constructor(
		private repo: TodoRepository,
		initialData: TodoItem[] = []
	) {
		this.items = initialData;
	}

	/**
	 * Load all todos from the repository
	 * Sets loading state and handles errors
	 */
	async loadTodos(): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			this.items = await this.repo.getAll();
		} catch (err) {
			this.error = (err as Error).message;
			console.error('Failed to load todos:', err);
		} finally {
			this.loading = false;
		}
	}

	/**
	 * Create a new todo
	 * Adds the new todo to the items array on success
	 */
	async createTodo(dto: CreateTodoDto): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			const newTodo = await this.repo.create(dto);
			this.items = [...this.items, newTodo];
		} catch (err) {
			this.error = (err as Error).message;
			console.error('Failed to create todo:', err);
		} finally {
			this.loading = false;
		}
	}

	/**
	 * Toggle the completion status of a todo
	 * Uses optimistic updates with rollback on error
	 */
	async toggle(id: string): Promise<void> {
		const todo = this.items.find((t) => t.id === id);
		if (!todo) return;

		// Optimistic update
		const previousState = todo.completed;
		todo.completed = !todo.completed;

		try {
			await this.repo.update(id, { completed: todo.completed });
		} catch (err) {
			// Rollback on error
			todo.completed = previousState;
			this.error = (err as Error).message;
			console.error('Failed to toggle todo:', err);
		}
	}

	/**
	 * Delete a todo
	 * Removes the todo from the items array on success
	 */
	async deleteTodo(id: string): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			await this.repo.delete(id);
			this.items = this.items.filter((t) => t.id !== id);
		} catch (err) {
			this.error = (err as Error).message;
			console.error('Failed to delete todo:', err);
		} finally {
			this.loading = false;
		}
	}

	/**
	 * Select a todo by ID
	 */
	select(id: string): void {
		this.selectedId = id;
	}

	/**
	 * Clear the current selection
	 */
	clearSelection(): void {
		this.selectedId = null;
	}
}
