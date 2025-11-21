import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Unit tests for Paraglide configuration
 * 
 * These tests verify that the Paraglide configuration file is valid
 * and contains all required fields with correct values.
 * 
 * **Validates: Requirements 1.1, 1.2**
 */

describe('Paraglide Configuration', () => {
	// Load the settings file
	const settingsPath = path.join(process.cwd(), 'project.inlang', 'settings.json');
	let settings: any;

	// Helper to load and parse settings
	const loadSettings = () => {
		const content = fs.readFileSync(settingsPath, 'utf-8');
		return JSON.parse(content);
	};

	describe('Configuration File Validity', () => {
		it('should be valid JSON', () => {
			expect.assertions(1);
			expect(() => {
				loadSettings();
			}).not.toThrow();
		});

		it('should parse without errors', () => {
			expect.assertions(1);
			settings = loadSettings();
			expect(settings).toBeDefined();
		});

		it('should be an object', () => {
			expect.assertions(2);
			settings = loadSettings();
			expect(typeof settings).toBe('object');
			expect(settings).not.toBeNull();
		});
	});

	describe('Required Fields', () => {
		beforeEach(() => {
			settings = loadSettings();
		});

		it('should have $schema field', () => {
			expect.assertions(2);
			expect(settings).toHaveProperty('$schema');
			expect(typeof settings.$schema).toBe('string');
		});

		it('should have modules field', () => {
			expect.assertions(2);
			expect(settings).toHaveProperty('modules');
			expect(Array.isArray(settings.modules)).toBe(true);
		});

		it('should have plugin.inlang.messageFormat field', () => {
			expect.assertions(2);
			expect(settings).toHaveProperty('plugin.inlang.messageFormat');
			expect(typeof settings['plugin.inlang.messageFormat']).toBe('object');
		});

		it('should have baseLocale field', () => {
			expect.assertions(2);
			expect(settings).toHaveProperty('baseLocale');
			expect(typeof settings.baseLocale).toBe('string');
		});

		it('should have locales field', () => {
			expect.assertions(2);
			expect(settings).toHaveProperty('locales');
			expect(Array.isArray(settings.locales)).toBe(true);
		});
	});

	describe('Locale Configuration', () => {
		beforeEach(() => {
			settings = loadSettings();
		});

		it('should support three locales: en, zh-tw, and jp', () => {
			expect.assertions(3);
			expect(settings.locales).toContain('en');
			expect(settings.locales).toContain('zh-tw');
			expect(settings.locales).toContain('jp');
		});

		it('should have exactly three locales', () => {
			expect.assertions(1);
			expect(settings.locales.length).toBe(3);
		});

		it('should set English (en) as the base locale', () => {
			expect.assertions(1);
			expect(settings.baseLocale).toBe('en');
		});

		it('should have base locale in locales array', () => {
			expect.assertions(1);
			expect(settings.locales).toContain(settings.baseLocale);
		});

		it('should have valid locale codes', () => {
			expect.assertions(1);
			// Locale codes should be lowercase and follow pattern: language or language-region
			const validLocalePattern = /^[a-z]{2}(-[a-z]{2})?$/;
			const allValid = settings.locales.every((locale: string) =>
				validLocalePattern.test(locale)
			);
			expect(allValid).toBe(true);
		});

		it('should have no duplicate locales', () => {
			expect.assertions(1);
			const uniqueLocales = new Set(settings.locales);
			expect(uniqueLocales.size).toBe(settings.locales.length);
		});
	});

	describe('Message Format Configuration', () => {
		beforeEach(() => {
			settings = loadSettings();
		});

		it('should have pathPattern in messageFormat config', () => {
			expect.assertions(1);
			expect(settings['plugin.inlang.messageFormat']).toHaveProperty('pathPattern');
		});

		it('should have correct pathPattern format', () => {
			expect.assertions(1);
			const pathPattern = settings['plugin.inlang.messageFormat'].pathPattern;
			expect(pathPattern).toBe('./messages/{locale}.json');
		});

		it('should include {locale} placeholder in pathPattern', () => {
			expect.assertions(1);
			const pathPattern = settings['plugin.inlang.messageFormat'].pathPattern;
			expect(pathPattern).toContain('{locale}');
		});

		it('should point to messages directory', () => {
			expect.assertions(1);
			const pathPattern = settings['plugin.inlang.messageFormat'].pathPattern;
			expect(pathPattern).toContain('messages/');
		});
	});

	describe('Plugins Configuration', () => {
		beforeEach(() => {
			settings = loadSettings();
		});

		it('should have modules array with plugins', () => {
			expect.assertions(1);
			expect(settings.modules.length).toBeGreaterThan(0);
		});

		it('should include message-format plugin', () => {
			expect.assertions(1);
			const hasMessageFormatPlugin = settings.modules.some((module: string) =>
				module.includes('message-format')
			);
			expect(hasMessageFormatPlugin).toBe(true);
		});

		it('should include m-function-matcher plugin', () => {
			expect.assertions(1);
			const hasMFunctionPlugin = settings.modules.some((module: string) =>
				module.includes('m-function-matcher')
			);
			expect(hasMFunctionPlugin).toBe(true);
		});

		it('should have valid plugin URLs', () => {
			expect.assertions(1);
			const allValid = settings.modules.every((module: string) =>
				typeof module === 'string' && module.length > 0
			);
			expect(allValid).toBe(true);
		});
	});

	describe('Configuration Consistency', () => {
		beforeEach(() => {
			settings = loadSettings();
		});

		it('should have baseLocale matching one of the locales', () => {
			expect.assertions(1);
			expect(settings.locales).toContain(settings.baseLocale);
		});

		it('should have all locales as strings', () => {
			expect.assertions(1);
			const allStrings = settings.locales.every((locale: any) => typeof locale === 'string');
			expect(allStrings).toBe(true);
		});

		it('should have non-empty locale codes', () => {
			expect.assertions(1);
			const allNonEmpty = settings.locales.every((locale: string) => locale.length > 0);
			expect(allNonEmpty).toBe(true);
		});

		it('should have schema URL pointing to inlang', () => {
			expect.assertions(1);
			expect(settings.$schema).toContain('inlang.com');
		});

		it('should have schema URL pointing to project-settings', () => {
			expect.assertions(1);
			expect(settings.$schema).toContain('project-settings');
		});
	});
});
