<script module>
	/**
	 * Button Component Stories
	 *
	 * Storybook stories for the Button component demonstrating
	 * all variants, sizes, states, and button types.
	 *
	 * Requirements: 4.3, 4.4
	 */

	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from './Button.svelte';
	import { fn } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'UI/Primitives/Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			variant: {
				control: 'select',
				options: ['primary', 'secondary', 'danger'],
				description: 'Visual style variant of the button'
			},
			size: {
				control: 'select',
				options: ['sm', 'md', 'lg'],
				description: 'Size of the button'
			},
			disabled: {
				control: 'boolean',
				description: 'Whether the button is disabled'
			},
			type: {
				control: 'select',
				options: ['button', 'submit', 'reset'],
				description: 'HTML button type attribute'
			}
		},
		args: {
			onclick: fn()
		}
	});
</script>

<!-- Story: Primary Variant -->
<Story name="Primary" args={{ variant: 'primary' }}>
	<Button variant="primary">Primary Button</Button>
</Story>

<!-- Story: Secondary Variant -->
<Story name="Secondary" args={{ variant: 'secondary' }}>
	<Button variant="secondary">Secondary Button</Button>
</Story>

<!-- Story: Danger Variant -->
<Story name="Danger" args={{ variant: 'danger' }}>
	<Button variant="danger">Delete</Button>
</Story>

<!-- Story: Small Size -->
<Story name="Small" args={{ size: 'sm', variant: 'primary' }}>
	<Button size="sm" variant="primary">Small Button</Button>
</Story>

<!-- Story: Medium Size (Default) -->
<Story name="Medium" args={{ size: 'md', variant: 'primary' }}>
	<Button size="md" variant="primary">Medium Button</Button>
</Story>

<!-- Story: Large Size -->
<Story name="Large" args={{ size: 'lg', variant: 'primary' }}>
	<Button size="lg" variant="primary">Large Button</Button>
</Story>

<!-- Story: Disabled State -->
<Story name="Disabled" args={{ disabled: true, variant: 'primary' }}>
	<Button disabled variant="primary">Disabled Button</Button>
</Story>

<!-- Story: Button Type (default) -->
<Story name="ButtonType" args={{ type: 'button', variant: 'primary' }}>
	<Button type="button" variant="primary">Button Type</Button>
</Story>

<!-- Story: Submit Type -->
<Story name="SubmitType" args={{ type: 'submit', variant: 'primary' }}>
	<Button type="submit" variant="primary">Submit Form</Button>
</Story>

<!-- Story: Reset Type -->
<Story name="ResetType" args={{ type: 'reset', variant: 'secondary' }}>
	<Button type="reset" variant="secondary">Reset Form</Button>
</Story>

<!-- Story: All Variants Showcase -->
<Story name="AllVariants">
	<div class="flex gap-4">
		<Button variant="primary">Primary</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="danger">Danger</Button>
	</div>
</Story>

<!-- Story: All Sizes Showcase -->
<Story name="AllSizes">
	<div class="flex items-center gap-4">
		<Button size="sm">Small</Button>
		<Button size="md">Medium</Button>
		<Button size="lg">Large</Button>
	</div>
</Story>

<!-- Story: All Types Showcase -->
<Story name="AllTypes">
	<div class="flex gap-4">
		<Button type="button">Button</Button>
		<Button type="submit" variant="primary">Submit</Button>
		<Button type="reset" variant="secondary">Reset</Button>
	</div>
</Story>

<!-- Story: Disabled States Showcase -->
<Story name="DisabledStates">
	<div class="flex gap-4">
		<Button disabled variant="primary">Disabled Primary</Button>
		<Button disabled variant="secondary">Disabled Secondary</Button>
		<Button disabled variant="danger">Disabled Danger</Button>
	</div>
</Story>
