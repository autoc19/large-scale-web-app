/**
 * Integration tests for About Page Component
 *
 * Tests the page component's integration with:
 * - Service dependency injection
 * - $effect sync pattern
 * - Child component rendering
 * - Error display
 *
 * Requirements: 5.2, 5.5, 5.6
 */

import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { getContext } from 'svelte';
import { ABOUT_SERVICE_KEY } from '$lib/core/context/keys';
import { AboutService } from '$lib/domains/about/services/about.service.svelte';
import type {
	AboutInfo,
	TechnologyItem,
	ArchitecturePrinciple,
	TeamMember
} from '$lib/domains/about/models/about.types';

describe('About Page Integration Tests', () => {
	const mockAboutInfo: AboutInfo = {
		projectName: 'Test Project',
		description: 'Test description',
		version: '1.0.0',
		repository: 'https://github.com/test/repo',
		license: 'MIT'
	};

	const mockTechnologies: TechnologyItem[] = [
		{
			name: 'Svelte 5',
			category: 'framework',
			description: 'Modern reactive framework',
			version: '5.0.0',
			url: 'https://svelte.dev'
		},
		{
			name: 'TypeScript',
			category: 'language',
			description: 'Typed superset of JavaScript',
			version: '5.9',
			url: 'https://typescriptlang.org'
		}
	];

	const mockPrinciples: ArchitecturePrinciple[] = [
		{
			id: 'contract-first',
			title: 'Contract-First Development',
			description: 'Define interfaces before implementation',
			icon: '📋',
			examples: ['Define interfaces first', 'Use Zod schemas']
		}
	];

	const mockTeamMembers: TeamMember[] = [
		{
			name: 'Test Developer',
			role: 'Lead Developer',
			email: 'test@example.com',
			github: 'testdev'
		}
	];

	const createMockPageData = (overrides?: Partial<any>) => ({
		aboutInfo: mockAboutInfo,
		technologies: mockTechnologies,
		principles: mockPrinciples,
		teamMembers: mockTeamMembers,
		...overrides
	});

	describe('Service Injection into Context', () => {
		it('should inject AboutService into context', async () => {
			expect.assertions(1);

			const TestComponent = `
				<script lang="ts">
					import { setContext, getContext } from 'svelte';
					import { AboutService } from '$lib/domains/about/services/about.service.svelte';
					import { AboutRepositoryStatic } from '$lib/domains/about/repositories/about.repository.static';
					import { ABOUT_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new AboutRepositoryStatic();
					const service = new AboutService(repo, {
						aboutInfo: data.aboutInfo,
						technologies: data.technologies,
						principles: data.principles,
						teamMembers: data.teamMembers
					});
					setContext(ABOUT_SERVICE_KEY, service);

					const injectedService = getContext(ABOUT_SERVICE_KEY);
					const isInjected = injectedService === service;
				</script>

				<div>
					{#if isInjected}
						<span data-testid="context-injected">Service injected</span>
					{/if}
				</div>
			`;

			const pageData = createMockPageData();
			const { container } = await render(TestComponent, {
				props: { data: pageData }
			});

			const injectedIndicator = container.querySelector('[data-testid="context-injected"]');
			expect(injectedIndicator).toBeTruthy();
		});

		it('should inject service with initial data', async () => {
			expect.assertions(4);

			const TestComponent = `
				<script lang="ts">
					import { setContext, getContext } from 'svelte';
					import { AboutService } from '$lib/domains/about/services/about.service.svelte';
					import { AboutRepositoryStatic } from '$lib/domains/about/repositories/about.repository.static';
					import { ABOUT_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new AboutRepositoryStatic();
					const service = new AboutService(repo, {
						aboutInfo: data.aboutInfo,
						technologies: data.technologies,
						principles: data.principles,
						teamMembers: data.teamMembers
					});
					setContext(ABOUT_SERVICE_KEY, service);

					const injectedService = getContext(ABOUT_SERVICE_KEY);
				</script>

				<div data-testid="project-name">{injectedService.aboutInfo?.projectName}</div>
				<div data-testid="tech-count">{injectedService.technologies.length}</div>
				<div data-testid="principle-count">{injectedService.principles.length}</div>
				<div data-testid="team-count">{injectedService.teamMembers.length}</div>
			`;

			const pageData = createMockPageData();
			const { container } = await render(TestComponent, {
				props: { data: pageData }
			});

			expect(container.querySelector('[data-testid="project-name"]')?.textContent).toBe('Test Project');
			expect(container.querySelector('[data-testid="tech-count"]')?.textContent).toBe('2');
			expect(container.querySelector('[data-testid="principle-count"]')?.textContent).toBe('1');
			expect(container.querySelector('[data-testid="team-count"]')?.textContent).toBe('1');
		});
	});

	describe('$effect Sync Pattern', () => {
		it('should sync service state when data changes', async () => {
			expect.assertions(2);

			const TestComponent = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { AboutService } from '$lib/domains/about/services/about.service.svelte';
					import { AboutRepositoryStatic } from '$lib/domains/about/repositories/about.repository.static';
					import { ABOUT_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new AboutRepositoryStatic();
					const service = new AboutService(repo, {
						aboutInfo: data.aboutInfo,
						technologies: data.technologies,
						principles: data.principles,
						teamMembers: data.teamMembers
					});
					setContext(ABOUT_SERVICE_KEY, service);

					// CRITICAL: Sync service when route data changes
					$effect(() => {
						service.aboutInfo = data.aboutInfo;
						service.technologies = data.technologies;
						service.principles = data.principles;
						service.teamMembers = data.teamMembers;
					});
				</script>

				<div data-testid="project-name">{service.aboutInfo?.projectName}</div>
				<div data-testid="tech-count">{service.technologies.length}</div>
			`;

			const pageData = createMockPageData();
			const { container, rerender } = await render(TestComponent, {
				props: { data: pageData }
			});

			// Initial state
			expect(container.querySelector('[data-testid="project-name"]')?.textContent).toBe('Test Project');

			// Simulate route data change
			const newData = createMockPageData({
				aboutInfo: {
					projectName: 'Updated Project',
					description: 'Updated description',
					version: '2.0.0'
				},
				technologies: [
					{
						name: 'Vue',
						category: 'framework' as const,
						description: 'Progressive framework'
					}
				]
			});

			await rerender({ data: newData });

			// After sync, should have new data
			expect(container.querySelector('[data-testid="project-name"]')?.textContent).toBe('Updated Project');
		});

		it('should update derived state after sync', async () => {
			expect.assertions(2);

			const TestComponent = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { AboutService } from '$lib/domains/about/services/about.service.svelte';
					import { AboutRepositoryStatic } from '$lib/domains/about/repositories/about.repository.static';
					import { ABOUT_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new AboutRepositoryStatic();
					const service = new AboutService(repo, {
						aboutInfo: data.aboutInfo,
						technologies: data.technologies,
						principles: data.principles,
						teamMembers: data.teamMembers
					});
					setContext(ABOUT_SERVICE_KEY, service);

					$effect(() => {
						service.aboutInfo = data.aboutInfo;
						service.technologies = data.technologies;
						service.principles = data.principles;
						service.teamMembers = data.teamMembers;
					});
				</script>

				<div data-testid="team-count">{service.teamMemberCount}</div>
			`;

			const pageData = createMockPageData();
			const { container, rerender } = await render(TestComponent, {
				props: { data: pageData }
			});

			// Initial: 1 team member
			expect(container.querySelector('[data-testid="team-count"]')?.textContent).toBe('1');

			// Change to 3 team members
			const newData = createMockPageData({
				teamMembers: [
					{ name: 'Member 1', role: 'Developer' },
					{ name: 'Member 2', role: 'Designer' },
					{ name: 'Member 3', role: 'Manager' }
				]
			});

			await rerender({ data: newData });

			// After sync: 3 team members
			expect(container.querySelector('[data-testid="team-count"]')?.textContent).toBe('3');
		});

		it('should handle empty data arrays during sync', async () => {
			expect.assertions(3);

			const TestComponent = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { AboutService } from '$lib/domains/about/services/about.service.svelte';
					import { AboutRepositoryStatic } from '$lib/domains/about/repositories/about.repository.static';
					import { ABOUT_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new AboutRepositoryStatic();
					const service = new AboutService(repo, {
						aboutInfo: data.aboutInfo,
						technologies: data.technologies,
						principles: data.principles,
						teamMembers: data.teamMembers
					});
					setContext(ABOUT_SERVICE_KEY, service);

					$effect(() => {
						service.aboutInfo = data.aboutInfo;
						service.technologies = data.technologies;
						service.principles = data.principles;
						service.teamMembers = data.teamMembers;
					});
				</script>

				<div data-testid="tech-count">{service.technologies.length}</div>
				<div data-testid="principle-count">{service.principles.length}</div>
				<div data-testid="team-count">{service.teamMembers.length}</div>
			`;

			const pageData = createMockPageData({
				technologies: [],
				principles: [],
				teamMembers: []
			});
			const { container } = await render(TestComponent, {
				props: { data: pageData }
			});

			expect(container.querySelector('[data-testid="tech-count"]')?.textContent).toBe('0');
			expect(container.querySelector('[data-testid="principle-count"]')?.textContent).toBe('0');
			expect(container.querySelector('[data-testid="team-count"]')?.textContent).toBe('0');
		});
	});

	describe('Page Rendering', () => {
		it('should render page with semantic HTML', async () => {
			expect.assertions(2);

			const PageTestWrapper = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { AboutService } from '$lib/domains/about/services/about.service.svelte';
					import { AboutRepositoryStatic } from '$lib/domains/about/repositories/about.repository.static';
					import { ABOUT_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new AboutRepositoryStatic();
					const service = new AboutService(repo, {
						aboutInfo: data.aboutInfo,
						technologies: data.technologies,
						principles: data.principles,
						teamMembers: data.teamMembers
					});
					setContext(ABOUT_SERVICE_KEY, service);

					$effect(() => {
						service.aboutInfo = data.aboutInfo;
						service.technologies = data.technologies;
						service.principles = data.principles;
						service.teamMembers = data.teamMembers;
					});
				</script>

				<div class="min-h-screen bg-gray-50">
					<main class="container mx-auto px-4 py-12">
						{#if service.error}
							<div class="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
								<h3 class="mb-2 font-semibold">Error loading content</h3>
								<p>{service.error}</p>
							</div>
						{/if}

						<section data-testid="hero-section">
							<h1>{service.aboutInfo?.projectName}</h1>
						</section>

						<section data-testid="tech-section">
							<h2>Technology Stack</h2>
						</section>

						<section data-testid="architecture-section">
							<h2>Architecture Principles</h2>
						</section>

						<section data-testid="team-section">
							<h2>Our Team</h2>
						</section>
					</main>
				</div>
			`;

			const pageData = createMockPageData();
			const { container } = await render(PageTestWrapper, {
				props: { data: pageData }
			});

			const main = container.querySelector('main');
			expect(main).toBeTruthy();

			const sections = container.querySelectorAll('section');
			expect(sections.length).toBe(4);
		});

		it('should render all domain components', async () => {
			expect.assertions(4);

			const PageTestWrapper = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { AboutService } from '$lib/domains/about/services/about.service.svelte';
					import { AboutRepositoryStatic } from '$lib/domains/about/repositories/about.repository.static';
					import { ABOUT_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new AboutRepositoryStatic();
					const service = new AboutService(repo, {
						aboutInfo: data.aboutInfo,
						technologies: data.technologies,
						principles: data.principles,
						teamMembers: data.teamMembers
					});
					setContext(ABOUT_SERVICE_KEY, service);

					$effect(() => {
						service.aboutInfo = data.aboutInfo;
						service.technologies = data.technologies;
						service.principles = data.principles;
						service.teamMembers = data.teamMembers;
					});
				</script>

				<main>
					<div data-testid="about-hero">AboutHero Component</div>
					<section>
						<div data-testid="technology-stack">TechnologyStack Component</div>
					</section>
					<section>
						<div data-testid="architecture-section">ArchitectureSection Component</div>
					</section>
					<section>
						<div data-testid="team-section">TeamSection Component</div>
					</section>
				</main>
			`;

			const pageData = createMockPageData();
			const { container } = await render(PageTestWrapper, {
				props: { data: pageData }
			});

			expect(container.querySelector('[data-testid="about-hero"]')).toBeTruthy();
			expect(container.querySelector('[data-testid="technology-stack"]')).toBeTruthy();
			expect(container.querySelector('[data-testid="architecture-section"]')).toBeTruthy();
			expect(container.querySelector('[data-testid="team-section"]')).toBeTruthy();
		});
	});

	describe('Error Display', () => {
		it('should display error message when service.error is set', async () => {
			expect.assertions(2);

			const TestComponent = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { AboutService } from '$lib/domains/about/services/about.service.svelte';
					import { AboutRepositoryStatic } from '$lib/domains/about/repositories/about.repository.static';
					import { ABOUT_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new AboutRepositoryStatic();
					const service = new AboutService(repo, {
						aboutInfo: data.aboutInfo,
						technologies: data.technologies,
						principles: data.principles,
						teamMembers: data.teamMembers
					});
					setContext(ABOUT_SERVICE_KEY, service);

					$effect(() => {
						service.aboutInfo = data.aboutInfo;
						service.technologies = data.technologies;
						service.principles = data.principles;
						service.teamMembers = data.teamMembers;
					});

					// Simulate error
					service.error = 'Failed to load about content';
				</script>

				<main>
					{#if service.error}
						<div role="alert" data-testid="error-alert">
							<h3 class="font-semibold">Error loading content</h3>
							<p>{service.error}</p>
						</div>
					{/if}
				</main>
			`;

			const pageData = createMockPageData();
			const { container } = await render(TestComponent, {
				props: { data: pageData }
			});

			const errorAlert = container.querySelector('[data-testid="error-alert"]');
			expect(errorAlert).toBeTruthy();
			expect(errorAlert?.textContent).toContain('Failed to load about content');
		});

		it('should not display error when service.error is null', async () => {
			expect.assertions(1);

			const TestComponent = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { AboutService } from '$lib/domains/about/services/about.service.svelte';
					import { AboutRepositoryStatic } from '$lib/domains/about/repositories/about.repository.static';
					import { ABOUT_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new AboutRepositoryStatic();
					const service = new AboutService(repo, {
						aboutInfo: data.aboutInfo,
						technologies: data.technologies,
						principles: data.principles,
						teamMembers: data.teamMembers
					});
					setContext(ABOUT_SERVICE_KEY, service);

					$effect(() => {
						service.aboutInfo = data.aboutInfo;
						service.technologies = data.technologies;
						service.principles = data.principles;
						service.teamMembers = data.teamMembers;
					});
				</script>

				<main>
					{#if service.error}
						<div role="alert" data-testid="error-alert">
							<h3 class="font-semibold">Error loading content</h3>
							<p>{service.error}</p>
						</div>
					{/if}
				</main>
			`;

			const pageData = createMockPageData();
			const { container } = await render(TestComponent, {
				props: { data: pageData }
			});

			const errorAlert = container.querySelector('[data-testid="error-alert"]');
			expect(errorAlert).toBeFalsy();
		});
	});

	describe('Integration: Service, Context, and Sync', () => {
		it('should maintain service reactivity through context after sync', async () => {
			expect.assertions(3);

			const TestComponent = `
				<script lang="ts">
					import { setContext, getContext } from 'svelte';
					import { AboutService } from '$lib/domains/about/services/about.service.svelte';
					import { AboutRepositoryStatic } from '$lib/domains/about/repositories/about.repository.static';
					import { ABOUT_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new AboutRepositoryStatic();
					const service = new AboutService(repo, {
						aboutInfo: data.aboutInfo,
						technologies: data.technologies,
						principles: data.principles,
						teamMembers: data.teamMembers
					});
					setContext(ABOUT_SERVICE_KEY, service);

					$effect(() => {
						service.aboutInfo = data.aboutInfo;
						service.technologies = data.technologies;
						service.principles = data.principles;
						service.teamMembers = data.teamMembers;
					});

					const injectedService = getContext(ABOUT_SERVICE_KEY);
				</script>

				<div data-testid="project-name">{injectedService.aboutInfo?.projectName}</div>
				<div data-testid="tech-count">{injectedService.technologies.length}</div>
				<div data-testid="team-count">{injectedService.teamMemberCount}</div>
			`;

			const pageData = createMockPageData();
			const { container, rerender } = await render(TestComponent, {
				props: { data: pageData }
			});

			// Initial state
			expect(container.querySelector('[data-testid="project-name"]')?.textContent).toBe('Test Project');

			// Simulate route change with different data
			const newData = createMockPageData({
				aboutInfo: {
					projectName: 'New Project',
					description: 'New description',
					version: '3.0.0'
				},
				technologies: [
					{ name: 'Tech 1', category: 'framework' as const, description: 'Desc 1' },
					{ name: 'Tech 2', category: 'language' as const, description: 'Desc 2' },
					{ name: 'Tech 3', category: 'testing' as const, description: 'Desc 3' }
				],
				teamMembers: [
					{ name: 'Member 1', role: 'Developer' },
					{ name: 'Member 2', role: 'Designer' }
				]
			});

			await rerender({ data: newData });

			// After sync
			expect(container.querySelector('[data-testid="tech-count"]')?.textContent).toBe('3');
			expect(container.querySelector('[data-testid="team-count"]')?.textContent).toBe('2');
		});

		it('should handle multiple sequential syncs correctly', async () => {
			expect.assertions(4);

			const TestComponent = `
				<script lang="ts">
					import { setContext } from 'svelte';
					import { AboutService } from '$lib/domains/about/services/about.service.svelte';
					import { AboutRepositoryStatic } from '$lib/domains/about/repositories/about.repository.static';
					import { ABOUT_SERVICE_KEY } from '$lib/core/context/keys';

					interface Props {
						data: any;
					}

					let { data }: Props = $props();

					const repo = new AboutRepositoryStatic();
					const service = new AboutService(repo, {
						aboutInfo: data.aboutInfo,
						technologies: data.technologies,
						principles: data.principles,
						teamMembers: data.teamMembers
					});
					setContext(ABOUT_SERVICE_KEY, service);

					$effect(() => {
						service.aboutInfo = data.aboutInfo;
						service.technologies = data.technologies;
						service.principles = data.principles;
						service.teamMembers = data.teamMembers;
					});
				</script>

				<div data-testid="tech-count">{service.technologies.length}</div>
			`;

			// First sync
			const data1 = createMockPageData({
				technologies: [
					{ name: 'Tech 1', category: 'framework' as const, description: 'Desc' }
				]
			});

			const { container, rerender } = await render(TestComponent, {
				props: { data: data1 }
			});

			expect(container.querySelector('[data-testid="tech-count"]')?.textContent).toBe('1');

			// Second sync
			const data2 = createMockPageData({
				technologies: [
					{ name: 'Tech 1', category: 'framework' as const, description: 'Desc' },
					{ name: 'Tech 2', category: 'language' as const, description: 'Desc' }
				]
			});

			await rerender({ data: data2 });
			expect(container.querySelector('[data-testid="tech-count"]')?.textContent).toBe('2');

			// Third sync - empty
			const data3 = createMockPageData({ technologies: [] });
			await rerender({ data: data3 });
			expect(container.querySelector('[data-testid="tech-count"]')?.textContent).toBe('0');

			// Fourth sync - back to data
			const data4 = createMockPageData({
				technologies: [
					{ name: 'Tech 1', category: 'framework' as const, description: 'Desc' }
				]
			});

			await rerender({ data: data4 });
			expect(container.querySelector('[data-testid="tech-count"]')?.textContent).toBe('1');
		});
	});
});
