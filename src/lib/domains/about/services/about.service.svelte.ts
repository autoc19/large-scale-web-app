/**
 * About Service
 * 
 * This service manages the state and business logic for the About page.
 * It uses Svelte 5 Runes for reactive state management and provides
 * derived computations for organizing content.
 */

import type {
	AboutInfo,
	TechnologyItem,
	ArchitecturePrinciple,
	TeamMember,
	TechnologyCategory
} from '../models/about.types';
import type { AboutRepository } from '../repositories/about.repository';

/**
 * Service class for managing About page state and logic
 */
export class AboutService {
	// State properties using Svelte 5 $state
	aboutInfo = $state<AboutInfo | null>(null);
	technologies = $state<TechnologyItem[]>([]);
	principles = $state<ArchitecturePrinciple[]>([]);
	teamMembers = $state<TeamMember[]>([]);
	loading = $state(false);
	error = $state<string | null>(null);

	/**
	 * Constructor
	 * @param repo - AboutRepository implementation
	 * @param initialData - Optional initial data to populate state
	 */
	constructor(
		private repo: AboutRepository,
		initialData?: {
			aboutInfo?: AboutInfo;
			technologies?: TechnologyItem[];
			principles?: ArchitecturePrinciple[];
			teamMembers?: TeamMember[];
		}
	) {
		// Initialize state with provided initial data
		if (initialData) {
			if (initialData.aboutInfo) {
				this.aboutInfo = initialData.aboutInfo;
			}
			if (initialData.technologies) {
				this.technologies = initialData.technologies;
			}
			if (initialData.principles) {
				this.principles = initialData.principles;
			}
			if (initialData.teamMembers) {
				this.teamMembers = initialData.teamMembers;
			}
		}
	}

	/**
	 * Load all content from the repository
	 * Manages loading state and error handling
	 */
	async loadAllContent(): Promise<void> {
		this.loading = true;
		this.error = null;

		try {
			// Load all content in parallel
			const [aboutInfo, technologies, principles, teamMembers] = await Promise.all([
				this.repo.getAboutInfo(),
				this.repo.getTechnologies(),
				this.repo.getArchitecturePrinciples(),
				this.repo.getTeamMembers()
			]);

			// Update state with loaded data
			this.aboutInfo = aboutInfo;
			this.technologies = technologies;
			this.principles = principles;
			this.teamMembers = teamMembers;
		} catch (err) {
			// Catch errors and set error state (don't throw)
			this.error = (err as Error).message;
			console.error('Failed to load about content:', err);
		} finally {
			this.loading = false;
		}
	}

	/**
	 * Derived state: Group technologies by category
	 * @returns Object mapping category to array of technologies
	 */
	get technologiesByCategory(): Record<TechnologyCategory, TechnologyItem[]> {
		const grouped: Record<TechnologyCategory, TechnologyItem[]> = {
			framework: [],
			language: [],
			testing: [],
			styling: [],
			tooling: []
		};

		for (const tech of this.technologies) {
			grouped[tech.category].push(tech);
		}

		return grouped;
	}

	/**
	 * Derived state: Count of team members
	 * @returns Number of team members
	 */
	get teamMemberCount(): number {
		return this.teamMembers.length;
	}
}
