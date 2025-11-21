/**
 * Dependency Injection Context Keys
 *
 * Symbol keys for Svelte context-based dependency injection.
 * Using Symbols prevents naming collisions.
 *
 * @module core/context/keys
 */

/**
 * HTTP Client context key
 *
 * @example
 * ```typescript
 * // In +page.svelte
 * import { setContext } from 'svelte';
 * import { createHttpClient } from '$core/api/http-client';
 * import { HTTP_CLIENT_KEY } from '$core/context/keys';
 *
 * const client = createHttpClient(fetch);
 * setContext(HTTP_CLIENT_KEY, client);
 * ```
 *
 * @example
 * ```typescript
 * // In child component
 * import { getContext } from 'svelte';
 * import { HTTP_CLIENT_KEY } from '$core/context/keys';
 * import type { HttpClient } from '$core/api/http-client';
 *
 * const client = getContext<HttpClient>(HTTP_CLIENT_KEY);
 * ```
 */
export const HTTP_CLIENT_KEY = Symbol('HTTP_CLIENT');

/**
 * Todo Service context key
 *
 * @example
 * ```typescript
 * // In +page.svelte
 * import { setContext } from 'svelte';
 * import { TodoService } from '$domains/todo/services/todo.service.svelte';
 * import { TODO_SERVICE_KEY } from '$core/context/keys';
 *
 * const service = new TodoService(repo, data.items);
 * setContext(TODO_SERVICE_KEY, service);
 * ```
 *
 * @example
 * ```typescript
 * // In child component
 * import { getContext } from 'svelte';
 * import { TODO_SERVICE_KEY } from '$core/context/keys';
 * import type { TodoService } from '$domains/todo/services/todo.service.svelte';
 *
 * const service = getContext<TodoService>(TODO_SERVICE_KEY);
 * ```
 */
export const TODO_SERVICE_KEY = Symbol('TODO_SERVICE');

/**
 * Future domain service keys will be added here
 *
 * Example:
 * export const AUTH_SERVICE_KEY = Symbol('AUTH_SERVICE');
 * export const USER_SERVICE_KEY = Symbol('USER_SERVICE');
 */
