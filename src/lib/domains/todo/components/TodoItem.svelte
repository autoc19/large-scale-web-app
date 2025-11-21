<script lang="ts">
	/**
	 * TodoItem Component
	 *
	 * Displays a single todo item with toggle and delete actions.
	 * Uses UI primitives for consistent styling.
	 *
	 * @component
	 */
	import Button from '$lib/ui/primitives/Button.svelte';
	import type { TodoItem } from '../models/todo.types';
	import * as m from '$lib/paraglide/messages';

	interface Props {
		todo: TodoItem;
		onToggle: (id: string) => void;
		onDelete: (id: string) => void;
		onSelect: (id: string) => void;
		class?: string;
	}

	let { todo, onToggle, onDelete, onSelect, class: className = '', ...rest }: Props = $props();

	function handleToggle(e: MouseEvent): void {
		e.stopPropagation();
		onToggle(todo.id);
	}

	function handleDelete(e: MouseEvent): void {
		e.stopPropagation();
		onDelete(todo.id);
	}

	function handleSelect(): void {
		onSelect(todo.id);
	}
</script>

<div
	class="flex items-center justify-between rounded border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md {className}"
	onclick={handleSelect}
	role="button"
	tabindex="0"
	{...rest}
>
	<span class="flex-1 {todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'}">
		{todo.title}
	</span>

	<div class="ml-4 flex gap-2">
		<Button onclick={handleToggle} variant={todo.completed ? 'secondary' : 'primary'} size="sm">
			{todo.completed ? m.mark_incomplete() : m.mark_complete()}
		</Button>

		<Button onclick={handleDelete} variant="danger" size="sm">{m.delete()}</Button>
	</div>
</div>
