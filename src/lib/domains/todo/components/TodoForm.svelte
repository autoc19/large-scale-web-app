<script lang="ts">
	/**
	 * TodoForm Component
	 *
	 * Form for creating new todos using Superforms + Zod validation.
	 * Uses progressive enhancement with the enhance action.
	 *
	 * @component
	 */
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ActionResult } from '@sveltejs/kit';
	import Button from '$lib/ui/primitives/Button.svelte';
	import Input from '$lib/ui/primitives/Input.svelte';
	import type { CreateTodoSchema } from '../models/todo.schema';
	import * as m from '$lib/paraglide/messages';

	interface Props {
		data: { form: SuperValidated<CreateTodoSchema> };
	}

	let { data }: Props = $props();

	// Initialize superForm with the form data from the server
	const { form, errors, enhance, submitting } = superForm(data.form, {
		resetForm: true,
		onResult: ({ result }: { result: ActionResult }) => {
			if (result.type === 'success') {
				// Form submitted successfully
				// The page will reload and show the new todo
			}
		}
	});
</script>

<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
	<h2 class="mb-4 text-lg font-semibold text-gray-900">{m.add_todo()}</h2>

	<form method="POST" action="?/create" use:enhance class="space-y-4">
		<Input
			name="title"
			bind:value={$form.title}
			label={m.todo_title()}
			placeholder={m.todo_title()}
			error={Array.isArray($errors.title)
				? $errors.title[0]
				: typeof $errors.title === 'string'
					? $errors.title
					: undefined}
			required
			disabled={$submitting}
		/>

		<Button type="submit" variant="primary" disabled={$submitting} class="w-full">
			{$submitting ? m.loading() : m.create()}
		</Button>
	</form>
</div>
