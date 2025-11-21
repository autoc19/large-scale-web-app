<script lang="ts">
	/**
	 * Modal Component
	 *
	 * A reusable modal dialog with backdrop, header, and footer support.
	 * Uses Svelte 5 Snippets for flexible content projection.
	 *
	 * @component
	 */
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	interface Props {
		open: boolean;
		onclose?: () => void;
		children: Snippet;
		header?: Snippet<[{ close: () => void }]>;
		footer?: Snippet<[{ close: () => void }]>;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		class?: string;
	}

	let {
		open = $bindable(false),
		onclose,
		children,
		header,
		footer,
		size = 'md',
		class: className = '',
		...rest
	}: Props = $props();

	// Size classes
	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl'
	};

	// Close handler
	function handleClose() {
		open = false;
		onclose?.();
	}

	// Handle backdrop click
	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}

	// Handle ESC key
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			handleClose();
		}
	}

	// Focus trap and ESC key handling
	onMount(() => {
		const handleEsc = (e: KeyboardEvent) => handleKeydown(e);
		window.addEventListener('keydown', handleEsc);
		return () => window.removeEventListener('keydown', handleEsc);
	});
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
		onclick={handleBackdropClick}
		role="presentation"
	>
		<!-- Modal Container -->
		<div
			class="relative w-full {sizeClasses[size]} rounded-lg bg-white shadow-xl {className}"
			role="dialog"
			aria-modal="true"
			{...rest}
		>
			<!-- Header -->
			{#if header}
				<div class="border-b border-gray-200 px-6 py-4">
					{@render header({ close: handleClose })}
				</div>
			{/if}

			<!-- Content -->
			<div class="px-6 py-4">
				{@render children()}
			</div>

			<!-- Footer -->
			{#if footer}
				<div class="border-t border-gray-200 px-6 py-4">
					{@render footer({ close: handleClose })}
				</div>
			{/if}

			<!-- Close button (always available) -->
			<button
				type="button"
				class="absolute top-4 right-4 rounded text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				onclick={handleClose}
				aria-label="Close modal"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	</div>
{/if}
