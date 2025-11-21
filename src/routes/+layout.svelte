<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import LocaleSwitcher from '$lib/ui/primitives/LocaleSwitcher.svelte';
	import { onMount } from 'svelte';
	import { initializeLocale } from '$lib/core/i18n/locale-switcher';

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
			<LocaleSwitcher />
		</div>
	</header>

	<main>{@render children()}</main>
</div>
