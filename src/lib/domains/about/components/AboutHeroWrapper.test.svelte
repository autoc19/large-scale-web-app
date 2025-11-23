<!--
  Test wrapper for AboutHero component
  Provides AboutService context for testing
-->
<script lang="ts">
	import { setContext } from 'svelte';
	import AboutHero from './AboutHero.svelte';
	import { AboutService } from '../services/about.service.svelte';
	import { ABOUT_SERVICE_KEY } from '$core/context/keys';
	import type { AboutInfo } from '../models/about.types';

	interface Props {
		aboutInfo: AboutInfo;
	}

	let { aboutInfo }: Props = $props();

	// Mock repository
	const mockRepo = {
		getAboutInfo: async () => aboutInfo,
		getTechnologies: async () => [],
		getArchitecturePrinciples: async () => [],
		getTeamMembers: async () => []
	};

	// Create service with aboutInfo
	const service = new AboutService(mockRepo, { aboutInfo });
	setContext(ABOUT_SERVICE_KEY, service);
</script>

<AboutHero />
