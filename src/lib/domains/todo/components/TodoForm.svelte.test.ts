import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TodoForm from './TodoForm.svelte';
import type { SuperValidated } from 'sveltekit-superforms';
import type { CreateTodoSchema } from '../models/todo.schema';

// Mock superForm to avoid lifecycle issues
vi.mock('sveltekit-superforms', () => ({
	superForm: vi.fn((form) => ({
		form: {
			subscribe: vi.fn((cb) => {
				cb({ title: '' });
				return () => {};
			})
		},
		errors: {
			subscribe: vi.fn((cb) => {
				cb({});
				return () => {};
			})
		},
		enhance: vi.fn(),
		submitting: {
			subscribe: vi.fn((cb) => {
				cb(false);
				return () => {};
			})
		}
	}))
}));

describe('TodoForm Component', () => {
	const createMockForm = (
		overrides?: Partial<SuperValidated<CreateTodoSchema>>
	): SuperValidated<CreateTodoSchema> => ({
		id: `form-${Math.random()}`,
		valid: true,
		posted: false,
		errors: {},
		data: {
			title: ''
		},
		constraints: {},
		...overrides
	} as SuperValidated<CreateTodoSchema>);

	it('should render form with input field', async () => {
		expect.assertions(1);
		const mockForm = createMockForm();

		const { container } = await render(TodoForm, {
			props: {
				data: { form: mockForm }
			}
		});

		const input = container.querySelector('input[name="title"]');
		expect(input).toBeDefined();
	});

	it('should render submit button', async () => {
		expect.assertions(1);
		const mockForm = createMockForm();

		const { container } = await render(TodoForm, {
			props: {
				data: { form: mockForm }
			}
		});

		const button = container.querySelector('button[type="submit"]');
		expect(button).toBeDefined();
	});

	it('should have form with correct action and method', async () => {
		expect.assertions(2);
		const mockForm = createMockForm();

		const { container } = await render(TodoForm, {
			props: {
				data: { form: mockForm }
			}
		});

		const form = container.querySelector('form');
		expect(form?.getAttribute('method')).toBe('POST');
		expect(form?.getAttribute('action')).toBe('?/create');
	});

	it('should have input with name attribute title', async () => {
		expect.assertions(1);
		const mockForm = createMockForm();

		const { container } = await render(TodoForm, {
			props: {
				data: { form: mockForm }
			}
		});

		const input = container.querySelector('input[name="title"]');
		expect(input?.getAttribute('name')).toBe('title');
	});

	it('should have required attribute on input', async () => {
		expect.assertions(1);
		const mockForm = createMockForm();

		const { container } = await render(TodoForm, {
			props: {
				data: { form: mockForm }
			}
		});

		const input = container.querySelector('input[name="title"]');
		expect(input?.getAttribute('required')).toBe('');
	});

	it('should render input with label', async () => {
		expect.assertions(1);
		const mockForm = createMockForm();

		const { container } = await render(TodoForm, {
			props: {
				data: { form: mockForm }
			}
		});

		const label = container.querySelector('label');
		expect(label).toBeDefined();
	});

	it('should render form heading', async () => {
		expect.assertions(1);
		const mockForm = createMockForm();

		const { container } = await render(TodoForm, {
			props: {
				data: { form: mockForm }
			}
		});

		const heading = container.querySelector('h2');
		expect(heading).toBeDefined();
	});

	it('should render button with primary variant', async () => {
		expect.assertions(1);
		const mockForm = createMockForm();

		const { container } = await render(TodoForm, {
			props: {
				data: { form: mockForm }
			}
		});

		const button = container.querySelector('button[type="submit"]');
		expect(button?.className).toContain('bg-blue-600');
	});

	it('should have full width button', async () => {
		expect.assertions(1);
		const mockForm = createMockForm();

		const { container } = await render(TodoForm, {
			props: {
				data: { form: mockForm }
			}
		});

		const button = container.querySelector('button[type="submit"]');
		expect(button?.className).toContain('w-full');
	});
});
