import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createHttpClient, HttpError } from './http-client';

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

/**
 * Property 4: HTTP Client Error Handling
 *
 * For any HTTP request that returns a non-2xx status code, the HTTP client
 * should throw a standardized Error object with status and message.
 *
 * **Feature: infrastructure-setup, Property 4: HTTP Client Error Handling**
 * **Validates: Requirements 5.2**
 *
 * This property-based test verifies that:
 * 1. All non-2xx status codes (4xx and 5xx) throw HttpError
 * 2. The thrown error contains the correct status code
 * 3. The thrown error contains a descriptive message
 * 4. The error message includes both status code and status text
 */
describe('Property 4: HTTP Client Error Handling', () => {
	let mockFetch: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockFetch = vi.fn();
	});

	// Generate all 4xx status codes (400-499)
	const clientErrorCodes = Array.from({ length: 100 }, (_, i) => 400 + i);

	// Generate all 5xx status codes (500-599)
	const serverErrorCodes = Array.from({ length: 100 }, (_, i) => 500 + i);

	// All non-2xx error codes
	const allErrorCodes = [...clientErrorCodes, ...serverErrorCodes];

	it('should throw HttpError for all 4xx status codes', async () => {
		expect.assertions(clientErrorCodes.length);

		const client = createHttpClient(mockFetch);

		for (const statusCode of clientErrorCodes) {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: statusCode,
				statusText: `Client Error ${statusCode}`
			});

			const error = await client.get('/test').catch((e) => e);

			// Property: For any 4xx status code, error should be HttpError with correct status
			expect(error).toBeInstanceOf(HttpError);
		}
	});

	it('should throw HttpError for all 5xx status codes', async () => {
		expect.assertions(serverErrorCodes.length);

		const client = createHttpClient(mockFetch);

		for (const statusCode of serverErrorCodes) {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: statusCode,
				statusText: `Server Error ${statusCode}`
			});

			const error = await client.get('/test').catch((e) => e);

			// Property: For any 5xx status code, error should be HttpError with correct status
			expect(error).toBeInstanceOf(HttpError);
		}
	});

	it('should include correct status code in error for all error codes', async () => {
		expect.assertions(allErrorCodes.length);

		const client = createHttpClient(mockFetch);

		for (const statusCode of allErrorCodes) {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: statusCode,
				statusText: `Error ${statusCode}`
			});

			const error = await client.get('/test').catch((e) => e);

			// Property: For any error response, the error.status should match the HTTP status code
			expect((error as HttpError).status).toBe(statusCode);
		}
	});

	it('should include status text in error message for all error codes', async () => {
		expect.assertions(allErrorCodes.length);

		const client = createHttpClient(mockFetch);

		for (const statusCode of allErrorCodes) {
			const statusText = `Error ${statusCode}`;
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: statusCode,
				statusText
			});

			const error = await client.get('/test').catch((e) => e);

			// Property: For any error response, the error message should contain the status text
			expect((error as HttpError).message).toContain(statusText);
		}
	});

	it('should include status code in error message for all error codes', async () => {
		expect.assertions(allErrorCodes.length);

		const client = createHttpClient(mockFetch);

		for (const statusCode of allErrorCodes) {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: statusCode,
				statusText: `Error ${statusCode}`
			});

			const error = await client.get('/test').catch((e) => e);

			// Property: For any error response, the error message should contain the status code
			expect((error as HttpError).message).toContain(statusCode.toString());
		}
	});

	it('should throw error with consistent format for all HTTP methods', async () => {
		expect.assertions(4);

		const statusCode = 404;
		const statusText = 'Not Found';

		const client = createHttpClient(mockFetch);

		// Test GET
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: statusCode,
			statusText
		});
		const getError = await client.get('/test').catch((e) => e);
		expect((getError as HttpError).status).toBe(statusCode);

		// Test POST
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: statusCode,
			statusText
		});
		const postError = await client.post('/test', {}).catch((e) => e);
		expect((postError as HttpError).status).toBe(statusCode);

		// Test PUT
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: statusCode,
			statusText
		});
		const putError = await client.put('/test', {}).catch((e) => e);
		expect((putError as HttpError).status).toBe(statusCode);

		// Test DELETE
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: statusCode,
			statusText
		});
		const deleteError = await client.delete('/test').catch((e) => e);
		expect((deleteError as HttpError).status).toBe(statusCode);
	});
});
