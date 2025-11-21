/**
 * Unit tests for TodoService
 *
 * Tests business logic in isolation using MockTodoRepository
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoService } from './todo.service.svelte';
import { MockTodoRepository } from '../repositories/todo.repository.mock';
import type { TodoItem } from '../models/todo.types';

describe('TodoService', () => {
	let mockRepo: MockTodoRepository;
	let service: TodoService;

	// Helper function to create fresh mock todos (prevents mutation issues)
	const createMockTodo1 = (): TodoItem => ({
		id: '1',
		title: 'Test Todo 1',
		completed: false,
		createdAt: '2024-01-01T00:00:00.000Z',
		updatedAt: '2024-01-01T00:00:00.000Z'
	});

	const createMockTodo2 = (): TodoItem => ({
		id: '2',
		title: 'Test Todo 2',
		completed: true,
		createdAt: '2024-01-02T00:00:00.000Z',
		updatedAt: '2024-01-02T00:00:00.000Z'
	});

	beforeEach(() => {
		mockRepo = new MockTodoRepository();
		service = new TodoService(mockRepo);
	});

	describe('Initialization', () => {
		it('should initialize with empty items by default', () => {
			expect(service.items).toEqual([]);
			expect(service.loading).toBe(false);
			expect(service.error).toBe(null);
			expect(service.selectedId).toBe(null);
		});

		it('should initialize with provided initial data', () => {
			const initialData = [createMockTodo1(), createMockTodo2()];
			const serviceWithData = new TodoService(mockRepo, initialData);

			expect(serviceWithData.items).toEqual(initialData);
			expect(serviceWithData.items.length).toBe(2);
		});
	});

	describe('loadTodos', () => {
		it('should load todos from repository and update items', async () => {
			// Setup: Add todos to mock repository
			await mockRepo.create({ title: 'Todo 1' });
			await mockRepo.create({ title: 'Todo 2' });

			// Execute
			await service.loadTodos();

			// Verify
			expect(service.items.length).toBe(2);
			expect(service.items[0].title).toBe('Todo 1');
			expect(service.items[1].title).toBe('Todo 2');
			expect(service.loading).toBe(false);
			expect(service.error).toBe(null);
		});

		it('should set loading to true during load and false after', async () => {
			// Setup: Create a promise we can control
			let resolvePromise: (value: TodoItem[]) => void;
			const controlledPromise = new Promise<TodoItem[]>((resolve) => {
				resolvePromise = resolve;
			});

			// Mock the repository to return our controlled promise
			mockRepo.getAll = vi.fn(() => controlledPromise);

			// Start loading
			const loadPromise = service.loadTodos();

			// Check loading is true
			expect(service.loading).toBe(true);

			// Resolve the promise
			resolvePromise!([createMockTodo1()]);
			await loadPromise;

			// Check loading is false
			expect(service.loading).toBe(false);
		});

		it('should handle errors and set error state', async () => {
			// Setup: Make repository throw an error
			const errorMessage = 'Failed to fetch todos';
			mockRepo.getAll = vi.fn(() => Promise.reject(new Error(errorMessage)));

			// Execute
			await service.loadTodos();

			// Verify
			expect(service.error).toBe(errorMessage);
			expect(service.loading).toBe(false);
			expect(service.items).toEqual([]);
		});

		it('should clear previous error state on successful load', async () => {
			// Setup: Set an error state
			service.error = 'Previous error';

			// Execute
			await service.loadTodos();

			// Verify
			expect(service.error).toBe(null);
		});
	});

	describe('createTodo', () => {
		it('should create a new todo and add it to items', async () => {
			// Execute
			await service.createTodo({ title: 'New Todo' });

			// Verify
			expect(service.items.length).toBe(1);
			expect(service.items[0].title).toBe('New Todo');
			expect(service.items[0].completed).toBe(false);
			expect(service.loading).toBe(false);
			expect(service.error).toBe(null);
		});

		it('should append new todo to existing items', async () => {
			// Setup: Initialize with existing data
			const existingTodo = createMockTodo1();
			service = new TodoService(mockRepo, [existingTodo]);

			// Execute
			await service.createTodo({ title: 'New Todo' });

			// Verify
			expect(service.items.length).toBe(2);
			expect(service.items[0]).toEqual(existingTodo);
			expect(service.items[1].title).toBe('New Todo');
		});

		it('should handle errors and set error state', async () => {
			// Setup: Make repository throw an error
			const errorMessage = 'Failed to create todo';
			mockRepo.create = vi.fn(() => Promise.reject(new Error(errorMessage)));

			// Execute
			await service.createTodo({ title: 'New Todo' });

			// Verify
			expect(service.error).toBe(errorMessage);
			expect(service.loading).toBe(false);
			expect(service.items.length).toBe(0);
		});
	});

	describe('toggle', () => {
		it('should flip completed status from false to true', async () => {
			// Setup - Add todo to repository first
			const todo1 = createMockTodo1();
			mockRepo = new MockTodoRepository([todo1]);
			service = new TodoService(mockRepo, [todo1]);

			// Execute
			await service.toggle('1');

			// Verify
			expect(service.items[0].completed).toBe(true);
		});

		it('should flip completed status from true to false', async () => {
			// Setup - Add todo to repository first
			const todo2 = createMockTodo2();
			mockRepo = new MockTodoRepository([todo2]);
			service = new TodoService(mockRepo, [todo2]);

			// Execute
			await service.toggle('2');

			// Verify
			expect(service.items[0].completed).toBe(false);
		});

		it('should do nothing if todo not found', async () => {
			// Setup
			const todo1 = createMockTodo1();
			service = new TodoService(mockRepo, [todo1]);

			// Execute
			await service.toggle('non-existent-id');

			// Verify - no changes
			expect(service.items[0].completed).toBe(false);
			expect(service.error).toBe(null);
		});

		it('should rollback on repository error', async () => {
			// Setup - Add todo to repository first
			const todo1 = createMockTodo1();
			mockRepo = new MockTodoRepository([todo1]);
			service = new TodoService(mockRepo, [todo1]);
			const errorMessage = 'Failed to update todo';
			mockRepo.update = vi.fn(() => Promise.reject(new Error(errorMessage)));

			// Execute
			await service.toggle('1');

			// Verify - status rolled back
			expect(service.items[0].completed).toBe(false);
			expect(service.error).toBe(errorMessage);
		});
	});

	describe('deleteTodo', () => {
		it('should remove todo from items', async () => {
			// Setup - Add todos to repository first
			const todo1 = createMockTodo1();
			const todo2 = createMockTodo2();
			mockRepo = new MockTodoRepository([todo1, todo2]);
			service = new TodoService(mockRepo, [todo1, todo2]);

			// Execute
			await service.deleteTodo('1');

			// Verify
			expect(service.items.length).toBe(1);
			expect(service.items[0].id).toBe('2');
			expect(service.loading).toBe(false);
			expect(service.error).toBe(null);
		});

		it('should handle errors and set error state', async () => {
			// Setup - Add todo to repository first
			const todo1 = createMockTodo1();
			mockRepo = new MockTodoRepository([todo1]);
			service = new TodoService(mockRepo, [todo1]);
			const errorMessage = 'Failed to delete todo';
			mockRepo.delete = vi.fn(() => Promise.reject(new Error(errorMessage)));

			// Execute
			await service.deleteTodo('1');

			// Verify
			expect(service.error).toBe(errorMessage);
			expect(service.loading).toBe(false);
			expect(service.items.length).toBe(1); // Item not removed
		});
	});

	describe('Derived Getters', () => {
		describe('completedCount', () => {
			it('should return 0 when no todos are completed', () => {
				service = new TodoService(mockRepo, [createMockTodo1()]);
				expect(service.completedCount).toBe(0);
			});

			it('should return correct count of completed todos', () => {
				service = new TodoService(mockRepo, [createMockTodo1(), createMockTodo2()]);
				expect(service.completedCount).toBe(1);
			});

			it('should return total count when all todos are completed', () => {
				const completedTodo1 = { ...createMockTodo1(), completed: true };
				const completedTodo2 = { ...createMockTodo2(), completed: true };
				service = new TodoService(mockRepo, [completedTodo1, completedTodo2]);
				expect(service.completedCount).toBe(2);
			});
		});

		describe('pendingCount', () => {
			it('should return correct count of pending todos', () => {
				service = new TodoService(mockRepo, [createMockTodo1(), createMockTodo2()]);
				expect(service.pendingCount).toBe(1);
			});

			it('should return 0 when all todos are completed', () => {
				service = new TodoService(mockRepo, [createMockTodo2()]);
				expect(service.pendingCount).toBe(0);
			});

			it('should return total count when no todos are completed', () => {
				const pendingTodo1 = { ...createMockTodo1(), completed: false };
				const pendingTodo2 = { ...createMockTodo2(), completed: false };
				service = new TodoService(mockRepo, [pendingTodo1, pendingTodo2]);
				expect(service.pendingCount).toBe(2);
			});
		});

		describe('selectedItem', () => {
			it('should return undefined when no item is selected', () => {
				service = new TodoService(mockRepo, [createMockTodo1()]);
				expect(service.selectedItem).toBeUndefined();
			});

			it('should return the selected item', () => {
				const todo2 = createMockTodo2();
				service = new TodoService(mockRepo, [createMockTodo1(), todo2]);
				service.select('2');
				expect(service.selectedItem).toEqual(todo2);
			});

			it('should return undefined when selected id does not exist', () => {
				service = new TodoService(mockRepo, [createMockTodo1()]);
				service.select('non-existent-id');
				expect(service.selectedItem).toBeUndefined();
			});
		});
	});

	describe('Selection Management', () => {
		it('should set selectedId when select is called', () => {
			service.select('1');
			expect(service.selectedId).toBe('1');
		});

		it('should clear selectedId when clearSelection is called', () => {
			service.select('1');
			service.clearSelection();
			expect(service.selectedId).toBe(null);
		});
	});

	describe('Error State Management', () => {
		it('should clear error state when starting a new operation', async () => {
			// Setup: Set an error state
			service.error = 'Previous error';

			// Execute: Start a new operation
			await service.loadTodos();

			// Verify: Error is cleared (assuming loadTodos succeeds)
			expect(service.error).toBe(null);
		});

		it('should maintain error state across multiple failed operations', async () => {
			// Setup: Make repository throw errors
			mockRepo.getAll = vi.fn(() => Promise.reject(new Error('Load error')));

			// Execute: First failed operation
			await service.loadTodos();
			expect(service.error).toBe('Load error');

			// Setup: Different error
			mockRepo.create = vi.fn(() => Promise.reject(new Error('Create error')));

			// Execute: Second failed operation
			await service.createTodo({ title: 'Test' });

			// Verify: Error is updated to the new error
			expect(service.error).toBe('Create error');
		});
	});

	describe('Loading State Management', () => {
		it('should set loading to false after successful operation', async () => {
			await service.loadTodos();
			expect(service.loading).toBe(false);
		});

		it('should set loading to false after failed operation', async () => {
			mockRepo.getAll = vi.fn(() => Promise.reject(new Error('Error')));
			await service.loadTodos();
			expect(service.loading).toBe(false);
		});

		it('should handle loading state for createTodo', async () => {
			let resolvePromise: (value: TodoItem) => void;
			const controlledPromise = new Promise<TodoItem>((resolve) => {
				resolvePromise = resolve;
			});

			mockRepo.create = vi.fn(() => controlledPromise);

			const createPromise = service.createTodo({ title: 'Test' });
			expect(service.loading).toBe(true);

			resolvePromise!(createMockTodo1());
			await createPromise;
			expect(service.loading).toBe(false);
		});

		it('should handle loading state for deleteTodo', async () => {
			const todo1 = createMockTodo1();
			service = new TodoService(mockRepo, [todo1]);

			let resolvePromise: () => void;
			const controlledPromise = new Promise<void>((resolve) => {
				resolvePromise = resolve;
			});

			mockRepo.delete = vi.fn(() => controlledPromise);

			const deletePromise = service.deleteTodo('1');
			expect(service.loading).toBe(true);

			resolvePromise!();
			await deletePromise;
			expect(service.loading).toBe(false);
		});
	});
});
