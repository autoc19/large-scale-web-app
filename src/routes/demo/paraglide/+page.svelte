<script lang="ts">
	// TODO: Enable Paraglide demo after i18n-integration spec is implemented
	// import { setLocale } from '$lib/paraglide/runtime';
	// import { page } from '$app/state';
	// import { goto } from '$app/navigation';
	// import { m } from '$lib/paraglide/messages.js';
</script>

<div class="p-8">
	<h1 class="mb-4 text-2xl font-bold">Paraglide i18n Demo</h1>
	<p class="text-gray-600">
		This demo will be enabled after the i18n-integration spec is implemented.
	</p>
	<p class="mt-4">
		If you use VSCode, install the <a
			href="https://marketplace.visualstudio.com/items?itemName=inlang.vs-code-extension"
			target="_blank"
			class="text-blue-600 hover:underline">Sherlock i18n extension</a
		> for a better i18n experience.
	</p>
</div>

<!-- TODO: Uncomment after i18n-integration
<h1>{m.hello_world({ name: 'SvelteKit User' })}</h1>
<div>
	<button onclick={() => setLocale('en')}>en</button>
	<button onclick={() => setLocale('zh-tw')}>zh-tw</button>
	<button onclick={() => setLocale('jp')}>jp</button>
</div>
-->
