import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createHttpClient } from './http-client';

// Note: HTTP client uses publicConfig.apiBase from environment
// In tests, this defaults to http://localhost:3000/api (from .env)
const BASE_URL = 'http://localhost:3000/api';

describe('HttpClient', () => {
	let mockFetch: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockFetch = vi.fn();
	});

	describe('GET requests', () => {
		it('should construct correct URL for GET request', async () => {
			expect.assertions(2);

			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => ({ data: 'test' })
			});

			const client = createHttpClient(mockFetch);
			await client.get('/users');

			expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/users`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			});
			expect(mockFetch).toHaveBeenCalledTimes(1);
		});

		it('should return parsed JSON response', async () => {
			expect.assertions(1);

			const mockData = { id: 1, name: 'Test User' };
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => mockData
			});

			const client = createHttpClient(mockFetch);
			const result = await client.get('/users/1');

			expect(result).toEqual(mockData);
		});
	});

	describe('POST requests', () => {
		it('should send correct payload for POST request', async () => {
			expect.assertions(2);

			const payload = { name: 'New User', email: 'user@example.com' };
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => ({ id: 1, ...payload })
			});

			const client = createHttpClient(mockFetch);
			await client.post('/users', payload);

			expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/users`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			expect(mockFetch).toHaveBeenCalledTimes(1);
		});
	});

	describe('PUT requests', () => {
		it('should send correct payload for PUT request', async () => {
			expect.assertions(2);

			const payload = { name: 'Updated User' };
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => ({ id: 1, ...payload })
			});

			const client = createHttpClient(mockFetch);
			await client.put('/users/1', payload);

			expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/users/1`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			expect(mockFetch).toHaveBeenCalledTimes(1);
		});
	});

	describe('DELETE requests', () => {
		it('should call correct endpoint for DELETE request', async () => {
			expect.assertions(2);

			mockFetch.mockResolvedValue({
				ok: true,
				status: 204
			});

			const client = createHttpClient(mockFetch);
			await client.delete('/users/1');

			expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/users/1`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' }
			});
			expect(mockFetch).toHaveBeenCalledTimes(1);
		});
	});

	describe('Error handling', () => {
		it('should throw error for 4xx responses', async () => {
			expect.assertions(1);

			mockFetch.mockResolvedValue({
				ok: false,
				status: 404,
				statusText: 'Not Found'
			});

			const client = createHttpClient(mockFetch);

			await expect(client.get('/users/999')).rejects.toThrow('HTTP Error: 404 Not Found');
		});

		it('should throw error for 5xx responses', async () => {
			expect.assertions(1);

			mockFetch.mockResolvedValue({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error'
			});

			const client = createHttpClient(mockFetch);

			await expect(client.get('/users')).rejects.toThrow('HTTP Error: 500 Internal Server Error');
		});

		it('should handle network errors', async () => {
			expect.assertions(1);

			mockFetch.mockRejectedValue(new Error('Network error'));

			const client = createHttpClient(mockFetch);

			await expect(client.get('/users')).rejects.toThrow('Network request failed: Network error');
		});

		it('should handle JSON parse errors', async () => {
			expect.assertions(1);

			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => {
					throw new Error('Invalid JSON');
				}
			});

			const client = createHttpClient(mockFetch);

			await expect(client.get('/users')).rejects.toThrow('Network request failed: Invalid JSON');
		});
	});
});
