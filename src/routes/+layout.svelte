<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import LocaleSwitcher from '$lib/ui/primitives/LocaleSwitcher.svelte';
	import { onMount } from 'svelte';
	import { initializeLocale } from '$lib/core/i18n/locale-switcher';
	import * as m from '$paraglide/messages';

	let { children } = $props();

	onMount(() => {
		initializeLocale();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<header class="border-b border-gray-200 bg-white shadow-sm">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
			<h1 class="text-xl font-bold text-gray-900">Todo App</h1>
			<nav class="flex items-center gap-6">
				<a
					href="/about"
					class="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 transition-colors"
					aria-label={m.about()}
				>
					{m.about()}
				</a>
				<LocaleSwitcher />
			</nav>
		</div>
	</header>

	<main>{@render children()}</main>
</div>
