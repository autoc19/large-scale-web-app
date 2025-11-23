/**
 * About Page Load Function
 * 
 * Loads all About page content from the static repository.
 * This runs on both server and client for universal rendering.
 */

import { AboutRepositoryStatic } from '$lib/domains/about/repositories/about.repository.static';
import type {
	AboutInfo,
	TechnologyItem,
	ArchitecturePrinciple,
	TeamMember
} from '$lib/domains/about/models/about.types';

/**
 * Page data type
 */
export interface AboutPageData {
	aboutInfo: AboutInfo;
	technologies: TechnologyItem[];
	principles: ArchitecturePrinciple[];
	teamMembers: TeamMember[];
}

/**
 * Load function - fetches all About page content
 */
export const load = async (): Promise<AboutPageData> => {
	// Instantiate static repository
	const repo = new AboutRepositoryStatic();

	// Fetch all content in parallel
	const [aboutInfo, technologies, principles, teamMembers] = await Promise.all([
		repo.getAboutInfo(),
		repo.getTechnologies(),
		repo.getArchitecturePrinciples(),
		repo.getTeamMembers()
	]);

	// Return data object
	return {
		aboutInfo,
		technologies,
		principles,
		teamMembers
	};
};
