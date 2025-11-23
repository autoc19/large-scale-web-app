/**
 * Unit Tests for AboutHero Component
 * 
 * Tests that the AboutHero component renders project information correctly.
 */

import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import AboutHeroWrapper from './AboutHeroWrapper.test.svelte';
import type { AboutInfo } from '../models/about.types';

describe('AboutHero Component', () => {
	it('should render project name, description, and version', async () => {
		const aboutInfo: AboutInfo = {
			projectName: 'Test Project',
			description: 'This is a test project description',
			version: '1.0.0'
		};

		const { container } = await render(AboutHeroWrapper, {
			props: { aboutInfo }
		});

		expect(container.textContent).toContain('Test Project');
		expect(container.textContent).toContain('This is a test project description');
		expect(container.textContent).toContain('Version 1.0.0');
	});

	it('should render repository link when provided', async () => {
		const aboutInfo: AboutInfo = {
			projectName: 'Test Project',
			description: 'Description',
			version: '1.0.0',
			repository: 'https://github.com/test/repo'
		};

		const { container } = await render(AboutHeroWrapper, {
			props: { aboutInfo }
		});

		const link = container.querySelector('a[href="https://github.com/test/repo"]');
		expect(link).not.toBeNull();
		expect(link?.textContent).toContain('View Repository');
	});

	it('should render license when provided', async () => {
		const aboutInfo: AboutInfo = {
			projectName: 'Test Project',
			description: 'Description',
			version: '1.0.0',
			license: 'MIT'
		};

		const { container } = await render(AboutHeroWrapper, {
			props: { aboutInfo }
		});

		expect(container.textContent).toContain('License: MIT');
	});

	it('should not render repository link when not provided', async () => {
		const aboutInfo: AboutInfo = {
			projectName: 'Test Project',
			description: 'Description',
			version: '1.0.0'
		};

		const { container } = await render(AboutHeroWrapper, {
			props: { aboutInfo }
		});

		const links = container.querySelectorAll('a');
		expect(links.length).toBe(0);
	});

	it('should not render license when not provided', async () => {
		const aboutInfo: AboutInfo = {
			projectName: 'Test Project',
			description: 'Description',
			version: '1.0.0'
		};

		const { container } = await render(AboutHeroWrapper, {
			props: { aboutInfo }
		});

		expect(container.textContent).not.toContain('License:');
	});

	it('should render both repository and license when both provided', async () => {
		const aboutInfo: AboutInfo = {
			projectName: 'Test Project',
			description: 'Description',
			version: '1.0.0',
			repository: 'https://github.com/test/repo',
			license: 'Apache-2.0'
		};

		const { container } = await render(AboutHeroWrapper, {
			props: { aboutInfo }
		});

		const link = container.querySelector('a[href="https://github.com/test/repo"]');
		expect(link).not.toBeNull();
		expect(container.textContent).toContain('License: Apache-2.0');
	});

	it('should use proper heading hierarchy', async () => {
		const aboutInfo: AboutInfo = {
			projectName: 'Test Project',
			description: 'Description',
			version: '1.0.0'
		};

		const { container } = await render(AboutHeroWrapper, {
			props: { aboutInfo }
		});

		const h1 = container.querySelector('h1');
		expect(h1).not.toBeNull();
		expect(h1?.textContent).toContain('Test Project');
	});
});
