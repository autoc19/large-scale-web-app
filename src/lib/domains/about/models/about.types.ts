/**
 * About Domain Type Definitions
 * 
 * This file contains all TypeScript interfaces for the About page domain.
 * These types define the data contracts for project information, technology stack,
 * architecture principles, and team members.
 */

/**
 * Project information displayed in the About page hero section
 */
export interface AboutInfo {
	/** The name of the project */
	projectName: string;
	/** A description of the project */
	description: string;
	/** The current version of the project */
	version: string;
	/** Optional URL to the project repository */
	repository?: string;
	/** Optional license information */
	license?: string;
}

/**
 * Technology category types
 */
export type TechnologyCategory = 'framework' | 'language' | 'testing' | 'styling' | 'tooling';

/**
 * A technology item in the technology stack
 */
export interface TechnologyItem {
	/** The name of the technology */
	name: string;
	/** The category this technology belongs to */
	category: TechnologyCategory;
	/** A description of how this technology is used */
	description: string;
	/** Optional version number */
	version?: string;
	/** Optional URL to the technology's documentation */
	url?: string;
}

/**
 * An architecture principle followed in the project
 */
export interface ArchitecturePrinciple {
	/** Unique identifier for the principle */
	id: string;
	/** The title of the principle */
	title: string;
	/** A description of the principle */
	description: string;
	/** Icon identifier or emoji for visual representation */
	icon: string;
	/** Optional code examples demonstrating the principle */
	examples?: string[];
}

/**
 * A team member who contributed to the project
 */
export interface TeamMember {
	/** The name of the team member */
	name: string;
	/** The role of the team member */
	role: string;
	/** Optional URL to the team member's avatar image */
	avatar?: string;
	/** Optional email address */
	email?: string;
	/** Optional GitHub username */
	github?: string;
}

/**
 * A content section in the About page
 */
export interface ContentSection {
	/** Unique identifier for the section */
	id: string;
	/** The title of the section */
	title: string;
	/** The content of the section */
	content: string;
}
