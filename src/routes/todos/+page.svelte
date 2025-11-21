<script lang="ts">
	/**
	 * Todo Page Component
	 *
	 * Main page for todo management demonstrating the critical $effect sync pattern.
	 * This pattern ensures service state stays synchronized during client-side navigation.
	 *
	 * Architecture:
	 * 1. Load function fetches data (runs on navigation)
	 * 2. Page instantiates service with initial data
	 * 3. Service is injected into context for child components
	 * 4. $effect syncs service state when route data changes (CRITICAL)
	 *
	 * @component
	 */
	import { setContext } from 'svelte';
	import { TodoService } from '$lib/domains/todo/services/todo.service.svelte';
	import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
	import { TODO_SERVICE_KEY } from '$lib/core/context/keys';
	import TodoList from '$lib/domains/todo/components/TodoList.svelte';
	import TodoForm from '$lib/domains/todo/components/TodoForm.svelte';
	import type { PageData } from './$types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { CreateTodoSchema } from '$lib/domains/todo/models/todo.schema';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// 1. Dependency assembly (runs once on mount)
	const repo = new HttpTodoRepository(fetch);
	const service = new TodoService(repo, data.items);

	// 2. Inject service into context for child components
	setContext(TODO_SERVICE_KEY, service);

	// 3. CRITICAL: Sync service state when route data changes
	// Without this, service.items will be stale after client-side navigation
	$effect(() => {
		service.items = data.items;
	});
</script>

<svelte:head>
	<title>Todo Management</title>
	<meta name="description" content="Manage your todos with a clean, intuitive interface" />
</svelte:head>

<main class="container mx-auto max-w-4xl px-4 py-8">
	<header class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900">Todo Management</h1>
		<p class="mt-2 text-gray-600">A reference implementation of DDD architecture with Svelte 5</p>
	</header>

	<!-- Error Display (Service-level errors) -->
	{#if service.error}
		<div
			class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
			role="alert"
			aria-live="polite"
		>
			<p class="font-semibold">Service Error</p>
			<p class="text-sm">{service.error}</p>
		</div>
	{/if}

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Todo Form (1/3 width on large screens) -->
		<div class="lg:col-span-1">
			{#if 'form' in data && data.form}
				<TodoForm data={{ form: data.form as SuperValidated<CreateTodoSchema> }} />
			{/if}
		</div>

		<!-- Todo List (2/3 width on large screens) -->
		<div class="lg:col-span-2">
			<TodoList />
		</div>
	</div>
</main>
