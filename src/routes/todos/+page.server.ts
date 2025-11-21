/**
 * Todo Page Server Functions
 *
 * Server-side load function and form actions for todo management.
 * Uses Superforms + Zod for type-safe form validation.
 */

import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createTodoSchema } from '$lib/domains/todo/models/todo.schema';
import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
import type { PageServerLoad, Actions } from './$types';

/**
 * Server load function
 * Initializes an empty Superform for todo creation
 */
export const load: PageServerLoad = async () => {
	// Initialize empty form with createTodoSchema
	// @ts-expect-error - sveltekit-superforms zod adapter type issue
	const form = await superValidate(zod(createTodoSchema));

	return {
		form
	};
};

/**
 * Form actions
 */
export const actions: Actions = {
	/**
	 * Create action - handles todo creation
	 */
	create: async ({ request, fetch }) => {
		// Validate form data against Zod schema
		// @ts-expect-error - sveltekit-superforms zod adapter type issue
		const form = await superValidate(request, zod(createTodoSchema));

		// Return validation errors if form is invalid
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// Instantiate repository with server fetch
			const repo = new HttpTodoRepository(fetch);

			// Create the todo with validated data
			await repo.create({ title: form.data.title as string });

			// Return success with message
			return message(form, 'Todo created successfully!');
		} catch (err) {
			// Handle repository errors
			const errorMessage = (err as Error).message;
			return message(form, errorMessage, { status: 500 });
		}
	}
};
