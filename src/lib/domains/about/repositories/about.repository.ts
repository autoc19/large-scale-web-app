/**
 * About Repository Interface
 * 
 * This interface defines the contract for loading About page content.
 * Different implementations can provide data from various sources
 * (static files, CMS, API, etc.) without changing business logic.
 */

import type {
	AboutInfo,
	TechnologyItem,
	ArchitecturePrinciple,
	TeamMember
} from '../models/about.types';

/**
 * Repository interface for About page content
 */
export interface AboutRepository {
	/**
	 * Get project information
	 * @returns Promise resolving to AboutInfo
	 */
	getAboutInfo(): Promise<AboutInfo>;

	/**
	 * Get all technologies used in the project
	 * @returns Promise resolving to array of TechnologyItem
	 */
	getTechnologies(): Promise<TechnologyItem[]>;

	/**
	 * Get architecture principles followed in the project
	 * @returns Promise resolving to array of ArchitecturePrinciple
	 */
	getArchitecturePrinciples(): Promise<ArchitecturePrinciple[]>;

	/**
	 * Get team members who contributed to the project
	 * @returns Promise resolving to array of TeamMember
	 */
	getTeamMembers(): Promise<TeamMember[]>;
}
