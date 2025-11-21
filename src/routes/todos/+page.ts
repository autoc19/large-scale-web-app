/**
 * Todo Page Load Function
 *
 * Universal load function that fetches todos from the API.
 * Uses HttpTodoRepository with SvelteKit's fetch for SSR compatibility.
 */

import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	// Instantiate repository with SvelteKit's fetch for SSR compatibility
	const repo = new HttpTodoRepository(fetch);

	// Fetch all todos
	const items = await repo.getAll();

	// Return data to the page component
	return {
		items
	};
};
