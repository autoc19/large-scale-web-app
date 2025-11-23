/**
 * Unit Tests for TeamSection Component
 * 
 * Tests that the TeamSection component displays team members correctly
 * and handles optional contact information gracefully.
 */

import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TeamSectionWrapper from './TeamSectionWrapper.test.svelte';
import type { TeamMember } from '../models/about.types';

describe('TeamSection Component', () => {
	it('should render team member name and role', async () => {
		const teamMembers: TeamMember[] = [
			{
				name: 'John Doe',
				role: 'Lead Developer'
			}
		];

		const { container } = await render(TeamSectionWrapper, {
			props: { teamMembers }
		});

		expect(container.textContent).toContain('John Doe');
		expect(container.textContent).toContain('Lead Developer');
	});

	it('should render avatar when provided', async () => {
		const teamMembers: TeamMember[] = [
			{
				name: 'Jane Smith',
				role: 'Designer',
				avatar: 'https://example.com/avatar.jpg'
			}
		];

		const { container } = await render(TeamSectionWrapper, {
			props: { teamMembers }
		});

		const img = container.querySelector('img[src="https://example.com/avatar.jpg"]');
		expect(img).not.toBeNull();
		expect(img?.getAttribute('alt')).toContain('Jane Smith');
	});

	it('should render placeholder when avatar not provided', async () => {
		const teamMembers: TeamMember[] = [
			{
				name: 'Bob Johnson',
				role: 'Developer'
			}
		];

		const { container } = await render(TeamSectionWrapper, {
			props: { teamMembers }
		});

		// Should have a placeholder div with first letter
		expect(container.textContent).toContain('B');
	});

	it('should render email link when provided', async () => {
		const teamMembers: TeamMember[] = [
			{
				name: 'Alice Brown',
				role: 'Developer',
				email: 'alice@example.com'
			}
		];

		const { container } = await render(TeamSectionWrapper, {
			props: { teamMembers }
		});

		const emailLink = container.querySelector('a[href="mailto:alice@example.com"]');
		expect(emailLink).not.toBeNull();
		expect(emailLink?.textContent).toContain('alice@example.com');
	});

	it('should render GitHub link when provided', async () => {
		const teamMembers: TeamMember[] = [
			{
				name: 'Charlie Davis',
				role: 'Developer',
				github: 'charlied'
			}
		];

		const { container } = await render(TeamSectionWrapper, {
			props: { teamMembers }
		});

		const githubLink = container.querySelector('a[href="https://github.com/charlied"]');
		expect(githubLink).not.toBeNull();
		expect(githubLink?.textContent).toContain('@charlied');
	});

	it('should not render email link when not provided', async () => {
		const teamMembers: TeamMember[] = [
			{
				name: 'Eve Wilson',
				role: 'Developer'
			}
		];

		const { container } = await render(TeamSectionWrapper, {
			props: { teamMembers }
		});

		const emailLinks = container.querySelectorAll('a[href^="mailto:"]');
		expect(emailLinks.length).toBe(0);
	});

	it('should not render GitHub link when not provided', async () => {
		const teamMembers: TeamMember[] = [
			{
				name: 'Frank Miller',
				role: 'Developer'
			}
		];

		const { container } = await render(TeamSectionWrapper, {
			props: { teamMembers }
		});

		const githubLinks = container.querySelectorAll('a[href^="https://github.com/"]');
		expect(githubLinks.length).toBe(0);
	});

	it('should render multiple team members', async () => {
		const teamMembers: TeamMember[] = [
			{
				name: 'Member 1',
				role: 'Role 1'
			},
			{
				name: 'Member 2',
				role: 'Role 2'
			},
			{
				name: 'Member 3',
				role: 'Role 3'
			}
		];

		const { container } = await render(TeamSectionWrapper, {
			props: { teamMembers }
		});

		expect(container.textContent).toContain('Member 1');
		expect(container.textContent).toContain('Member 2');
		expect(container.textContent).toContain('Member 3');
	});

	it('should render all contact information when provided', async () => {
		const teamMembers: TeamMember[] = [
			{
				name: 'Grace Lee',
				role: 'Full Stack Developer',
				avatar: 'https://example.com/grace.jpg',
				email: 'grace@example.com',
				github: 'gracelee'
			}
		];

		const { container } = await render(TeamSectionWrapper, {
			props: { teamMembers }
		});

		expect(container.textContent).toContain('Grace Lee');
		expect(container.textContent).toContain('Full Stack Developer');
		
		const img = container.querySelector('img[src="https://example.com/grace.jpg"]');
		expect(img).not.toBeNull();
		
		const emailLink = container.querySelector('a[href="mailto:grace@example.com"]');
		expect(emailLink).not.toBeNull();
		
		const githubLink = container.querySelector('a[href="https://github.com/gracelee"]');
		expect(githubLink).not.toBeNull();
	});

	it('should use proper heading hierarchy', async () => {
		const teamMembers: TeamMember[] = [
			{
				name: 'Test Member',
				role: 'Test Role'
			}
		];

		const { container } = await render(TeamSectionWrapper, {
			props: { teamMembers }
		});

		const h2 = container.querySelector('h2');
		expect(h2).not.toBeNull();
		expect(h2?.textContent).toContain('Our Team');

		const h3 = container.querySelector('h3');
		expect(h3).not.toBeNull();
		expect(h3?.textContent).toContain('Test Member');
	});
});
