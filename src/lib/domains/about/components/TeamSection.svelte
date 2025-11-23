<!--
  TeamSection Component
  
  Displays team members in a responsive grid layout.
  Shows avatar (or placeholder), name, role, and optional contact information.
-->
<script lang="ts">
	import { getContext } from 'svelte';
	import { ABOUT_SERVICE_KEY } from '$core/context/keys';
	import type { AboutService } from '../services/about.service.svelte';
	import * as m from '$paraglide/messages';

	const service = getContext<AboutService>(ABOUT_SERVICE_KEY);

	// Map role strings to translation functions
	function getRoleTranslation(role: string): string {
		const roleMap: Record<string, () => string> = {
			'Full Stack Developers': m.about_role_full_stack_developers
		};
		return roleMap[role]?.() || role;
	}
</script>

<div>
	<h2 id="team-heading" class="mb-8 text-center text-3xl font-bold text-gray-900">{m.about_team()}</h2>
	
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		{#each service.teamMembers as member}
			<article class="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
				<div class="mb-4 flex justify-center">
					{#if member.avatar}
						<img
							src={member.avatar}
							alt={`${member.name}'s avatar`}
							class="h-24 w-24 rounded-full object-cover"
						/>
					{:else}
						<div class="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-3xl font-bold text-gray-600">
							{member.name.charAt(0).toUpperCase()}
						</div>
					{/if}
				</div>
				
				<h3 class="mb-1 text-lg font-semibold text-gray-900">
					{member.name}
				</h3>
				
				<p class="mb-3 text-sm text-gray-600">
					{getRoleTranslation(member.role)}
				</p>
				
				<div class="flex flex-col gap-2">
					{#if member.email}
						<a
							href={`mailto:${member.email}`}
							class="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
							aria-label="Email {member.name}"
						>
							{member.email}
						</a>
					{/if}
					
					{#if member.github}
						<a
							href={`https://github.com/${member.github}`}
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
							aria-label="GitHub profile of {member.name}"
						>
							@{member.github}
						</a>
					{/if}
				</div>
			</article>
		{/each}
	</div>
</div>
