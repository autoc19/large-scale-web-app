/**
 * Unit Tests for AboutService
 * 
 * These tests verify specific behaviors and edge cases of the AboutService class.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AboutService } from './about.service.svelte';
import type { AboutRepository } from '../repositories/about.repository';
import type {
	AboutInfo,
	TechnologyItem,
	ArchitecturePrinciple,
	TeamMember
} from '../models/about.types';

describe('AboutService', () => {
	let mockRepo: AboutRepository;

	beforeEach(() => {
		mockRepo = {
			getAboutInfo: vi.fn().mockResolvedValue({
				projectName: 'Test Project',
				description: 'Test Description',
				version: '1.0.0'
			}),
			getTechnologies: vi.fn().mockResolvedValue([]),
			getArchitecturePrinciples: vi.fn().mockResolvedValue([]),
			getTeamMembers: vi.fn().mockResolvedValue([])
		};
	});

	describe('Constructor', () => {
		it('should initialize with empty state when no initial data provided', () => {
			const service = new AboutService(mockRepo);

			expect(service.aboutInfo).toBeNull();
			expect(service.technologies).toEqual([]);
			expect(service.principles).toEqual([]);
			expect(service.teamMembers).toEqual([]);
			expect(service.loading).toBe(false);
			expect(service.error).toBeNull();
		});

		it('should initialize with provided initial data', () => {
			const initialData = {
				aboutInfo: {
					projectName: 'Initial Project',
					description: 'Initial Description',
					version: '0.1.0'
				},
				technologies: [
					{ name: 'Tech 1', category: 'framework' as const, description: 'Desc 1' }
				],
				principles: [
					{ id: '1', title: 'Principle 1', description: 'Desc 1', icon: '📋' }
				],
				teamMembers: [
					{ name: 'Member 1', role: 'Developer' }
				]
			};

			const service = new AboutService(mockRepo, initialData);

			expect(service.aboutInfo).toEqual(initialData.aboutInfo);
			expect(service.technologies).toEqual(initialData.technologies);
			expect(service.principles).toEqual(initialData.principles);
			expect(service.teamMembers).toEqual(initialData.teamMembers);
		});

		it('should initialize with partial initial data', () => {
			const service = new AboutService(mockRepo, {
				aboutInfo: {
					projectName: 'Partial Project',
					description: 'Partial Description',
					version: '0.5.0'
				}
			});

			expect(service.aboutInfo).toBeDefined();
			expect(service.aboutInfo?.projectName).toBe('Partial Project');
			expect(service.technologies).toEqual([]);
			expect(service.principles).toEqual([]);
			expect(service.teamMembers).toEqual([]);
		});
	});

	describe('loadAllContent', () => {
		it('should load all content from repository', async () => {
			const aboutInfo: AboutInfo = {
				projectName: 'Loaded Project',
				description: 'Loaded Description',
				version: '2.0.0'
			};
			const technologies: TechnologyItem[] = [
				{ name: 'Svelte', category: 'framework', description: 'Framework' }
			];
			const principles: ArchitecturePrinciple[] = [
				{ id: '1', title: 'DDD', description: 'Domain-Driven Design', icon: '🏗️' }
			];
			const teamMembers: TeamMember[] = [
				{ name: 'John Doe', role: 'Lead Developer' }
			];

			mockRepo.getAboutInfo = vi.fn().mockResolvedValue(aboutInfo);
			mockRepo.getTechnologies = vi.fn().mockResolvedValue(technologies);
			mockRepo.getArchitecturePrinciples = vi.fn().mockResolvedValue(principles);
			mockRepo.getTeamMembers = vi.fn().mockResolvedValue(teamMembers);

			const service = new AboutService(mockRepo);
			await service.loadAllContent();

			expect(service.aboutInfo).toEqual(aboutInfo);
			expect(service.technologies).toEqual(technologies);
			expect(service.principles).toEqual(principles);
			expect(service.teamMembers).toEqual(teamMembers);
			expect(service.error).toBeNull();
		});

		it('should call all repository methods', async () => {
			const service = new AboutService(mockRepo);
			await service.loadAllContent();

			expect(mockRepo.getAboutInfo).toHaveBeenCalledTimes(1);
			expect(mockRepo.getTechnologies).toHaveBeenCalledTimes(1);
			expect(mockRepo.getArchitecturePrinciples).toHaveBeenCalledTimes(1);
			expect(mockRepo.getTeamMembers).toHaveBeenCalledTimes(1);
		});

		it('should handle repository errors gracefully', async () => {
			const errorMessage = 'Repository error';
			mockRepo.getAboutInfo = vi.fn().mockRejectedValue(new Error(errorMessage));

			const service = new AboutService(mockRepo);
			await service.loadAllContent();

			expect(service.error).toBe(errorMessage);
			expect(service.loading).toBe(false);
		});

		it('should clear previous error on successful load', async () => {
			const service = new AboutService(mockRepo);
			service.error = 'Previous error';

			await service.loadAllContent();

			expect(service.error).toBeNull();
		});
	});

	describe('technologiesByCategory getter', () => {
		it('should return empty arrays for all categories when no technologies', () => {
			const service = new AboutService(mockRepo);

			const grouped = service.technologiesByCategory;

			expect(grouped.framework).toEqual([]);
			expect(grouped.language).toEqual([]);
			expect(grouped.testing).toEqual([]);
			expect(grouped.styling).toEqual([]);
			expect(grouped.tooling).toEqual([]);
		});

		it('should group technologies correctly by category', () => {
			const technologies: TechnologyItem[] = [
				{ name: 'Svelte', category: 'framework', description: 'Framework' },
				{ name: 'React', category: 'framework', description: 'Framework' },
				{ name: 'TypeScript', category: 'language', description: 'Language' },
				{ name: 'Vitest', category: 'testing', description: 'Testing' },
				{ name: 'Tailwind', category: 'styling', description: 'Styling' },
				{ name: 'Vite', category: 'tooling', description: 'Tooling' }
			];

			const service = new AboutService(mockRepo, { technologies });

			const grouped = service.technologiesByCategory;

			expect(grouped.framework).toHaveLength(2);
			expect(grouped.language).toHaveLength(1);
			expect(grouped.testing).toHaveLength(1);
			expect(grouped.styling).toHaveLength(1);
			expect(grouped.tooling).toHaveLength(1);
		});

		it('should return same reference for same technologies', () => {
			const technologies: TechnologyItem[] = [
				{ name: 'Svelte', category: 'framework', description: 'Framework' }
			];

			const service = new AboutService(mockRepo, { technologies });

			const grouped1 = service.technologiesByCategory;
			const grouped2 = service.technologiesByCategory;

			// Getter should compute fresh each time (not cached)
			expect(grouped1).not.toBe(grouped2);
			expect(grouped1).toEqual(grouped2);
		});
	});

	describe('teamMemberCount getter', () => {
		it('should return 0 when no team members', () => {
			const service = new AboutService(mockRepo);

			expect(service.teamMemberCount).toBe(0);
		});

		it('should return correct count for team members', () => {
			const teamMembers: TeamMember[] = [
				{ name: 'Member 1', role: 'Developer' },
				{ name: 'Member 2', role: 'Designer' },
				{ name: 'Member 3', role: 'Manager' }
			];

			const service = new AboutService(mockRepo, { teamMembers });

			expect(service.teamMemberCount).toBe(3);
		});

		it('should update when team members change', () => {
			const service = new AboutService(mockRepo, {
				teamMembers: [{ name: 'Member 1', role: 'Developer' }]
			});

			expect(service.teamMemberCount).toBe(1);

			service.teamMembers = [
				{ name: 'Member 1', role: 'Developer' },
				{ name: 'Member 2', role: 'Designer' }
			];

			expect(service.teamMemberCount).toBe(2);
		});
	});

	describe('Error scenarios', () => {
		it('should handle getAboutInfo error', async () => {
			mockRepo.getAboutInfo = vi.fn().mockRejectedValue(new Error('AboutInfo error'));

			const service = new AboutService(mockRepo);
			await service.loadAllContent();

			expect(service.error).toBe('AboutInfo error');
		});

		it('should handle getTechnologies error', async () => {
			mockRepo.getTechnologies = vi.fn().mockRejectedValue(new Error('Technologies error'));

			const service = new AboutService(mockRepo);
			await service.loadAllContent();

			expect(service.error).toBe('Technologies error');
		});

		it('should handle getArchitecturePrinciples error', async () => {
			mockRepo.getArchitecturePrinciples = vi.fn().mockRejectedValue(new Error('Principles error'));

			const service = new AboutService(mockRepo);
			await service.loadAllContent();

			expect(service.error).toBe('Principles error');
		});

		it('should handle getTeamMembers error', async () => {
			mockRepo.getTeamMembers = vi.fn().mockRejectedValue(new Error('TeamMembers error'));

			const service = new AboutService(mockRepo);
			await service.loadAllContent();

			expect(service.error).toBe('TeamMembers error');
		});
	});

	describe('State management', () => {
		it('should maintain separate state for multiple service instances', () => {
			const service1 = new AboutService(mockRepo, {
				aboutInfo: { projectName: 'Project 1', description: 'Desc 1', version: '1.0.0' }
			});

			const service2 = new AboutService(mockRepo, {
				aboutInfo: { projectName: 'Project 2', description: 'Desc 2', version: '2.0.0' }
			});

			expect(service1.aboutInfo?.projectName).toBe('Project 1');
			expect(service2.aboutInfo?.projectName).toBe('Project 2');
		});

		it('should allow direct state modification', () => {
			const service = new AboutService(mockRepo);

			service.aboutInfo = {
				projectName: 'Modified Project',
				description: 'Modified Description',
				version: '3.0.0'
			};

			expect(service.aboutInfo.projectName).toBe('Modified Project');
		});
	});
});
