<script lang="ts">
	/**
	 * Button Component
	 *
	 * A reusable button component with multiple variants and sizes.
	 * Uses Svelte 5 Snippets for content projection.
	 *
	 * @component
	 */
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		onclick?: (e: MouseEvent) => void;
		variant?: 'primary' | 'secondary' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
	}

	let {
		children,
		onclick,
		variant = 'primary',
		size = 'md',
		disabled = false,
		type = 'button',
		class: className = '',
		...rest
	}: Props = $props();

	// Variant styles
	const variantClasses = {
		primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
		secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
		danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
	};

	// Size styles
	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg'
	};

	// Base styles
	const baseClasses =
		'rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

	// Combine all classes
	const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
</script>

<button {type} class={buttonClasses} {onclick} {disabled} {...rest}>
	{@render children()}
</button>
