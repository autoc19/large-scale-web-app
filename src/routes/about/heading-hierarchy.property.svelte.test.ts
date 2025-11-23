/**
 * Property-Based Tests for About Page Heading Hierarchy
 * 
 * Feature: about-page, Property 9: Heading hierarchy validity
 * Validates: Requirements 8.3, 9.5
 * 
 * Tests that heading elements follow proper hierarchy without skipping levels
 * (h1 -> h2 -> h3, never h1 -> h3).
 */

import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import AboutPageWrapper from './AboutPageWrapper.test.svelte';
import type {
	AboutInfo,
	TechnologyItem,
	ArchitecturePrinciple,
	TeamMember
} from '$lib/domains/about/models/about.types';

/**
 * Extract heading levels from HTML element
 */
function extractHeadingLevels(element: HTMLElement): number[] {
	const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
	return Array.from(headings).map(h => parseInt(h.tagName.substring(1), 10));
}

/**
 * Validate heading hierarchy - no level should be skipped
 */
function validateHeadingHierarchy(levels: number[]): { valid: boolean; error?: string } {
	if (levels.length === 0) {
		return { valid: true };
	}
	
	// First heading should be h1 or h2
	if (levels[0] > 2) {
		return { valid: false, error: `First heading is h${levels[0]}, should be h1 or h2` };
	}
	
	// Check for skipped levels
	for (let i = 1; i < levels.length; i++) {
		const current = levels[i];
		const previous = levels[i - 1];
		
		// Can go down any number of levels, but can only go up by 1
		if (current > previous + 1) {
			return {
				valid: false,
				error: `Heading hierarchy skips from h${previous} to h${current} at position ${i}`
			};
		}
	}
	
	return { valid: true };
}

/**
 * Feature: about-page, Property 9: Heading hierarchy validity
 * Validates: Requirements 8.3, 9.5
 * 
 * For any rendered page, heading elements should follow proper hierarchy
 * without skipping levels (h1 -> h2 -> h3, never h1 -> h3)
 */
describe('Property 9: Heading hierarchy validity', () => {
	it('should maintain valid heading hierarchy with minimal data', async () => {
		// Property: For any page render, heading hierarchy should be valid
		
		const data = {
			aboutInfo: {
				projectName: 'Test Project',
				description: 'Test description',
				version: '1.0.0'
			},
			technologies: [],
			principles: [],
			teamMembers: []
		};

		const { container } = await render(AboutPageWrapper, {
			props: { data }
		});

		const levels = extractHeadingLevels(container);
		const validation = validateHeadingHierarchy(levels);

		// Property: Heading hierarchy should be valid
		expect(validation.valid).toBe(true);
		if (!validation.valid) {
			console.error(`Hierarchy error: ${validation.error}`);
			console.error(`Levels found: ${levels.join(', ')}`);
		}

		// Should have h1 for hero
		expect(levels).toContain(1);
	});

	it('should maintain valid heading hierarchy with complete data', async () => {
		// Property: For any page render with all sections, heading hierarchy should be valid
		
		const data = {
			aboutInfo: {
				projectName: 'Complete Project',
				description: 'Complete description',
				version: '2.0.0',
				repository: 'https://github.com/test',
				license: 'MIT'
			},
			technologies: [
				{ name: 'Svelte', category: 'framework' as const, description: 'Framework' },
				{ name: 'TypeScript', category: 'language' as const, description: 'Language' },
				{ name: 'Vitest', category: 'testing' as const, description: 'Testing' }
			],
			principles: [
				{ id: 'test-1', title: 'Principle 1', description: 'Description 1', icon: '📋' },
				{ id: 'test-2', title: 'Principle 2', description: 'Description 2', icon: '📢' }
			],
			teamMembers: [
				{ name: 'Member 1', role: 'Developer' },
				{ name: 'Member 2', role: 'Designer' }
			]
		};

		const { container } = await render(AboutPageWrapper, {
			props: { data }
		});

		const levels = extractHeadingLevels(container);
		const validation = validateHeadingHierarchy(levels);

		// Property: Heading hierarchy should be valid
		expect(validation.valid).toBe(true);
		if (!validation.valid) {
			console.error(`Hierarchy error: ${validation.error}`);
			console.error(`Levels found: ${levels.join(', ')}`);
		}

		// Should have proper structure: h1 (hero), h2 (sections), h3 (subsections), h4 (items)
		expect(levels).toContain(1); // Hero
		expect(levels).toContain(2); // Section headings
		expect(levels).toContain(3); // Subsection headings
		expect(levels).toContain(4); // Item headings
	});

	it('should maintain valid heading hierarchy with large dataset', async () => {
		// Property: For any large dataset, heading hierarchy should remain valid
		
		const data = {
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
				icon: '📋',
				examples: i % 2 === 0 ? [`Example ${i}`] : undefined
			})),
			teamMembers: Array.from({ length: 15 }, (_, i) => ({
				name: `Member ${i}`,
				role: `Role ${i}`
			}))
		};

		const { container } = await render(AboutPageWrapper, {
			props: { data }
		});

		const levels = extractHeadingLevels(container);
		const validation = validateHeadingHierarchy(levels);

		// Property: Heading hierarchy should be valid even with large dataset
		expect(validation.valid).toBe(true);
		if (!validation.valid) {
			console.error(`Hierarchy error: ${validation.error}`);
			console.error(`Levels found: ${levels.join(', ')}`);
		}
	});

	it('should not skip heading levels in any configuration', async () => {
		// Property: For any data configuration, no heading level should be skipped
		
		const configurations = [
			// Only technologies
			{
				aboutInfo: { projectName: 'Tech Only', description: 'Desc', version: '1.0.0' },
				technologies: [
					{ name: 'Svelte', category: 'framework' as const, description: 'Framework' }
				],
				principles: [],
				teamMembers: []
			},
			// Only principles
			{
				aboutInfo: { projectName: 'Principles Only', description: 'Desc', version: '1.0.0' },
				technologies: [],
				principles: [
					{ id: 'test-1', title: 'Principle', description: 'Desc', icon: '📋' }
				],
				teamMembers: []
			},
			// Only team
			{
				aboutInfo: { projectName: 'Team Only', description: 'Desc', version: '1.0.0' },
				technologies: [],
				principles: [],
				teamMembers: [
					{ name: 'Member', role: 'Developer' }
				]
			},
			// All sections with varying amounts
			{
				aboutInfo: { projectName: 'Mixed', description: 'Desc', version: '1.0.0' },
				technologies: [
					{ name: 'Tech 1', category: 'framework' as const, description: 'Desc' },
					{ name: 'Tech 2', category: 'language' as const, description: 'Desc' }
				],
				principles: [
					{ id: 'p1', title: 'P1', description: 'Desc', icon: '📋' }
				],
				teamMembers: [
					{ name: 'M1', role: 'Dev' },
					{ name: 'M2', role: 'Des' },
					{ name: 'M3', role: 'Man' }
				]
			}
		];

		for (const config of configurations) {
			const { container } = await render(AboutPageWrapper, {
				props: { data: config }
			});

			const levels = extractHeadingLevels(container);
			const validation = validateHeadingHierarchy(levels);

			// Property: No levels should be skipped
			expect(validation.valid).toBe(true);
			if (!validation.valid) {
				console.error(`Configuration: ${config.aboutInfo.projectName}`);
				console.error(`Hierarchy error: ${validation.error}`);
				console.error(`Levels found: ${levels.join(', ')}`);
			}
		}
	});

	it('should start with h1 and progress logically', async () => {
		// Property: For any page, first heading should be h1, and progression should be logical
		
		const data = {
			aboutInfo: {
				projectName: 'Test',
				description: 'Desc',
				version: '1.0.0'
			},
			technologies: [
				{ name: 'Tech', category: 'framework' as const, description: 'Desc' }
			],
			principles: [
				{ id: 'p1', title: 'Principle', description: 'Desc', icon: '📋' }
			],
			teamMembers: [
				{ name: 'Member', role: 'Developer' }
			]
		};

		const { container } = await render(AboutPageWrapper, {
			props: { data }
		});

		const levels = extractHeadingLevels(container);

		// Property: First heading should be h1
		expect(levels[0]).toBe(1);

		// Property: Should have logical progression (h1 -> h2 -> h3 -> h4)
		const uniqueLevels = [...new Set(levels)].sort();
		for (let i = 1; i < uniqueLevels.length; i++) {
			const diff = uniqueLevels[i] - uniqueLevels[i - 1];
			// Difference should be at most 1
			expect(diff).toBeLessThanOrEqual(1);
		}
	});

	it('should maintain hierarchy with optional fields present', async () => {
		// Property: For any data with optional fields, heading hierarchy should remain valid
		
		const data = {
			aboutInfo: {
				projectName: 'Full Project',
				description: 'Full description',
				version: '1.0.0',
				repository: 'https://github.com/test',
				license: 'MIT'
			},
			technologies: [
				{
					name: 'Svelte',
					category: 'framework' as const,
					description: 'Framework',
					version: '5.0.0',
					url: 'https://svelte.dev'
				}
			],
			principles: [
				{
					id: 'test-1',
					title: 'Principle',
					description: 'Description',
					icon: '📋',
					examples: ['Example 1', 'Example 2']
				}
			],
			teamMembers: [
				{
					name: 'Member',
					role: 'Developer',
					avatar: 'https://example.com/avatar.jpg',
					email: 'member@example.com',
					github: 'member'
				}
			]
		};

		const { container } = await render(AboutPageWrapper, {
			props: { data }
		});

		const levels = extractHeadingLevels(container);
		const validation = validateHeadingHierarchy(levels);

		// Property: Heading hierarchy should be valid with all optional fields
		expect(validation.valid).toBe(true);
		if (!validation.valid) {
			console.error(`Hierarchy error: ${validation.error}`);
			console.error(`Levels found: ${levels.join(', ')}`);
		}
	});
});
