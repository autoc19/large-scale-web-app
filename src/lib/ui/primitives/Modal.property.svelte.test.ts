import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Modal from './Modal.svelte';

/**
 * Property 8: Modal Open State
 * 
 * For any Modal component, when the open prop is false, 
 * the modal should not be visible in the DOM or should have display:none.
 * 
 * **Feature: infrastructure-setup, Property 8: Modal Open State**
 * **Validates: Requirements 4.7**
 * 
 * This property test validates that the Modal component correctly
 * controls its visibility based on the open prop, ensuring that
 * when open is false, the modal is not rendered in the DOM,
 * and when open is true, the modal is properly rendered with
 * all its elements accessible.
 */
describe('Property 8: Modal Open State', () => {
	it('should not render modal in DOM when open is false', async () => {
		expect.assertions(3);
		
		// Test that modal is not in DOM when open is false
		const { container } = await render(Modal, {
			props: {
				open: false,
				children: () => 'Modal content'
			}
		});

		// Property: When open is false, modal should not be in DOM
		const dialog = container.querySelector('[role="dialog"]');
		const backdrop = container.querySelector('[role="presentation"]');
		const closeButton = container.querySelector('button[aria-label="Close modal"]');
		
		expect(dialog).toBeNull();
		expect(backdrop).toBeNull();
		expect(closeButton).toBeNull();
	});

	it('should render modal in DOM when open is true', async () => {
		expect.assertions(3);
		
		// Test that modal is in DOM when open is true
		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Modal content'
			}
		});

		// Property: When open is true, modal should be in DOM
		const dialog = container.querySelector('[role="dialog"]');
		const backdrop = container.querySelector('[role="presentation"]');
		const closeButton = container.querySelector('button[aria-label="Close modal"]');
		
		expect(dialog).not.toBeNull();
		expect(backdrop).not.toBeNull();
		expect(closeButton).not.toBeNull();
	});

	it('should toggle visibility when open prop changes', async () => {
		expect.assertions(6);
		
		// Test that modal visibility changes reactively with open prop
		const { container, rerender } = await render(Modal, {
			props: {
				open: false,
				children: () => 'Modal content'
			}
		});

		// Initially closed
		let dialog = container.querySelector('[role="dialog"]');
		expect(dialog).toBeNull();

		// Open modal
		await rerender({ open: true });
		dialog = container.querySelector('[role="dialog"]');
		expect(dialog).not.toBeNull();

		// Close modal
		await rerender({ open: false });
		dialog = container.querySelector('[role="dialog"]');
		expect(dialog).toBeNull();

		// Open again
		await rerender({ open: true });
		dialog = container.querySelector('[role="dialog"]');
		expect(dialog).not.toBeNull();

		// Close again
		await rerender({ open: false });
		dialog = container.querySelector('[role="dialog"]');
		expect(dialog).toBeNull();

		// Final open
		await rerender({ open: true });
		dialog = container.querySelector('[role="dialog"]');
		expect(dialog).not.toBeNull();
	});

	it('should not render modal content when closed', async () => {
		expect.assertions(1);
		
		// Test that modal content is not in DOM when closed
		const testContent = 'Secret modal content that should not be visible';
		
		const { container } = await render(Modal, {
			props: {
				open: false,
				children: () => testContent
			}
		});

		// Property: When closed, modal content should not be in DOM
		expect(container.textContent).not.toContain(testContent);
	});

	it('should render modal content when open', async () => {
		expect.assertions(1);
		
		// Test that modal content container is in DOM when open
		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Visible modal content'
			}
		});

		// Property: When open, modal content container should be in DOM
		// The content div has specific classes for padding
		const contentDiv = container.querySelector('[role="dialog"] > .px-6.py-4');
		expect(contentDiv).not.toBeNull();
	});

	it('should not render header when closed', async () => {
		expect.assertions(1);
		
		// Test that header snippet is not rendered when modal is closed
		const headerContent = 'Modal Header';
		
		const { container } = await render(Modal, {
			props: {
				open: false,
				children: () => 'Content',
				header: () => headerContent
			}
		});

		// Property: When closed, header should not be in DOM
		expect(container.textContent).not.toContain(headerContent);
	});

	it('should render header when open', async () => {
		expect.assertions(1);
		
		// Test that header container is rendered when modal is open
		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content',
				header: () => 'Modal Header'
			}
		});

		// Property: When open, header container should be in DOM
		// Header has border-b class
		const headerDiv = container.querySelector('.border-b.border-gray-200');
		expect(headerDiv).not.toBeNull();
	});

	it('should not render footer when closed', async () => {
		expect.assertions(1);
		
		// Test that footer snippet is not rendered when modal is closed
		const footerContent = 'Modal Footer';
		
		const { container } = await render(Modal, {
			props: {
				open: false,
				children: () => 'Content',
				footer: () => footerContent
			}
		});

		// Property: When closed, footer should not be in DOM
		expect(container.textContent).not.toContain(footerContent);
	});

	it('should render footer when open', async () => {
		expect.assertions(1);
		
		// Test that footer container is rendered when modal is open
		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content',
				footer: () => 'Modal Footer'
			}
		});

		// Property: When open, footer container should be in DOM
		// Footer has border-t class
		const footerDiv = container.querySelector('.border-t.border-gray-200');
		expect(footerDiv).not.toBeNull();
	});

	it('should maintain open state across different sizes', async () => {
		expect.assertions(8);
		
		// Test that open state works correctly with all size variants
		const sizes: Array<'sm' | 'md' | 'lg' | 'xl'> = ['sm', 'md', 'lg', 'xl'];
		
		for (const size of sizes) {
			// Test closed state
			const { container: closedContainer } = await render(Modal, {
				props: {
					open: false,
					size,
					children: () => 'Content'
				}
			});
			
			expect(closedContainer.querySelector('[role="dialog"]')).toBeNull();
			
			// Test open state
			const { container: openContainer } = await render(Modal, {
				props: {
					open: true,
					size,
					children: () => 'Content'
				}
			});
			
			expect(openContainer.querySelector('[role="dialog"]')).not.toBeNull();
		}
	});

	it('should maintain open state with custom class', async () => {
		expect.assertions(2);
		
		// Test that open state works correctly with custom classes
		const customClass = 'custom-modal-class';
		
		// Closed with custom class
		const { container: closedContainer } = await render(Modal, {
			props: {
				open: false,
				class: customClass,
				children: () => 'Content'
			}
		});
		
		expect(closedContainer.querySelector('[role="dialog"]')).toBeNull();
		
		// Open with custom class
		const { container: openContainer } = await render(Modal, {
			props: {
				open: true,
				class: customClass,
				children: () => 'Content'
			}
		});
		
		const dialog = openContainer.querySelector('[role="dialog"]');
		expect(dialog).not.toBeNull();
	});

	it('should handle rapid open/close state changes', async () => {
		expect.assertions(100);
		
		// Test that modal handles rapid state changes correctly
		const { container, rerender } = await render(Modal, {
			props: {
				open: false,
				children: () => 'Content'
			}
		});

		// Simulate rapid open/close toggles
		for (let i = 0; i < 50; i++) {
			// Open
			await rerender({ open: true });
			let dialog = container.querySelector('[role="dialog"]');
			expect(dialog).not.toBeNull();
			
			// Close
			await rerender({ open: false });
			dialog = container.querySelector('[role="dialog"]');
			expect(dialog).toBeNull();
		}
	});

	it('should not render accessibility attributes when closed', async () => {
		expect.assertions(1);
		
		// Test that ARIA attributes are not in DOM when modal is closed
		const { container } = await render(Modal, {
			props: {
				open: false,
				children: () => 'Content'
			}
		});

		// Property: When closed, aria-modal should not be in DOM
		const ariaModal = container.querySelector('[aria-modal="true"]');
		expect(ariaModal).toBeNull();
	});

	it('should render accessibility attributes when open', async () => {
		expect.assertions(2);
		
		// Test that ARIA attributes are in DOM when modal is open
		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content'
			}
		});

		// Property: When open, aria-modal and role should be present
		const dialog = container.querySelector('[role="dialog"]');
		expect(dialog?.getAttribute('aria-modal')).toBe('true');
		expect(dialog?.getAttribute('role')).toBe('dialog');
	});

	it('should maintain open state with all props combinations', async () => {
		expect.assertions(4);
		
		// Test that open state works with complex prop combinations
		const complexProps = {
			size: 'lg' as const,
			class: 'custom-class',
			header: () => 'Header',
			footer: () => 'Footer',
			children: () => 'Content'
		};
		
		// Closed with all props
		const { container: closedContainer } = await render(Modal, {
			props: {
				...complexProps,
				open: false
			}
		});
		
		expect(closedContainer.querySelector('[role="dialog"]')).toBeNull();
		expect(closedContainer.querySelector('.border-b')).toBeNull();
		
		// Open with all props
		const { container: openContainer } = await render(Modal, {
			props: {
				...complexProps,
				open: true
			}
		});
		
		expect(openContainer.querySelector('[role="dialog"]')).not.toBeNull();
		const headerDiv = openContainer.querySelector('.border-b.border-gray-200');
		expect(headerDiv).not.toBeNull();
	});

	it('should preserve open state behavior with onclose callback', async () => {
		expect.assertions(2);
		
		// Test that open state works correctly with onclose callback
		const onclose = () => {
			// Callback function
		};
		
		// Closed with callback
		const { container: closedContainer } = await render(Modal, {
			props: {
				open: false,
				onclose,
				children: () => 'Content'
			}
		});
		
		expect(closedContainer.querySelector('[role="dialog"]')).toBeNull();
		
		// Open with callback
		const { container: openContainer } = await render(Modal, {
			props: {
				open: true,
				onclose,
				children: () => 'Content'
			}
		});
		
		expect(openContainer.querySelector('[role="dialog"]')).not.toBeNull();
	});

	it('should handle initial open state correctly', async () => {
		expect.assertions(2);
		
		// Test that modal respects initial open state
		
		// Initially closed
		const { container: initiallyClosedContainer } = await render(Modal, {
			props: {
				open: false,
				children: () => 'Content'
			}
		});
		
		expect(initiallyClosedContainer.querySelector('[role="dialog"]')).toBeNull();
		
		// Initially open
		const { container: initiallyOpenContainer } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content'
			}
		});
		
		expect(initiallyOpenContainer.querySelector('[role="dialog"]')).not.toBeNull();
	});

	it('should not leak DOM elements when toggling open state', async () => {
		expect.assertions(6);
		
		// Test that DOM is properly cleaned up when modal closes
		const { container, rerender } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content'
			}
		});

		// Count elements when open
		let dialogs = container.querySelectorAll('[role="dialog"]');
		let backdrops = container.querySelectorAll('[role="presentation"]');
		expect(dialogs.length).toBe(1);
		expect(backdrops.length).toBe(1);

		// Close and verify cleanup
		await rerender({ open: false });
		dialogs = container.querySelectorAll('[role="dialog"]');
		backdrops = container.querySelectorAll('[role="presentation"]');
		expect(dialogs.length).toBe(0);
		expect(backdrops.length).toBe(0);

		// Reopen and verify single instance
		await rerender({ open: true });
		dialogs = container.querySelectorAll('[role="dialog"]');
		backdrops = container.querySelectorAll('[role="presentation"]');
		expect(dialogs.length).toBe(1);
		expect(backdrops.length).toBe(1);
	});
});
