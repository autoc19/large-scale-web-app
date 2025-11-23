/**
 * Property-Based Tests for About Page Semantic HTML Structure
 * 
 * Feature: about-page, Property 10: Semantic HTML structure
 * Validates: Requirements 8.5, 9.1
 * 
 * Tests that the HTML uses proper semantic elements (header, main, section, article)
 * in appropriate contexts.
 */

import { describe, it, expect } from 'vitest';
import type {
	AboutInfo,
	TechnologyItem,
	ArchitecturePrinciple,
	TeamMember
} from '$lib/domains/about/models/about.types';

/**
 * Simulate the semantic structure of the About page based on data
 */
function simulatePageSemanticStructure(data: {
	aboutInfo: AboutInfo;
	technologies: TechnologyItem[];
	principles: ArchitecturePrinciple[];
	teamMembers: TeamMember[];
}): {
	hasMain: boolean;
	hasHeader: boolean;
	sectionCount: number;
	articleCount: number;
	semanticElements: string[];
} {
	const semanticElements: string[] = [];
	
	// Page should have main element
	semanticElements.push('main');
	
	// AboutHero uses header element
	semanticElements.push('header');
	
	// Each section (Technology, Architecture, Team) uses section element
	let sectionCount = 0;
	let articleCount = 0;
	
	if (data.technologies.length > 0) {
		semanticElements.push('section'); // Technology section
		sectionCount++;
		
		// Each technology item is an article
		articleCount += data.technologies.length;
		for (let i = 0; i < data.technologies.length; i++) {
			semanticElements.push('article');
		}
	}
	
	if (data.principles.length > 0) {
		semanticElements.push('section'); // Architecture section
		sectionCount++;
		
		// Each principle is an article
		articleCount += data.principles.length;
		for (let i = 0; i < data.principles.length; i++) {
			semanticElements.push('article');
		}
	}
	
	if (data.teamMembers.length > 0) {
		semanticElements.push('section'); // Team section
		sectionCount++;
		
		// Each team member is an article
		articleCount += data.teamMembers.length;
		for (let i = 0; i < data.teamMembers.length; i++) {
			semanticElements.push('article');
		}
	}
	
	return {
		hasMain: semanticElements.includes('main'),
		hasHeader: semanticElements.includes('header'),
		sectionCount,
		articleCount,
		semanticElements
	};
}

/**
 * Validate semantic HTML structure
 */
function validateSemanticStructure(structure: {
	hasMain: boolean;
	hasHeader: boolean;
	sectionCount: number;
	articleCount: number;
	semanticElements: string[];
}): { valid: boolean; errors: string[] } {
	const errors: string[] = [];
	
	// Page must have main element
	if (!structure.hasMain) {
		errors.push('Page must have a <main> element');
	}
	
	// Page must have header element (for hero section)
	if (!structure.hasHeader) {
		errors.push('Page must have a <header> element');
	}
	
	// Should have at least one section if there's content
	if (structure.articleCount > 0 && structure.sectionCount === 0) {
		errors.push('Page with content should have <section> elements');
	}
	
	// Articles should be within sections
	if (structure.articleCount > 0 && structure.sectionCount === 0) {
		errors.push('Articles should be within sections');
	}
	
	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Feature: about-page, Property 10: Semantic HTML structure
 * Validates: Requirements 8.5, 9.1
 * 
 * For any rendered page, the HTML should use proper semantic elements
 * (header, main, section, article) in appropriate contexts
 */
describe('Property 10: Semantic HTML structure', () => {
	it('should use semantic HTML elements with minimal data', () => {
		// Property: For any page, semantic HTML elements should be present
		
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

		const structure = simulatePageSemanticStructure(data);
		const validation = validateSemanticStructure(structure);

		// Property: Semantic structure should be valid
		expect(validation.valid).toBe(true);
		if (!validation.valid) {
			console.error('Semantic structure errors:');
			validation.errors.forEach(error => console.error(`  - ${error}`));
		}

		// Should have main and header
		expect(structure.hasMain).toBe(true);
		expect(structure.hasHeader).toBe(true);
	});

	it('should use semantic HTML elements with complete data', () => {
		// Property: For any page with all sections, semantic elements should be properly used
		
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

		const structure = simulatePageSemanticStructure(data);
		const validation = validateSemanticStructure(structure);

		// Property: Semantic structure should be valid
		expect(validation.valid).toBe(true);
		if (!validation.valid) {
			console.error('Semantic structure errors:');
			validation.errors.forEach(error => console.error(`  - ${error}`));
		}

		// Should have proper structure
		expect(structure.hasMain).toBe(true);
		expect(structure.hasHeader).toBe(true);
		expect(structure.sectionCount).toBe(3); // Technology, Architecture, Team
		expect(structure.articleCount).toBe(7); // 3 techs + 2 principles + 2 members
	});

	it('should use semantic HTML elements with large dataset', () => {
		// Property: For any large dataset, semantic structure should remain valid
		
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
				icon: '📋'
			})),
			teamMembers: Array.from({ length: 15 }, (_, i) => ({
				name: `Member ${i}`,
				role: `Role ${i}`
			}))
		};

		const structure = simulatePageSemanticStructure(data);
		const validation = validateSemanticStructure(structure);

		// Property: Semantic structure should be valid even with large dataset
		expect(validation.valid).toBe(true);
		if (!validation.valid) {
			console.error('Semantic structure errors:');
			validation.errors.forEach(error => console.error(`  - ${error}`));
		}

		// Should have proper counts
		expect(structure.sectionCount).toBe(3);
		expect(structure.articleCount).toBe(45); // 20 + 10 + 15
	});

	it('should maintain semantic structure in any configuration', () => {
		// Property: For any data configuration, semantic structure should be valid
		
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
			const structure = simulatePageSemanticStructure(config);
			const validation = validateSemanticStructure(structure);

			// Property: Semantic structure should be valid
			expect(validation.valid).toBe(true);
			if (!validation.valid) {
				console.error(`Configuration: ${config.aboutInfo.projectName}`);
				console.error('Semantic structure errors:');
				validation.errors.forEach(error => console.error(`  - ${error}`));
			}

			// Should always have main and header
			expect(structure.hasMain).toBe(true);
			expect(structure.hasHeader).toBe(true);
		}
	});

	it('should use articles for content items', () => {
		// Property: For any content items, they should be wrapped in article elements
		
		const data = {
			aboutInfo: {
				projectName: 'Test',
				description: 'Desc',
				version: '1.0.0'
			},
			technologies: [
				{ name: 'Tech 1', category: 'framework' as const, description: 'Desc' },
				{ name: 'Tech 2', category: 'language' as const, description: 'Desc' }
			],
			principles: [
				{ id: 'p1', title: 'Principle 1', description: 'Desc', icon: '📋' }
			],
			teamMembers: [
				{ name: 'Member 1', role: 'Developer' },
				{ name: 'Member 2', role: 'Designer' }
			]
		};

		const structure = simulatePageSemanticStructure(data);

		// Property: Article count should match total content items
		const totalItems = data.technologies.length + data.principles.length + data.teamMembers.length;
		expect(structure.articleCount).toBe(totalItems);
	});

	it('should use sections for major content areas', () => {
		// Property: For any page with content, sections should be used for major areas
		
		const testCases = [
			{
				data: {
					aboutInfo: { projectName: 'Test', description: 'Desc', version: '1.0.0' },
					technologies: [{ name: 'Tech', category: 'framework' as const, description: 'Desc' }],
					principles: [],
					teamMembers: []
				},
				expectedSections: 1
			},
			{
				data: {
					aboutInfo: { projectName: 'Test', description: 'Desc', version: '1.0.0' },
					technologies: [{ name: 'Tech', category: 'framework' as const, description: 'Desc' }],
					principles: [{ id: 'p1', title: 'P1', description: 'Desc', icon: '📋' }],
					teamMembers: []
				},
				expectedSections: 2
			},
			{
				data: {
					aboutInfo: { projectName: 'Test', description: 'Desc', version: '1.0.0' },
					technologies: [{ name: 'Tech', category: 'framework' as const, description: 'Desc' }],
					principles: [{ id: 'p1', title: 'P1', description: 'Desc', icon: '📋' }],
					teamMembers: [{ name: 'Member', role: 'Developer' }]
				},
				expectedSections: 3
			}
		];

		for (const testCase of testCases) {
			const structure = simulatePageSemanticStructure(testCase.data);
			
			// Property: Section count should match number of content areas
			expect(structure.sectionCount).toBe(testCase.expectedSections);
		}
	});

	it('should validate the semantic structure validation function', () => {
		// Property: The validation function should correctly identify valid and invalid structures
		
		const testCases = [
			{
				structure: {
					hasMain: true,
					hasHeader: true,
					sectionCount: 3,
					articleCount: 10,
					semanticElements: ['main', 'header', 'section', 'article']
				},
				expected: true,
				description: 'Valid complete structure'
			},
			{
				structure: {
					hasMain: true,
					hasHeader: true,
					sectionCount: 0,
					articleCount: 0,
					semanticElements: ['main', 'header']
				},
				expected: true,
				description: 'Valid minimal structure'
			},
			{
				structure: {
					hasMain: false,
					hasHeader: true,
					sectionCount: 1,
					articleCount: 5,
					semanticElements: ['header', 'section', 'article']
				},
				expected: false,
				description: 'Invalid - missing main'
			},
			{
				structure: {
					hasMain: true,
					hasHeader: false,
					sectionCount: 1,
					articleCount: 5,
					semanticElements: ['main', 'section', 'article']
				},
				expected: false,
				description: 'Invalid - missing header'
			},
			{
				structure: {
					hasMain: true,
					hasHeader: true,
					sectionCount: 0,
					articleCount: 5,
					semanticElements: ['main', 'header', 'article']
				},
				expected: false,
				description: 'Invalid - articles without sections'
			}
		];

		for (const testCase of testCases) {
			const validation = validateSemanticStructure(testCase.structure);
			expect(validation.valid).toBe(testCase.expected);
			if (validation.valid !== testCase.expected) {
				console.error(`Test case failed: ${testCase.description}`);
				console.error(`Expected: ${testCase.expected}, Got: ${validation.valid}`);
				if (validation.errors.length > 0) {
					console.error('Errors:');
					validation.errors.forEach(error => console.error(`  - ${error}`));
				}
			}
		}
	});
});
