<script module>
	/**
	 * TodoItem Component Stories
	 *
	 * Storybook stories for the TodoItem component demonstrating
	 * different states and interactions.
	 *
	 * Requirements: 10.1
	 */

	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TodoItem from './TodoItem.svelte';
	import { fn } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'Domains/Todo/TodoItem',
		component: TodoItem,
		tags: ['autodocs'],
		argTypes: {
			todo: {
				description: 'The todo item to display'
			},
			onToggle: {
				description: 'Callback when toggle button is clicked'
			},
			onDelete: {
				description: 'Callback when delete button is clicked'
			},
			onSelect: {
				description: 'Callback when todo item is clicked'
			}
		},
		args: {
			onToggle: fn(),
			onDelete: fn(),
			onSelect: fn()
		}
	});
</script>

<script lang="ts">
	import type { TodoItem as TodoItemType } from '../models/todo.types';

	// Mock data for stories
	const pendingTodo: TodoItemType = {
		id: '1',
		title: 'Complete project documentation',
		completed: false,
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z'
	};

	const completedTodo: TodoItemType = {
		id: '2',
		title: 'Review pull requests',
		completed: true,
		createdAt: '2024-01-14T09:00:00Z',
		updatedAt: '2024-01-15T14:30:00Z'
	};

	const longTitleTodo: TodoItemType = {
		id: '3',
		title:
			'This is a very long todo title that demonstrates how the component handles lengthy text content. It should wrap properly and maintain good readability even with extended descriptions that span multiple lines.',
		completed: false,
		createdAt: '2024-01-15T11:00:00Z',
		updatedAt: '2024-01-15T11:00:00Z'
	};

	const longTitleCompletedTodo: TodoItemType = {
		id: '4',
		title:
			'Another long todo title but this one is completed. It should display with line-through styling while still being readable and properly formatted across multiple lines.',
		completed: true,
		createdAt: '2024-01-14T08:00:00Z',
		updatedAt: '2024-01-15T16:00:00Z'
	};

	// State for interactive story
	let interactiveTodo = $state<TodoItemType>({
		id: '5',
		title: 'Interactive todo - try clicking the buttons!',
		completed: false,
		createdAt: '2024-01-15T12:00:00Z',
		updatedAt: '2024-01-15T12:00:00Z'
	});

	let actionLog = $state<string[]>([]);

	function handleToggle(id: string): void {
		interactiveTodo.completed = !interactiveTodo.completed;
		actionLog = [...actionLog, `Toggled todo ${id} - now ${interactiveTodo.completed ? 'completed' : 'pending'}`];
	}

	function handleDelete(id: string): void {
		actionLog = [...actionLog, `Delete clicked for todo ${id}`];
	}

	function handleSelect(id: string): void {
		actionLog = [...actionLog, `Selected todo ${id}`];
	}
</script>

<!-- Story: Pending Todo -->
<Story name="Pending" args={{ todo: pendingTodo }}>
	<TodoItem todo={pendingTodo} onToggle={fn()} onDelete={fn()} onSelect={fn()} />
</Story>

<!-- Story: Completed Todo -->
<Story name="Completed" args={{ todo: completedTodo }}>
	<TodoItem todo={completedTodo} onToggle={fn()} onDelete={fn()} onSelect={fn()} />
</Story>

<!-- Story: Long Title (Pending) -->
<Story name="LongTitlePending" args={{ todo: longTitleTodo }}>
	<TodoItem todo={longTitleTodo} onToggle={fn()} onDelete={fn()} onSelect={fn()} />
</Story>

<!-- Story: Long Title (Completed) -->
<Story name="LongTitleCompleted" args={{ todo: longTitleCompletedTodo }}>
	<TodoItem todo={longTitleCompletedTodo} onToggle={fn()} onDelete={fn()} onSelect={fn()} />
</Story>

<!-- Story: Interactive Demo -->
<Story name="Interactive">
	{#snippet children()}
		<div class="space-y-4">
			<div class="rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">Interactive Demo</p>
				<p class="text-xs text-blue-700">
					Click the todo item to select it, use the buttons to toggle completion or delete.
				</p>
			</div>

			<TodoItem
				todo={interactiveTodo}
				onToggle={handleToggle}
				onDelete={handleDelete}
				onSelect={handleSelect}
			/>

			{#if actionLog.length > 0}
				<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
					<p class="mb-2 text-sm font-medium text-gray-900">Action Log:</p>
					<ul class="space-y-1">
						{#each actionLog as action}
							<li class="text-xs text-gray-600">• {action}</li>
						{/each}
					</ul>
					<button
						onclick={() => (actionLog = [])}
						class="mt-2 text-xs text-blue-600 hover:text-blue-800"
					>
						Clear log
					</button>
				</div>
			{/if}
		</div>
	{/snippet}
</Story>

<!-- Story: Multiple States Showcase -->
<Story name="AllStates">
	{#snippet children()}
		<div class="space-y-4">
			<div>
				<p class="mb-2 text-sm font-medium text-gray-700">Pending Todo:</p>
				<TodoItem todo={pendingTodo} onToggle={fn()} onDelete={fn()} onSelect={fn()} />
			</div>

			<div>
				<p class="mb-2 text-sm font-medium text-gray-700">Completed Todo:</p>
				<TodoItem todo={completedTodo} onToggle={fn()} onDelete={fn()} onSelect={fn()} />
			</div>

			<div>
				<p class="mb-2 text-sm font-medium text-gray-700">Long Title (Pending):</p>
				<TodoItem todo={longTitleTodo} onToggle={fn()} onDelete={fn()} onSelect={fn()} />
			</div>

			<div>
				<p class="mb-2 text-sm font-medium text-gray-700">Long Title (Completed):</p>
				<TodoItem todo={longTitleCompletedTodo} onToggle={fn()} onDelete={fn()} onSelect={fn()} />
			</div>
		</div>
	{/snippet}
</Story>

<!-- Story: Custom Styling -->
<Story name="CustomStyling">
	{#snippet children()}
		<div class="space-y-4">
			<div>
				<p class="mb-2 text-sm font-medium text-gray-700">With Custom Class:</p>
				<TodoItem
					todo={pendingTodo}
					onToggle={fn()}
					onDelete={fn()}
					onSelect={fn()}
					class="border-2 border-blue-500"
				/>
			</div>

			<div>
				<p class="mb-2 text-sm font-medium text-gray-700">Multiple Items in List:</p>
				<div class="space-y-2">
					<TodoItem todo={pendingTodo} onToggle={fn()} onDelete={fn()} onSelect={fn()} />
					<TodoItem todo={completedTodo} onToggle={fn()} onDelete={fn()} onSelect={fn()} />
					<TodoItem
						todo={{ ...pendingTodo, id: '6', title: 'Another pending task' }}
						onToggle={fn()}
						onDelete={fn()}
						onSelect={fn()}
					/>
				</div>
			</div>
		</div>
	{/snippet}
</Story>
