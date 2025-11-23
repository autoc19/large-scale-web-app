<!--
  Test wrapper for TechnologyStack component
  Provides AboutService context for testing
-->
<script lang="ts">
	import { setContext } from 'svelte';
	import TechnologyStack from './TechnologyStack.svelte';
	import { AboutService } from '../services/about.service.svelte';
	import { ABOUT_SERVICE_KEY } from '$core/context/keys';
	import type { TechnologyItem } from '../models/about.types';

	interface Props {
		technologies: TechnologyItem[];
	}

	let { technologies }: Props = $props();

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

	// Create service with technologies
	const service = new AboutService(mockRepo, { technologies });
	setContext(ABOUT_SERVICE_KEY, service);
</script>

<TechnologyStack />
