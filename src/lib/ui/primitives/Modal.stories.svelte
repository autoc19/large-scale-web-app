<script lang="ts">
	/**
	 * Modal Component Stories
	 *
	 * Storybook stories for the Modal component demonstrating
	 * different sizes, configurations, and accessibility features.
	 */

	import Modal from './Modal.svelte';
	import Button from './Button.svelte';
	import type { Meta, StoryObj } from '@storybook/svelte';

	const meta = {
		title: 'UI/Primitives/Modal',
		component: Modal,
		tags: ['autodocs'],
		argTypes: {
			size: {
				control: 'select',
				options: ['sm', 'md', 'lg', 'xl']
			},
			open: {
				control: 'boolean'
			}
		}
	} satisfies Meta<Modal>;

	export default meta;
	type Story = StoryObj<typeof meta>;

	// Small modal
	export const Small: Story = {
		args: {
			open: true,
			size: 'sm',
			children: () => 'Small modal content'
		}
	};

	// Medium modal (default)
	export const Medium: Story = {
		args: {
			open: true,
			size: 'md',
			children: () => 'Medium modal content'
		}
	};

	// Large modal
	export const Large: Story = {
		args: {
			open: true,
			size: 'lg',
			children: () => 'Large modal content'
		}
	};

	// Extra large modal
	export const ExtraLarge: Story = {
		args: {
			open: true,
			size: 'xl',
			children: () => 'Extra large modal content'
		}
	};

	// With header
	export const WithHeader: Story = {
		args: {
			open: true,
			header: () => 'Modal Title',
			children: () => 'Modal content goes here'
		}
	};

	// With footer
	export const WithFooter: Story = {
		args: {
			open: true,
			children: () => 'Modal content',
			footer: ({ close }) => 'Footer content'
		}
	};

	// With header and footer
	export const WithHeaderAndFooter: Story = {
		args: {
			open: true,
			header: () => 'Confirm Action',
			children: () => 'Are you sure you want to proceed?',
			footer: ({ close }) => 'Confirm'
		}
	};

	// Closed state
	export const Closed: Story = {
		args: {
			open: false,
			children: () => 'This modal is closed'
		}
	};

	// Accessibility example
	export const Accessible: Story = {
		args: {
			open: true,
			header: () => 'Accessible Modal',
			children: () => `
				This modal demonstrates accessibility features:
				- Proper ARIA attributes
				- Keyboard navigation (ESC to close)
				- Focus management
				- Semantic HTML
			`,
			footer: ({ close }) => 'Close Modal'
		}
	};
</script>

<div class="space-y-4">
	<div class="text-sm text-gray-600">
		<p>Modal stories are interactive. Click "Open" to see the modal in action.</p>
	</div>

	<div class="space-y-2">
		<h3 class="font-semibold">Sizes</h3>
		<div class="flex gap-2">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</div>
	</div>

	<div class="space-y-2">
		<h3 class="font-semibold">Features</h3>
		<ul class="list-disc list-inside text-sm text-gray-700">
			<li>Header and footer snippets</li>
			<li>Backdrop click to close</li>
			<li>ESC key to close</li>
			<li>Focus management</li>
			<li>ARIA attributes</li>
		</ul>
	</div>
</div>
