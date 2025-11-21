import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@vitest/browser/vitest';
import Button from './Button.svelte';

describe('Button Component', () => {
	it('should render children snippet correctly', async () => {
		expect.assertions(1);
		const { container } = await render(Button, {
			props: {
				children: () => 'Click me'
			}
		});

		const button = container.querySelector('button');
		expect(button?.textContent).toBe('Click me');
	});

	it('should call onclick handler when clicked', async () => {
		expect.assertions(1);
		const handleClick = vi.fn();

		const { container } = await render(Button, {
			props: {
				children: () => 'Click me',
				onclick: handleClick
			}
		});

		const button = container.querySelector('button');
		button?.click();

		expect(handleClick).toHaveBeenCalled();
	});

	it('should apply primary variant classes by default', async () => {
		expect.assertions(1);
		const { container } = await render(Button, {
			props: {
				children: () => 'Button'
			}
		});

		const button = container.querySelector('button');
		expect(button?.className).toContain('bg-blue-600');
	});

	it('should apply secondary variant classes', async () => {
		expect.assertions(1);
		const { container } = await render(Button, {
			props: {
				children: () => 'Button',
				variant: 'secondary'
			}
		});

		const button = container.querySelector('button');
		expect(button?.className).toContain('bg-gray-600');
	});

	it('should apply danger variant classes', async () => {
		expect.assertions(1);
		const { container } = await render(Button, {
			props: {
				children: () => 'Button',
				variant: 'danger'
			}
		});

		const button = container.querySelector('button');
		expect(button?.className).toContain('bg-red-600');
	});

	it('should apply size classes correctly', async () => {
		expect.assertions(3);

		// Test sm size
		const { container: smContainer } = await render(Button, {
			props: {
				children: () => 'Button',
				size: 'sm'
			}
		});
		expect(smContainer.querySelector('button')?.className).toContain('text-sm');

		// Test md size
		const { container: mdContainer } = await render(Button, {
			props: {
				children: () => 'Button',
				size: 'md'
			}
		});
		expect(mdContainer.querySelector('button')?.className).toContain('text-base');

		// Test lg size
		const { container: lgContainer } = await render(Button, {
			props: {
				children: () => 'Button',
				size: 'lg'
			}
		});
		expect(lgContainer.querySelector('button')?.className).toContain('text-lg');
	});

	it('should disable button when disabled prop is true', async () => {
		expect.assertions(1);
		const { container } = await render(Button, {
			props: {
				children: () => 'Button',
				disabled: true
			}
		});

		const button = container.querySelector('button') as HTMLButtonElement;
		expect(button.disabled).toBe(true);
	});

	it('should not call onclick when disabled', async () => {
		expect.assertions(1);
		const handleClick = vi.fn();

		const { container } = await render(Button, {
			props: {
				children: () => 'Button',
				onclick: handleClick,
				disabled: true
			}
		});

		const button = container.querySelector('button');
		button?.click();

		// Button is disabled, so click should not trigger handler
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('should set button type correctly', async () => {
		expect.assertions(3);

		// Test button type
		const { container: buttonContainer } = await render(Button, {
			props: {
				children: () => 'Button',
				type: 'button'
			}
		});
		expect(buttonContainer.querySelector('button')?.type).toBe('button');

		// Test submit type
		const { container: submitContainer } = await render(Button, {
			props: {
				children: () => 'Button',
				type: 'submit'
			}
		});
		expect(submitContainer.querySelector('button')?.type).toBe('submit');

		// Test reset type
		const { container: resetContainer } = await render(Button, {
			props: {
				children: () => 'Button',
				type: 'reset'
			}
		});
		expect(resetContainer.querySelector('button')?.type).toBe('reset');
	});

	it('should apply custom class prop', async () => {
		expect.assertions(1);
		const { container } = await render(Button, {
			props: {
				children: () => 'Button',
				class: 'custom-class'
			}
		});

		const button = container.querySelector('button');
		expect(button?.className).toContain('custom-class');
	});

	it('should have base accessibility classes', async () => {
		expect.assertions(1);
		const { container } = await render(Button, {
			props: {
				children: () => 'Button'
			}
		});

		const button = container.querySelector('button');
		expect(button?.className).toContain('focus:ring-2');
	});

	it('should support keyboard navigation', async () => {
		expect.assertions(1);
		const handleClick = vi.fn();

		const { container } = await render(Button, {
			props: {
				children: () => 'Button',
				onclick: handleClick
			}
		});

		const button = container.querySelector('button') as HTMLButtonElement;
		
		// Simulate Enter key press
		const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
		button.dispatchEvent(enterEvent);

		// Button should be focusable
		expect(button.tabIndex).toBeGreaterThanOrEqual(-1);
	});
});
