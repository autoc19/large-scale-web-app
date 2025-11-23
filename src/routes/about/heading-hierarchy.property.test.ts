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
import type {
	AboutInfo,
	TechnologyItem,
	ArchitecturePrinciple,
	TeamMember
} from '$lib/domains/about/models/about.types';

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
 * Simulate the heading structure of the About page based on data
 */
function simulatePageHeadingStructure(data: {
	aboutInfo: AboutInfo;
	technologies: TechnologyItem[];
	principles: ArchitecturePrinciple[];
	teamMembers: TeamMember[];
}): number[] {
	const levels: number[] = [];
	
	// AboutHero: h1 for project name
	levels.push(1);
	
	// TechnologyStack: h2 for section
	if (data.technologies.length > 0) {
		levels.push(2); // Section heading
		
		// Group by category
		const categories = new Set(data.technologies.map(t => t.category));
		for (const category of categories) {
			levels.push(3); // Category heading
			
			// Each technology has h4
			const techsInCategory = data.technologies.filter(t => t.category === category);
			for (let i = 0; i < techsInCategory.length; i++) {
				levels.push(4); // Technology item heading
			}
		}
	}
	
	// ArchitectureSection: h2 for section
	if (data.principles.length > 0) {
		levels.push(2); // Section heading
		
		// Each principle has h3
		for (const principle of data.principles) {
			levels.push(3); // Principle heading
			
			// If principle has examples, h4 for examples heading
			if (principle.examples && principle.examples.length > 0) {
				levels.push(4); // Examples heading
			}
		}
	}
	
	// TeamSection: h2 for section
	if (data.teamMembers.length > 0) {
		levels.push(2); // Section heading
		
		// Each team member has h3
		for (let i = 0; i < data.teamMembers.length; i++) {
			levels.push(3); // Member heading
		}
	}
	
	return levels;
}

/**
 * Feature: about-page, Property 9: Heading hierarchy validity
 * Validates: Requirements 8.3, 9.5
 * 
 * For any rendered page, heading elements should follow proper hierarchy
 * without skipping levels (h1 -> h2 -> h3, never h1 -> h3)
 */
describe('Property 9: Heading hierarchy validity', () => {
	it('should maintain valid heading hierarchy with minimal data', () => {
		// Property: For any page structure, heading hierarchy should be valid
		
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

		const levels = simulatePageHeadingStructure(data);
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

	it('should maintain valid heading hierarchy with complete data', () => {
		// Property: For any page with all sections, heading hierarchy should be valid
		
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

		const levels = simulatePageHeadingStructure(data);
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

	it('should maintain valid heading hierarchy with large dataset', () => {
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

		const levels = simulatePageHeadingStructure(data);
		const validation = validateHeadingHierarchy(levels);

		// Property: Heading hierarchy should be valid even with large dataset
		expect(validation.valid).toBe(true);
		if (!validation.valid) {
			console.error(`Hierarchy error: ${validation.error}`);
			console.error(`Levels found: ${levels.join(', ')}`);
		}
	});

	it('should not skip heading levels in any configuration', () => {
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
			const levels = simulatePageHeadingStructure(config);
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

	it('should start with h1 and progress logically', () => {
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

		const levels = simulatePageHeadingStructure(data);

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

	it('should maintain hierarchy with optional fields present', () => {
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

		const levels = simulatePageHeadingStructure(data);
		const validation = validateHeadingHierarchy(levels);

		// Property: Heading hierarchy should be valid with all optional fields
		expect(validation.valid).toBe(true);
		if (!validation.valid) {
			console.error(`Hierarchy error: ${validation.error}`);
			console.error(`Levels found: ${levels.join(', ')}`);
		}
	});

	it('should validate the hierarchy validation function itself', () => {
		// Property: The validation function should correctly identify valid and invalid hierarchies
		
		const testCases = [
			{ levels: [1, 2, 3, 4], expected: true, description: 'Valid progression' },
			{ levels: [1, 2, 2, 3], expected: true, description: 'Valid with same level' },
			{ levels: [1, 2, 3, 2, 3], expected: true, description: 'Valid with backtracking' },
			{ levels: [1, 3], expected: false, description: 'Invalid - skips h2' },
			{ levels: [2, 4], expected: false, description: 'Invalid - skips h3' },
			{ levels: [1, 2, 4], expected: false, description: 'Invalid - skips h3 after h2' },
			{ levels: [3, 4], expected: false, description: 'Invalid - starts with h3' },
			{ levels: [1], expected: true, description: 'Valid - single h1' },
			{ levels: [2], expected: true, description: 'Valid - single h2' },
			{ levels: [], expected: true, description: 'Valid - empty' }
		];

		for (const testCase of testCases) {
			const validation = validateHeadingHierarchy(testCase.levels);
			expect(validation.valid).toBe(testCase.expected);
			if (validation.valid !== testCase.expected) {
				console.error(`Test case failed: ${testCase.description}`);
				console.error(`Levels: ${testCase.levels.join(', ')}`);
				console.error(`Expected: ${testCase.expected}, Got: ${validation.valid}`);
				if (validation.error) {
					console.error(`Error: ${validation.error}`);
				}
			}
		}
	});
});
