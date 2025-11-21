<script lang="ts">
	/**
	 * Input Component Stories
	 *
	 * Storybook stories for the Input component demonstrating
	 * all input types, states, and configurations.
	 */

	import Input from './Input.svelte';
	import type { Meta, StoryObj } from '@storybook/svelte';

	const meta = {
		title: 'UI/Primitives/Input',
		component: Input,
		tags: ['autodocs'],
		argTypes: {
			type: {
				control: 'select',
				options: ['text', 'email', 'password', 'number', 'tel', 'url']
			},
			disabled: {
				control: 'boolean'
			},
			required: {
				control: 'boolean'
			}
		}
	} satisfies Meta<Input>;

	export default meta;
	type Story = StoryObj<typeof meta>;

	// Text input
	export const Text: Story = {
		args: {
			type: 'text',
			label: 'Text Input',
			placeholder: 'Enter text'
		}
	};

	// Email input
	export const Email: Story = {
		args: {
			type: 'email',
			label: 'Email Address',
			placeholder: 'Enter your email'
		}
	};

	// Password input
	export const Password: Story = {
		args: {
			type: 'password',
			label: 'Password',
			placeholder: 'Enter password'
		}
	};

	// Number input
	export const Number: Story = {
		args: {
			type: 'number',
			label: 'Quantity',
			placeholder: 'Enter number'
		}
	};

	// Telephone input
	export const Telephone: Story = {
		args: {
			type: 'tel',
			label: 'Phone Number',
			placeholder: 'Enter phone number'
		}
	};

	// URL input
	export const URL: Story = {
		args: {
			type: 'url',
			label: 'Website',
			placeholder: 'Enter URL'
		}
	};

	// With label
	export const WithLabel: Story = {
		args: {
			label: 'Full Name',
			placeholder: 'Enter your full name'
		}
	};

	// With error
	export const WithError: Story = {
		args: {
			label: 'Email',
			error: 'Please enter a valid email address'
		}
	};

	// Required field
	export const Required: Story = {
		args: {
			label: 'Required Field',
			required: true,
			placeholder: 'This field is required'
		}
	};

	// Disabled state
	export const Disabled: Story = {
		args: {
			label: 'Disabled Input',
			disabled: true,
			value: 'Cannot edit'
		}
	};

	// All input types
	export const AllTypes: Story = {
		render: () => ({
			Component: Input,
			props: {}
		})
	};
</script>

<div class="space-y-6 max-w-md">
	<Input type="text" label="Text Input" placeholder="Enter text" />
	<Input type="email" label="Email" placeholder="Enter email" />
	<Input type="password" label="Password" placeholder="Enter password" />
	<Input type="number" label="Number" placeholder="Enter number" />
	<Input type="tel" label="Phone" placeholder="Enter phone" />
	<Input type="url" label="Website" placeholder="Enter URL" />
	<Input label="Required" required />
	<Input label="With Error" error="This field has an error" />
	<Input label="Disabled" disabled />
</div>
