<script lang="ts">
	/**
	 * Input Component
	 *
	 * A reusable input component with label, error display, and two-way binding support.
	 * Uses Svelte 5 $bindable() for two-way binding.
	 *
	 * @component
	 */

	interface Props {
		value?: string;
		type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
		placeholder?: string;
		label?: string;
		error?: string;
		disabled?: boolean;
		required?: boolean;
		id?: string;
		class?: string;
	}

	let {
		value = $bindable(''),
		type = 'text',
		placeholder = '',
		label = '',
		error = '',
		disabled = false,
		required = false,
		id = `input-${Math.random().toString(36).substr(2, 9)}`,
		class: className = '',
		...rest
	}: Props = $props();

	// Base input styles
	const baseClasses =
		'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors';

	// State-dependent styles
	const stateClasses = error
		? 'border-red-300 focus:border-red-500 focus:ring-red-500'
		: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

	const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';

	// Combine all classes
	const inputClasses = `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`;
</script>

<div class="w-full">
	{#if label}
		<label for={id} class="mb-1 block text-sm font-medium text-gray-700">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<input
		{id}
		{type}
		{placeholder}
		{disabled}
		{required}
		bind:value
		class={inputClasses}
		aria-invalid={error ? 'true' : 'false'}
		aria-describedby={error ? `${id}-error` : undefined}
		{...rest}
	/>

	{#if error}
		<p id="{id}-error" class="mt-1 text-sm text-red-600" role="alert">
			{error}
		</p>
	{/if}
</div>
