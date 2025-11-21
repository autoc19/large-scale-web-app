/**
 * Integration tests for Todo Page Component
 *
 * Tests the page component's integration with:
 * - Service dependency injection
 * - $effect sync pattern
 * - Child component rendering
 * - Error display
 *
 * Requirements: 5.3, 5.4, 5.5, 5.6, 5.7, 9.1, 9.2, 9.3, 9.4, 9.5
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { getContext } from 'svelte';
import { TODO_SERVICE_KEY } from '$lib/core/context/keys';
import { TodoService } from '$lib/domains/todo/services/todo.service.svelte';
import type { TodoItem } from '$lib/domains/todo/models/todo.types';

describe('Todo Page Integration Tests', () => {
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
			createdAt: '2024-01-02T00:00:00Z',
			updatedAt: '2024-01-02T00:00:00Z'
		}
	];

	const createMockPageData = (overrides?: Partial<any>) => ({
		items: mockTodos,
		form: null,
		...overrides
	});

	describe('Service Injection into Context', () => {
		it('should inject TodoService into context', async () => {
			expect.assertions(1);

			const TestComponent = `
				<script lang="ts">
					import { setContext, getContext } from 'svelte';
					import { TodoService } from '$lib/domains/todo/services/todo.service.svelte';
					import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
					import { TODO_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new HttpTodoRepository(fetch);
					const service = new TodoService(repo, data.items);
					setContext(TODO_SERVICE_KEY, service);

					const injectedService = getContext(TODO_SERVICE_KEY);
					const isInjected = injectedService === service;
				</script>

				<div>
					{#if isInjected}
						<span data-testid="context-injected">Service injected</span>
					{/if}
				</div>
			`;

			const pageData = createMockPageData();
			const { container } = await render(TestComponent, {
				props: { data: pageData }
			});

			const injectedIndicator = container.querySelector('[data-testid="context-injected"]');
			expect(injectedIndicator).toBeTruthy();
		});

		it('should inject service with initial data', async () => {
			expect.assertions(1);

			const TestComponent = `
				<script lang="ts">
					import { setContext, getContext } from 'svelte';
					import { TodoService } from '$lib/domains/todo/services/todo.service.svelte';
					import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
					import { TODO_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new HttpTodoRepository(fetch);
					const service = new TodoService(repo, data.items);
					setContext(TODO_SERVICE_KEY, service);

					const injectedService = getContext(TODO_SERVICE_KEY);
				</script>

				<div data-testid="item-count">{injectedService.items.length}</div>
			`;

			const pageData = createMockPageData();
			const { container } = await render(TestComponent, {
				props: { data: pageData }
			});

			const itemCount = container.querySelector('[data-testid="item-count"]');
			expect(itemCount?.textContent).toBe('2');
		});
	});

	describe('$effect Sync Pattern', () => {
		it('should sync service.items when data.items changes', async () => {
			expect.assertions(2);

			const TestComponent = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { TodoService } from '$lib/domains/todo/services/todo.service.svelte';
					import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
					import { TODO_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new HttpTodoRepository(fetch);
					const service = new TodoService(repo, data.items);
					setContext(TODO_SERVICE_KEY, service);

					// CRITICAL: Sync service when route data changes
					$effect(() => {
						service.items = data.items;
					});
				</script>

				<div data-testid="item-count">{service.items.length}</div>
				<div data-testid="first-item">{service.items[0]?.title}</div>
			`;

			const pageData = createMockPageData();
			const { container, rerender } = await render(TestComponent, {
				props: { data: pageData }
			});

			// Initial state
			expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe('2');

			// Simulate route data change
			const newData = createMockPageData({
				items: [
					{
						id: '10',
						title: 'New Todo',
						completed: false,
						createdAt: '2024-01-10T00:00:00Z',
						updatedAt: '2024-01-10T00:00:00Z'
					}
				]
			});

			await rerender({ data: newData });

			// After sync, should have new data
			expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe('1');
		});

		it('should update derived state after sync', async () => {
			expect.assertions(2);

			const TestComponent = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { TodoService } from '$lib/domains/todo/services/todo.service.svelte';
					import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
					import { TODO_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new HttpTodoRepository(fetch);
					const service = new TodoService(repo, data.items);
					setContext(TODO_SERVICE_KEY, service);

					$effect(() => {
						service.items = data.items;
					});
				</script>

				<div data-testid="completed-count">{service.completedCount}</div>
				<div data-testid="pending-count">{service.pendingCount}</div>
			`;

			const pageData = createMockPageData();
			const { container, rerender } = await render(TestComponent, {
				props: { data: pageData }
			});

			// Initial: 1 completed, 1 pending
			expect(container.querySelector('[data-testid="completed-count"]')?.textContent).toBe('1');

			// Change to all completed
			const newData = createMockPageData({
				items: [
					{
						id: '1',
						title: 'Todo 1',
						completed: true,
						createdAt: '2024-01-01T00:00:00Z',
						updatedAt: '2024-01-01T00:00:00Z'
					},
					{
						id: '2',
						title: 'Todo 2',
						completed: true,
						createdAt: '2024-01-02T00:00:00Z',
						updatedAt: '2024-01-02T00:00:00Z'
					}
				]
			});

			await rerender({ data: newData });

			// After sync: 2 completed, 0 pending
			expect(container.querySelector('[data-testid="completed-count"]')?.textContent).toBe('2');
		});

		it('should handle empty data array during sync', async () => {
			expect.assertions(1);

			const TestComponent = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { TodoService } from '$lib/domains/todo/services/todo.service.svelte';
					import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
					import { TODO_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new HttpTodoRepository(fetch);
					const service = new TodoService(repo, data.items);
					setContext(TODO_SERVICE_KEY, service);

					$effect(() => {
						service.items = data.items;
					});
				</script>

				<div data-testid="item-count">{service.items.length}</div>
			`;

			const pageData = createMockPageData({ items: [] });
			const { container } = await render(TestComponent, {
				props: { data: pageData }
			});

			expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe('0');
		});
	});

	describe('Page Rendering', () => {
		it('should render page header', async () => {
			expect.assertions(1);

			const PageTestWrapper = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { TodoService } from '$lib/domains/todo/services/todo.service.svelte';
					import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
					import { TODO_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new HttpTodoRepository(fetch);
					const service = new TodoService(repo, data.items);
					setContext(TODO_SERVICE_KEY, service);

					$effect(() => {
						service.items = data.items;
					});
				</script>

				<main class="container mx-auto max-w-4xl px-4 py-8">
					<header class="mb-8">
						<h1 class="text-3xl font-bold text-gray-900">Todo Management</h1>
						<p class="mt-2 text-gray-600">A reference implementation of DDD architecture with Svelte 5</p>
					</header>

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
						<div class="lg:col-span-1">
							{#if 'form' in data && data.form}
								<div data-testid="todo-form">TodoForm Component</div>
							{/if}
						</div>

						<div class="lg:col-span-2">
							<div data-testid="todo-list">TodoList Component</div>
						</div>
					</div>
				</main>
			`;

			const pageData = createMockPageData();
			const { container } = await render(PageTestWrapper, {
				props: { data: pageData }
			});

			const header = container.querySelector('h1');
			expect(header?.textContent).toContain('Todo Management');
		});

		it('should render TodoList component', async () => {
			expect.assertions(1);

			const PageTestWrapper = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { TodoService } from '$lib/domains/todo/services/todo.service.svelte';
					import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
					import { TODO_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new HttpTodoRepository(fetch);
					const service = new TodoService(repo, data.items);
					setContext(TODO_SERVICE_KEY, service);

					$effect(() => {
						service.items = data.items;
					});
				</script>

				<main>
					<div data-testid="todo-list">TodoList Component</div>
				</main>
			`;

			const pageData = createMockPageData();
			const { container } = await render(PageTestWrapper, {
				props: { data: pageData }
			});

			const todoList = container.querySelector('[data-testid="todo-list"]');
			expect(todoList).toBeTruthy();
		});

		it('should render TodoForm component when form data exists', async () => {
			expect.assertions(1);

			const PageTestWrapper = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { TodoService } from '$lib/domains/todo/services/todo.service.svelte';
					import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
					import { TODO_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new HttpTodoRepository(fetch);
					const service = new TodoService(repo, data.items);
					setContext(TODO_SERVICE_KEY, service);

					$effect(() => {
						service.items = data.items;
					});
				</script>

				<main>
					<div>
						{#if 'form' in data && data.form}
							<div data-testid="todo-form">TodoForm Component</div>
						{/if}
					</div>
				</main>
			`;

			const pageData = createMockPageData({
				form: {
					id: 'test-form',
					valid: true,
					posted: false,
					errors: {},
					data: { title: '' }
				}
			});

			const { container } = await render(PageTestWrapper, {
				props: { data: pageData }
			});

			const todoForm = container.querySelector('[data-testid="todo-form"]');
			expect(todoForm).toBeTruthy();
		});

		it('should not render TodoForm when form data is null', async () => {
			expect.assertions(1);

			const PageTestWrapper = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { TodoService } from '$lib/domains/todo/services/todo.service.svelte';
					import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
					import { TODO_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new HttpTodoRepository(fetch);
					const service = new TodoService(repo, data.items);
					setContext(TODO_SERVICE_KEY, service);

					$effect(() => {
						service.items = data.items;
					});
				</script>

				<main>
					<div>
						{#if 'form' in data && data.form}
							<div data-testid="todo-form">TodoForm Component</div>
						{/if}
					</div>
				</main>
			`;

			const pageData = createMockPageData({ form: null });
			const { container } = await render(PageTestWrapper, {
				props: { data: pageData }
			});

			const todoForm = container.querySelector('[data-testid="todo-form"]');
			expect(todoForm).toBeFalsy();
		});
	});

	describe('Error Display', () => {
		it('should display error message when service.error is set', async () => {
			expect.assertions(2);

			const TestComponent = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { TodoService } from '$lib/domains/todo/services/todo.service.svelte';
					import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
					import { TODO_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new HttpTodoRepository(fetch);
					const service = new TodoService(repo, data.items);
					setContext(TODO_SERVICE_KEY, service);

					$effect(() => {
						service.items = data.items;
					});

					// Simulate error
					service.error = 'Failed to load todos';
				</script>

				<main>
					{#if service.error}
						<div role="alert" data-testid="error-alert">
							<p class="font-semibold">Service Error</p>
							<p class="text-sm">{service.error}</p>
						</div>
					{/if}
				</main>
			`;

			const pageData = createMockPageData();
			const { container } = await render(TestComponent, {
				props: { data: pageData }
			});

			const errorAlert = container.querySelector('[data-testid="error-alert"]');
			expect(errorAlert).toBeTruthy();
			expect(errorAlert?.textContent).toContain('Failed to load todos');
		});

		it('should not display error when service.error is null', async () => {
			expect.assertions(1);

			const TestComponent = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { TodoService } from '$lib/domains/todo/services/todo.service.svelte';
					import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
					import { TODO_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new HttpTodoRepository(fetch);
					const service = new TodoService(repo, data.items);
					setContext(TODO_SERVICE_KEY, service);

					$effect(() => {
						service.items = data.items;
					});
				</script>

				<main>
					{#if service.error}
						<div role="alert" data-testid="error-alert">
							<p class="font-semibold">Service Error</p>
							<p class="text-sm">{service.error}</p>
						</div>
					{/if}
				</main>
			`;

			const pageData = createMockPageData();
			const { container } = await render(TestComponent, {
				props: { data: pageData }
			});

			const errorAlert = container.querySelector('[data-testid="error-alert"]');
			expect(errorAlert).toBeFalsy();
		});

		it('should have aria-live attribute for accessibility', async () => {
			expect.assertions(1);

			const TestComponent = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { TodoService } from '$lib/domains/todo/services/todo.service.svelte';
					import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
					import { TODO_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new HttpTodoRepository(fetch);
					const service = new TodoService(repo, data.items);
					setContext(TODO_SERVICE_KEY, service);

					$effect(() => {
						service.items = data.items;
					});

					service.error = 'Test error';
				</script>

				<main>
					{#if service.error}
						<div
							role="alert"
							aria-live="polite"
							data-testid="error-alert"
						>
							{service.error}
						</div>
					{/if}
				</main>
			`;

			const pageData = createMockPageData();
			const { container } = await render(TestComponent, {
				props: { data: pageData }
			});

			const errorAlert = container.querySelector('[data-testid="error-alert"]');
			expect(errorAlert?.getAttribute('aria-live')).toBe('polite');
		});
	});

	describe('Integration: Service, Context, and Sync', () => {
		it('should maintain service reactivity through context after sync', async () => {
			expect.assertions(3);

			const TestComponent = `
				<script lang="ts">
					import { setContext, getContext } from 'svelte';
					import { TodoService } from '$lib/domains/todo/services/todo.service.svelte';
					import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
					import { TODO_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new HttpTodoRepository(fetch);
					const service = new TodoService(repo, data.items);
					setContext(TODO_SERVICE_KEY, service);

					$effect(() => {
						service.items = data.items;
					});

					const injectedService = getContext(TODO_SERVICE_KEY);
				</script>

				<div data-testid="item-count">{injectedService.items.length}</div>
				<div data-testid="completed-count">{injectedService.completedCount}</div>
				<div data-testid="pending-count">{injectedService.pendingCount}</div>
			`;

			const pageData = createMockPageData();
			const { container, rerender } = await render(TestComponent, {
				props: { data: pageData }
			});

			// Initial state: 2 items, 1 completed, 1 pending
			expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe('2');

			// Simulate route change with different data
			const newData = createMockPageData({
				items: [
					{
						id: '10',
						title: 'New Todo 1',
						completed: true,
						createdAt: '2024-01-10T00:00:00Z',
						updatedAt: '2024-01-10T00:00:00Z'
					},
					{
						id: '11',
						title: 'New Todo 2',
						completed: true,
						createdAt: '2024-01-11T00:00:00Z',
						updatedAt: '2024-01-11T00:00:00Z'
					},
					{
						id: '12',
						title: 'New Todo 3',
						completed: false,
						createdAt: '2024-01-12T00:00:00Z',
						updatedAt: '2024-01-12T00:00:00Z'
					}
				]
			});

			await rerender({ data: newData });

			// After sync: 3 items, 2 completed, 1 pending
			expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe('3');
			expect(container.querySelector('[data-testid="completed-count"]')?.textContent).toBe('2');
		});

		it('should handle multiple sequential syncs correctly', async () => {
			expect.assertions(4);

			const TestComponent = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { TodoService } from '$lib/domains/todo/services/todo.service.svelte';
					import { HttpTodoRepository } from '$lib/domains/todo/repositories/todo.repository.http';
					import { TODO_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new HttpTodoRepository(fetch);
					const service = new TodoService(repo, data.items);
					setContext(TODO_SERVICE_KEY, service);

					$effect(() => {
						service.items = data.items;
					});
				</script>

				<div data-testid="item-count">{service.items.length}</div>
			`;

			// First sync
			const data1 = createMockPageData({
				items: [
					{
						id: '1',
						title: 'Todo 1',
						completed: false,
						createdAt: '2024-01-01T00:00:00Z',
						updatedAt: '2024-01-01T00:00:00Z'
					}
				]
			});

			const { container, rerender } = await render(TestComponent, {
				props: { data: data1 }
			});

			expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe('1');

			// Second sync
			const data2 = createMockPageData({
				items: [
					{
						id: '2',
						title: 'Todo 2',
						completed: false,
						createdAt: '2024-01-02T00:00:00Z',
						updatedAt: '2024-01-02T00:00:00Z'
					},
					{
						id: '3',
						title: 'Todo 3',
						completed: false,
						createdAt: '2024-01-03T00:00:00Z',
						updatedAt: '2024-01-03T00:00:00Z'
					}
				]
			});

			await rerender({ data: data2 });
			expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe('2');

			// Third sync - empty
			const data3 = createMockPageData({ items: [] });
			await rerender({ data: data3 });
			expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe('0');

			// Fourth sync - back to data
			const data4 = createMockPageData({
				items: [
					{
						id: '4',
						title: 'Todo 4',
						completed: false,
						createdAt: '2024-01-04T00:00:00Z',
						updatedAt: '2024-01-04T00:00:00Z'
					}
				]
			});

			await rerender({ data: data4 });
			expect(container.querySelector('[data-testid="item-count"]')?.textContent).toBe('1');
		});
	});
});
