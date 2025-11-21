import { describe, it, expect, vi } from 'vitest';
import { render } from '@vitest/browser/vitest';
import Input from './Input.svelte';

describe('Input Component', () => {
	it('should render input element', async () => {
		expect.assertions(1);
		const { container } = await render(Input, {
			props: {
				value: ''
			}
		});

		const input = container.querySelector('input');
		expect(input).toBeDefined();
	});

	it('should support value binding', async () => {
		expect.assertions(1);
		const { container } = await render(Input, {
			props: {
				value: 'test value'
			}
		});

		const input = container.querySelector('input') as HTMLInputElement;
		expect(input.value).toBe('test value');
	});

	it('should update value when input changes', async () => {
		expect.assertions(1);
		const { container } = await render(Input, {
			props: {
				value: ''
			}
		});

		const input = container.querySelector('input') as HTMLInputElement;
		input.value = 'new value';
		input.dispatchEvent(new Event('input'));

		expect(input.value).toBe('new value');
	});

	it('should display label when provided', async () => {
		expect.assertions(1);
		const { container } = await render(Input, {
			props: {
				value: '',
				label: 'Email'
			}
		});

		const label = container.querySelector('label');
		expect(label?.textContent).toContain('Email');
	});

	it('should associate label with input using id', async () => {
		expect.assertions(1);
		const { container } = await render(Input, {
			props: {
				value: '',
				label: 'Email',
				id: 'email-input'
			}
		});

		const label = container.querySelector('label');
		const input = container.querySelector('input');
		expect(label?.getAttribute('for')).toBe(input?.id);
	});

	it('should display error message', async () => {
		expect.assertions(1);
		const { container } = await render(Input, {
			props: {
				value: '',
				error: 'This field is required'
			}
		});

		const errorMsg = container.querySelector('[role="alert"]');
		expect(errorMsg?.textContent).toBe('This field is required');
	});

	it('should set aria-invalid when error is present', async () => {
		expect.assertions(1);
		const { container } = await render(Input, {
			props: {
				value: '',
				error: 'Invalid input'
			}
		});

		const input = container.querySelector('input');
		expect(input?.getAttribute('aria-invalid')).toBe('true');
	});

	it('should set aria-invalid to false when no error', async () => {
		expect.assertions(1);
		const { container } = await render(Input, {
			props: {
				value: ''
			}
		});

		const input = container.querySelector('input');
		expect(input?.getAttribute('aria-invalid')).toBe('false');
	});

	it('should set aria-describedby when error is present', async () => {
		expect.assertions(1);
		const { container } = await render(Input, {
			props: {
				value: '',
				error: 'Error message',
				id: 'test-input'
			}
		});

		const input = container.querySelector('input');
		expect(input?.getAttribute('aria-describedby')).toBe('test-input-error');
	});

	it('should support different input types', async () => {
		expect.assertions(4);

		// Test email type
		const { container: emailContainer } = await render(Input, {
			props: {
				value: '',
				type: 'email'
			}
		});
		expect(emailContainer.querySelector('input')?.type).toBe('email');

		// Test password type
		const { container: passwordContainer } = await render(Input, {
			props: {
				value: '',
				type: 'password'
			}
		});
		expect(passwordContainer.querySelector('input')?.type).toBe('password');

		// Test number type
		const { container: numberContainer } = await render(Input, {
			props: {
				value: '',
				type: 'number'
			}
		});
		expect(numberContainer.querySelector('input')?.type).toBe('number');

		// Test tel type
		const { container: telContainer } = await render(Input, {
			props: {
				value: '',
				type: 'tel'
			}
		});
		expect(telContainer.querySelector('input')?.type).toBe('tel');
	});

	it('should set placeholder correctly', async () => {
		expect.assertions(1);
		const { container } = await render(Input, {
			props: {
				value: '',
				placeholder: 'Enter your email'
			}
		});

		const input = container.querySelector('input');
		expect(input?.placeholder).toBe('Enter your email');
	});

	it('should disable input when disabled prop is true', async () => {
		expect.assertions(1);
		const { container } = await render(Input, {
			props: {
				value: '',
				disabled: true
			}
		});

		const input = container.querySelector('input') as HTMLInputElement;
		expect(input.disabled).toBe(true);
	});

	it('should set required attribute when required prop is true', async () => {
		expect.assertions(1);
		const { container } = await render(Input, {
			props: {
				value: '',
				required: true
			}
		});

		const input = container.querySelector('input');
		expect(input?.required).toBe(true);
	});

	it('should display required indicator in label', async () => {
		expect.assertions(1);
		const { container } = await render(Input, {
			props: {
				value: '',
				label: 'Email',
				required: true
			}
		});

		const requiredIndicator = container.querySelector('label span');
		expect(requiredIndicator?.textContent).toBe('*');
	});

	it('should apply custom class prop', async () => {
		expect.assertions(1);
		const { container } = await render(Input, {
			props: {
				value: '',
				class: 'custom-class'
			}
		});

		const input = container.querySelector('input');
		expect(input?.className).toContain('custom-class');
	});

	it('should apply error styling when error is present', async () => {
		expect.assertions(1);
		const { container } = await render(Input, {
			props: {
				value: '',
				error: 'Invalid input'
			}
		});

		const input = container.querySelector('input');
		expect(input?.className).toContain('border-red-300');
	});

	it('should generate unique id if not provided', async () => {
		expect.assertions(2);
		const { container: container1 } = await render(Input, {
			props: {
				value: ''
			}
		});

		const { container: container2 } = await render(Input, {
			props: {
				value: ''
			}
		});

		const input1 = container1.querySelector('input');
		const input2 = container2.querySelector('input');

		expect(input1?.id).toBeDefined();
		expect(input1?.id).not.toBe(input2?.id);
	});
});
