/**
 * Property-Based Tests for TechnologyStack Component
 * 
 * **Feature: about-page, Property 6: Technology display completeness**
 * **Validates: Requirements 4.2**
 * 
 * Tests that the TechnologyStack component displays all technologies
 * grouped by category with no items missing.
 */

import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TechnologyStackWrapper from './TechnologyStackWrapper.test.svelte';
import type { TechnologyItem, TechnologyCategory } from '../models/about.types';

// Helper to generate random technology items
function generateTechnology(category: TechnologyCategory): TechnologyItem {
	return {
		name: `Tech-${Math.random().toString(36).substring(7)}`,
		category,
		description: `Description for ${category} technology`,
		version: Math.random() > 0.5 ? `${Math.floor(Math.random() * 10)}.0.0` : undefined,
		url: Math.random() > 0.5 ? `https://example.com/${category}` : undefined
	};
}

// Helper to generate array of technologies
function generateTechnologies(count: number): TechnologyItem[] {
	const categories: TechnologyCategory[] = ['framework', 'language', 'testing', 'styling', 'tooling'];
	const technologies: TechnologyItem[] = [];
	
	for (let i = 0; i < count; i++) {
		const category = categories[Math.floor(Math.random() * categories.length)];
		technologies.push(generateTechnology(category));
	}
	
	return technologies;
}

describe('TechnologyStack Property Tests', () => {
	describe('Property 6: Technology display completeness', () => {
		it('should display all technologies grouped by category with no items missing', async () => {
			expect.assertions(100);
			
			// Property: For any set of technologies, all should be displayed
			for (let run = 0; run < 100; run++) {
				const techCount = Math.floor(Math.random() * 20);
				const technologies = generateTechnologies(techCount);
				
				// Render component with technologies
				const { container } = await render(TechnologyStackWrapper, {
					props: { technologies }
				});

				// Get all technology names from the rendered output
				const renderedTechNames = Array.from(
					container.querySelectorAll('h4')
				).map((h4) => h4.textContent?.trim() || '');

				// Verify all technologies are displayed
				const allTechNames = technologies.map((t) => t.name);
				
				// Every technology should be rendered
				expect(renderedTechNames.sort()).toEqual(allTechNames.sort());
			}
		});

		it('should display technology versions when present', async () => {
			// Property: For any technology with a version, the version should be displayed
			for (let run = 0; run < 50; run++) {
				const technologies = generateTechnologies(5);
				
				const { container } = await render(TechnologyStackWrapper, {
					props: { technologies }
				});

				// Check that versions are displayed when present
				for (const tech of technologies) {
					if (tech.version) {
						const versionText = `v${tech.version}`;
						expect(container.textContent).toContain(versionText);
					}
				}
			}
		});

		it('should display documentation links when URLs are present', async () => {
			expect.assertions(50);
			
			// Property: For any technology with a URL, a documentation link should be present
			for (let run = 0; run < 50; run++) {
				const technologies = generateTechnologies(5);
				
				const { container } = await render(TechnologyStackWrapper, {
					props: { technologies }
				});

				// Check that documentation links are present when URLs exist
				const links = Array.from(container.querySelectorAll('a'));
				const techsWithUrls = technologies.filter((t) => t.url);
				
				// Count links that are documentation links
				const docLinks = links.filter((link) => 
					link.textContent?.includes('Documentation')
				);
				
				expect(docLinks.length).toBe(techsWithUrls.length);
			}
		});

		it('should group technologies by category correctly', async () => {
			expect.assertions(20);
			
			// Property: Technologies should be grouped by their category
			for (let run = 0; run < 20; run++) {
				const technologies = generateTechnologies(10);
				
				const { container } = await render(TechnologyStackWrapper, {
					props: { technologies }
				});

				// Get unique categories from technologies
				const uniqueCategories = [...new Set(technologies.map(t => t.category))];
				
				// Each category with technologies should have a heading
				const categoryHeadings = Array.from(
					container.querySelectorAll('h3')
				).map((h3) => h3.textContent?.trim() || '');
				
				// At least one category heading should be present if there are technologies
				if (technologies.length > 0) {
					expect(categoryHeadings.length).toBeGreaterThanOrEqual(uniqueCategories.length);
				}
			}
		});

		it('should handle empty technology list', async () => {
			expect.assertions(2);
			
			// Property: Empty technology list should render without errors
			const { container } = await render(TechnologyStackWrapper, {
				props: { technologies: [] }
			});

			// Should have the section heading
			const sectionHeading = container.querySelector('h2');
			expect(sectionHeading).not.toBeNull();
			expect(sectionHeading?.textContent).toContain('Technology Stack');
		});

		it('should display all required fields for each technology', async () => {
			// Property: Each technology should display name and description
			for (let run = 0; run < 50; run++) {
				const technologies = generateTechnologies(3);
				
				const { container } = await render(TechnologyStackWrapper, {
					props: { technologies }
				});

				// Check that all names and descriptions are present
				for (const tech of technologies) {
					expect(container.textContent).toContain(tech.name);
					expect(container.textContent).toContain(tech.description);
				}
			}
		});
	});
});
