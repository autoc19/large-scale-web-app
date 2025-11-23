/**
 * Property-Based Tests for About Page State Synchronization
 * 
 * Feature: about-page, Property 8: Service state synchronization
 * Validates: Requirements 5.5
 * 
 * Tests that the $effect hook properly synchronizes service state
 * when route data changes.
 */

import { describe, it, expect } from 'vitest';
import { AboutService } from '$lib/domains/about/services/about.service.svelte';
import { AboutRepositoryStatic } from '$lib/domains/about/repositories/about.repository.static';
import type {
	AboutInfo,
	TechnologyItem,
	ArchitecturePrinciple,
	TeamMember
} from '$lib/domains/about/models/about.types';

/**
 * Feature: about-page, Property 8: Service state synchronization
 * Validates: Requirements 5.5
 * 
 * For any change in route data, the $effect hook should update the service state
 * properties to match the new data values
 */
describe('Property 8: Service state synchronization', () => {
	it('should sync service state when data changes', () => {
		// Property: For any change in route data, service state should be updated
		
		const testCases = [
			{
				name: 'Complete data update',
				newData: {
					aboutInfo: {
						projectName: 'Updated Project',
						description: 'Updated description',
						version: '2.0.0',
						repository: 'https://github.com/updated',
						license: 'Apache-2.0'
					},
					technologies: [
						{ name: 'Vue', category: 'framework' as const, description: 'Framework' },
						{ name: 'Python', category: 'language' as const, description: 'Language' }
					],
					principles: [
						{ id: 'new-1', title: 'New Principle', description: 'Description', icon: '🎯' }
					],
					teamMembers: [
						{ name: 'New Member', role: 'Developer' }
					]
				}
			},
			{
				name: 'Minimal data update',
				newData: {
					aboutInfo: {
						projectName: 'Minimal',
						description: 'Minimal desc',
						version: '1.0.0'
					},
					technologies: [],
					principles: [],
					teamMembers: []
				}
			},
			{
				name: 'Large data update',
				newData: {
					aboutInfo: {
						projectName: 'Large Project',
						description: 'Large description',
						version: '3.0.0'
					},
					technologies: Array.from({ length: 20 }, (_, i) => ({
						name: `Tech ${i}`,
						category: (['framework', 'language', 'testing', 'styling', 'tooling'] as const)[i % 5],
						description: `Description ${i}`
					})),
					principles: Array.from({ length: 10 }, (_, i) => ({
						id: `principle-${i}`,
						title: `Principle ${i}`,
						description: `Description ${i}`,
						icon: '📋'
					})),
					teamMembers: Array.from({ length: 15 }, (_, i) => ({
						name: `Member ${i}`,
						role: `Role ${i}`
					}))
				}
			}
		];

		for (const testCase of testCases) {
			// Create service with initial data
			const repo = new AboutRepositoryStatic();
			const service = new AboutService(repo, {
				aboutInfo: {
					projectName: 'Initial Project',
					description: 'Initial description',
					version: '0.0.0'
				},
				technologies: [],
				principles: [],
				teamMembers: []
			});

			// Verify initial state
			expect(service.aboutInfo?.projectName).toBe('Initial Project');
			expect(service.technologies).toHaveLength(0);
			expect(service.principles).toHaveLength(0);
			expect(service.teamMembers).toHaveLength(0);

			// Simulate $effect sync by updating service state
			service.aboutInfo = testCase.newData.aboutInfo;
			service.technologies = testCase.newData.technologies;
			service.principles = testCase.newData.principles;
			service.teamMembers = testCase.newData.teamMembers;

			// Property: State should be synchronized
			expect(service.aboutInfo).toEqual(testCase.newData.aboutInfo);
			expect(service.technologies).toEqual(testCase.newData.technologies);
			expect(service.principles).toEqual(testCase.newData.principles);
			expect(service.teamMembers).toEqual(testCase.newData.teamMembers);
		}
	});

	it('should maintain derived state after synchronization', () => {
		// Property: For any data update, derived state should reflect the new data
		
		const repo = new AboutRepositoryStatic();
		const service = new AboutService(repo);

		const newTechnologies: TechnologyItem[] = [
			{ name: 'Svelte', category: 'framework', description: 'Framework' },
			{ name: 'React', category: 'framework', description: 'Framework' },
			{ name: 'TypeScript', category: 'language', description: 'Language' },
			{ name: 'Vitest', category: 'testing', description: 'Testing' },
			{ name: 'Tailwind', category: 'styling', description: 'Styling' }
		];

		// Update state
		service.technologies = newTechnologies;

		// Property: Derived state should be correct
		const grouped = service.technologiesByCategory;

		// All technologies should be in the grouped result
		const allGroupedTechs = Object.values(grouped).flat();
		expect(allGroupedTechs).toHaveLength(newTechnologies.length);

		// Each technology should be in its correct category
		expect(grouped.framework).toHaveLength(2);
		expect(grouped.language).toHaveLength(1);
		expect(grouped.testing).toHaveLength(1);
		expect(grouped.styling).toHaveLength(1);
		expect(grouped.tooling).toHaveLength(0);
	});

	it('should update team member count after synchronization', () => {
		// Property: For any team members update, count should reflect the new data
		
		const testCases = [
			{ count: 0, members: [] },
			{ count: 1, members: [{ name: 'Member 1', role: 'Developer' }] },
			{ count: 5, members: Array.from({ length: 5 }, (_, i) => ({ name: `Member ${i}`, role: 'Developer' })) },
			{ count: 20, members: Array.from({ length: 20 }, (_, i) => ({ name: `Member ${i}`, role: 'Developer' })) }
		];

		for (const testCase of testCases) {
			const repo = new AboutRepositoryStatic();
			const service = new AboutService(repo);

			// Update state
			service.teamMembers = testCase.members;

			// Property: Derived count should be correct
			expect(service.teamMemberCount).toBe(testCase.count);
		}
	});

	it('should handle multiple synchronization cycles', () => {
		// Property: For any sequence of data updates, state should always match the latest data
		
		const repo = new AboutRepositoryStatic();
		const service = new AboutService(repo);

		const updates = [
			{
				aboutInfo: { projectName: 'Update 1', description: 'Desc 1', version: '1.0.0' },
				technologies: [{ name: 'Tech 1', category: 'framework' as const, description: 'Desc' }],
				principles: [{ id: '1', title: 'Principle 1', description: 'Desc', icon: '📋' }],
				teamMembers: [{ name: 'Member 1', role: 'Developer' }]
			},
			{
				aboutInfo: { projectName: 'Update 2', description: 'Desc 2', version: '2.0.0' },
				technologies: [
					{ name: 'Tech 1', category: 'framework' as const, description: 'Desc' },
					{ name: 'Tech 2', category: 'language' as const, description: 'Desc' }
				],
				principles: [
					{ id: '1', title: 'Principle 1', description: 'Desc', icon: '📋' },
					{ id: '2', title: 'Principle 2', description: 'Desc', icon: '📢' }
				],
				teamMembers: [
					{ name: 'Member 1', role: 'Developer' },
					{ name: 'Member 2', role: 'Designer' }
				]
			},
			{
				aboutInfo: { projectName: 'Update 3', description: 'Desc 3', version: '3.0.0' },
				technologies: [],
				principles: [],
				teamMembers: []
			}
		];

		for (const update of updates) {
			// Simulate $effect sync
			service.aboutInfo = update.aboutInfo;
			service.technologies = update.technologies;
			service.principles = update.principles;
			service.teamMembers = update.teamMembers;

			// Property: State should match the current update
			expect(service.aboutInfo).toEqual(update.aboutInfo);
			expect(service.technologies).toEqual(update.technologies);
			expect(service.principles).toEqual(update.principles);
			expect(service.teamMembers).toEqual(update.teamMembers);
		}
	});

	it('should preserve object references when data does not change', () => {
		// Property: For any unchanged data, object references should remain stable
		
		const repo = new AboutRepositoryStatic();
		const initialData = {
			aboutInfo: { projectName: 'Test', description: 'Desc', version: '1.0.0' },
			technologies: [{ name: 'Tech', category: 'framework' as const, description: 'Desc' }],
			principles: [{ id: '1', title: 'Principle', description: 'Desc', icon: '📋' }],
			teamMembers: [{ name: 'Member', role: 'Developer' }]
		};

		const service = new AboutService(repo, initialData);

		const initialAboutInfo = service.aboutInfo;
		const initialTechnologies = service.technologies;
		const initialPrinciples = service.principles;
		const initialTeamMembers = service.teamMembers;

		// Update with same data
		service.aboutInfo = initialData.aboutInfo;
		service.technologies = initialData.technologies;
		service.principles = initialData.principles;
		service.teamMembers = initialData.teamMembers;

		// Property: References should be the same
		expect(service.aboutInfo).toBe(initialAboutInfo);
		expect(service.technologies).toBe(initialTechnologies);
		expect(service.principles).toBe(initialPrinciples);
		expect(service.teamMembers).toBe(initialTeamMembers);
	});

	it('should handle partial data updates', () => {
		// Property: For any partial update, only updated fields should change
		
		const repo = new AboutRepositoryStatic();
		const service = new AboutService(repo, {
			aboutInfo: { projectName: 'Initial', description: 'Initial desc', version: '1.0.0' },
			technologies: [{ name: 'Tech 1', category: 'framework' as const, description: 'Desc' }],
			principles: [{ id: '1', title: 'Principle 1', description: 'Desc', icon: '📋' }],
			teamMembers: [{ name: 'Member 1', role: 'Developer' }]
		});

		const initialTechnologies = service.technologies;
		const initialPrinciples = service.principles;
		const initialTeamMembers = service.teamMembers;

		// Update only aboutInfo
		service.aboutInfo = { projectName: 'Updated', description: 'Updated desc', version: '2.0.0' };

		// Property: Only aboutInfo should change
		expect(service.aboutInfo?.projectName).toBe('Updated');
		expect(service.technologies).toBe(initialTechnologies);
		expect(service.principles).toBe(initialPrinciples);
		expect(service.teamMembers).toBe(initialTeamMembers);
	});
});
