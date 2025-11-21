import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { setContext } from 'svelte';
import TodoList from './TodoList.svelte';
import { TODO_SERVICE_KEY } from '$lib/core/context/keys';
import { TodoService } from '../services/todo.service.svelte';
import type { TodoItem } from '../models/todo.types';

// Helper component to provide context
const TodoListWithContext = `
<script lang="ts">
	import { setContext } from 'svelte';
	import TodoList from './TodoList.svelte';
	import { TODO_SERVICE_KEY } from '$lib/core/context/keys';
	
	let { service } = $props();
	setContext(TODO_SERVICE_KEY, service);
</script>

<TodoList />
`;

describe('TodoList Component', () => {
	const mockTodos: TodoItem[] = [
		{
			id: '1',
			title: 'Test Todo 1',
			completed: false,
			createdAt: '2024-01-01T00:00:00Z',
			updatedAt: '2024-01-01T00:00:00Z'
		},
		{
			id: '2',
			title: 'Test Todo 2',
			completed: true,
			createdAt: '2024-01-01T00:00:00Z',
			updatedAt: '2024-01-01T00:00:00Z'
		},
		{
			id: '3',
			title: 'Test Todo 3',
			completed: false,
			createdAt: '2024-01-01T00:00:00Z',
			updatedAt: '2024-01-01T00:00:00Z'
		}
	];

	const createMockRepo = () => ({
		getAll: vi.fn(),
		getById: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn()
	});

	it('should render all todos from service', async () => {
		expect.assertions(1);
		const mockRepo = createMockRepo();
		const service = new TodoService(mockRepo, mockTodos);

		const { container } = await render(TodoList, {
			context: new Map([[TODO_SERVICE_KEY, service]])
		});

		// Check that all todos are rendered
		const todoItems = container.querySelectorAll('[role="button"]');
		expect(todoItems.length).toBe(3);
	});

	it('should display loading indicator when loading', async () => {
		expect.assertions(2);
		const mockRepo = createMockRepo();
		const service = new TodoService(mockRepo, []);
		service.loading = true;

		const { container } = await render(TodoList, {
			context: new Map([[TODO_SERVICE_KEY, service]])
		});

		// Check for loading spinner
		const loadingSpinner = container.querySelector('[role="status"]');
		expect(loadingSpinner).toBeTruthy();
		
		// Check for loading text
		expect(loadingSpinner?.textContent).toContain('Loading');
	});

	it('should display error message when error is set', async () => {
		expect.assertions(2);
		const mockRepo = createMockRepo();
		const service = new TodoService(mockRepo, []);
		service.error = 'Failed to load todos';

		const { container } = await render(TodoList, {
			context: new Map([[TODO_SERVICE_KEY, service]])
		});

		// Check for error alert
		const errorAlert = container.querySelector('[role="alert"]');
		expect(errorAlert).toBeTruthy();
		
		// Check error message content
		expect(errorAlert?.textContent).toContain('Failed to load todos');
	});

	it('should display empty state when no todos', async () => {
		expect.assertions(1);
		const mockRepo = createMockRepo();
		const service = new TodoService(mockRepo, []);
		service.loading = false;

		const { container } = await render(TodoList, {
			context: new Map([[TODO_SERVICE_KEY, service]])
		});

		// Check for empty state message
		const emptyState = container.querySelector('.text-gray-600');
		expect(emptyState?.textContent).toContain('No todos yet');
	});

	it('should pass correct props to TodoItem', async () => {
		expect.assertions(3);
		const mockRepo = createMockRepo();
		const service = new TodoService(mockRepo, [mockTodos[0]]);

		const { container } = await render(TodoList, {
			context: new Map([[TODO_SERVICE_KEY, service]])
		});

		// Check that TodoItem is rendered with correct title
		const todoItem = container.querySelector('[role="button"]');
		expect(todoItem).toBeTruthy();
		
		// Check that the title is displayed
		const titleElement = todoItem?.querySelector('span');
		expect(titleElement?.textContent).toBe('Test Todo 1');
		
		// Check that buttons are present (toggle and delete)
		const buttons = todoItem?.querySelectorAll('button');
		expect(buttons?.length).toBe(2);
	});

	it('should display summary with correct counts', async () => {
		expect.assertions(3);
		const mockRepo = createMockRepo();
		const service = new TodoService(mockRepo, mockTodos);

		const { container } = await render(TodoList, {
			context: new Map([[TODO_SERVICE_KEY, service]])
		});

		// Check for summary section
		const summary = container.querySelector('.mt-4');
		expect(summary).toBeTruthy();
		
		// Check counts (2 pending, 1 completed, 3 total)
		const summaryText = summary?.textContent || '';
		expect(summaryText).toContain('2'); // pending count
		expect(summaryText).toContain('1'); // completed count
	});

	it('should not display summary when loading', async () => {
		expect.assertions(1);
		const mockRepo = createMockRepo();
		const service = new TodoService(mockRepo, mockTodos);
		service.loading = true;

		const { container } = await render(TodoList, {
			context: new Map([[TODO_SERVICE_KEY, service]])
		});

		// Summary should not be visible when loading
		const summary = container.querySelector('.mt-4');
		expect(summary).toBeFalsy();
	});

	it('should not display summary when empty', async () => {
		expect.assertions(1);
		const mockRepo = createMockRepo();
		const service = new TodoService(mockRepo, []);
		service.loading = false;

		const { container } = await render(TodoList, {
			context: new Map([[TODO_SERVICE_KEY, service]])
		});

		// Summary should not be visible when empty
		const summary = container.querySelector('.mt-4');
		expect(summary).toBeFalsy();
	});

	it('should call service.toggle when TodoItem toggle is clicked', async () => {
		expect.assertions(1);
		const mockRepo = createMockRepo();
		mockRepo.update.mockResolvedValue(undefined);
		const service = new TodoService(mockRepo, [mockTodos[0]]);
		const toggleSpy = vi.spyOn(service, 'toggle');

		const { container } = await render(TodoList, {
			context: new Map([[TODO_SERVICE_KEY, service]])
		});

		// Click the toggle button
		const buttons = container.querySelectorAll('button');
		const toggleButton = buttons[0] as HTMLButtonElement;
		toggleButton?.click();

		expect(toggleSpy).toHaveBeenCalledWith('1');
	});

	it('should call service.deleteTodo when TodoItem delete is clicked', async () => {
		expect.assertions(1);
		const mockRepo = createMockRepo();
		mockRepo.delete.mockResolvedValue(undefined);
		const service = new TodoService(mockRepo, [mockTodos[0]]);
		const deleteSpy = vi.spyOn(service, 'deleteTodo');

		const { container } = await render(TodoList, {
			context: new Map([[TODO_SERVICE_KEY, service]])
		});

		// Click the delete button
		const buttons = container.querySelectorAll('button');
		const deleteButton = buttons[1] as HTMLButtonElement;
		deleteButton?.click();

		expect(deleteSpy).toHaveBeenCalledWith('1');
	});

	it('should call service.select when TodoItem is clicked', async () => {
		expect.assertions(1);
		const mockRepo = createMockRepo();
		const service = new TodoService(mockRepo, [mockTodos[0]]);
		const selectSpy = vi.spyOn(service, 'select');

		const { container } = await render(TodoList, {
			context: new Map([[TODO_SERVICE_KEY, service]])
		});

		// Click the todo item
		const todoItem = container.querySelector('[role="button"]') as HTMLElement;
		todoItem?.click();

		expect(selectSpy).toHaveBeenCalledWith('1');
	});
});
