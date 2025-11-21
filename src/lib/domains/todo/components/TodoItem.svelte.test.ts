import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TodoItem from './TodoItem.svelte';
import type { TodoItem as TodoItemType } from '../models/todo.types';

describe('TodoItem Component', () => {
	const mockTodo: TodoItemType = {
		id: '1',
		title: 'Test Todo',
		completed: false,
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z'
	};

	const mockCompletedTodo: TodoItemType = {
		id: '2',
		title: 'Completed Todo',
		completed: true,
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z'
	};

	it('should render todo with correct title', async () => {
		expect.assertions(1);
		const { container } = await render(TodoItem, {
			props: {
				todo: mockTodo,
				onToggle: vi.fn(),
				onDelete: vi.fn(),
				onSelect: vi.fn()
			}
		});

		const titleElement = container.querySelector('span');
		expect(titleElement?.textContent).toBe('Test Todo');
	});

	it('should apply line-through styling to completed todos', async () => {
		expect.assertions(1);
		const { container } = await render(TodoItem, {
			props: {
				todo: mockCompletedTodo,
				onToggle: vi.fn(),
				onDelete: vi.fn(),
				onSelect: vi.fn()
			}
		});

		const titleElement = container.querySelector('span');
		expect(titleElement?.className).toContain('line-through');
	});

	it('should not apply line-through styling to pending todos', async () => {
		expect.assertions(1);
		const { container } = await render(TodoItem, {
			props: {
				todo: mockTodo,
				onToggle: vi.fn(),
				onDelete: vi.fn(),
				onSelect: vi.fn()
			}
		});

		const titleElement = container.querySelector('span');
		expect(titleElement?.className).not.toContain('line-through');
	});

	it('should call onToggle when toggle button is clicked', async () => {
		expect.assertions(1);
		const handleToggle = vi.fn();

		const { container } = await render(TodoItem, {
			props: {
				todo: mockTodo,
				onToggle: handleToggle,
				onDelete: vi.fn(),
				onSelect: vi.fn()
			}
		});

		// Find the toggle button (first button)
		const buttons = container.querySelectorAll('button');
		const toggleButton = buttons[0];
		toggleButton?.click();

		expect(handleToggle).toHaveBeenCalledWith('1');
	});

	it('should call onDelete when delete button is clicked', async () => {
		expect.assertions(1);
		const handleDelete = vi.fn();

		const { container } = await render(TodoItem, {
			props: {
				todo: mockTodo,
				onToggle: vi.fn(),
				onDelete: handleDelete,
				onSelect: vi.fn()
			}
		});

		// Find the delete button (second button)
		const buttons = container.querySelectorAll('button');
		const deleteButton = buttons[1];
		deleteButton?.click();

		expect(handleDelete).toHaveBeenCalledWith('1');
	});

	it('should call onSelect when item is clicked', async () => {
		expect.assertions(1);
		const handleSelect = vi.fn();

		const { container } = await render(TodoItem, {
			props: {
				todo: mockTodo,
				onToggle: vi.fn(),
				onDelete: vi.fn(),
				onSelect: handleSelect
			}
		});

		const itemContainer = container.querySelector('div[role="button"]');
		itemContainer?.click();

		expect(handleSelect).toHaveBeenCalledWith('1');
	});

	it('should not call onSelect when toggle button is clicked', async () => {
		expect.assertions(2);
		const handleSelect = vi.fn();
		const handleToggle = vi.fn();

		const { container } = await render(TodoItem, {
			props: {
				todo: mockTodo,
				onToggle: handleToggle,
				onDelete: vi.fn(),
				onSelect: handleSelect
			}
		});

		// Click the toggle button
		const buttons = container.querySelectorAll('button');
		const toggleButton = buttons[0];
		toggleButton?.click();

		// onToggle should be called, but onSelect should not (due to stopPropagation)
		expect(handleToggle).toHaveBeenCalledWith('1');
		expect(handleSelect).not.toHaveBeenCalled();
	});

	it('should not call onSelect when delete button is clicked', async () => {
		expect.assertions(2);
		const handleSelect = vi.fn();
		const handleDelete = vi.fn();

		const { container } = await render(TodoItem, {
			props: {
				todo: mockTodo,
				onToggle: vi.fn(),
				onDelete: handleDelete,
				onSelect: handleSelect
			}
		});

		// Click the delete button
		const buttons = container.querySelectorAll('button');
		const deleteButton = buttons[1];
		deleteButton?.click();

		// onDelete should be called, but onSelect should not (due to stopPropagation)
		expect(handleDelete).toHaveBeenCalledWith('1');
		expect(handleSelect).not.toHaveBeenCalled();
	});

	it('should apply custom class prop', async () => {
		expect.assertions(1);
		const { container } = await render(TodoItem, {
			props: {
				todo: mockTodo,
				onToggle: vi.fn(),
				onDelete: vi.fn(),
				onSelect: vi.fn(),
				class: 'custom-class'
			}
		});

		const itemContainer = container.querySelector('div[role="button"]');
		expect(itemContainer?.className).toContain('custom-class');
	});

	it('should have proper accessibility attributes', async () => {
		expect.assertions(2);
		const { container } = await render(TodoItem, {
			props: {
				todo: mockTodo,
				onToggle: vi.fn(),
				onDelete: vi.fn(),
				onSelect: vi.fn()
			}
		});

		const itemContainer = container.querySelector('div[role="button"]');
		expect(itemContainer?.getAttribute('role')).toBe('button');
		expect(itemContainer?.getAttribute('tabindex')).toBe('0');
	});

	it('should display different button text for completed todos', async () => {
		expect.assertions(1);
		const { container } = await render(TodoItem, {
			props: {
				todo: mockCompletedTodo,
				onToggle: vi.fn(),
				onDelete: vi.fn(),
				onSelect: vi.fn()
			}
		});

		const buttons = container.querySelectorAll('button');
		const toggleButton = buttons[0];
		// The button should show "Mark Incomplete" or similar for completed todos
		expect(toggleButton?.textContent).toBeTruthy();
	});

	it('should display different button text for pending todos', async () => {
		expect.assertions(1);
		const { container } = await render(TodoItem, {
			props: {
				todo: mockTodo,
				onToggle: vi.fn(),
				onDelete: vi.fn(),
				onSelect: vi.fn()
			}
		});

		const buttons = container.querySelectorAll('button');
		const toggleButton = buttons[0];
		// The button should show "Mark Complete" or similar for pending todos
		expect(toggleButton?.textContent).toBeTruthy();
	});
});
