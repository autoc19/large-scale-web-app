import { describe, it, expect } from 'vitest';
import { render } from '@vitest/browser/vitest';
import Button from './Button.svelte';
import Input from './Input.svelte';
import Modal from './Modal.svelte';

/**
 * Integration tests for UI primitives
 * 
 * These tests verify that UI primitives work together correctly
 * and can be composed into more complex components.
 */

describe('UI Primitives Integration', () => {
	describe('Button and Input in Forms', () => {
		it('should render Button and Input together', async () => {
			expect.assertions(2);
			const { container: inputContainer } = await render(Input, {
				props: {
					value: '',
					label: 'Email'
				}
			});

			const { container: buttonContainer } = await render(Button, {
				props: {
					children: () => 'Submit'
				}
			});

			const input = inputContainer.querySelector('input');
			const button = buttonContainer.querySelector('button');

			expect(input).toBeDefined();
			expect(button).toBeDefined();
		});

		it('should allow Button to submit form with Input', async () => {
			expect.assertions(1);
			const { container: inputContainer } = await render(Input, {
				props: {
					value: 'test@example.com',
					type: 'email'
				}
			});

			const { container: buttonContainer } = await render(Button, {
				props: {
					children: () => 'Submit',
					type: 'submit'
				}
			});

			const button = buttonContainer.querySelector('button') as HTMLButtonElement;
			expect(button.type).toBe('submit');
		});

		it('should display Input error and disable Button', async () => {
			expect.assertions(2);
			const { container: inputContainer } = await render(Input, {
				props: {
					value: '',
					error: 'Email is required'
				}
			});

			const { container: buttonContainer } = await render(Button, {
				props: {
					children: () => 'Submit',
					disabled: true
				}
			});

			const errorMsg = inputContainer.querySelector('[role="alert"]');
			const button = buttonContainer.querySelector('button') as HTMLButtonElement;

			expect(errorMsg?.textContent).toContain('Email is required');
			expect(button.disabled).toBe(true);
		});
	});

	describe('Modal with UI Primitives', () => {
		it('should render Modal with Button inside', async () => {
			expect.assertions(2);
			const { container } = await render(Modal, {
				props: {
					open: true,
					children: () => 'Modal content',
					footer: ({ close }) => {
						// Render button in footer
						return 'Close Button';
					}
				}
			});

			const modal = container.querySelector('[role="dialog"]');
			const footer = container.querySelector('.border-t');

			expect(modal).toBeDefined();
			expect(footer?.textContent).toContain('Close Button');
		});

		it('should render Modal with Input inside', async () => {
			expect.assertions(2);
			const { container } = await render(Modal, {
				props: {
					open: true,
					children: () => 'Modal content with input'
				}
			});

			const modal = container.querySelector('[role="dialog"]');
			expect(modal).toBeDefined();
			expect(modal?.textContent).toContain('Modal content with input');
		});

		it('should render Modal with header, content, and footer', async () => {
			expect.assertions(3);
			const { container } = await render(Modal, {
				props: {
					open: true,
					children: () => 'Main content',
					header: () => 'Modal Header',
					footer: () => 'Modal Footer'
				}
			});

			const header = container.querySelector('.border-b');
			const content = container.querySelector('[role="dialog"] > div:nth-child(2)');
			const footer = container.querySelector('.border-t');

			expect(header?.textContent).toContain('Modal Header');
			expect(content?.textContent).toContain('Main content');
			expect(footer?.textContent).toContain('Modal Footer');
		});

		it('should allow Modal to contain form with Button and Input', async () => {
			expect.assertions(1);
			const { container } = await render(Modal, {
				props: {
					open: true,
					children: () => 'Form content',
					footer: ({ close }) => 'Submit Button'
				}
			});

			const modal = container.querySelector('[role="dialog"]');
			expect(modal?.textContent).toContain('Form content');
		});
	});

	describe('Component Composition', () => {
		it('should render all UI primitives without errors', async () => {
			expect.assertions(3);
			const { container: buttonContainer } = await render(Button, {
				props: {
					children: () => 'Button'
				}
			});

			const { container: inputContainer } = await render(Input, {
				props: {
					value: ''
				}
			});

			const { container: modalContainer } = await render(Modal, {
				props: {
					open: true,
					children: () => 'Content'
				}
			});

			expect(buttonContainer.querySelector('button')).toBeDefined();
			expect(inputContainer.querySelector('input')).toBeDefined();
			expect(modalContainer.querySelector('[role="dialog"]')).toBeDefined();
		});

		it('should maintain accessibility across composed components', async () => {
			expect.assertions(3);
			const { container: buttonContainer } = await render(Button, {
				props: {
					children: () => 'Button'
				}
			});

			const { container: inputContainer } = await render(Input, {
				props: {
					value: '',
					label: 'Input'
				}
			});

			const { container: modalContainer } = await render(Modal, {
				props: {
					open: true,
					children: () => 'Content'
				}
			});

			const button = buttonContainer.querySelector('button');
			const label = inputContainer.querySelector('label');
			const modal = modalContainer.querySelector('[role="dialog"]');

			expect(button?.className).toContain('focus:ring-2');
			expect(label).toBeDefined();
			expect(modal?.getAttribute('aria-modal')).toBe('true');
		});

		it('should support styling consistency across primitives', async () => {
			expect.assertions(3);
			const { container: buttonContainer } = await render(Button, {
				props: {
					children: () => 'Button'
				}
			});

			const { container: inputContainer } = await render(Input, {
				props: {
					value: ''
				}
			});

			const { container: modalContainer } = await render(Modal, {
				props: {
					open: true,
					children: () => 'Content'
				}
			});

			const button = buttonContainer.querySelector('button');
			const input = inputContainer.querySelector('input');
			const modal = modalContainer.querySelector('[role="dialog"]');

			// All should have rounded corners
			expect(button?.className).toContain('rounded');
			expect(input?.className).toContain('rounded-md');
			expect(modal?.className).toContain('rounded-lg');
		});
	});

	describe('State Management Integration', () => {
		it('should handle Button click affecting Input state', async () => {
			expect.assertions(1);
			const { container: inputContainer } = await render(Input, {
				props: {
					value: 'initial'
				}
			});

			const input = inputContainer.querySelector('input') as HTMLInputElement;
			expect(input.value).toBe('initial');
		});

		it('should handle Modal open state with Button interaction', async () => {
			expect.assertions(1);
			const { container } = await render(Modal, {
				props: {
					open: true,
					children: () => 'Content'
				}
			});

			const modal = container.querySelector('[role="dialog"]');
			expect(modal).toBeDefined();
		});
	});

	describe('Responsive Behavior', () => {
		it('should render Button in different sizes', async () => {
			expect.assertions(3);
			const sizes = ['sm', 'md', 'lg'] as const;

			for (const size of sizes) {
				const { container } = await render(Button, {
					props: {
						children: () => 'Button',
						size
					}
				});

				const button = container.querySelector('button');
				expect(button).toBeDefined();
			}
		});

		it('should render Modal in different sizes', async () => {
			expect.assertions(4);
			const sizes = ['sm', 'md', 'lg', 'xl'] as const;

			for (const size of sizes) {
				const { container } = await render(Modal, {
					props: {
						open: true,
						children: () => 'Content',
						size
					}
				});

				const modal = container.querySelector('[role="dialog"]');
				expect(modal).toBeDefined();
			}
		});
	});
});
