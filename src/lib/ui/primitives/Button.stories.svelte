<script lang="ts">
	/**
	 * Button Component Stories
	 *
	 * Storybook stories for the Button component demonstrating
	 * all variants, sizes, and states.
	 */

	import Button from './Button.svelte';
	import type { Meta, StoryObj } from '@storybook/svelte';

	const meta = {
		title: 'UI/Primitives/Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			variant: {
				control: 'select',
				options: ['primary', 'secondary', 'danger']
			},
			size: {
				control: 'select',
				options: ['sm', 'md', 'lg']
			},
			disabled: {
				control: 'boolean'
			},
			type: {
				control: 'select',
				options: ['button', 'submit', 'reset']
			}
		}
	} satisfies Meta<Button>;

	export default meta;
	type Story = StoryObj<typeof meta>;

	// Primary variant
	export const Primary: Story = {
		args: {
			variant: 'primary',
			children: () => 'Primary Button'
		}
	};

	// Secondary variant
	export const Secondary: Story = {
		args: {
			variant: 'secondary',
			children: () => 'Secondary Button'
		}
	};

	// Danger variant
	export const Danger: Story = {
		args: {
			variant: 'danger',
			children: () => 'Delete'
		}
	};

	// Small size
	export const Small: Story = {
		args: {
			size: 'sm',
			children: () => 'Small Button'
		}
	};

	// Medium size (default)
	export const Medium: Story = {
		args: {
			size: 'md',
			children: () => 'Medium Button'
		}
	};

	// Large size
	export const Large: Story = {
		args: {
			size: 'lg',
			children: () => 'Large Button'
		}
	};

	// Disabled state
	export const Disabled: Story = {
		args: {
			disabled: true,
			children: () => 'Disabled Button'
		}
	};

	// Submit button
	export const Submit: Story = {
		args: {
			type: 'submit',
			children: () => 'Submit'
		}
	};

	// Reset button
	export const Reset: Story = {
		args: {
			type: 'reset',
			children: () => 'Reset'
		}
	};

	// All variants
	export const AllVariants: Story = {
		render: () => ({
			Component: Button,
			props: {}
		}),
		decorators: [
			() => ({
				Component: Button,
				props: {}
			})
		]
	};
</script>

<div class="space-y-4">
	<div class="flex gap-2">
		<Button variant="primary">Primary</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="danger">Danger</Button>
	</div>

	<div class="flex gap-2">
		<Button size="sm">Small</Button>
		<Button size="md">Medium</Button>
		<Button size="lg">Large</Button>
	</div>

	<div class="flex gap-2">
		<Button disabled>Disabled</Button>
		<Button type="submit">Submit</Button>
		<Button type="reset">Reset</Button>
	</div>
</div>
