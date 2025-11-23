<!--
  Test wrapper for TeamSection component
  Provides AboutService context for testing
-->
<script lang="ts">
	import { setContext } from 'svelte';
	import TeamSection from './TeamSection.svelte';
	import { AboutService } from '../services/about.service.svelte';
	import { ABOUT_SERVICE_KEY } from '$core/context/keys';
	import type { TeamMember } from '../models/about.types';

	interface Props {
		teamMembers: TeamMember[];
	}

	let { teamMembers }: Props = $props();

	// Mock repository
	const mockRepo = {
		getAboutInfo: async () => ({
			projectName: 'Test',
			description: 'Test',
			version: '1.0.0'
		}),
		getTechnologies: async () => [],
		getArchitecturePrinciples: async () => [],
		getTeamMembers: async () => []
	};

	// Create service with teamMembers
	const service = new AboutService(mockRepo, { teamMembers });
	setContext(ABOUT_SERVICE_KEY, service);
</script>

<TeamSection />
