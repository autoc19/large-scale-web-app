import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpTodoRepository } from './todo.repository.http';
import type { TodoItem, CreateTodoDto, UpdateTodoDto } from '../models/todo.types';

// Mock publicConfig
vi.mock('$lib/config/env.public', () => ({
	publicConfig: {
		apiBase: 'http://localhost:3000/api'
	}
}));

const BASE_URL = 'http://localhost:3000/api';

describe('HttpTodoRepository', () => {
	let mockFetch: ReturnType<typeof vi.fn>;
	let repository: HttpTodoRepository;

	beforeEach(() => {
		mockFetch = vi.fn();
		repository = new HttpTodoRepository(mockFetch as unknown as typeof fetch);
	});

	describe('getAll', () => {
		it('should fetch all todos correctly', async () => {
			expect.assertions(3);

			const mockTodos: TodoItem[] = [
				{
					id: '1',
					title: 'Test Todo 1',
					completed: false,
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z'
				},
				{
					id: '2',
					title: 'Test Todo 2',
					completed: true,
					createdAt: '2024-01-02T00:00:00Z',
					updatedAt: '2024-01-02T00:00:00Z'
				}
			];

			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => mockTodos
			});

			const result = await repository.getAll();

			expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/todos`);
			expect(mockFetch).toHaveBeenCalledTimes(1);
			expect(result).toEqual(mockTodos);
		});

		it('should throw error on failed fetch', async () => {
			expect.assertions(1);

			mockFetch.mockResolvedValue({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error'
			});

			await expect(repository.getAll()).rejects.toThrow(
				'Failed to fetch todos: 500 Internal Server Error'
			);
		});
	});

	describe('getById', () => {
		it('should fetch a single todo by ID', async () => {
			expect.assertions(3);

			const mockTodo: TodoItem = {
				id: '1',
				title: 'Test Todo',
				completed: false,
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z'
			};

			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => mockTodo
			});

			const result = await repository.getById('1');

			expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/todos/1`);
			expect(mockFetch).toHaveBeenCalledTimes(1);
			expect(result).toEqual(mockTodo);
		});

		it('should throw error when todo not found', async () => {
			expect.assertions(1);

			mockFetch.mockResolvedValue({
				ok: false,
				status: 404,
				statusText: 'Not Found'
			});

			await expect(repository.getById('999')).rejects.toThrow(
				'Failed to fetch todo: 404 Not Found'
			);
		});
	});

	describe('create', () => {
		it('should send correct payload for create', async () => {
			expect.assertions(3);

			const createDto: CreateTodoDto = {
				title: 'New Todo'
			};

			const mockCreatedTodo: TodoItem = {
				id: '3',
				title: 'New Todo',
				completed: false,
				createdAt: '2024-01-03T00:00:00Z',
				updatedAt: '2024-01-03T00:00:00Z'
			};

			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => mockCreatedTodo
			});

			const result = await repository.create(createDto);

			expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/todos`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(createDto)
			});
			expect(mockFetch).toHaveBeenCalledTimes(1);
			expect(result).toEqual(mockCreatedTodo);
		});

		it('should throw error on failed create', async () => {
			expect.assertions(1);

			const createDto: CreateTodoDto = {
				title: 'New Todo'
			};

			mockFetch.mockResolvedValue({
				ok: false,
				status: 400,
				statusText: 'Bad Request'
			});

			await expect(repository.create(createDto)).rejects.toThrow(
				'Failed to create todo: 400 Bad Request'
			);
		});
	});

	describe('update', () => {
		it('should send correct payload for update', async () => {
			expect.assertions(3);

			const updateDto: UpdateTodoDto = {
				title: 'Updated Todo',
				completed: true
			};

			const mockUpdatedTodo: TodoItem = {
				id: '1',
				title: 'Updated Todo',
				completed: true,
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-03T00:00:00Z'
			};

			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => mockUpdatedTodo
			});

			const result = await repository.update('1', updateDto);

			expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/todos/1`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updateDto)
			});
			expect(mockFetch).toHaveBeenCalledTimes(1);
			expect(result).toEqual(mockUpdatedTodo);
		});

		it('should handle partial updates', async () => {
			expect.assertions(2);

			const updateDto: UpdateTodoDto = {
				completed: true
			};

			const mockUpdatedTodo: TodoItem = {
				id: '1',
				title: 'Original Title',
				completed: true,
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-03T00:00:00Z'
			};

			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => mockUpdatedTodo
			});

			const result = await repository.update('1', updateDto);

			expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/todos/1`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updateDto)
			});
			expect(result).toEqual(mockUpdatedTodo);
		});

		it('should throw error on failed update', async () => {
			expect.assertions(1);

			const updateDto: UpdateTodoDto = {
				title: 'Updated Todo'
			};

			mockFetch.mockResolvedValue({
				ok: false,
				status: 404,
				statusText: 'Not Found'
			});

			await expect(repository.update('999', updateDto)).rejects.toThrow(
				'Failed to update todo: 404 Not Found'
			);
		});
	});

	describe('delete', () => {
		it('should call correct endpoint for delete', async () => {
			expect.assertions(2);

			mockFetch.mockResolvedValue({
				ok: true,
				status: 204
			});

			await repository.delete('1');

			expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/todos/1`, {
				method: 'DELETE'
			});
			expect(mockFetch).toHaveBeenCalledTimes(1);
		});

		it('should throw error on failed delete', async () => {
			expect.assertions(1);

			mockFetch.mockResolvedValue({
				ok: false,
				status: 404,
				statusText: 'Not Found'
			});

			await expect(repository.delete('999')).rejects.toThrow(
				'Failed to delete todo: 404 Not Found'
			);
		});
	});

	describe('Error handling for 4xx and 5xx responses', () => {
		it('should throw error for 400 Bad Request', async () => {
			expect.assertions(1);

			mockFetch.mockResolvedValue({
				ok: false,
				status: 400,
				statusText: 'Bad Request'
			});

			await expect(repository.getAll()).rejects.toThrow(
				'Failed to fetch todos: 400 Bad Request'
			);
		});

		it('should throw error for 401 Unauthorized', async () => {
			expect.assertions(1);

			mockFetch.mockResolvedValue({
				ok: false,
				status: 401,
				statusText: 'Unauthorized'
			});

			await expect(repository.getAll()).rejects.toThrow(
				'Failed to fetch todos: 401 Unauthorized'
			);
		});

		it('should throw error for 403 Forbidden', async () => {
			expect.assertions(1);

			mockFetch.mockResolvedValue({
				ok: false,
				status: 403,
				statusText: 'Forbidden'
			});

			await expect(repository.getAll()).rejects.toThrow(
				'Failed to fetch todos: 403 Forbidden'
			);
		});

		it('should throw error for 404 Not Found', async () => {
			expect.assertions(1);

			mockFetch.mockResolvedValue({
				ok: false,
				status: 404,
				statusText: 'Not Found'
			});

			await expect(repository.getAll()).rejects.toThrow(
				'Failed to fetch todos: 404 Not Found'
			);
		});

		it('should throw error for 500 Internal Server Error', async () => {
			expect.assertions(1);

			mockFetch.mockResolvedValue({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error'
			});

			await expect(repository.getAll()).rejects.toThrow(
				'Failed to fetch todos: 500 Internal Server Error'
			);
		});

		it('should throw error for 502 Bad Gateway', async () => {
			expect.assertions(1);

			mockFetch.mockResolvedValue({
				ok: false,
				status: 502,
				statusText: 'Bad Gateway'
			});

			await expect(repository.getAll()).rejects.toThrow(
				'Failed to fetch todos: 502 Bad Gateway'
			);
		});

		it('should throw error for 503 Service Unavailable', async () => {
			expect.assertions(1);

			mockFetch.mockResolvedValue({
				ok: false,
				status: 503,
				statusText: 'Service Unavailable'
			});

			await expect(repository.getAll()).rejects.toThrow(
				'Failed to fetch todos: 503 Service Unavailable'
			);
		});
	});
});
