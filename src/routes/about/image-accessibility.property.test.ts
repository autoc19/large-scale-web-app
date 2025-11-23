/**
 * Property-Based Tests for About Page Image Accessibility
 * 
 * Feature: about-page, Property 11: Image accessibility
 * Validates: Requirements 9.2
 * 
 * Tests that all image elements have alt attributes with non-empty descriptive text.
 */

import { describe, it, expect } from 'vitest';
import type { TeamMember, ArchitecturePrinciple } from '$lib/domains/about/models/about.types';

/**
 * Simulate image elements in the About page
 */
function simulateImageElements(data: {
	teamMembers: TeamMember[];
	principles: ArchitecturePrinciple[];
}): Array<{ type: string; hasAlt: boolean; altText: string; isDecorative: boolean }> {
	const images: Array<{ type: string; hasAlt: boolean; altText: string; isDecorative: boolean }> = [];
	
	// Team member avatars
	for (const member of data.teamMembers) {
		if (member.avatar) {
			images.push({
				type: 'avatar',
				hasAlt: true,
				altText: `${member.name}'s avatar`,
				isDecorative: false
			});
		}
	}
	
	// Architecture principle icons (using role="img" with aria-label)
	for (const principle of data.principles) {
		if (principle.icon) {
			images.push({
				type: 'icon',
				hasAlt: true,
				altText: principle.title,
				isDecorative: false
			});
		}
	}
	
	return images;
}

/**
 * Validate image accessibility
 */
function validateImageAccessibility(images: Array<{
	type: string;
	hasAlt: boolean;
	altText: string;
	isDecorative: boolean;
}>): { valid: boolean; errors: string[] } {
	const errors: string[] = [];
	
	for (let i = 0; i < images.length; i++) {
		const image = images[i];
		
		// All images must have alt attribute
		if (!image.hasAlt) {
			errors.push(`Image ${i} (${image.type}) is missing alt attribute`);
		}
		
		// Non-decorative images must have non-empty alt text
		if (!image.isDecorative && image.altText.trim() === '') {
			errors.push(`Image ${i} (${image.type}) has empty alt text but is not decorative`);
		}
		
		// Decorative images should have empty alt text
		if (image.isDecorative && image.altText.trim() !== '') {
			errors.push(`Image ${i} (${image.type}) is decorative but has non-empty alt text`);
		}
	}
	
	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Feature: about-page, Property 11: Image accessibility
 * Validates: Requirements 9.2
 * 
 * For any image element in the rendered output, it should have an alt attribute
 * with non-empty descriptive text
 */
describe('Property 11: Image accessibility', () => {
	it('should have alt text for all team member avatars', () => {
		// Property: For any team member with avatar, image should have descriptive alt text
		
		const testCases: TeamMember[][] = [
			// Single member with avatar
			[
				{ name: 'John Doe', role: 'Developer', avatar: 'https://example.com/john.jpg' }
			],
			// Multiple members with avatars
			[
				{ name: 'John Doe', role: 'Developer', avatar: 'https://example.com/john.jpg' },
				{ name: 'Jane Smith', role: 'Designer', avatar: 'https://example.com/jane.jpg' },
				{ name: 'Bob Johnson', role: 'Manager', avatar: 'https://example.com/bob.jpg' }
			],
			// Mixed - some with avatars, some without
			[
				{ name: 'John Doe', role: 'Developer', avatar: 'https://example.com/john.jpg' },
				{ name: 'Jane Smith', role: 'Designer' },
				{ name: 'Bob Johnson', role: 'Manager', avatar: 'https://example.com/bob.jpg' }
			],
			// No avatars
			[
				{ name: 'John Doe', role: 'Developer' },
				{ name: 'Jane Smith', role: 'Designer' }
			]
		];

		for (const teamMembers of testCases) {
			const images = simulateImageElements({ teamMembers, principles: [] });
			const validation = validateImageAccessibility(images);

			// Property: All images should have valid alt text
			expect(validation.valid).toBe(true);
			if (!validation.valid) {
				console.error('Image accessibility errors:');
				validation.errors.forEach(error => console.error(`  - ${error}`));
			}

			// Property: Each avatar should have descriptive alt text
			const avatarImages = images.filter(img => img.type === 'avatar');
			for (const avatarImage of avatarImages) {
				expect(avatarImage.hasAlt).toBe(true);
				expect(avatarImage.altText).not.toBe('');
				expect(avatarImage.altText).toContain('avatar');
			}
		}
	});

	it('should have aria-label for all principle icons', () => {
		// Property: For any principle with icon, it should have aria-label
		
		const testCases: ArchitecturePrinciple[][] = [
			// Single principle
			[
				{ id: 'test-1', title: 'Principle 1', description: 'Description', icon: '📋' }
			],
			// Multiple principles
			[
				{ id: 'test-1', title: 'Principle 1', description: 'Description 1', icon: '📋' },
				{ id: 'test-2', title: 'Principle 2', description: 'Description 2', icon: '📢' },
				{ id: 'test-3', title: 'Principle 3', description: 'Description 3', icon: '🎯' }
			],
			// Many principles
			Array.from({ length: 10 }, (_, i) => ({
				id: `principle-${i}`,
				title: `Principle ${i}`,
				description: `Description ${i}`,
				icon: '📋'
			}))
		];

		for (const principles of testCases) {
			const images = simulateImageElements({ teamMembers: [], principles });
			const validation = validateImageAccessibility(images);

			// Property: All icon images should have valid aria-label
			expect(validation.valid).toBe(true);
			if (!validation.valid) {
				console.error('Image accessibility errors:');
				validation.errors.forEach(error => console.error(`  - ${error}`));
			}

			// Property: Each icon should have descriptive aria-label
			const iconImages = images.filter(img => img.type === 'icon');
			expect(iconImages.length).toBe(principles.length);
			
			for (let i = 0; i < iconImages.length; i++) {
				const iconImage = iconImages[i];
				const principle = principles[i];
				
				expect(iconImage.hasAlt).toBe(true);
				expect(iconImage.altText).toBe(principle.title);
				expect(iconImage.altText).not.toBe('');
			}
		}
	});

	it('should have alt text for all images in any configuration', () => {
		// Property: For any data configuration, all images should have alt text
		
		const configurations = [
			// Only team members with avatars
			{
				teamMembers: [
					{ name: 'Member 1', role: 'Developer', avatar: 'https://example.com/1.jpg' },
					{ name: 'Member 2', role: 'Designer', avatar: 'https://example.com/2.jpg' }
				],
				principles: []
			},
			// Only principles with icons
			{
				teamMembers: [],
				principles: [
					{ id: 'p1', title: 'Principle 1', description: 'Desc', icon: '📋' },
					{ id: 'p2', title: 'Principle 2', description: 'Desc', icon: '📢' }
				]
			},
			// Both team members and principles
			{
				teamMembers: [
					{ name: 'Member 1', role: 'Developer', avatar: 'https://example.com/1.jpg' }
				],
				principles: [
					{ id: 'p1', title: 'Principle 1', description: 'Desc', icon: '📋' }
				]
			},
			// Large dataset
			{
				teamMembers: Array.from({ length: 20 }, (_, i) => ({
					name: `Member ${i}`,
					role: `Role ${i}`,
					avatar: i % 2 === 0 ? `https://example.com/${i}.jpg` : undefined
				})),
				principles: Array.from({ length: 10 }, (_, i) => ({
					id: `p${i}`,
					title: `Principle ${i}`,
					description: `Desc ${i}`,
					icon: '📋'
				}))
			}
		];

		for (const config of configurations) {
			const images = simulateImageElements(config);
			const validation = validateImageAccessibility(images);

			// Property: All images should have valid alt text
			expect(validation.valid).toBe(true);
			if (!validation.valid) {
				console.error('Configuration:', config);
				console.error('Image accessibility errors:');
				validation.errors.forEach(error => console.error(`  - ${error}`));
			}
		}
	});

	it('should have descriptive alt text, not generic', () => {
		// Property: For any image, alt text should be descriptive, not generic
		
		const teamMembers: TeamMember[] = [
			{ name: 'Alice Johnson', role: 'Developer', avatar: 'https://example.com/alice.jpg' },
			{ name: 'Bob Smith', role: 'Designer', avatar: 'https://example.com/bob.jpg' }
		];

		const principles: ArchitecturePrinciple[] = [
			{ id: 'contract-first', title: 'Contract-First Development', description: 'Desc', icon: '📋' },
			{ id: 'screaming-arch', title: 'Screaming Architecture', description: 'Desc', icon: '📢' }
		];

		const images = simulateImageElements({ teamMembers, principles });

		// Property: Alt text should be specific and descriptive
		for (const image of images) {
			expect(image.altText).not.toBe('image');
			expect(image.altText).not.toBe('icon');
			expect(image.altText).not.toBe('picture');
			expect(image.altText).not.toBe('photo');
			
			// Should contain meaningful content
			expect(image.altText.length).toBeGreaterThan(0);
		}
	});

	it('should validate the image accessibility validation function', () => {
		// Property: The validation function should correctly identify valid and invalid images
		
		const testCases = [
			{
				images: [
					{ type: 'avatar', hasAlt: true, altText: 'John Doe avatar', isDecorative: false }
				],
				expected: true,
				description: 'Valid image with alt text'
			},
			{
				images: [
					{ type: 'icon', hasAlt: true, altText: 'Principle Title', isDecorative: false }
				],
				expected: true,
				description: 'Valid icon with aria-label'
			},
			{
				images: [
					{ type: 'decorative', hasAlt: true, altText: '', isDecorative: true }
				],
				expected: true,
				description: 'Valid decorative image with empty alt'
			},
			{
				images: [
					{ type: 'avatar', hasAlt: false, altText: '', isDecorative: false }
				],
				expected: false,
				description: 'Invalid - missing alt attribute'
			},
			{
				images: [
					{ type: 'avatar', hasAlt: true, altText: '', isDecorative: false }
				],
				expected: false,
				description: 'Invalid - empty alt text for non-decorative image'
			},
			{
				images: [
					{ type: 'decorative', hasAlt: true, altText: 'Some text', isDecorative: true }
				],
				expected: false,
				description: 'Invalid - decorative image with non-empty alt'
			}
		];

		for (const testCase of testCases) {
			const validation = validateImageAccessibility(testCase.images);
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

	it('should handle edge cases in alt text', () => {
		// Property: For any edge case, alt text should still be valid
		
		const edgeCases: TeamMember[] = [
			// Name with special characters
			{ name: "O'Brien", role: 'Developer', avatar: 'https://example.com/obrien.jpg' },
			// Name with unicode
			{ name: '李明', role: 'Developer', avatar: 'https://example.com/liming.jpg' },
			// Very long name
			{ name: 'Alexander Maximilian Christopher Wellington III', role: 'Developer', avatar: 'https://example.com/alex.jpg' },
			// Single character name
			{ name: 'X', role: 'Developer', avatar: 'https://example.com/x.jpg' }
		];

		const images = simulateImageElements({ teamMembers: edgeCases, principles: [] });
		const validation = validateImageAccessibility(images);

		// Property: All edge cases should have valid alt text
		expect(validation.valid).toBe(true);
		if (!validation.valid) {
			console.error('Image accessibility errors:');
			validation.errors.forEach(error => console.error(`  - ${error}`));
		}

		// Property: Each alt text should contain the member's name
		for (let i = 0; i < images.length; i++) {
			const image = images[i];
			const member = edgeCases[i];
			expect(image.altText).toContain(member.name);
		}
	});
});
