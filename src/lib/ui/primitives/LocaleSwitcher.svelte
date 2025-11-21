<script lang="ts">
	import { availableLocales, getCurrentLocale, setLocale } from '$lib/core/i18n/locale-switcher';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	let currentLocale = $state(getCurrentLocale());

	function handleLocaleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const locale = target.value;
		setLocale(locale);
		currentLocale = locale;
		
		// Force page reload to update all components
		if (typeof window !== 'undefined') {
			window.location.reload();
		}
	}
</script>

<select
	value={currentLocale}
	onchange={handleLocaleChange}
	class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 {className}"
	aria-label="Select language"
>
	{#each availableLocales as locale}
		<option value={locale.code}>{locale.nativeName}</option>
	{/each}
</select>
