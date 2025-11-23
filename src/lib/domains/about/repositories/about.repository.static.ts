/**
 * Static About Repository Implementation
 * 
 * This implementation provides hardcoded About page content.
 * It simulates async behavior for consistency with other repository implementations.
 */

import type {
	AboutInfo,
	TechnologyItem,
	ArchitecturePrinciple,
	TeamMember
} from '../models/about.types';
import type { AboutRepository } from './about.repository';

/**
 * Static implementation of AboutRepository with hardcoded data
 */
export class AboutRepositoryStatic implements AboutRepository {
	/**
	 * Get project information
	 */
	async getAboutInfo(): Promise<AboutInfo> {
		return Promise.resolve({
			projectName: 'SvelteKit Enterprise Application',
			description:
				'A large-scale enterprise web application built with SvelteKit, designed to demonstrate best practices for scalable frontend architecture using Svelte 5 and Domain-Driven Design principles.',
			version: '1.0.0',
			repository: 'https://github.com/example/sveltekit-enterprise',
			license: 'MIT'
		});
	}

	/**
	 * Get all technologies used in the project
	 */
	async getTechnologies(): Promise<TechnologyItem[]> {
		return Promise.resolve([
			// Framework
			{
				name: 'Svelte 5',
				category: 'framework',
				description: 'Modern reactive framework with Runes for universal reactivity',
				version: '5.0.0',
				url: 'https://svelte.dev'
			},
			{
				name: 'SvelteKit',
				category: 'framework',
				description: 'Full-stack framework for building web applications',
				version: '2.0.0',
				url: 'https://kit.svelte.dev'
			},
			// Language
			{
				name: 'TypeScript',
				category: 'language',
				description: 'Strongly typed programming language with strict mode enabled',
				version: '5.9+',
				url: 'https://www.typescriptlang.org'
			},
			// Testing
			{
				name: 'Vitest',
				category: 'testing',
				description: 'Fast unit test framework with browser mode support',
				version: '4.0.0',
				url: 'https://vitest.dev'
			},
			{
				name: 'Playwright',
				category: 'testing',
				description: 'End-to-end testing framework for web applications',
				version: 'latest',
				url: 'https://playwright.dev'
			},
			// Styling
			{
				name: 'Tailwind CSS',
				category: 'styling',
				description: 'Utility-first CSS framework for rapid UI development',
				version: '4.0.0',
				url: 'https://tailwindcss.com'
			},
			// Tooling
			{
				name: 'Vite',
				category: 'tooling',
				description: 'Next generation frontend build tool',
				version: '7.0.0',
				url: 'https://vitejs.dev'
			},
			{
				name: 'Storybook',
				category: 'tooling',
				description: 'Component development and documentation tool',
				version: '10.0.0',
				url: 'https://storybook.js.org'
			},
			{
				name: 'Paraglide JS',
				category: 'tooling',
				description: 'Type-safe internationalization library',
				version: 'latest',
				url: 'https://inlang.com/m/gerre34r/library-inlang-paraglideJs'
			},
			{
				name: 'ESLint',
				category: 'tooling',
				description: 'Code quality and style enforcement',
				version: '9.0.0',
				url: 'https://eslint.org'
			},
			{
				name: 'Prettier',
				category: 'tooling',
				description: 'Opinionated code formatter',
				version: '3.0.0',
				url: 'https://prettier.io'
			}
		]);
	}

	/**
	 * Get architecture principles followed in the project
	 */
	async getArchitecturePrinciples(): Promise<ArchitecturePrinciple[]> {
		return Promise.resolve([
			{
				id: 'contract-first',
				title: 'Contract-First Development',
				description:
					'Always define TypeScript interfaces before writing implementation. Create models in models/*.types.ts first, define repository interfaces before implementations, and use Zod schemas for runtime validation.',
				icon: '📋',
				examples: [
					'Define interfaces in models/*.types.ts',
					'Create repository interfaces before implementations',
					'Use Zod schemas for validation'
				]
			},
			{
				id: 'screaming-architecture',
				title: 'Screaming Architecture',
				description:
					'Directory structure reflects business domains, not technical layers. Organize by feature/domain (auth, inventory, users), not by type (components, services). A developer should understand the business by looking at folder names.',
				icon: '📢',
				examples: [
					'domains/auth/ not services/auth-service.ts',
					'Organize by business domain',
					'Self-documenting folder structure'
				]
			},
			{
				id: 'logic-externalization',
				title: 'Logic Externalization',
				description:
					'UI components (.svelte) are for rendering only. All business logic must be in Service classes (.svelte.ts). Services use Svelte 5 Runes for reactive state management. Components consume services via dependency injection.',
				icon: '🧩',
				examples: [
					'Business logic in Service classes',
					'UI components only render',
					'Use Svelte 5 Runes for state'
				]
			},
			{
				id: 'anti-corruption-layer',
				title: 'Anti-Corruption Layer',
				description:
					'UI never calls APIs directly. All data access goes through Repository pattern. Repository interface defines the contract. Implementations (HTTP, Mock, LocalStorage) are swappable. Isolates business logic from external dependencies.',
				icon: '🛡️',
				examples: [
					'Repository pattern for data access',
					'Swappable implementations',
					'Isolate external dependencies'
				]
			}
		]);
	}

	/**
	 * Get team members who contributed to the project
	 */
	async getTeamMembers(): Promise<TeamMember[]> {
		return Promise.resolve([
			{
				name: 'Development Team',
				role: 'Full Stack Developers',
				avatar: undefined,
				email: undefined,
				github: undefined
			}
		]);
	}
}
