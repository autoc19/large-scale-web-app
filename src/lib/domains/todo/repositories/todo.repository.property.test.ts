import { describe, it, expect, vi } from 'vitest';
import { HttpTodoRepository } from './todo.repository.http';
import type { CreateTodoDto, UpdateTodoDto } from '../models/todo.types';

/**
 * Property 10: Repository Error Throwing
 * 
 * For any HTTP response with a non-2xx status code, the repository should throw
 * an Error with status code and message.
 * 
 * **Feature: todo-management, Property 10: Repository Error Throwing**
 * **Validates: Requirements 2.3, 8.1**
 * 
 * This property test validates that the HttpTodoRepository correctly handles
 * HTTP errors by throwing descriptive Error objects for all non-2xx responses.
 */
describe('Property 10: Repository Error Throwing', () => {
	it('should throw error with status and message for non-2xx responses in getAll', async () => {
		expect.assertions(12);
		
		// Property: For any non-2xx status code, getAll should throw an Error
		const errorStatuses = [
			{ status: 400, statusText: 'Bad Request' },
			{ status: 401, statusText: 'Unauthorized' },
			{ status: 403, statusText: 'Forbidden' },
			{ status: 404, statusText: 'Not Found' },
			{ status: 500, statusText: 'Internal Server Error' },
			{ status: 502, statusText: 'Bad Gateway' }
		];

		for (const { status, statusText } of errorStatuses) {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: false,
				status,
				statusText
			});

			const repo = new HttpTodoRepository(mockFetch);

			// Property: Non-2xx responses should throw
			await expect(repo.getAll()).rejects.toThrow();
			
			// Property: Error message should contain status code and status text
			await expect(repo.getAll()).rejects.toThrow(new RegExp(`${status}`));
		}
	});

	it('should throw error with status and message for non-2xx responses in getById', async () => {
		expect.assertions(12);
		
		// Property: For any non-2xx status code, getById should throw an Error
		const errorStatuses = [
			{ status: 400, statusText: 'Bad Request' },
			{ status: 401, statusText: 'Unauthorized' },
			{ status: 403, statusText: 'Forbidden' },
			{ status: 404, statusText: 'Not Found' },
			{ status: 500, statusText: 'Internal Server Error' },
			{ status: 502, statusText: 'Bad Gateway' }
		];

		for (const { status, statusText } of errorStatuses) {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: false,
				status,
				statusText
			});

			const repo = new HttpTodoRepository(mockFetch);

			// Property: Non-2xx responses should throw
			await expect(repo.getById('test-id')).rejects.toThrow();
			
			// Property: Error message should contain status code and status text
			await expect(repo.getById('test-id')).rejects.toThrow(new RegExp(`${status}`));
		}
	});

	it('should throw error with status and message for non-2xx responses in create', async () => {
		expect.assertions(12);
		
		// Property: For any non-2xx status code, create should throw an Error
		const errorStatuses = [
			{ status: 400, statusText: 'Bad Request' },
			{ status: 401, statusText: 'Unauthorized' },
			{ status: 403, statusText: 'Forbidden' },
			{ status: 422, statusText: 'Unprocessable Entity' },
			{ status: 500, statusText: 'Internal Server Error' },
			{ status: 503, statusText: 'Service Unavailable' }
		];

		const dto: CreateTodoDto = { title: 'Test Todo' };

		for (const { status, statusText } of errorStatuses) {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: false,
				status,
				statusText
			});

			const repo = new HttpTodoRepository(mockFetch);

			// Property: Non-2xx responses should throw
			await expect(repo.create(dto)).rejects.toThrow();
			
			// Property: Error message should contain status code and status text
			await expect(repo.create(dto)).rejects.toThrow(new RegExp(`${status}`));
		}
	});

	it('should throw error with status and message for non-2xx responses in update', async () => {
		expect.assertions(12);
		
		// Property: For any non-2xx status code, update should throw an Error
		const errorStatuses = [
			{ status: 400, statusText: 'Bad Request' },
			{ status: 401, statusText: 'Unauthorized' },
			{ status: 403, statusText: 'Forbidden' },
			{ status: 404, statusText: 'Not Found' },
			{ status: 500, statusText: 'Internal Server Error' },
			{ status: 502, statusText: 'Bad Gateway' }
		];

		const dto: UpdateTodoDto = { title: 'Updated Todo', completed: true };

		for (const { status, statusText } of errorStatuses) {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: false,
				status,
				statusText
			});

			const repo = new HttpTodoRepository(mockFetch);

			// Property: Non-2xx responses should throw
			await expect(repo.update('test-id', dto)).rejects.toThrow();
			
			// Property: Error message should contain status code and status text
			await expect(repo.update('test-id', dto)).rejects.toThrow(new RegExp(`${status}`));
		}
	});

	it('should throw error with status and message for non-2xx responses in delete', async () => {
		expect.assertions(12);
		
		// Property: For any non-2xx status code, delete should throw an Error
		const errorStatuses = [
			{ status: 400, statusText: 'Bad Request' },
			{ status: 401, statusText: 'Unauthorized' },
			{ status: 403, statusText: 'Forbidden' },
			{ status: 404, statusText: 'Not Found' },
			{ status: 500, statusText: 'Internal Server Error' },
			{ status: 502, statusText: 'Bad Gateway' }
		];

		for (const { status, statusText } of errorStatuses) {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: false,
				status,
				statusText
			});

			const repo = new HttpTodoRepository(mockFetch);

			// Property: Non-2xx responses should throw
			await expect(repo.delete('test-id')).rejects.toThrow();
			
			// Property: Error message should contain status code and status text
			await expect(repo.delete('test-id')).rejects.toThrow(new RegExp(`${status}`));
		}
	});

	it('should include descriptive operation context in error messages', async () => {
		expect.assertions(5);
		
		// Property: For any repository operation that fails, the error message should
		// indicate which operation failed
		
		const mockFetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
			statusText: 'Internal Server Error'
		});

		const repo = new HttpTodoRepository(mockFetch);

		// Property: Each operation should have a descriptive error message
		await expect(repo.getAll()).rejects.toThrow(/fetch todos/i);
		await expect(repo.getById('id')).rejects.toThrow(/fetch todo/i);
		await expect(repo.create({ title: 'Test' })).rejects.toThrow(/create todo/i);
		await expect(repo.update('id', { title: 'Test' })).rejects.toThrow(/update todo/i);
		await expect(repo.delete('id')).rejects.toThrow(/delete todo/i);
	});

	it('should not throw for successful 2xx responses', async () => {
		expect.assertions(5);
		
		// Property: For any 2xx status code, repository operations should not throw
		const successStatuses = [200, 201, 204];
		
		for (const status of successStatuses) {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: true,
				status,
				statusText: 'OK',
				json: async () => ({ id: '1', title: 'Test', completed: false, createdAt: '', updatedAt: '' })
			});

			const repo = new HttpTodoRepository(mockFetch);

			// Property: 2xx responses should not throw
			await expect(repo.getAll()).resolves.not.toThrow();
		}

		// Test delete with 204 No Content
		const mockFetchDelete = vi.fn().mockResolvedValue({
			ok: true,
			status: 204,
			statusText: 'No Content'
		});

		const repoDelete = new HttpTodoRepository(mockFetchDelete);
		await expect(repoDelete.delete('id')).resolves.not.toThrow();
		
		// Test create with 201 Created
		const mockFetchCreate = vi.fn().mockResolvedValue({
			ok: true,
			status: 201,
			statusText: 'Created',
			json: async () => ({ id: '1', title: 'Test', completed: false, createdAt: '', updatedAt: '' })
		});

		const repoCreate = new HttpTodoRepository(mockFetchCreate);
		await expect(repoCreate.create({ title: 'Test' })).resolves.not.toThrow();
	});

	it('should throw Error objects (not strings or other types)', async () => {
		expect.assertions(5);
		
		// Property: For any failed repository operation, the thrown value should be an Error instance
		
		const mockFetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
			statusText: 'Internal Server Error'
		});

		const repo = new HttpTodoRepository(mockFetch);

		// Property: All thrown values should be Error instances
		try {
			await repo.getAll();
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
		}

		try {
			await repo.getById('id');
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
		}

		try {
			await repo.create({ title: 'Test' });
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
		}

		try {
			await repo.update('id', { title: 'Test' });
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
		}

		try {
			await repo.delete('id');
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
		}
	});

	it('should handle various client error status codes (4xx)', async () => {
		expect.assertions(10);
		
		// Property: For any 4xx status code, repository should throw an error
		const clientErrors = [
			{ status: 400, statusText: 'Bad Request' },
			{ status: 401, statusText: 'Unauthorized' },
			{ status: 403, statusText: 'Forbidden' },
			{ status: 404, statusText: 'Not Found' },
			{ status: 422, statusText: 'Unprocessable Entity' }
		];

		for (const { status, statusText } of clientErrors) {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: false,
				status,
				statusText
			});

			const repo = new HttpTodoRepository(mockFetch);

			// Property: All 4xx errors should throw
			await expect(repo.getAll()).rejects.toThrow();
			
			// Property: Error should contain status information
			await expect(repo.getAll()).rejects.toThrow(new RegExp(`${status}`));
		}
	});

	it('should handle various server error status codes (5xx)', async () => {
		expect.assertions(10);
		
		// Property: For any 5xx status code, repository should throw an error
		const serverErrors = [
			{ status: 500, statusText: 'Internal Server Error' },
			{ status: 501, statusText: 'Not Implemented' },
			{ status: 502, statusText: 'Bad Gateway' },
			{ status: 503, statusText: 'Service Unavailable' },
			{ status: 504, statusText: 'Gateway Timeout' }
		];

		for (const { status, statusText } of serverErrors) {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: false,
				status,
				statusText
			});

			const repo = new HttpTodoRepository(mockFetch);

			// Property: All 5xx errors should throw
			await expect(repo.getAll()).rejects.toThrow();
			
			// Property: Error should contain status information
			await expect(repo.getAll()).rejects.toThrow(new RegExp(`${status}`));
		}
	});
});
