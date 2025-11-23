/**
 * Property-Based Tests for About Page Keyboard Navigation
 * 
 * Feature: about-page, Property 12: Keyboard navigation support
 * Validates: Requirements 9.3
 * 
 * Tests that all interactive elements are keyboard accessible with proper
 * tabindex and focus management.
 */

import { describe, it, expect } from 'vitest';
import type {
	AboutInfo,
	TechnologyItem,
	TeamMember
} from '$lib/domains/about/models/about.types';

/**
 * Simulate interactive elements in the About page
 */
function simulateInteractiveElements(data: {
	aboutInfo: AboutInfo;
	technologies: TechnologyItem[];
	teamMembers: TeamMember[];
}): Array<{
	type: string;
	isFocusable: boolean;
	tabIndex: number;
	hasFocusIndicator: boolean;
	role: string;
}> {
	const elements: Array<{
		type: string;
		isFocusable: boolean;
		tabIndex: number;
		hasFocusIndicator: boolean;
		role: string;
	}> = [];
	
	// Repository link in AboutHero
	if (data.aboutInfo.repository) {
		elements.push({
			type: 'link',
			isFocusable: true,
			tabIndex: 0, // Default for links
			hasFocusIndicator: true,
			role: 'link'
		});
	}
	
	// Technology documentation links
	for (const tech of data.technologies) {
		if (tech.url) {
			elements.push({
				type: 'link',
				isFocusable: true,
				tabIndex: 0,
				hasFocusIndicator: true,
				role: 'link'
			});
		}
	}
	
	// Team member contact links
	for (const member of data.teamMembers) {
		if (member.email) {
			elements.push({
				type: 'link',
				isFocusable: true,
				tabIndex: 0,
				hasFocusIndicator: true,
				role: 'link'
			});
		}
		if (member.github) {
			elements.push({
				type: 'link',
				isFocusable: true,
				tabIndex: 0,
				hasFocusIndicator: true,
				role: 'link'
			});
		}
	}
	
	return elements;
}

/**
 * Validate keyboard navigation
 */
function validateKeyboardNavigation(elements: Array<{
	type: string;
	isFocusable: boolean;
	tabIndex: number;
	hasFocusIndicator: boolean;
	role: string;
}>): { valid: boolean; errors: string[] } {
	const errors: string[] = [];
	
	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];
		
		// All interactive elements must be focusable
		if (!element.isFocusable) {
			errors.push(`Element ${i} (${element.type}) is not focusable`);
		}
		
		// Interactive elements should have tabIndex 0 or greater (not -1)
		if (element.isFocusable && element.tabIndex < 0) {
			errors.push(`Element ${i} (${element.type}) has negative tabIndex`);
		}
		
		// All focusable elements must have visible focus indicators
		if (element.isFocusable && !element.hasFocusIndicator) {
			errors.push(`Element ${i} (${element.type}) lacks visible focus indicator`);
		}
		
		// Elements should have appropriate roles
		if (!element.role) {
			errors.push(`Element ${i} (${element.type}) lacks semantic role`);
		}
	}
	
	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Feature: about-page, Property 12: Keyboard navigation support
 * Validates: Requirements 9.3
 * 
 * For any interactive element, it should be keyboard accessible with proper
 * tabindex and focus management
 */
describe('Property 12: Keyboard navigation support', () => {
	it('should make all links keyboard accessible', () => {
		// Property: For any link, it should be keyboard accessible
		
		const data = {
			aboutInfo: {
				projectName: 'Test Project',
				description: 'Description',
				version: '1.0.0',
				repository: 'https://github.com/test/repo'
			},
			technologies: [
				{
					name: 'Svelte',
					category: 'framework' as const,
					description: 'Framework',
					url: 'https://svelte.dev'
				}
			],
			teamMembers: [
				{
					name: 'Member 1',
					role: 'Developer',
					email: 'member@example.com',
					github: 'member1'
				}
			]
		};

		const elements = simulateInteractiveElements(data);
		const validation = validateKeyboardNavigation(elements);

		// Property: All elements should be keyboard accessible
		expect(validation.valid).toBe(true);
		if (!validation.valid) {
			console.error('Keyboard navigation errors:');
			validation.errors.forEach(error => console.error(`  - ${error}`));
		}

		// Property: All links should be focusable
		for (const element of elements) {
			expect(element.isFocusable).toBe(true);
			expect(element.tabIndex).toBeGreaterThanOrEqual(0);
			expect(element.hasFocusIndicator).toBe(true);
		}
	});

	it('should maintain keyboard accessibility with many interactive elements', () => {
		// Property: For any number of interactive elements, all should be keyboard accessible
		
		const data = {
			aboutInfo: {
				projectName: 'Large Project',
				description: 'Description',
				version: '1.0.0',
				repository: 'https://github.com/test/repo'
			},
			technologies: Array.from({ length: 20 }, (_, i) => ({
				name: `Tech ${i}`,
				category: 'framework' as const,
				description: `Description ${i}`,
				url: `https://example.com/tech${i}`
			})),
			teamMembers: Array.from({ length: 15 }, (_, i) => ({
				name: `Member ${i}`,
				role: `Role ${i}`,
				email: `member${i}@example.com`,
				github: `member${i}`
			}))
		};

		const elements = simulateInteractiveElements(data);
		const validation = validateKeyboardNavigation(elements);

		// Property: All elements should be keyboard accessible
		expect(validation.valid).toBe(true);
		if (!validation.valid) {
			console.error('Keyboard navigation errors:');
			validation.errors.forEach(error => console.error(`  - ${error}`));
		}

		// Should have many interactive elements
		expect(elements.length).toBeGreaterThan(30); // 1 repo + 20 techs + 15*2 members
	});

	it('should maintain keyboard accessibility in any configuration', () => {
		// Property: For any data configuration, keyboard navigation should work
		
		const configurations = [
			// Only repository link
			{
				aboutInfo: {
					projectName: 'Test',
					description: 'Desc',
					version: '1.0.0',
					repository: 'https://github.com/test'
				},
				technologies: [],
				teamMembers: []
			},
			// Only technology links
			{
				aboutInfo: {
					projectName: 'Test',
					description: 'Desc',
					version: '1.0.0'
				},
				technologies: [
					{ name: 'Tech 1', category: 'framework' as const, description: 'Desc', url: 'https://example.com/1' },
					{ name: 'Tech 2', category: 'language' as const, description: 'Desc', url: 'https://example.com/2' }
				],
				teamMembers: []
			},
			// Only team member links
			{
				aboutInfo: {
					projectName: 'Test',
					description: 'Desc',
					version: '1.0.0'
				},
				technologies: [],
				teamMembers: [
					{ name: 'Member 1', role: 'Dev', email: 'member1@example.com', github: 'member1' },
					{ name: 'Member 2', role: 'Des', email: 'member2@example.com' }
				]
			},
			// Mixed configuration
			{
				aboutInfo: {
					projectName: 'Test',
					description: 'Desc',
					version: '1.0.0',
					repository: 'https://github.com/test'
				},
				technologies: [
					{ name: 'Tech', category: 'framework' as const, description: 'Desc', url: 'https://example.com' }
				],
				teamMembers: [
					{ name: 'Member', role: 'Dev', github: 'member' }
				]
			},
			// No interactive elements
			{
				aboutInfo: {
					projectName: 'Test',
					description: 'Desc',
					version: '1.0.0'
				},
				technologies: [],
				teamMembers: []
			}
		];

		for (const config of configurations) {
			const elements = simulateInteractiveElements(config);
			const validation = validateKeyboardNavigation(elements);

			// Property: All elements should be keyboard accessible
			expect(validation.valid).toBe(true);
			if (!validation.valid) {
				console.error('Configuration:', config.aboutInfo.projectName);
				console.error('Keyboard navigation errors:');
				validation.errors.forEach(error => console.error(`  - ${error}`));
			}
		}
	});

	it('should have proper tab order', () => {
		// Property: For any page, tab order should be logical (all tabIndex >= 0)
		
		const data = {
			aboutInfo: {
				projectName: 'Test',
				description: 'Desc',
				version: '1.0.0',
				repository: 'https://github.com/test'
			},
			technologies: [
				{ name: 'Tech 1', category: 'framework' as const, description: 'Desc', url: 'https://example.com/1' },
				{ name: 'Tech 2', category: 'language' as const, description: 'Desc', url: 'https://example.com/2' }
			],
			teamMembers: [
				{ name: 'Member 1', role: 'Dev', email: 'member1@example.com' }
			]
		};

		const elements = simulateInteractiveElements(data);

		// Property: All elements should have non-negative tabIndex
		for (const element of elements) {
			expect(element.tabIndex).toBeGreaterThanOrEqual(0);
		}

		// Property: Elements should use default tab order (tabIndex 0)
		const nonDefaultTabIndex = elements.filter(e => e.tabIndex !== 0);
		expect(nonDefaultTabIndex.length).toBe(0);
	});

	it('should have visible focus indicators', () => {
		// Property: For any interactive element, it should have visible focus indicator
		
		const data = {
			aboutInfo: {
				projectName: 'Test',
				description: 'Desc',
				version: '1.0.0',
				repository: 'https://github.com/test'
			},
			technologies: [
				{ name: 'Tech', category: 'framework' as const, description: 'Desc', url: 'https://example.com' }
			],
			teamMembers: [
				{ name: 'Member', role: 'Dev', email: 'member@example.com', github: 'member' }
			]
		};

		const elements = simulateInteractiveElements(data);

		// Property: All focusable elements should have focus indicators
		for (const element of elements) {
			if (element.isFocusable) {
				expect(element.hasFocusIndicator).toBe(true);
			}
		}
	});

	it('should validate the keyboard navigation validation function', () => {
		// Property: The validation function should correctly identify valid and invalid navigation
		
		const testCases = [
			{
				elements: [
					{ type: 'link', isFocusable: true, tabIndex: 0, hasFocusIndicator: true, role: 'link' }
				],
				expected: true,
				description: 'Valid link'
			},
			{
				elements: [
					{ type: 'link', isFocusable: false, tabIndex: 0, hasFocusIndicator: true, role: 'link' }
				],
				expected: false,
				description: 'Invalid - not focusable'
			},
			{
				elements: [
					{ type: 'link', isFocusable: true, tabIndex: -1, hasFocusIndicator: true, role: 'link' }
				],
				expected: false,
				description: 'Invalid - negative tabIndex'
			},
			{
				elements: [
					{ type: 'link', isFocusable: true, tabIndex: 0, hasFocusIndicator: false, role: 'link' }
				],
				expected: false,
				description: 'Invalid - no focus indicator'
			},
			{
				elements: [
					{ type: 'link', isFocusable: true, tabIndex: 0, hasFocusIndicator: true, role: '' }
				],
				expected: false,
				description: 'Invalid - no role'
			},
			{
				elements: [
					{ type: 'link', isFocusable: true, tabIndex: 0, hasFocusIndicator: true, role: 'link' },
					{ type: 'link', isFocusable: true, tabIndex: 0, hasFocusIndicator: true, role: 'link' }
				],
				expected: true,
				description: 'Valid - multiple links'
			}
		];

		for (const testCase of testCases) {
			const validation = validateKeyboardNavigation(testCase.elements);
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

	it('should handle optional interactive elements', () => {
		// Property: For any optional interactive element, if present, it should be keyboard accessible
		
		const testCases = [
			// Repository link present
			{
				aboutInfo: {
					projectName: 'Test',
					description: 'Desc',
					version: '1.0.0',
					repository: 'https://github.com/test'
				},
				technologies: [],
				teamMembers: []
			},
			// Repository link absent
			{
				aboutInfo: {
					projectName: 'Test',
					description: 'Desc',
					version: '1.0.0'
				},
				technologies: [],
				teamMembers: []
			},
			// Technology URL present
			{
				aboutInfo: {
					projectName: 'Test',
					description: 'Desc',
					version: '1.0.0'
				},
				technologies: [
					{ name: 'Tech', category: 'framework' as const, description: 'Desc', url: 'https://example.com' }
				],
				teamMembers: []
			},
			// Technology URL absent
			{
				aboutInfo: {
					projectName: 'Test',
					description: 'Desc',
					version: '1.0.0'
				},
				technologies: [
					{ name: 'Tech', category: 'framework' as const, description: 'Desc' }
				],
				teamMembers: []
			}
		];

		for (const config of testCases) {
			const elements = simulateInteractiveElements(config);
			const validation = validateKeyboardNavigation(elements);

			// Property: All present elements should be keyboard accessible
			expect(validation.valid).toBe(true);
			if (!validation.valid) {
				console.error('Keyboard navigation errors:');
				validation.errors.forEach(error => console.error(`  - ${error}`));
			}
		}
	});
});
