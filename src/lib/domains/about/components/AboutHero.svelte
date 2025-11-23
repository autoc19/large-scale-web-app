<!--
  AboutHero Component
  
  Displays the hero section of the About page with project information.
  Shows project name, description, version, and optional repository/license links.
-->
<script lang="ts">
	import { getContext } from 'svelte';
	import { ABOUT_SERVICE_KEY } from '$core/context/keys';
	import type { AboutService } from '../services/about.service.svelte';
	import * as m from '$paraglide/messages';

	const service = getContext<AboutService>(ABOUT_SERVICE_KEY);
</script>

{#if service.aboutInfo}
	<header class="mb-12 text-center">
		<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
			{m.about_project_name()}
		</h1>
		
		<p class="mx-auto mb-6 max-w-3xl text-lg text-gray-600 md:text-xl">
			{m.about_project_description()}
		</p>
		
		<div class="mb-4 text-sm text-gray-500 md:text-base">
			{m.about_version({ version: service.aboutInfo.version })}
		</div>
		
		<div class="flex flex-wrap items-center justify-center gap-4">
			{#if service.aboutInfo.repository}
				<a
					href={service.aboutInfo.repository}
					target="_blank"
					rel="noopener noreferrer"
					class="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					aria-label="{m.about_view_repository()} on GitHub"
				>
					{m.about_view_repository()}
				</a>
			{/if}
			
			{#if service.aboutInfo.license}
				<span class="rounded-lg border border-gray-300 px-6 py-2 text-gray-700">
					{m.about_license({ license: service.aboutInfo.license })}
				</span>
			{/if}
		</div>
	</header>
{/if}
