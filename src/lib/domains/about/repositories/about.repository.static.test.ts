/**
 * Unit Tests for AboutRepositoryStatic
 * 
 * Tests the static repository implementation to ensure it returns
 * correct data structures and behaves as expected.
 */

import { describe, it, expect } from 'vitest';
import { AboutRepositoryStatic } from './about.repository.static';

describe('AboutRepositoryStatic', () => {
	const repo = new AboutRepositoryStatic();

	describe('getAboutInfo', () => {
		it('returns AboutInfo with all required fields', async () => {
			const result = await repo.getAboutInfo();

			expect(result).toBeDefined();
			expect(result.projectName).toBe('SvelteKit Enterprise Application');
			expect(result.description).toContain('enterprise web application');
			expect(result.version).toBe('1.0.0');
		});

		it('includes optional repository and license fields', async () => {
			const result = await repo.getAboutInfo();

			expect(result.repository).toBeDefined();
			expect(result.repository).toContain('github.com');
			expect(result.license).toBe('MIT');
		});

		it('returns a Promise', () => {
			const result = repo.getAboutInfo();
			expect(result).toBeInstanceOf(Promise);
		});
	});

	describe('getTechnologies', () => {
		it('returns array of technologies', async () => {
			const result = await repo.getTechnologies();

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
		});

		it('includes Svelte 5 framework', async () => {
			const result = await repo.getTechnologies();

			const svelte = result.find((tech) => tech.name === 'Svelte 5');
			expect(svelte).toBeDefined();
			expect(svelte?.category).toBe('framework');
			expect(svelte?.version).toBe('5.0.0');
		});

		it('includes TypeScript language', async () => {
			const result = await repo.getTechnologies();

			const typescript = result.find((tech) => tech.name === 'TypeScript');
			expect(typescript).toBeDefined();
			expect(typescript?.category).toBe('language');
		});

		it('includes testing tools', async () => {
			const result = await repo.getTechnologies();

			const vitest = result.find((tech) => tech.name === 'Vitest');
			const playwright = result.find((tech) => tech.name === 'Playwright');

			expect(vitest).toBeDefined();
			expect(vitest?.category).toBe('testing');
			expect(playwright).toBeDefined();
			expect(playwright?.category).toBe('testing');
		});

		it('includes Tailwind CSS for styling', async () => {
			const result = await repo.getTechnologies();

			const tailwind = result.find((tech) => tech.name === 'Tailwind CSS');
			expect(tailwind).toBeDefined();
			expect(tailwind?.category).toBe('styling');
		});

		it('includes tooling technologies', async () => {
			const result = await repo.getTechnologies();

			const tooling = result.filter((tech) => tech.category === 'tooling');
			expect(tooling.length).toBeGreaterThan(0);

			const vite = tooling.find((tech) => tech.name === 'Vite');
			expect(vite).toBeDefined();
		});

		it('all technologies have required fields', async () => {
			const result = await repo.getTechnologies();

			for (const tech of result) {
				expect(tech.name).toBeDefined();
				expect(tech.category).toBeDefined();
				expect(tech.description).toBeDefined();
				expect(tech.name.length).toBeGreaterThan(0);
				expect(tech.description.length).toBeGreaterThan(0);
			}
		});

		it('returns a Promise', () => {
			const result = repo.getTechnologies();
			expect(result).toBeInstanceOf(Promise);
		});
	});

	describe('getArchitecturePrinciples', () => {
		it('returns array of architecture principles', async () => {
			const result = await repo.getArchitecturePrinciples();

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(4);
		});

		it('includes Contract-First principle', async () => {
			const result = await repo.getArchitecturePrinciples();

			const principle = result.find((p) => p.id === 'contract-first');
			expect(principle).toBeDefined();
			expect(principle?.title).toBe('Contract-First Development');
			expect(principle?.description).toContain('TypeScript interfaces');
			expect(principle?.icon).toBe('📋');
		});

		it('includes Screaming Architecture principle', async () => {
			const result = await repo.getArchitecturePrinciples();

			const principle = result.find((p) => p.id === 'screaming-architecture');
			expect(principle).toBeDefined();
			expect(principle?.title).toBe('Screaming Architecture');
			expect(principle?.description).toContain('business domains');
		});

		it('includes Logic Externalization principle', async () => {
			const result = await repo.getArchitecturePrinciples();

			const principle = result.find((p) => p.id === 'logic-externalization');
			expect(principle).toBeDefined();
			expect(principle?.title).toBe('Logic Externalization');
			expect(principle?.description).toContain('business logic');
		});

		it('includes Anti-Corruption Layer principle', async () => {
			const result = await repo.getArchitecturePrinciples();

			const principle = result.find((p) => p.id === 'anti-corruption-layer');
			expect(principle).toBeDefined();
			expect(principle?.title).toBe('Anti-Corruption Layer');
			expect(principle?.description).toContain('Repository pattern');
		});

		it('all principles have required fields', async () => {
			const result = await repo.getArchitecturePrinciples();

			for (const principle of result) {
				expect(principle.id).toBeDefined();
				expect(principle.title).toBeDefined();
				expect(principle.description).toBeDefined();
				expect(principle.icon).toBeDefined();
				expect(principle.id.length).toBeGreaterThan(0);
				expect(principle.title.length).toBeGreaterThan(0);
				expect(principle.description.length).toBeGreaterThan(0);
			}
		});

		it('principles include examples', async () => {
			const result = await repo.getArchitecturePrinciples();

			for (const principle of result) {
				expect(principle.examples).toBeDefined();
				expect(Array.isArray(principle.examples)).toBe(true);
				expect(principle.examples!.length).toBeGreaterThan(0);
			}
		});

		it('returns a Promise', () => {
			const result = repo.getArchitecturePrinciples();
			expect(result).toBeInstanceOf(Promise);
		});
	});

	describe('getTeamMembers', () => {
		it('returns array of team members', async () => {
			const result = await repo.getTeamMembers();

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
		});

		it('includes development team', async () => {
			const result = await repo.getTeamMembers();

			const member = result.find((m) => m.name === 'Development Team');
			expect(member).toBeDefined();
			expect(member?.role).toBe('Full Stack Developers');
		});

		it('all team members have required fields', async () => {
			const result = await repo.getTeamMembers();

			for (const member of result) {
				expect(member.name).toBeDefined();
				expect(member.role).toBeDefined();
				expect(member.name.length).toBeGreaterThan(0);
				expect(member.role.length).toBeGreaterThan(0);
			}
		});

		it('returns a Promise', () => {
			const result = repo.getTeamMembers();
			expect(result).toBeInstanceOf(Promise);
		});
	});

	describe('async behavior', () => {
		it('all methods can be awaited', async () => {
			const aboutInfo = await repo.getAboutInfo();
			const technologies = await repo.getTechnologies();
			const principles = await repo.getArchitecturePrinciples();
			const teamMembers = await repo.getTeamMembers();

			expect(aboutInfo).toBeDefined();
			expect(technologies).toBeDefined();
			expect(principles).toBeDefined();
			expect(teamMembers).toBeDefined();
		});

		it('all methods can be used with Promise.all', async () => {
			const [aboutInfo, technologies, principles, teamMembers] = await Promise.all([
				repo.getAboutInfo(),
				repo.getTechnologies(),
				repo.getArchitecturePrinciples(),
				repo.getTeamMembers()
			]);

			expect(aboutInfo).toBeDefined();
			expect(technologies).toBeDefined();
			expect(principles).toBeDefined();
			expect(teamMembers).toBeDefined();
		});
	});
});
