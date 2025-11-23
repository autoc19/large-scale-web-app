<!--
  Test wrapper for ArchitectureSection component
  Provides AboutService context for testing
-->
<script lang="ts">
	import { setContext } from 'svelte';
	import ArchitectureSection from './ArchitectureSection.svelte';
	import { AboutService } from '../services/about.service.svelte';
	import { ABOUT_SERVICE_KEY } from '$core/context/keys';
	import type { ArchitecturePrinciple } from '../models/about.types';

	interface Props {
		principles: ArchitecturePrinciple[];
	}

	let { principles }: Props = $props();

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

	// Create service with principles
	const service = new AboutService(mockRepo, { principles });
	setContext(ABOUT_SERVICE_KEY, service);
</script>

<ArchitectureSection />
