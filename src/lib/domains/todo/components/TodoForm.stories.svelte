<script module>
	/**
	 * TodoForm Component Stories
	 *
	 * Storybook stories for the TodoForm component demonstrating
	 * different states: empty form, validation errors, and submitting state.
	 *
	 * Requirements: 10.3
	 */

	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TodoForm from './TodoForm.svelte';

	const { Story } = defineMeta({
		title: 'Domains/Todo/TodoForm',
		component: TodoForm,
		tags: ['autodocs'],
		argTypes: {
			data: {
				description: 'Form data object containing the Superform instance'
			}
		}
	});
</script>

<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { CreateTodoSchema } from '../models/todo.schema';

	/**
	 * Helper function to create a mock Superform object
	 * This simulates the structure returned by sveltekit-superforms
	 */
	function createMockForm(
		title: string = '',
		titleError: string | string[] | undefined = undefined,
		isSubmitting: boolean = false
	): SuperValidated<CreateTodoSchema> {
		return {
			id: 'form-' + Math.random().toString(36).substr(2, 9),
			data: {
				title
			},
			errors: {
				title: titleError
			},
			constraints: {
				title: {
					required: true,
					minlength: 2,
					maxlength: 100
				}
			},
			message: undefined,
			status: 200,
			valid: !titleError,
			posted: false,
			tainted: undefined,
			submitting: isSubmitting,
			delayed: false,
			timeout: false,
			fields: {
				title: {
					name: 'title',
					value: title,
					errors: titleError ? (Array.isArray(titleError) ? titleError : [titleError]) : [],
					constraints: {
						required: true,
						minlength: 2,
						maxlength: 100
					}
				}
			}
		} as unknown as SuperValidated<CreateTodoSchema>;
	}

	// Mock data for different form states
	const emptyForm = createMockForm();
	const formWithShortTitleError = createMockForm('', 'Title must be at least 2 characters');
	const formWithLongTitleError = createMockForm(
		'A'.repeat(101),
		'Title must be less than 100 characters'
	);
	const formWithValidTitle = createMockForm('Complete project documentation');
	const formSubmitting = createMockForm('New todo item', undefined, true);
	const formWithMultipleErrors = createMockForm('', [
		'Title must be at least 2 characters',
		'Title is required'
	]);
</script>

<!-- Story: Empty Form -->
<Story name="EmptyForm" args={{ data: { form: emptyForm } }}>
	{#snippet children()}
		<div class="max-w-md">
			<div class="mb-4 rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">Empty Form State</p>
				<p class="text-xs text-blue-700">
					A fresh form ready for user input with no validation errors.
				</p>
			</div>
			<TodoForm data={{ form: emptyForm }} />
		</div>
	{/snippet}
</Story>

<!-- Story: Validation Error - Short Title -->
<Story name="ValidationErrorShortTitle" args={{ data: { form: formWithShortTitleError } }}>
	{#snippet children()}
		<div class="max-w-md">
			<div class="mb-4 rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">Validation Error - Short Title</p>
				<p class="text-xs text-blue-700">
					Shows validation error when title is too short (less than 2 characters).
				</p>
			</div>
			<TodoForm data={{ form: formWithShortTitleError }} />
		</div>
	{/snippet}
</Story>

<!-- Story: Validation Error - Long Title -->
<Story name="ValidationErrorLongTitle" args={{ data: { form: formWithLongTitleError } }}>
	{#snippet children()}
		<div class="max-w-md">
			<div class="mb-4 rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">Validation Error - Long Title</p>
				<p class="text-xs text-blue-700">
					Shows validation error when title exceeds maximum length (100 characters).
				</p>
			</div>
			<TodoForm data={{ form: formWithLongTitleError }} />
		</div>
	{/snippet}
</Story>

<!-- Story: Submitting State -->
<Story name="SubmittingState" args={{ data: { form: formSubmitting } }}>
	{#snippet children()}
		<div class="max-w-md">
			<div class="mb-4 rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">Submitting State</p>
				<p class="text-xs text-blue-700">
					Shows the form while it's being submitted. The submit button is disabled and shows loading text.
				</p>
			</div>
			<TodoForm data={{ form: formSubmitting }} />
		</div>
	{/snippet}
</Story>

<!-- Story: Valid Form with Title -->
<Story name="ValidFormWithTitle" args={{ data: { form: formWithValidTitle } }}>
	{#snippet children()}
		<div class="max-w-md">
			<div class="mb-4 rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">Valid Form with Title</p>
				<p class="text-xs text-blue-700">
					Shows a form with a valid title entered and ready to submit.
				</p>
			</div>
			<TodoForm data={{ form: formWithValidTitle }} />
		</div>
	{/snippet}
</Story>

<!-- Story: Multiple Validation Errors -->
<Story name="MultipleValidationErrors" args={{ data: { form: formWithMultipleErrors } }}>
	{#snippet children()}
		<div class="max-w-md">
			<div class="mb-4 rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">Multiple Validation Errors</p>
				<p class="text-xs text-blue-700">
					Shows how the form displays when there are multiple validation errors.
				</p>
			</div>
			<TodoForm data={{ form: formWithMultipleErrors }} />
		</div>
	{/snippet}
</Story>

<!-- Story: All States Showcase -->
<Story name="AllStates">
	{#snippet children()}
		<div class="space-y-8">
			<div>
				<h3 class="mb-2 text-sm font-medium text-gray-700">Empty Form</h3>
				<div class="max-w-md">
					<TodoForm data={{ form: emptyForm }} />
				</div>
			</div>

			<div>
				<h3 class="mb-2 text-sm font-medium text-gray-700">With Validation Error</h3>
				<div class="max-w-md">
					<TodoForm data={{ form: formWithShortTitleError }} />
				</div>
			</div>

			<div>
				<h3 class="mb-2 text-sm font-medium text-gray-700">With Valid Title</h3>
				<div class="max-w-md">
					<TodoForm data={{ form: formWithValidTitle }} />
				</div>
			</div>

			<div>
				<h3 class="mb-2 text-sm font-medium text-gray-700">Submitting State</h3>
				<div class="max-w-md">
					<TodoForm data={{ form: formSubmitting }} />
				</div>
			</div>
		</div>
	{/snippet}
</Story>

<!-- Story: Interactive Demo -->
<Story name="InteractiveDemo">
	{#snippet children()}
		<div class="max-w-md space-y-4">
			<div class="rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-900">Interactive Demo</p>
				<p class="text-xs text-blue-700">
					This is a static representation of the form. In the actual application, the form uses Superforms for
					progressive enhancement and real-time validation.
				</p>
			</div>

			<div class="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
				<div>
					<p class="mb-2 text-xs font-medium text-gray-600">Try these scenarios:</p>
					<ul class="space-y-1 text-xs text-gray-600">
						<li>• Enter a title with 1 character → See validation error</li>
						<li>• Enter a title with 2-100 characters → Form is valid</li>
						<li>• Enter a title with 101+ characters → See validation error</li>
						<li>• Click submit → Button shows loading state</li>
					</ul>
				</div>
			</div>

			<TodoForm data={{ form: emptyForm }} />
		</div>
	{/snippet}
</Story>

