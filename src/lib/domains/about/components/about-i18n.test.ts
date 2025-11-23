/**
 * About Domain i18n Integration Tests
 * 
 * Tests that all required translation keys exist and work correctly
 * with parameter interpolation.
 */

import { describe, it, expect } from 'vitest';
import * as m from '$paraglide/messages';

describe('About i18n Integration', () => {
	describe('Translation Keys Existence', () => {
		it('should have all section heading translations', () => {
			expect(m.about_title()).toBeTruthy();
			expect(m.about_technology_stack()).toBeTruthy();
			expect(m.about_architecture()).toBeTruthy();
			expect(m.about_team()).toBeTruthy();
		});

		it('should have project information translations', () => {
			expect(m.about_project_name()).toBeTruthy();
			expect(m.about_project_description()).toBeTruthy();
			expect(m.about_view_repository()).toBeTruthy();
			expect(m.about_documentation()).toBeTruthy();
			expect(m.about_examples()).toBeTruthy();
		});

		it('should have technology category translations', () => {
			expect(m.about_category_framework()).toBeTruthy();
			expect(m.about_category_language()).toBeTruthy();
			expect(m.about_category_testing()).toBeTruthy();
			expect(m.about_category_styling()).toBeTruthy();
			expect(m.about_category_tooling()).toBeTruthy();
		});

		it('should have architecture principle translations', () => {
			expect(m.about_principle_contract_first_title()).toBeTruthy();
			expect(m.about_principle_contract_first_description()).toBeTruthy();
			expect(m.about_principle_screaming_architecture_title()).toBeTruthy();
			expect(m.about_principle_screaming_architecture_description()).toBeTruthy();
			expect(m.about_principle_logic_externalization_title()).toBeTruthy();
			expect(m.about_principle_logic_externalization_description()).toBeTruthy();
			expect(m.about_principle_anti_corruption_layer_title()).toBeTruthy();
			expect(m.about_principle_anti_corruption_layer_description()).toBeTruthy();
		});

		it('should have team role translations', () => {
			expect(m.about_role_full_stack_developers()).toBeTruthy();
		});
	});

	describe('Parameter Interpolation', () => {
		it('should interpolate version parameter correctly', () => {
			const result = m.about_version({ version: '1.0.0' });
			expect(result).toContain('1.0.0');
			expect(result).toBeTruthy();
		});

		it('should interpolate license parameter correctly', () => {
			const result = m.about_license({ license: 'MIT' });
			expect(result).toContain('MIT');
			expect(result).toBeTruthy();
		});

		it('should handle different version formats', () => {
			const versions = ['1.0.0', '2.5.3', '0.1.0-beta'];
			versions.forEach(version => {
				const result = m.about_version({ version });
				expect(result).toContain(version);
			});
		});

		it('should handle different license types', () => {
			const licenses = ['MIT', 'Apache-2.0', 'GPL-3.0'];
			licenses.forEach(license => {
				const result = m.about_license({ license });
				expect(result).toContain(license);
			});
		});
	});

	describe('Translation Content Validation', () => {
		it('should return non-empty strings for all keys', () => {
			const keys = [
				m.about_title,
				m.about_technology_stack,
				m.about_architecture,
				m.about_team,
				m.about_project_name,
				m.about_project_description,
				m.about_view_repository,
				m.about_documentation,
				m.about_examples,
				m.about_category_framework,
				m.about_category_language,
				m.about_category_testing,
				m.about_category_styling,
				m.about_category_tooling,
				m.about_principle_contract_first_title,
				m.about_principle_contract_first_description,
				m.about_principle_screaming_architecture_title,
				m.about_principle_screaming_architecture_description,
				m.about_principle_logic_externalization_title,
				m.about_principle_logic_externalization_description,
				m.about_principle_anti_corruption_layer_title,
				m.about_principle_anti_corruption_layer_description,
				m.about_role_full_stack_developers
			];

			keys.forEach(key => {
				const result = key();
				expect(result).toBeTruthy();
				expect(result.length).toBeGreaterThan(0);
				expect(typeof result).toBe('string');
			});
		});

		it('should not return translation keys as strings', () => {
			// Ensure translations are resolved, not returning keys like "about_title"
			const result = m.about_title();
			expect(result).not.toMatch(/^about_/);
			expect(result).not.toContain('_');
		});
	});

	describe('Category Translations Mapping', () => {
		it('should provide translations for all technology categories', () => {
			const categories = ['framework', 'language', 'testing', 'styling', 'tooling'];
			const translationFunctions = [
				m.about_category_framework,
				m.about_category_language,
				m.about_category_testing,
				m.about_category_styling,
				m.about_category_tooling
			];

			translationFunctions.forEach(fn => {
				const result = fn();
				expect(result).toBeTruthy();
				expect(result.length).toBeGreaterThan(0);
			});
		});
	});

	describe('Architecture Principle Translations', () => {
		it('should have matching title and description for each principle', () => {
			const principles = [
				{
					title: m.about_principle_contract_first_title,
					description: m.about_principle_contract_first_description
				},
				{
					title: m.about_principle_screaming_architecture_title,
					description: m.about_principle_screaming_architecture_description
				},
				{
					title: m.about_principle_logic_externalization_title,
					description: m.about_principle_logic_externalization_description
				},
				{
					title: m.about_principle_anti_corruption_layer_title,
					description: m.about_principle_anti_corruption_layer_description
				}
			];

			principles.forEach(principle => {
				const title = principle.title();
				const description = principle.description();
				
				expect(title).toBeTruthy();
				expect(description).toBeTruthy();
				expect(title.length).toBeGreaterThan(0);
				expect(description.length).toBeGreaterThan(0);
				// Description should be longer than title
				expect(description.length).toBeGreaterThan(title.length);
			});
		});
	});
});
