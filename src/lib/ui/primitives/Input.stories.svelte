<script module>
	/**
	 * Input Component Stories
	 *
	 * Storybook stories for the Input component demonstrating
	 * all input types, states, and configurations.
	 *
	 * Requirements: 4.5, 4.6
	 */

	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Input from './Input.svelte';

	const { Story } = defineMeta({
		title: 'UI/Primitives/Input',
		component: Input,
		tags: ['autodocs'],
		argTypes: {
			type: {
				control: 'select',
				options: ['text', 'email', 'password', 'number', 'tel', 'url'],
				description: 'HTML input type attribute'
			},
			placeholder: {
				control: 'text',
				description: 'Placeholder text for the input'
			},
			label: {
				control: 'text',
				description: 'Label text for the input'
			},
			error: {
				control: 'text',
				description: 'Error message to display'
			},
			disabled: {
				control: 'boolean',
				description: 'Whether the input is disabled'
			},
			required: {
				control: 'boolean',
				description: 'Whether the input is required'
			}
		}
	});
</script>

<!-- Story: Text Input Type -->
<Story name="Text" args={{ type: 'text', placeholder: 'Enter text...' }}>
	<Input type="text" placeholder="Enter text..." />
</Story>

<!-- Story: Email Input Type -->
<Story name="Email" args={{ type: 'email', placeholder: 'Enter email...' }}>
	<Input type="email" placeholder="Enter email..." />
</Story>

<!-- Story: Password Input Type -->
<Story name="Password" args={{ type: 'password', placeholder: 'Enter password...' }}>
	<Input type="password" placeholder="Enter password..." />
</Story>

<!-- Story: Number Input Type -->
<Story name="Number" args={{ type: 'number', placeholder: 'Enter number...' }}>
	<Input type="number" placeholder="Enter number..." />
</Story>

<!-- Story: Tel Input Type -->
<Story name="Tel" args={{ type: 'tel', placeholder: 'Enter phone number...' }}>
	<Input type="tel" placeholder="Enter phone number..." />
</Story>

<!-- Story: URL Input Type -->
<Story name="URL" args={{ type: 'url', placeholder: 'Enter URL...' }}>
	<Input type="url" placeholder="Enter URL..." />
</Story>

<!-- Story: With Label -->
<Story name="WithLabel" args={{ label: 'Username', placeholder: 'Enter username...' }}>
	<Input label="Username" placeholder="Enter username..." />
</Story>

<!-- Story: With Label and Placeholder -->
<Story name="WithLabelAndPlaceholder" args={{ label: 'Email Address', placeholder: 'you@example.com', type: 'email' }}>
	<Input label="Email Address" placeholder="you@example.com" type="email" />
</Story>

<!-- Story: Error State -->
<Story name="ErrorState" args={{ label: 'Email', error: 'Please enter a valid email address', type: 'email' }}>
	<Input label="Email" error="Please enter a valid email address" type="email" />
</Story>

<!-- Story: Disabled State -->
<Story name="Disabled" args={{ label: 'Username', placeholder: 'Enter username...', disabled: true }}>
	<Input label="Username" placeholder="Enter username..." disabled />
</Story>

<!-- Story: Required State -->
<Story name="Required" args={{ label: 'Email', placeholder: 'you@example.com', required: true, type: 'email' }}>
	<Input label="Email" placeholder="you@example.com" required type="email" />
</Story>

<!-- Story: Disabled and Required -->
<Story name="DisabledAndRequired" args={{ label: 'Username', placeholder: 'Enter username...', disabled: true, required: true }}>
	<Input label="Username" placeholder="Enter username..." disabled required />
</Story>

<!-- Story: All Input Types Showcase -->
<Story name="AllTypes">
	<div class="space-y-4">
		<Input type="text" label="Text" placeholder="Enter text..." />
		<Input type="email" label="Email" placeholder="you@example.com" />
		<Input type="password" label="Password" placeholder="Enter password..." />
		<Input type="number" label="Number" placeholder="Enter number..." />
		<Input type="tel" label="Phone" placeholder="Enter phone number..." />
		<Input type="url" label="URL" placeholder="https://example.com" />
	</div>
</Story>

<!-- Story: All States Showcase -->
<Story name="AllStates">
	<div class="space-y-4">
		<Input label="Normal" placeholder="Normal input..." />
		<Input label="With Error" placeholder="Input with error..." error="This field is required" />
		<Input label="Disabled" placeholder="Disabled input..." disabled />
		<Input label="Required" placeholder="Required input..." required />
		<Input label="Disabled & Required" placeholder="Disabled & required..." disabled required />
	</div>
</Story>

<!-- Story: Form Example -->
<Story name="FormExample">
	<div class="space-y-4 max-w-md">
		<Input label="Full Name" placeholder="John Doe" required />
		<Input label="Email Address" type="email" placeholder="john@example.com" required />
		<Input label="Phone Number" type="tel" placeholder="+1 (555) 123-4567" />
		<Input label="Password" type="password" placeholder="Enter password..." required />
		<Input label="Confirm Password" type="password" placeholder="Confirm password..." required />
	</div>
</Story>

<!-- Story: Error States Showcase -->
<Story name="ErrorStates">
	<div class="space-y-4">
		<Input label="Email" type="email" error="Please enter a valid email address" />
		<Input label="Password" type="password" error="Password must be at least 8 characters" />
		<Input label="Username" error="This username is already taken" />
	</div>
</Story>
