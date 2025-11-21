<script lang="ts">
	/**
	 * TodoList Component
	 *
	 * Displays a list of todos with loading, error, and empty states.
	 * Gets the TodoService from context (dependency injection).
	 *
	 * @component
	 */
	import { getContext } from 'svelte';
	import { TODO_SERVICE_KEY } from '$lib/core/context/keys';
	import type { TodoService } from '../services/todo.service.svelte';
	import TodoItem from './TodoItem.svelte';
	import * as m from '$lib/paraglide/messages';

	// Get service from context (injected by page)
	const service = getContext<TodoService>(TODO_SERVICE_KEY);
</script>

<div class="space-y-4">
	<!-- Error State -->
	{#if service.error}
		<div
			class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
			role="alert"
			aria-live="polite"
		>
			<p class="font-semibold">{m.error()}</p>
			<p class="text-sm">{service.error}</p>
		</div>
	{/if}

	<!-- Loading State -->
	{#if service.loading}
		<div class="flex items-center justify-center p-8" role="status" aria-live="polite">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
			></div>
			<span class="ml-3 text-gray-600">{m.loading()}</span>
		</div>
	{/if}

	<!-- Empty State -->
	{#if !service.loading && service.items.length === 0}
		<div class="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
			<p class="text-gray-600">No todos yet. Create one to get started!</p>
		</div>
	{/if}

	<!-- Todo List -->
	{#if !service.loading && service.items.length > 0}
		<div class="space-y-2">
			{#each service.items as todo (todo.id)}
				<TodoItem
					{todo}
					onToggle={(id) => service.toggle(id)}
					onDelete={(id) => service.deleteTodo(id)}
					onSelect={(id) => service.select(id)}
				/>
			{/each}
		</div>

		<!-- Summary -->
		<div class="mt-4 flex justify-between text-sm text-gray-600">
			<span>{m.pending_count({ count: service.pendingCount })}</span>
			<span>{m.completed_count({ count: service.completedCount })}</span>
			<span>{m.todo_count({ count: service.items.length })}</span>
		</div>
	{/if}
</div>
