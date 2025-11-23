<!--
  Test Wrapper for About Page Components
  
  Provides context and renders all About page components for testing.
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
	import type {
		AboutInfo,
		TechnologyItem,
		ArchitecturePrinciple,
		TeamMember
	} from '$lib/domains/about/models/about.types';

	interface Props {
		data: {
			aboutInfo: AboutInfo;
			technologies: TechnologyItem[];
			principles: ArchitecturePrinciple[];
			teamMembers: TeamMember[];
		};
	}

	let { data }: Props = $props();

	// Create service with test data
	const repo = new AboutRepositoryStatic();
	const service = new AboutService(repo, data);

	// Inject service into context
	setContext(ABOUT_SERVICE_KEY, service);
</script>

<div>
	<!-- Hero Section -->
	<AboutHero />

	<!-- Technology Stack Section -->
	<section aria-labelledby="technology-heading">
		<TechnologyStack />
	</section>

	<!-- Architecture Principles Section -->
	<section aria-labelledby="architecture-heading">
		<ArchitectureSection />
	</section>

	<!-- Team Section -->
	<section aria-labelledby="team-heading">
		<TeamSection />
	</section>
</div>
