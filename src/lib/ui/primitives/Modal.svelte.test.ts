import { describe, it, expect, vi } from 'vitest';
import { render } from '@vitest/browser/vitest';
import Modal from './Modal.svelte';

describe('Modal Component', () => {
	it('should not render when open is false', async () => {
		expect.assertions(1);
		const { container } = await render(Modal, {
			props: {
				open: false,
				children: () => 'Modal content'
			}
		});

		const modal = container.querySelector('[role="dialog"]');
		expect(modal).toBeNull();
	});

	it('should render when open is true', async () => {
		expect.assertions(1);
		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Modal content'
			}
		});

		const modal = container.querySelector('[role="dialog"]');
		expect(modal).toBeDefined();
	});

	it('should render children content', async () => {
		expect.assertions(1);
		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Modal content'
			}
		});

		const content = container.textContent;
		expect(content).toContain('Modal content');
	});

	it('should render header snippet when provided', async () => {
		expect.assertions(1);
		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content',
				header: () => 'Modal Title'
			}
		});

		const header = container.querySelector('.border-b');
		expect(header?.textContent).toContain('Modal Title');
	});

	it('should render footer snippet when provided', async () => {
		expect.assertions(1);
		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content',
				footer: () => 'Footer content'
			}
		});

		const footer = container.querySelector('.border-t');
		expect(footer?.textContent).toContain('Footer content');
	});

	it('should have correct accessibility attributes', async () => {
		expect.assertions(2);
		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content'
			}
		});

		const modal = container.querySelector('[role="dialog"]');
		expect(modal?.getAttribute('aria-modal')).toBe('true');
		expect(modal?.getAttribute('role')).toBe('dialog');
	});

	it('should have close button with aria-label', async () => {
		expect.assertions(1);
		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content'
			}
		});

		const closeButton = container.querySelector('button[aria-label="Close modal"]');
		expect(closeButton).toBeDefined();
	});

	it('should apply size classes correctly', async () => {
		expect.assertions(4);

		// Test sm size
		const { container: smContainer } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content',
				size: 'sm'
			}
		});
		expect(smContainer.querySelector('[role="dialog"]')?.className).toContain('max-w-sm');

		// Test md size
		const { container: mdContainer } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content',
				size: 'md'
			}
		});
		expect(mdContainer.querySelector('[role="dialog"]')?.className).toContain('max-w-md');

		// Test lg size
		const { container: lgContainer } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content',
				size: 'lg'
			}
		});
		expect(lgContainer.querySelector('[role="dialog"]')?.className).toContain('max-w-lg');

		// Test xl size
		const { container: xlContainer } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content',
				size: 'xl'
			}
		});
		expect(xlContainer.querySelector('[role="dialog"]')?.className).toContain('max-w-xl');
	});

	it('should call onclose when close button is clicked', async () => {
		expect.assertions(1);
		const handleClose = vi.fn();

		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content',
				onclose: handleClose
			}
		});

		const closeButton = container.querySelector('button[aria-label="Close modal"]');
		closeButton?.click();

		expect(handleClose).toHaveBeenCalled();
	});

	it('should close modal when backdrop is clicked', async () => {
		expect.assertions(1);
		const handleClose = vi.fn();

		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content',
				onclose: handleClose
			}
		});

		const backdrop = container.querySelector('[role="presentation"]');
		backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

		expect(handleClose).toHaveBeenCalled();
	});

	it('should not close when clicking inside modal content', async () => {
		expect.assertions(1);
		const handleClose = vi.fn();

		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content',
				onclose: handleClose
			}
		});

		const modalContent = container.querySelector('[role="dialog"]');
		modalContent?.dispatchEvent(new MouseEvent('click', { bubbles: false }));

		expect(handleClose).not.toHaveBeenCalled();
	});

	it('should have backdrop with correct styling', async () => {
		expect.assertions(1);
		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content'
			}
		});

		const backdrop = container.querySelector('[role="presentation"]');
		expect(backdrop?.className).toContain('fixed');
	});

	it('should apply custom class prop', async () => {
		expect.assertions(1);
		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content',
				class: 'custom-modal-class'
			}
		});

		const modal = container.querySelector('[role="dialog"]');
		expect(modal?.className).toContain('custom-modal-class');
	});

	it('should pass close function to header snippet', async () => {
		expect.assertions(1);
		let closeFunction: (() => void) | null = null;

		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content',
				header: ({ close }) => {
					closeFunction = close;
					return 'Header';
				}
			}
		});

		expect(typeof closeFunction).toBe('function');
	});

	it('should pass close function to footer snippet', async () => {
		expect.assertions(1);
		let closeFunction: (() => void) | null = null;

		const { container } = await render(Modal, {
			props: {
				open: true,
				children: () => 'Content',
				footer: ({ close }) => {
					closeFunction = close;
					return 'Footer';
				}
			}
		});

		expect(typeof closeFunction).toBe('function');
	});
});
