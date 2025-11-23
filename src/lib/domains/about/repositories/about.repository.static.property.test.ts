/**
 * Property-Based Tests for About Repository
 * 
 * Feature: about-page, Property 1: Repository data structure conformance
 * Validates: Requirements 2.2
 * 
 * Tests that repository methods return data matching TypeScript interface structures
 * with all required fields present.
 */

import { describe, it, expect } from 'vitest';
import { AboutRepositoryStatic } from './about.repository.static';
import type {
	AboutInfo,
	TechnologyItem,
	ArchitecturePrinciple,
	TeamMember,
	TechnologyCategory
} from '../models/about.types';

describe('AboutRepositoryStatic - Property Tests', () => {
	const repo = new AboutRepositoryStatic();

	/**
	 * Property 1: Repository data structure conformance
	 * For any repository method call, the returned data should match the defined
	 * TypeScript interface structure with all required fields present
	 */
	describe('Property 1: Repository data structure conformance', () => {
		it('getAboutInfo returns data matching AboutInfo interface', async () => {
			const result = await repo.getAboutInfo();

			// Verify all required fields are present
			expect(result).toHaveProperty('projectName');
			expect(result).toHaveProperty('description');
			expect(result).toHaveProperty('version');

			// Verify types
			expect(typeof result.projectName).toBe('string');
			expect(typeof result.description).toBe('string');
			expect(typeof result.version).toBe('string');

			// Verify required fields are non-empty
			expect(result.projectName.length).toBeGreaterThan(0);
			expect(result.description.length).toBeGreaterThan(0);
			expect(result.version.length).toBeGreaterThan(0);

			// Verify optional fields are either string or undefined
			if (result.repository !== undefined) {
				expect(typeof result.repository).toBe('string');
			}
			if (result.license !== undefined) {
				expect(typeof result.license).toBe('string');
			}
		});

		it('getTechnologies returns array of items matching TechnologyItem interface', async () => {
			const result = await repo.getTechnologies();

			// Verify it's an array
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			// Verify each item has required fields
			for (const item of result) {
				expect(item).toHaveProperty('name');
				expect(item).toHaveProperty('category');
				expect(item).toHaveProperty('description');

				// Verify types
				expect(typeof item.name).toBe('string');
				expect(typeof item.description).toBe('string');

				// Verify category is valid
				const validCategories: TechnologyCategory[] = [
					'framework',
					'language',
					'testing',
					'styling',
					'tooling'
				];
				expect(validCategories).toContain(item.category);

				// Verify required fields are non-empty
				expect(item.name.length).toBeGreaterThan(0);
				expect(item.description.length).toBeGreaterThan(0);

				// Verify optional fields
				if (item.version !== undefined) {
					expect(typeof item.version).toBe('string');
				}
				if (item.url !== undefined) {
					expect(typeof item.url).toBe('string');
				}
			}
		});

		it('getArchitecturePrinciples returns array of items matching ArchitecturePrinciple interface', async () => {
			const result = await repo.getArchitecturePrinciples();

			// Verify it's an array
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			// Verify each item has required fields
			for (const item of result) {
				expect(item).toHaveProperty('id');
				expect(item).toHaveProperty('title');
				expect(item).toHaveProperty('description');
				expect(item).toHaveProperty('icon');

				// Verify types
				expect(typeof item.id).toBe('string');
				expect(typeof item.title).toBe('string');
				expect(typeof item.description).toBe('string');
				expect(typeof item.icon).toBe('string');

				// Verify required fields are non-empty
				expect(item.id.length).toBeGreaterThan(0);
				expect(item.title.length).toBeGreaterThan(0);
				expect(item.description.length).toBeGreaterThan(0);
				expect(item.icon.length).toBeGreaterThan(0);

				// Verify optional examples field
				if (item.examples !== undefined) {
					expect(Array.isArray(item.examples)).toBe(true);
					for (const example of item.examples) {
						expect(typeof example).toBe('string');
					}
				}
			}
		});

		it('getTeamMembers returns array of items matching TeamMember interface', async () => {
			const result = await repo.getTeamMembers();

			// Verify it's an array
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);

			// Verify each item has required fields
			for (const item of result) {
				expect(item).toHaveProperty('name');
				expect(item).toHaveProperty('role');

				// Verify types
				expect(typeof item.name).toBe('string');
				expect(typeof item.role).toBe('string');

				// Verify required fields are non-empty
				expect(item.name.length).toBeGreaterThan(0);
				expect(item.role.length).toBeGreaterThan(0);

				// Verify optional fields
				if (item.avatar !== undefined) {
					expect(typeof item.avatar).toBe('string');
				}
				if (item.email !== undefined) {
					expect(typeof item.email).toBe('string');
				}
				if (item.github !== undefined) {
					expect(typeof item.github).toBe('string');
				}
			}
		});

		it('all methods return Promises', async () => {
			// Verify all methods return Promise objects
			const aboutInfoPromise = repo.getAboutInfo();
			const technologiesPromise = repo.getTechnologies();
			const principlesPromise = repo.getArchitecturePrinciples();
			const teamMembersPromise = repo.getTeamMembers();

			expect(aboutInfoPromise).toBeInstanceOf(Promise);
			expect(technologiesPromise).toBeInstanceOf(Promise);
			expect(principlesPromise).toBeInstanceOf(Promise);
			expect(teamMembersPromise).toBeInstanceOf(Promise);

			// Await all to ensure they resolve
			await Promise.all([
				aboutInfoPromise,
				technologiesPromise,
				principlesPromise,
				teamMembersPromise
			]);
		});
	});
});
