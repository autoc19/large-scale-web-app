/**
 * HTTP Client
 *
 * Configured fetch wrapper with error handling and type safety.
 *
 * @module core/api/http-client
 */

import { publicConfig } from '$config/env.public';

/**
 * HTTP Client interface
 */
export interface HttpClient {
	get<T>(url: string, options?: RequestInit): Promise<T>;
	post<T>(url: string, body: unknown, options?: RequestInit): Promise<T>;
	put<T>(url: string, body: unknown, options?: RequestInit): Promise<T>;
	delete<T>(url: string, options?: RequestInit): Promise<T>;
}

/**
 * HTTP Error class
 */
export class HttpError extends Error {
	constructor(
		message: string,
		public status: number,
		public statusText: string
	) {
		super(message);
		this.name = 'HttpError';
	}
}

/**
 * Create HTTP client instance
 *
 * @param fetchFn - Fetch function (use SvelteKit's fetch for SSR compatibility)
 * @returns HTTP client instance
 *
 * @example
 * ```typescript
 * // In +page.ts or +page.server.ts
 * export const load = async ({ fetch }) => {
 *   const client = createHttpClient(fetch);
 *   const data = await client.get<Todo[]>('/todos');
 *   return { data };
 * };
 * ```
 */
export function createHttpClient(fetchFn: typeof fetch): HttpClient {
	const baseUrl = publicConfig.apiBase;

	async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
		const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

		try {
			const response = await fetchFn(fullUrl, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					...options.headers
				}
			});

			if (!response.ok) {
				throw new HttpError(
					`HTTP Error: ${response.status} ${response.statusText}`,
					response.status,
					response.statusText
				);
			}

			// Handle empty responses (204 No Content)
			if (response.status === 204) {
				return undefined as T;
			}

			return await response.json();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}

			// Network errors or other fetch errors
			throw new Error(
				`Network request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	return {
		async get<T>(url: string, options?: RequestInit): Promise<T> {
			return request<T>(url, { ...options, method: 'GET' });
		},

		async post<T>(url: string, body: unknown, options?: RequestInit): Promise<T> {
			return request<T>(url, {
				...options,
				method: 'POST',
				body: JSON.stringify(body)
			});
		},

		async put<T>(url: string, body: unknown, options?: RequestInit): Promise<T> {
			return request<T>(url, {
				...options,
				method: 'PUT',
				body: JSON.stringify(body)
			});
		},

		async delete<T>(url: string, options?: RequestInit): Promise<T> {
			return request<T>(url, { ...options, method: 'DELETE' });
		}
	};
}
