<script module>
	/**
	 * TodoList Component Stories
	 *
	 * Storybook stories for the TodoList component demonstrating
	 * different states: multiple todos, loading, error, and empty.
	 *
	 * Requirements: 10.2
	 */

	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TodoList from './TodoList.svelte';

	const { Story } = defineMeta({
		title: 'Domains/Todo/TodoList',
		component: TodoList,
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import { TODO_SERVICE_KEY } from '$lib/core/context/keys';
	import { TodoService } from '../services/todo.service.svelte';
	import type { TodoRepository } from '../repositories/todo.repository';
	import type { TodoItem, CreateTodoDto, UpdateTodoDto } from '../models/todo.types';

	// Mock repository for stories
	class MockTodoRepository implements TodoRepository {
		async getAll(): Promise<TodoItem[]> {
			return [];
		}

		async getById(id: string): Promise<TodoItem> {
			throw new Error('Not implemented');
		}

		async create(dto: CreateTodoDto): Promise<TodoItem> {
			throw new Error('Not implemented');
		}

		async update(id: string, dto: UpdateTodoDto): Promise<TodoItem> {
			throw new Error('Not implemented');
		}

		async delete(id: string): Promise<void> {
			return Promise.resolve();
		}
	}

	// Mock data
	const mockTodos: TodoItem[] = [
		{
			id: '1',
			title: 'Complete project documentation',
			completed: false,
			createdAt: '2024-01-15T10:00:00Z',
			updatedAt: '2024-01-15T10:00:00Z'
		},
		{
			id: '2',
			title: 'Review pull requests',
			completed: true,
			createdAt: '2024-01-14T09:00:00Z',
			updatedAt: '2024-01-15T14:30:00Z'
		},
		{
			id: '3',
			title: 'Update dependencies',
			completed: false,
			createdAt: '2024-01-15T11:00:00Z',
			updatedAt: '2024-01-15T11:00:00Z'
		},
		{
			id: '4',
			title: 'Write unit tests',
			completed: true,
			createdAt: '2024-01-13T08:00:00Z',
			updatedAt: '2024-01-14T16:00:00Z'
		},
		{
			id: '5',
			title: 'Deploy to staging',
			completed: false,
			createdAt: '2024-01-15T12:00:00Z',
			updatedAt: '2024-01-15T12:00:00Z'
		}
	];
</script>

<!-- Story: Multiple Todos -->
<Story name="MultipleTodos">
	{#snippet children()}
		{@const mockRepo = new MockTodoRepository()}
		{@const service = new TodoService(mockRepo, mockTodos)}
		{setContext(TODO_SERVICE_KEY, service)}
		<div class="max-w-2xl">
			<div class="mb-4 rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">Multiple Todos State</p>
				<p class="text-xs text-blue-700">
					Displaying a list with {mockTodos.length} todos ({service.completedCount} completed, {service.pendingCount} pending)
				</p>
			</div>
			<TodoList />
		</div>
	{/snippet}
</Story>

<!-- Story: Loading State -->
<Story name="LoadingState">
	{#snippet children()}
		{@const mockRepo = new MockTodoRepository()}
		{@const service = new TodoService(mockRepo, [])}
		{service.loading = true}
		{setContext(TODO_SERVICE_KEY, service)}
		<div class="max-w-2xl">
			<div class="mb-4 rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">Loading State</p>
				<p class="text-xs text-blue-700">
					Displays a loading spinner while fetching todos from the server.
				</p>
			</div>
			<TodoList />
		</div>
	{/snippet}
</Story>

<!-- Story: Error State -->
<Story name="ErrorState">
	{#snippet children()}
		{@const mockRepo = new MockTodoRepository()}
		{@const service = new TodoService(mockRepo, [])}
		{service.error = 'Failed to load todos: Network connection error. Please check your internet connection and try again.'}
		{setContext(TODO_SERVICE_KEY, service)}
		<div class="max-w-2xl">
			<div class="mb-4 rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">Error State</p>
				<p class="text-xs text-blue-700">
					Displays an error message when something goes wrong during data fetching.
				</p>
			</div>
			<TodoList />
		</div>
	{/snippet}
</Story>

<!-- Story: Empty State -->
<Story name="EmptyState">
	{#snippet children()}
		{@const mockRepo = new MockTodoRepository()}
		{@const service = new TodoService(mockRepo, [])}
		{setContext(TODO_SERVICE_KEY, service)}
		<div class="max-w-2xl">
			<div class="mb-4 rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">Empty State</p>
				<p class="text-xs text-blue-700">
					Displays a friendly message when there are no todos in the list.
				</p>
			</div>
			<TodoList />
		</div>
	{/snippet}
</Story>

<!-- Story: All Completed -->
<Story name="AllCompleted">
	{#snippet children()}
		{@const completedTodos = mockTodos.map(todo => ({ ...todo, completed: true }))}
		{@const mockRepo = new MockTodoRepository()}
		{@const service = new TodoService(mockRepo, completedTodos)}
		{setContext(TODO_SERVICE_KEY, service)}
		<div class="max-w-2xl">
			<div class="mb-4 rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">All Completed</p>
				<p class="text-xs text-blue-700">
					All {completedTodos.length} todos are marked as completed.
				</p>
			</div>
			<TodoList />
		</div>
	{/snippet}
</Story>

<!-- Story: All Pending -->
<Story name="AllPending">
	{#snippet children()}
		{@const pendingTodos = mockTodos.map(todo => ({ ...todo, completed: false }))}
		{@const mockRepo = new MockTodoRepository()}
		{@const service = new TodoService(mockRepo, pendingTodos)}
		{setContext(TODO_SERVICE_KEY, service)}
		<div class="max-w-2xl">
			<div class="mb-4 rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">All Pending</p>
				<p class="text-xs text-blue-700">
					All {pendingTodos.length} todos are pending completion.
				</p>
			</div>
			<TodoList />
		</div>
	{/snippet}
</Story>

<!-- Story: Single Todo -->
<Story name="SingleTodo">
	{#snippet children()}
		{@const singleTodo = [mockTodos[0]]}
		{@const mockRepo = new MockTodoRepository()}
		{@const service = new TodoService(mockRepo, singleTodo)}
		{setContext(TODO_SERVICE_KEY, service)}
		<div class="max-w-2xl">
			<div class="mb-4 rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">Single Todo</p>
				<p class="text-xs text-blue-700">
					Displays a list with just one todo item.
				</p>
			</div>
			<TodoList />
		</div>
	{/snippet}
</Story>

<!-- Story: Long List -->
<Story name="LongList">
	{#snippet children()}
		{@const longList: TodoItem[] = Array.from({ length: 15 }, (_, i) => ({
			id: `${i + 1}`,
			title: `Todo item ${i + 1}: ${i % 3 === 0 ? 'High priority task that needs immediate attention' : i % 2 === 0 ? 'Medium priority task' : 'Regular task'}`,
			completed: i % 3 === 0,
			createdAt: new Date(2024, 0, 15 - i).toISOString(),
			updatedAt: new Date(2024, 0, 15 - i).toISOString()
		}))}
		{@const mockRepo = new MockTodoRepository()}
		{@const service = new TodoService(mockRepo, longList)}
		{setContext(TODO_SERVICE_KEY, service)}
		<div class="max-w-2xl">
			<div class="mb-4 rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">Long List</p>
				<p class="text-xs text-blue-700">
					Displays a longer list with {longList.length} todos to test scrolling and performance.
				</p>
			</div>
			<TodoList />
		</div>
	{/snippet}
</Story>

<!-- Story: Error with Todos -->
<Story name="ErrorWithTodos">
	{#snippet children()}
		{@const mockRepo = new MockTodoRepository()}
		{@const service = new TodoService(mockRepo, mockTodos)}
		{service.error = 'Failed to update todo: Server returned 500 Internal Server Error'}
		{setContext(TODO_SERVICE_KEY, service)}
		<div class="max-w-2xl">
			<div class="mb-4 rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">Error with Existing Todos</p>
				<p class="text-xs text-blue-700">
					Shows how errors are displayed when there are already todos in the list.
				</p>
			</div>
			<TodoList />
		</div>
	{/snippet}
</Story>

<!-- Story: Interactive Demo -->
<Story name="Interactive">
	{#snippet children()}
		{@const mockRepo = new MockTodoRepository()}
		{@const service = new TodoService(mockRepo, [...mockTodos])}
		{setContext(TODO_SERVICE_KEY, service)}
		
		<div class="max-w-2xl space-y-4">
			<div class="rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">Interactive Demo</p>
				<p class="text-xs text-blue-700">
					Try toggling todos or deleting them to see the list update in real-time.
				</p>
			</div>

			<div class="flex gap-2">
				<button
					onclick={() => {
						service.items = [...mockTodos];
						service.error = null;
						service.loading = false;
					}}
					class="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
				>
					Reset
				</button>
				<button
					onclick={() => {
						service.loading = true;
						setTimeout(() => {
							service.loading = false;
						}, 2000);
					}}
					class="rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700"
				>
					Simulate Loading
				</button>
				<button
					onclick={() => {
						service.error = 'Simulated error message';
					}}
					class="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
				>
					Trigger Error
				</button>
				<button
					onclick={() => {
						service.items = [];
						service.error = null;
					}}
					class="rounded bg-yellow-600 px-3 py-1 text-sm text-white hover:bg-yellow-700"
				>
					Clear All
				</button>
			</div>

			<TodoList />
		</div>
	{/snippet}
</Story>
