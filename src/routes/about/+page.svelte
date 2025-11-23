<!--
  About Page Component
  
  Main page component that assembles the About page with dependency injection.
  Loads data via +page.ts, instantiates service, and renders domain components.
-->
<script lang="ts">
	import { setContext } from 'svelte';
	import { AboutService } from '$lib/domains/about/services/about.service.svelte';
	import { AboutRepositoryStatic } from '$lib/domains/about/repositories/about.repository.static';
	import { ABOUT_SERVICE_KEY } from '$core/context/keys';
	import AboutHero from '$lib/domains/about/components/AboutHero.svelte';
	import TechnologyStack from '$lib/domains/about/components/TechnologyStack.svelte';
	import ArchitectureSection from '$lib/domains/about/components/ArchitectureSection.svelte';
	import TeamSection from '$lib/domains/about/components/TeamSection.svelte';
	import type { AboutPageData } from './+page';

	interface Props {
		data: AboutPageData;
	}

	// Destructure data from props
	let { data }: Props = $props();

	// 1. Dependency assembly
	const repo = new AboutRepositoryStatic();
	const service = new AboutService(repo, {
		aboutInfo: data.aboutInfo,
		technologies: data.technologies,
		principles: data.principles,
		teamMembers: data.teamMembers
	});

	// 2. Inject service into context
	setContext(ABOUT_SERVICE_KEY, service);

	// 3. CRITICAL: Sync service state when route data changes
	$effect(() => {
		service.aboutInfo = data.aboutInfo;
		service.technologies = data.technologies;
		service.principles = data.principles;
		service.teamMembers = data.teamMembers;
	});
</script>

<svelte:head>
	<title>About - {data.aboutInfo.projectName}</title>
	<meta name="description" content={data.aboutInfo.description} />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<main class="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
		<!-- Error display -->
		{#if service.error}
			<div role="alert" class="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
				<h2 class="mb-2 font-semibold">Error loading content</h2>
				<p>{service.error}</p>
			</div>
		{/if}

		<!-- Hero Section -->
		<AboutHero />

		<!-- Technology Stack Section -->
		<section aria-labelledby="technology-heading" class="mb-12">
			<TechnologyStack />
		</section>

		<!-- Architecture Principles Section -->
		<section aria-labelledby="architecture-heading" class="mb-12">
			<ArchitectureSection />
		</section>

		<!-- Team Section -->
		<section aria-labelledby="team-heading" class="mb-12">
			<TeamSection />
		</section>
	</main>
</div>
