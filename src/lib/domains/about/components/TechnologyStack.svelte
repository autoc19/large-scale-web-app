<!--
  TechnologyStack Component
  
  Displays the technology stack grouped by category in a responsive grid.
  Shows technology name, category, description, version, and documentation links.
-->
<script lang="ts">
	import { getContext } from 'svelte';
	import { ABOUT_SERVICE_KEY } from '$core/context/keys';
	import type { AboutService } from '../services/about.service.svelte';
	import type { TechnologyCategory } from '../models/about.types';
	import * as m from '$paraglide/messages';

	const service = getContext<AboutService>(ABOUT_SERVICE_KEY);

	// Category display names
	const categoryNames: Record<TechnologyCategory, string> = {
		framework: m.about_category_framework(),
		language: m.about_category_language(),
		testing: m.about_category_testing(),
		styling: m.about_category_styling(),
		tooling: m.about_category_tooling()
	};
</script>

<div>
	<h2 id="technology-heading" class="mb-8 text-center text-3xl font-bold text-gray-900">{m.about_technology_stack()}</h2>
	
	{#each Object.entries(service.technologiesByCategory) as [category, technologies]}
		{#if technologies.length > 0}
			<div class="mb-8">
				<h3 class="mb-4 text-xl font-semibold text-gray-800">
					{categoryNames[category as TechnologyCategory]}
				</h3>
				
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each technologies as tech}
						<article class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
							<div class="mb-2 flex items-start justify-between">
								<h4 class="text-lg font-semibold text-gray-900">
									{tech.name}
								</h4>
								{#if tech.version}
									<span class="ml-2 rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
										v{tech.version}
									</span>
								{/if}
							</div>
							
							<p class="mb-3 text-sm text-gray-600">
								{tech.description}
							</p>
							
							{#if tech.url}
								<a
									href={tech.url}
									target="_blank"
									rel="noopener noreferrer"
									class="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
									aria-label="{m.about_documentation()} for {tech.name}"
								>
									{m.about_documentation()} →
								</a>
							{/if}
						</article>
					{/each}
				</div>
			</div>
		{/if}
	{/each}
</div>
