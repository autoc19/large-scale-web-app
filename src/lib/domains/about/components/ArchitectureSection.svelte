<!--
  ArchitectureSection Component
  
  Displays architecture principles in a card layout.
  Shows icon, title, description, and optional code examples for each principle.
-->
<script lang="ts">
	import { getContext } from 'svelte';
	import { ABOUT_SERVICE_KEY } from '$core/context/keys';
	import type { AboutService } from '../services/about.service.svelte';
	import * as m from '$paraglide/messages';

	const service = getContext<AboutService>(ABOUT_SERVICE_KEY);

	// Map principle IDs to translation functions
	const principleTranslations: Record<string, { title: () => string; description: () => string }> = {
		'contract-first': {
			title: m.about_principle_contract_first_title,
			description: m.about_principle_contract_first_description
		},
		'screaming-architecture': {
			title: m.about_principle_screaming_architecture_title,
			description: m.about_principle_screaming_architecture_description
		},
		'logic-externalization': {
			title: m.about_principle_logic_externalization_title,
			description: m.about_principle_logic_externalization_description
		},
		'anti-corruption-layer': {
			title: m.about_principle_anti_corruption_layer_title,
			description: m.about_principle_anti_corruption_layer_description
		}
	};
</script>

<div>
	<h2 id="architecture-heading" class="mb-8 text-center text-3xl font-bold text-gray-900">{m.about_architecture()}</h2>
	
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each service.principles as principle}
			{@const translations = principleTranslations[principle.id]}
			<article class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
				<div class="mb-4 flex items-center">
					<span class="mr-3 text-3xl" role="img" aria-label={translations?.title() || principle.title}>
						{principle.icon}
					</span>
					<h3 class="text-xl font-semibold text-gray-900">
						{translations?.title() || principle.title}
					</h3>
				</div>
				
				<p class="mb-4 text-gray-600">
					{translations?.description() || principle.description}
				</p>
				
				{#if principle.examples && principle.examples.length > 0}
					<div class="mt-4 border-t border-gray-200 pt-4">
						<h4 class="mb-2 text-sm font-semibold text-gray-700">{m.about_examples()}</h4>
						<ul class="space-y-2">
							{#each principle.examples as example}
								<li class="text-sm text-gray-600">
									<code class="rounded bg-gray-100 px-2 py-1 font-mono text-xs">
										{example}
									</code>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</article>
		{/each}
	</div>
</div>
