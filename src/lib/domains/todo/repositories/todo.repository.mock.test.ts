/**
 * Tests for MockTodoRepository
 *
 * These tests verify that the mock repository correctly implements
 * the TodoRepository interface and behaves as expected.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MockTodoRepository } from './todo.repository.mock';
import type { TodoItem } from '../models/todo.types';

describe('MockTodoRepository', () => {
	let repo: MockTodoRepository;

	beforeEach(() => {
		repo = new MockTodoRepository();
	});

	describe('getAll', () => {
		it('should return empty array when no todos exist', async () => {
			const items = await repo.getAll();
			expect(items).toEqual([]);
		});

		it('should return all todos', async () => {
			await repo.create({ title: 'Todo 1' });
			await repo.create({ title: 'Todo 2' });

			const items = await repo.getAll();
			expect(items).toHaveLength(2);
			expect(items[0].title).toBe('Todo 1');
			expect(items[1].title).toBe('Todo 2');
		});

		it('should return a copy of items array', async () => {
			await repo.create({ title: 'Todo 1' });
			const items1 = await repo.getAll();
			const items2 = await repo.getAll();

			expect(items1).not.toBe(items2);
			expect(items1).toEqual(items2);
		});
	});

	describe('getById', () => {
		it('should return todo by id', async () => {
			const created = await repo.create({ title: 'Test Todo' });
			const found = await repo.getById(created.id);

			expect(found).toEqual(created);
		});

		it('should throw error when todo not found', async () => {
			await expect(repo.getById('nonexistent')).rejects.toThrow('Todo with id nonexistent not found');
		});
	});

	describe('create', () => {
		it('should create a new todo with generated id', async () => {
			const created = await repo.create({ title: 'New Todo' });

			expect(created.id).toBeDefined();
			expect(created.title).toBe('New Todo');
			expect(created.completed).toBe(false);
			expect(created.createdAt).toBeDefined();
			expect(created.updatedAt).toBeDefined();
		});

		it('should increment id for each new todo', async () => {
			const todo1 = await repo.create({ title: 'Todo 1' });
			const todo2 = await repo.create({ title: 'Todo 2' });

			expect(parseInt(todo2.id, 10)).toBeGreaterThan(parseInt(todo1.id, 10));
		});

		it('should add todo to the list', async () => {
			await repo.create({ title: 'Todo 1' });
			const items = await repo.getAll();

			expect(items).toHaveLength(1);
			expect(items[0].title).toBe('Todo 1');
		});
	});

	describe('update', () => {
		it('should update todo title', async () => {
			const created = await repo.create({ title: 'Original' });
			const updated = await repo.update(created.id, { title: 'Updated' });

			expect(updated.title).toBe('Updated');
			expect(updated.id).toBe(created.id);
		});

		it('should update todo completed status', async () => {
			const created = await repo.create({ title: 'Test' });
			const updated = await repo.update(created.id, { completed: true });

			expect(updated.completed).toBe(true);
		});

		it('should update updatedAt timestamp', async () => {
			const created = await repo.create({ title: 'Test' });
			// Small delay to ensure different timestamp
			await new Promise((resolve) => setTimeout(resolve, 10));
			const updated = await repo.update(created.id, { title: 'Updated' });

			expect(updated.updatedAt).not.toBe(created.updatedAt);
		});

		it('should throw error when todo not found', async () => {
			await expect(repo.update('nonexistent', { title: 'Updated' })).rejects.toThrow(
				'Todo with id nonexistent not found'
			);
		});

		it('should only update provided fields', async () => {
			const created = await repo.create({ title: 'Original' });
			const updated = await repo.update(created.id, { completed: true });

			expect(updated.title).toBe('Original');
			expect(updated.completed).toBe(true);
		});
	});

	describe('delete', () => {
		it('should delete todo by id', async () => {
			const created = await repo.create({ title: 'To Delete' });
			await repo.delete(created.id);

			const items = await repo.getAll();
			expect(items).toHaveLength(0);
		});

		it('should throw error when todo not found', async () => {
			await expect(repo.delete('nonexistent')).rejects.toThrow('Todo with id nonexistent not found');
		});

		it('should only delete specified todo', async () => {
			const todo1 = await repo.create({ title: 'Todo 1' });
			const todo2 = await repo.create({ title: 'Todo 2' });

			await repo.delete(todo1.id);

			const items = await repo.getAll();
			expect(items).toHaveLength(1);
			expect(items[0].id).toBe(todo2.id);
		});
	});

	describe('constructor with initial data', () => {
		it('should initialize with provided data', () => {
			const initialData: TodoItem[] = [
				{
					id: '1',
					title: 'Existing Todo',
					completed: false,
					createdAt: '2024-01-01T00:00:00.000Z',
					updatedAt: '2024-01-01T00:00:00.000Z'
				}
			];

			const repoWithData = new MockTodoRepository(initialData);
			expect(repoWithData.count()).toBe(1);
		});

		it('should set nextId higher than existing ids', async () => {
			const initialData: TodoItem[] = [
				{
					id: '5',
					title: 'Existing Todo',
					completed: false,
					createdAt: '2024-01-01T00:00:00.000Z',
					updatedAt: '2024-01-01T00:00:00.000Z'
				}
			];

			const repoWithData = new MockTodoRepository(initialData);
			const newTodo = await repoWithData.create({ title: 'New Todo' });

			expect(parseInt(newTodo.id, 10)).toBeGreaterThan(5);
		});
	});

	describe('utility methods', () => {
		it('clear should remove all todos', async () => {
			await repo.create({ title: 'Todo 1' });
			await repo.create({ title: 'Todo 2' });

			repo.clear();

			expect(repo.count()).toBe(0);
			const items = await repo.getAll();
			expect(items).toHaveLength(0);
		});

		it('count should return number of todos', async () => {
			expect(repo.count()).toBe(0);

			await repo.create({ title: 'Todo 1' });
			expect(repo.count()).toBe(1);

			await repo.create({ title: 'Todo 2' });
			expect(repo.count()).toBe(2);
		});
	});
});
