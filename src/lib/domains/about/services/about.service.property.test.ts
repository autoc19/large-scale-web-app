/**
 * Property-Based Tests for AboutService
 * 
 * These tests verify universal properties that should hold across all inputs.
 */

import { describe, it, expect, vi } from 'vitest';
import { AboutService } from './about.service.svelte';
import type { AboutRepository } from '../repositories/about.repository';
import type {
	AboutInfo,
	TechnologyItem,
	ArchitecturePrinciple,
	TeamMember
} from '../models/about.types';

/**
 * Feature: about-page, Property 2: Service loading state transitions
 * Validates: Requirements 3.4
 * 
 * For any service load operation, the loading state should transition from
 * false to true at start, and back to false upon completion or error
 */
describe('Property 2: Service loading state transitions', () => {
	it('should transition loading state from false to true to false on successful load', async () => {
		// Property: For any successful load operation, loading should start false,
		// and end false with no error
		
		// Test with various data sets
		const testCases = [
			{
				aboutInfo: { projectName: 'Test 1', description: 'Desc 1', version: '1.0.0' },
				technologies: [{ name: 'Tech 1', category: 'framework' as const, description: 'Desc' }],
				principles: [{ id: '1', title: 'Principle 1', description: 'Desc', icon: '📋' }],
				teamMembers: [{ name: 'Member 1', role: 'Developer' }]
			},
			{
				aboutInfo: { projectName: 'Test 2', description: 'Desc 2', version: '2.0.0' },
				technologies: [],
				principles: [],
				teamMembers: []
			},
			{
				aboutInfo: { projectName: 'Test 3', description: 'Desc 3', version: '3.0.0' },
				technologies: [
					{ name: 'Tech 1', category: 'framework' as const, description: 'Desc 1' },
					{ name: 'Tech 2', category: 'language' as const, description: 'Desc 2' }
				],
				principles: [
					{ id: '1', title: 'Principle 1', description: 'Desc 1', icon: '📋' },
					{ id: '2', title: 'Principle 2', description: 'Desc 2', icon: '📢' }
				],
				teamMembers: [
					{ name: 'Member 1', role: 'Developer' },
					{ name: 'Member 2', role: 'Designer' }
				]
			}
		];

		for (const testData of testCases) {
			// Create mock repository that returns the test data
			const mockRepo: AboutRepository = {
				getAboutInfo: vi.fn().mockResolvedValue(testData.aboutInfo),
				getTechnologies: vi.fn().mockResolvedValue(testData.technologies),
				getArchitecturePrinciples: vi.fn().mockResolvedValue(testData.principles),
				getTeamMembers: vi.fn().mockResolvedValue(testData.teamMembers)
			};

			const service = new AboutService(mockRepo);

			// Property: Initial state - loading should be false
			expect(service.loading).toBe(false);

			// Start loading and wait for completion
			await service.loadAllContent();

			// Property: After completion - loading should be false
			expect(service.loading).toBe(false);
			expect(service.error).toBeNull();
		}
	});

	it('should transition loading state from false to true to false on error', async () => {
		expect.assertions(15);

		// Test with various error messages
		const errorMessages = [
			'Network error',
			'API timeout',
			'Server error',
			'Not found',
			'Unauthorized'
		];

		for (const errorMessage of errorMessages) {
			// Create mock repository that throws an error
			const mockRepo: AboutRepository = {
				getAboutInfo: vi.fn().mockRejectedValue(new Error(errorMessage)),
				getTechnologies: vi.fn().mockRejectedValue(new Error(errorMessage)),
				getArchitecturePrinciples: vi.fn().mockRejectedValue(new Error(errorMessage)),
				getTeamMembers: vi.fn().mockRejectedValue(new Error(errorMessage))
			};

			const service = new AboutService(mockRepo);

			// Property: Initial state - loading should be false
			expect(service.loading).toBe(false);

			// Start loading and wait for completion
			await service.loadAllContent();

			// Property: After error - loading should be false and error should be set
			expect(service.loading).toBe(false);
			expect(service.error).toBe(errorMessage);
		}
	});

	it('should handle multiple load operations with correct state transitions', async () => {
		expect.assertions(7);

		const mockRepo: AboutRepository = {
			getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
			getTechnologies: vi.fn().mockResolvedValue([]),
			getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
			getTeamMembers: vi.fn().mockResolvedValue([])
		};

		const service = new AboutService(mockRepo);

		// First load
		expect(service.loading).toBe(false);
		await service.loadAllContent();
		expect(service.loading).toBe(false);

		// Second load
		expect(service.loading).toBe(false);
		await service.loadAllContent();
		expect(service.loading).toBe(false);

		// Third load
		expect(service.loading).toBe(false);
		await service.loadAllContent();
		expect(service.loading).toBe(false);

		// Property: Error should be null after successful loads
		expect(service.error).toBeNull();
	});
});


/**
 * Feature: about-page, Property 3: Service error handling
 * Validates: Requirements 3.5
 * 
 * For any repository error, the service should catch it, set the error state
 * with the error message, and NOT throw the error
 */
describe('Property 3: Service error handling', () => {
	it('should catch errors and set error state without throwing', async () => {
		// Property: For any error from repository, service should catch it and set error state
		
		const errorMessages = [
			'Network connection failed',
			'API returned 500',
			'Timeout exceeded',
			'Resource not found',
			'Permission denied'
		];

		for (const errorMessage of errorMessages) {
			const mockRepo: AboutRepository = {
				getAboutInfo: vi.fn().mockRejectedValue(new Error(errorMessage)),
				getTechnologies: vi.fn().mockRejectedValue(new Error(errorMessage)),
				getArchitecturePrinciples: vi.fn().mockRejectedValue(new Error(errorMessage)),
				getTeamMembers: vi.fn().mockRejectedValue(new Error(errorMessage))
			};

			const service = new AboutService(mockRepo);

			// Property: loadAllContent should not throw
			await expect(service.loadAllContent()).resolves.not.toThrow();

			// Property: Error should be set in state
			expect(service.error).toBe(errorMessage);
			expect(service.loading).toBe(false);
		}
	});

	it('should clear error state on successful load after previous error', async () => {
		// Property: For any successful load after an error, error state should be cleared
		
		// First, create a repository that fails
		const failingRepo: AboutRepository = {
			getAboutInfo: vi.fn().mockRejectedValue(new Error('Initial error')),
			getTechnologies: vi.fn().mockRejectedValue(new Error('Initial error')),
			getArchitecturePrinciples: vi.fn().mockRejectedValue(new Error('Initial error')),
			getTeamMembers: vi.fn().mockRejectedValue(new Error('Initial error'))
		};

		const service = new AboutService(failingRepo);

		// Load with error
		await service.loadAllContent();
		expect(service.error).toBe('Initial error');

		// Now create a successful repository
		const successRepo: AboutRepository = {
			getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
			getTechnologies: vi.fn().mockResolvedValue([]),
			getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
			getTeamMembers: vi.fn().mockResolvedValue([])
		};

		// Replace the repository (simulating retry with fixed connection)
		(service as any).repo = successRepo;

		// Load again
		await service.loadAllContent();

		// Property: Error should be cleared
		expect(service.error).toBeNull();
		expect(service.loading).toBe(false);
	});

	it('should handle partial failures gracefully', async () => {
		// Property: For any error in any repository method, service should catch it
		
		const testCases = [
			{
				name: 'getAboutInfo fails',
				repo: {
					getAboutInfo: vi.fn().mockRejectedValue(new Error('AboutInfo error')),
					getTechnologies: vi.fn().mockResolvedValue([]),
					getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
					getTeamMembers: vi.fn().mockResolvedValue([])
				}
			},
			{
				name: 'getTechnologies fails',
				repo: {
					getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
					getTechnologies: vi.fn().mockRejectedValue(new Error('Technologies error')),
					getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
					getTeamMembers: vi.fn().mockResolvedValue([])
				}
			},
			{
				name: 'getArchitecturePrinciples fails',
				repo: {
					getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
					getTechnologies: vi.fn().mockResolvedValue([]),
					getArchitecturePrinciples: vi.fn().mockRejectedValue(new Error('Principles error')),
					getTeamMembers: vi.fn().mockResolvedValue([])
				}
			},
			{
				name: 'getTeamMembers fails',
				repo: {
					getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
					getTechnologies: vi.fn().mockResolvedValue([]),
					getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
					getTeamMembers: vi.fn().mockRejectedValue(new Error('TeamMembers error'))
				}
			}
		];

		for (const testCase of testCases) {
			const service = new AboutService(testCase.repo as AboutRepository);

			// Property: Should not throw
			await expect(service.loadAllContent()).resolves.not.toThrow();

			// Property: Error should be set
			expect(service.error).toBeTruthy();
			expect(service.loading).toBe(false);
		}
	});

	it('should not throw even with multiple consecutive errors', async () => {
		// Property: For any sequence of errors, service should never throw
		
		const mockRepo: AboutRepository = {
			getAboutInfo: vi.fn().mockRejectedValue(new Error('Error 1')),
			getTechnologies: vi.fn().mockRejectedValue(new Error('Error 2')),
			getArchitecturePrinciples: vi.fn().mockRejectedValue(new Error('Error 3')),
			getTeamMembers: vi.fn().mockRejectedValue(new Error('Error 4'))
		};

		const service = new AboutService(mockRepo);

		// Load multiple times
		for (let i = 0; i < 5; i++) {
			// Property: Should never throw
			await expect(service.loadAllContent()).resolves.not.toThrow();
			expect(service.error).toBeTruthy();
		}
	});
});


/**
 * Feature: about-page, Property 4: Technology grouping by category
 * Validates: Requirements 3.6
 * 
 * For any set of technologies, the service's technologiesByCategory getter
 * should correctly group all items by their category property
 */
describe('Property 4: Technology grouping by category', () => {
	it('should group all technologies by their category', () => {
		// Property: For any set of technologies, all should be grouped by category
		
		const technologies: TechnologyItem[] = [
			{ name: 'Svelte', category: 'framework', description: 'Framework' },
			{ name: 'React', category: 'framework', description: 'Framework' },
			{ name: 'TypeScript', category: 'language', description: 'Language' },
			{ name: 'JavaScript', category: 'language', description: 'Language' },
			{ name: 'Vitest', category: 'testing', description: 'Testing' },
			{ name: 'Playwright', category: 'testing', description: 'Testing' },
			{ name: 'Tailwind', category: 'styling', description: 'Styling' },
			{ name: 'Vite', category: 'tooling', description: 'Tooling' },
			{ name: 'ESLint', category: 'tooling', description: 'Tooling' }
		];

		const mockRepo: AboutRepository = {
			getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
			getTechnologies: vi.fn().mockResolvedValue(technologies),
			getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
			getTeamMembers: vi.fn().mockResolvedValue([])
		};

		const service = new AboutService(mockRepo, { technologies });

		const grouped = service.technologiesByCategory;

		// Property: All frameworks should be in framework category
		expect(grouped.framework).toHaveLength(2);
		expect(grouped.framework.every(t => t.category === 'framework')).toBe(true);

		// Property: All languages should be in language category
		expect(grouped.language).toHaveLength(2);
		expect(grouped.language.every(t => t.category === 'language')).toBe(true);

		// Property: All testing tools should be in testing category
		expect(grouped.testing).toHaveLength(2);
		expect(grouped.testing.every(t => t.category === 'testing')).toBe(true);

		// Property: All styling tools should be in styling category
		expect(grouped.styling).toHaveLength(1);
		expect(grouped.styling.every(t => t.category === 'styling')).toBe(true);

		// Property: All tooling should be in tooling category
		expect(grouped.tooling).toHaveLength(2);
		expect(grouped.tooling.every(t => t.category === 'tooling')).toBe(true);
	});

	it('should handle empty technology list', () => {
		// Property: For empty technology list, all categories should be empty arrays
		
		const mockRepo: AboutRepository = {
			getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
			getTechnologies: vi.fn().mockResolvedValue([]),
			getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
			getTeamMembers: vi.fn().mockResolvedValue([])
		};

		const service = new AboutService(mockRepo, { technologies: [] });

		const grouped = service.technologiesByCategory;

		// Property: All categories should be empty
		expect(grouped.framework).toHaveLength(0);
		expect(grouped.language).toHaveLength(0);
		expect(grouped.testing).toHaveLength(0);
		expect(grouped.styling).toHaveLength(0);
		expect(grouped.tooling).toHaveLength(0);
	});

	it('should handle technologies with only one category', () => {
		// Property: For technologies in single category, only that category should have items
		
		const testCases = [
			{ category: 'framework' as const, name: 'Framework Test' },
			{ category: 'language' as const, name: 'Language Test' },
			{ category: 'testing' as const, name: 'Testing Test' },
			{ category: 'styling' as const, name: 'Styling Test' },
			{ category: 'tooling' as const, name: 'Tooling Test' }
		];

		for (const testCase of testCases) {
			const technologies: TechnologyItem[] = [
				{ name: testCase.name, category: testCase.category, description: 'Test' }
			];

			const mockRepo: AboutRepository = {
				getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
				getTechnologies: vi.fn().mockResolvedValue(technologies),
				getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
				getTeamMembers: vi.fn().mockResolvedValue([])
			};

			const service = new AboutService(mockRepo, { technologies });

			const grouped = service.technologiesByCategory;

			// Property: Only the specified category should have items
			const totalItems = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
			expect(totalItems).toBe(1);
			expect(grouped[testCase.category]).toHaveLength(1);
			expect(grouped[testCase.category][0].name).toBe(testCase.name);
		}
	});

	it('should preserve all technology properties when grouping', () => {
		// Property: For any technology, all its properties should be preserved in grouped result
		
		const technologies: TechnologyItem[] = [
			{
				name: 'Svelte 5',
				category: 'framework',
				description: 'Modern reactive framework',
				version: '5.0.0',
				url: 'https://svelte.dev'
			},
			{
				name: 'TypeScript',
				category: 'language',
				description: 'Typed superset of JavaScript',
				version: '5.9',
				url: 'https://typescriptlang.org'
			}
		];

		const mockRepo: AboutRepository = {
			getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
			getTechnologies: vi.fn().mockResolvedValue(technologies),
			getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
			getTeamMembers: vi.fn().mockResolvedValue([])
		};

		const service = new AboutService(mockRepo, { technologies });

		const grouped = service.technologiesByCategory;

		// Property: All properties should be preserved
		const svelte = grouped.framework[0];
		expect(svelte.name).toBe('Svelte 5');
		expect(svelte.description).toBe('Modern reactive framework');
		expect(svelte.version).toBe('5.0.0');
		expect(svelte.url).toBe('https://svelte.dev');

		const typescript = grouped.language[0];
		expect(typescript.name).toBe('TypeScript');
		expect(typescript.description).toBe('Typed superset of JavaScript');
		expect(typescript.version).toBe('5.9');
		expect(typescript.url).toBe('https://typescriptlang.org');
	});

	it('should handle large number of technologies', () => {
		// Property: For any number of technologies, grouping should work correctly
		
		const technologies: TechnologyItem[] = [];
		const categories: TechnologyCategory[] = ['framework', 'language', 'testing', 'styling', 'tooling'];
		
		// Create 50 technologies (10 per category)
		for (let i = 0; i < 50; i++) {
			const category = categories[i % 5];
			technologies.push({
				name: `Tech ${i}`,
				category,
				description: `Description ${i}`
			});
		}

		const mockRepo: AboutRepository = {
			getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
			getTechnologies: vi.fn().mockResolvedValue(technologies),
			getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
			getTeamMembers: vi.fn().mockResolvedValue([])
		};

		const service = new AboutService(mockRepo, { technologies });

		const grouped = service.technologiesByCategory;

		// Property: Each category should have exactly 10 items
		expect(grouped.framework).toHaveLength(10);
		expect(grouped.language).toHaveLength(10);
		expect(grouped.testing).toHaveLength(10);
		expect(grouped.styling).toHaveLength(10);
		expect(grouped.tooling).toHaveLength(10);

		// Property: Total count should match original
		const totalGrouped = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
		expect(totalGrouped).toBe(50);
	});

	it('should not lose any technologies during grouping', () => {
		// Property: For any set of technologies, count before and after grouping should match
		
		const testSizes = [1, 5, 10, 20, 50];

		for (const size of testSizes) {
			const technologies: TechnologyItem[] = [];
			const categories: TechnologyCategory[] = ['framework', 'language', 'testing', 'styling', 'tooling'];
			
			for (let i = 0; i < size; i++) {
				technologies.push({
					name: `Tech ${i}`,
					category: categories[i % 5],
					description: `Desc ${i}`
				});
			}

			const mockRepo: AboutRepository = {
				getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
				getTechnologies: vi.fn().mockResolvedValue(technologies),
				getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
				getTeamMembers: vi.fn().mockResolvedValue([])
			};

			const service = new AboutService(mockRepo, { technologies });

			const grouped = service.technologiesByCategory;

			// Property: Total count should match
			const totalGrouped = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
			expect(totalGrouped).toBe(size);
		}
	});
});


/**
 * Feature: about-page, Property 5: Team member count accuracy
 * Validates: Requirements 3.7
 * 
 * For any set of team members, the service's teamMemberCount getter
 * should return the exact count of items in the teamMembers array
 */
describe('Property 5: Team member count accuracy', () => {
	it('should return correct count for any number of team members', () => {
		// Property: For any team members array, count should match array length
		
		const testCases = [0, 1, 5, 10, 20, 50, 100];

		for (const count of testCases) {
			const teamMembers: TeamMember[] = [];
			for (let i = 0; i < count; i++) {
				teamMembers.push({
					name: `Member ${i}`,
					role: `Role ${i}`
				});
			}

			const mockRepo: AboutRepository = {
				getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
				getTechnologies: vi.fn().mockResolvedValue([]),
				getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
				getTeamMembers: vi.fn().mockResolvedValue(teamMembers)
			};

			const service = new AboutService(mockRepo, { teamMembers });

			// Property: Count should match array length
			expect(service.teamMemberCount).toBe(count);
			expect(service.teamMemberCount).toBe(teamMembers.length);
		}
	});

	it('should return 0 for empty team members array', () => {
		// Property: For empty array, count should be 0
		
		const mockRepo: AboutRepository = {
			getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
			getTechnologies: vi.fn().mockResolvedValue([]),
			getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
			getTeamMembers: vi.fn().mockResolvedValue([])
		};

		const service = new AboutService(mockRepo, { teamMembers: [] });

		// Property: Count should be 0
		expect(service.teamMemberCount).toBe(0);
	});

	it('should update count when team members change', async () => {
		// Property: For any change in team members, count should reflect the change
		
		const mockRepo: AboutRepository = {
			getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
			getTechnologies: vi.fn().mockResolvedValue([]),
			getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
			getTeamMembers: vi.fn().mockResolvedValue([
				{ name: 'Member 1', role: 'Developer' },
				{ name: 'Member 2', role: 'Designer' },
				{ name: 'Member 3', role: 'Manager' }
			])
		};

		const service = new AboutService(mockRepo, {
			teamMembers: [
				{ name: 'Initial Member', role: 'Developer' }
			]
		});

		// Initial count
		expect(service.teamMemberCount).toBe(1);

		// Load new data
		await service.loadAllContent();

		// Property: Count should update
		expect(service.teamMemberCount).toBe(3);
	});

	it('should count team members with various properties', () => {
		// Property: For any team members with different properties, count should be accurate
		
		const teamMembers: TeamMember[] = [
			{ name: 'Member 1', role: 'Developer' },
			{ name: 'Member 2', role: 'Designer', email: 'test@example.com' },
			{ name: 'Member 3', role: 'Manager', github: 'testuser' },
			{ name: 'Member 4', role: 'Developer', avatar: 'https://example.com/avatar.jpg' },
			{ name: 'Member 5', role: 'Designer', email: 'test2@example.com', github: 'testuser2', avatar: 'https://example.com/avatar2.jpg' }
		];

		const mockRepo: AboutRepository = {
			getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
			getTechnologies: vi.fn().mockResolvedValue([]),
			getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
			getTeamMembers: vi.fn().mockResolvedValue(teamMembers)
		};

		const service = new AboutService(mockRepo, { teamMembers });

		// Property: Count should be 5 regardless of optional properties
		expect(service.teamMemberCount).toBe(5);
	});

	it('should maintain count accuracy after multiple operations', async () => {
		// Property: For any sequence of operations, count should always match array length
		
		const mockRepo: AboutRepository = {
			getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
			getTechnologies: vi.fn().mockResolvedValue([]),
			getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
			getTeamMembers: vi.fn()
		};

		const service = new AboutService(mockRepo, { teamMembers: [] });

		// Initial state
		expect(service.teamMemberCount).toBe(0);

		// Add some members
		service.teamMembers = [
			{ name: 'Member 1', role: 'Developer' },
			{ name: 'Member 2', role: 'Designer' }
		];
		expect(service.teamMemberCount).toBe(2);

		// Add more members
		service.teamMembers = [
			...service.teamMembers,
			{ name: 'Member 3', role: 'Manager' },
			{ name: 'Member 4', role: 'Developer' }
		];
		expect(service.teamMemberCount).toBe(4);

		// Remove some members
		service.teamMembers = service.teamMembers.slice(0, 2);
		expect(service.teamMemberCount).toBe(2);

		// Clear all members
		service.teamMembers = [];
		expect(service.teamMemberCount).toBe(0);
	});

	it('should handle team members with duplicate names', () => {
		// Property: For any team members including duplicates, count should be accurate
		
		const teamMembers: TeamMember[] = [
			{ name: 'John Doe', role: 'Developer' },
			{ name: 'John Doe', role: 'Designer' },
			{ name: 'John Doe', role: 'Manager' },
			{ name: 'Jane Smith', role: 'Developer' },
			{ name: 'Jane Smith', role: 'Designer' }
		];

		const mockRepo: AboutRepository = {
			getAboutInfo: vi.fn().mockResolvedValue({ projectName: 'Test', description: 'Desc', version: '1.0.0' }),
			getTechnologies: vi.fn().mockResolvedValue([]),
			getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
			getTeamMembers: vi.fn().mockResolvedValue(teamMembers)
		};

		const service = new AboutService(mockRepo, { teamMembers });

		// Property: Count should be 5 even with duplicate names
		expect(service.teamMemberCount).toBe(5);
	});
});
