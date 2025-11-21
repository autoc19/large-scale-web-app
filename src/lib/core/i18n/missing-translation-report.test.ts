import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	generateMissingTranslationReport,
	formatMissingTranslationReport,
	logMissingTranslationReport,
	hasMissingTranslations,
	getMissingKeysForLocale,
	type MissingTranslationReport
} from './missing-translation-report';

/**
 * Unit tests for missing translation report generator
 *
 * Tests:
 * - Report generation with complete translations
 * - Report formatting as human-readable string
 * - Console logging of reports
 * - Detection of missing translations
 * - Retrieval of missing keys per locale
 *
 * **Validates: Requirements 9.5**
 */

describe('Missing Translation Report Unit Tests', () => {
	describe('Report Generation', () => {
		it('should generate a report with correct structure', () => {
			// Requirement 9.5: WHEN translations are incomplete THEN the System SHALL provide a report of missing keys
			const report = generateMissingTranslationReport();

			expect(report).toHaveProperty('baseLocale');
			expect(report).toHaveProperty('locales');
			expect(report).toHaveProperty('timestamp');
			expect(report).toHaveProperty('summary');
			expect(report).toHaveProperty('details');
		});

		it('should have correct base locale', () => {
			// Requirement 9.5: Report should identify base locale
			const report = generateMissingTranslationReport();

			expect(report.baseLocale).toBe('en');
		});

		it('should include all supported locales', () => {
			// Requirement 9.5: Report should list all locales
			const report = generateMissingTranslationReport();

			expect(report.locales).toContain('en');
			expect(report.locales).toContain('zh-tw');
			expect(report.locales).toContain('jp');
		});

		it('should have valid timestamp', () => {
			// Requirement 9.5: Report should include generation timestamp
			const report = generateMissingTranslationReport();

			expect(report.timestamp).toBeDefined();
			expect(() => new Date(report.timestamp)).not.toThrow();
		});

		it('should have summary with correct properties', () => {
			// Requirement 9.5: Report summary should contain key statistics
			const report = generateMissingTranslationReport();

			expect(report.summary).toHaveProperty('totalKeys');
			expect(report.summary).toHaveProperty('completeLocales');
			expect(report.summary).toHaveProperty('incompleteLocales');
			expect(report.summary).toHaveProperty('totalMissing');

			expect(typeof report.summary.totalKeys).toBe('number');
			expect(Array.isArray(report.summary.completeLocales)).toBe(true);
			expect(Array.isArray(report.summary.incompleteLocales)).toBe(true);
			expect(typeof report.summary.totalMissing).toBe('number');
		});

		it('should have details for each locale', () => {
			// Requirement 9.5: Report should provide per-locale details
			const report = generateMissingTranslationReport();

			report.locales.forEach((locale) => {
				expect(report.details).toHaveProperty(locale);
				const detail = report.details[locale];

				expect(detail).toHaveProperty('locale');
				expect(detail).toHaveProperty('missingKeys');
				expect(detail).toHaveProperty('missingCount');
				expect(detail).toHaveProperty('completionPercentage');

				expect(detail.locale).toBe(locale);
				expect(Array.isArray(detail.missingKeys)).toBe(true);
				expect(typeof detail.missingCount).toBe('number');
				expect(typeof detail.completionPercentage).toBe('number');
			});
		});

		it('should have base locale as complete', () => {
			// Requirement 9.5: Base locale should always be complete
			const report = generateMissingTranslationReport();

			expect(report.summary.completeLocales).toContain('en');
			expect(report.details['en'].missingCount).toBe(0);
			expect(report.details['en'].completionPercentage).toBe(100);
		});

		it('should calculate completion percentage correctly', () => {
			// Requirement 9.5: Report should show completion percentage
			const report = generateMissingTranslationReport();

			report.locales.forEach((locale) => {
				const detail = report.details[locale];
				const expectedPercentage =
					((report.summary.totalKeys - detail.missingCount) / report.summary.totalKeys) * 100;

				expect(detail.completionPercentage).toBe(
					Math.round(expectedPercentage * 100) / 100
				);
			});
		});

		it('should have non-negative missing counts', () => {
			// Requirement 9.5: Missing counts should be valid
			const report = generateMissingTranslationReport();

			report.locales.forEach((locale) => {
				const detail = report.details[locale];
				expect(detail.missingCount).toBeGreaterThanOrEqual(0);
			});
		});

		it('should have valid completion percentages', () => {
			// Requirement 9.5: Completion percentages should be between 0 and 100
			const report = generateMissingTranslationReport();

			report.locales.forEach((locale) => {
				const detail = report.details[locale];
				expect(detail.completionPercentage).toBeGreaterThanOrEqual(0);
				expect(detail.completionPercentage).toBeLessThanOrEqual(100);
			});
		});
	});

	describe('Report Formatting', () => {
		it('should format report as string', () => {
			// Requirement 9.5: Report should be formattable as human-readable string
			const report = generateMissingTranslationReport();
			const formatted = formatMissingTranslationReport(report);

			expect(typeof formatted).toBe('string');
			expect(formatted.length).toBeGreaterThan(0);
		});

		it('should include title in formatted report', () => {
			// Requirement 9.5: Formatted report should have clear title
			const report = generateMissingTranslationReport();
			const formatted = formatMissingTranslationReport(report);

			expect(formatted).toContain('MISSING TRANSLATION REPORT');
		});

		it('should include timestamp in formatted report', () => {
			// Requirement 9.5: Formatted report should show when it was generated
			const report = generateMissingTranslationReport();
			const formatted = formatMissingTranslationReport(report);

			expect(formatted).toContain('Generated:');
			expect(formatted).toContain(report.timestamp);
		});

		it('should include base locale in formatted report', () => {
			// Requirement 9.5: Formatted report should identify base locale
			const report = generateMissingTranslationReport();
			const formatted = formatMissingTranslationReport(report);

			expect(formatted).toContain('Base Locale:');
			expect(formatted).toContain(report.baseLocale);
		});

		it('should include summary section in formatted report', () => {
			// Requirement 9.5: Formatted report should have summary section
			const report = generateMissingTranslationReport();
			const formatted = formatMissingTranslationReport(report);

			expect(formatted).toContain('SUMMARY');
			expect(formatted).toContain('Total Message Keys:');
			expect(formatted).toContain('Complete Locales:');
			expect(formatted).toContain('Incomplete Locales:');
			expect(formatted).toContain('Total Missing Translations:');
		});

		it('should include details section in formatted report', () => {
			// Requirement 9.5: Formatted report should have details section
			const report = generateMissingTranslationReport();
			const formatted = formatMissingTranslationReport(report);

			expect(formatted).toContain('DETAILS');
		});

		it('should include all locales in formatted report', () => {
			// Requirement 9.5: Formatted report should list all locales
			const report = generateMissingTranslationReport();
			const formatted = formatMissingTranslationReport(report);

			report.locales.forEach((locale) => {
				expect(formatted).toContain(locale.toUpperCase());
			});
		});

		it('should include completion percentage in formatted report', () => {
			// Requirement 9.5: Formatted report should show completion percentage
			const report = generateMissingTranslationReport();
			const formatted = formatMissingTranslationReport(report);

			expect(formatted).toContain('Completion:');
			expect(formatted).toContain('%');
		});

		it('should include missing keys in formatted report', () => {
			// Requirement 9.5: Formatted report should list missing keys
			const report = generateMissingTranslationReport();
			const formatted = formatMissingTranslationReport(report);

			expect(formatted).toContain('Missing Keys:');
		});

		it('should have proper formatting with separators', () => {
			// Requirement 9.5: Formatted report should be well-structured
			const report = generateMissingTranslationReport();
			const formatted = formatMissingTranslationReport(report);

			expect(formatted).toContain('='.repeat(60));
			expect(formatted).toContain('-'.repeat(60));
		});
	});

	describe('Console Logging', () => {
		let consoleLogSpy: ReturnType<typeof vi.spyOn>;

		beforeEach(() => {
			consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
		});

		afterEach(() => {
			consoleLogSpy.mockRestore();
		});

		it('should log report to console', () => {
			// Requirement 9.5: Report should be loggable to console
			const report = generateMissingTranslationReport();

			logMissingTranslationReport(report);

			expect(consoleLogSpy).toHaveBeenCalled();
		});

		it('should log formatted report', () => {
			// Requirement 9.5: Logged report should be formatted
			const report = generateMissingTranslationReport();

			logMissingTranslationReport(report);

			const loggedContent = consoleLogSpy.mock.calls[0][0] as string;
			expect(loggedContent).toContain('MISSING TRANSLATION REPORT');
		});
	});

	describe('Missing Translation Detection', () => {
		it('should detect if there are missing translations', () => {
			// Requirement 9.5: Should be able to check if translations are incomplete
			const hasMissing = hasMissingTranslations();

			expect(typeof hasMissing).toBe('boolean');
		});

		it('should return false when all translations are complete', () => {
			// Requirement 9.5: Should correctly identify complete translations
			const hasMissing = hasMissingTranslations();

			// With current complete translations, should be false
			expect(hasMissing).toBe(false);
		});
	});

	describe('Missing Keys Retrieval', () => {
		it('should get missing keys for a locale', () => {
			// Requirement 9.5: Should be able to retrieve missing keys per locale
			const missingKeys = getMissingKeysForLocale('zh-tw');

			expect(Array.isArray(missingKeys)).toBe(true);
		});

		it('should return empty array for base locale', () => {
			// Requirement 9.5: Base locale should have no missing keys
			const missingKeys = getMissingKeysForLocale('en');

			expect(missingKeys).toEqual([]);
		});

		it('should return empty array for complete locales', () => {
			// Requirement 9.5: Complete locales should have no missing keys
			const report = generateMissingTranslationReport();

			report.summary.completeLocales.forEach((locale) => {
				const missingKeys = getMissingKeysForLocale(locale);
				expect(missingKeys).toEqual([]);
			});
		});

		it('should return valid keys for incomplete locales', () => {
			// Requirement 9.5: Incomplete locales should list missing keys
			const report = generateMissingTranslationReport();

			if (report.summary.incompleteLocales.length > 0) {
				report.summary.incompleteLocales.forEach((locale) => {
					const missingKeys = getMissingKeysForLocale(locale);
					expect(Array.isArray(missingKeys)).toBe(true);
					expect(missingKeys.length).toBeGreaterThan(0);
				});
			} else {
				// All locales are complete, which is valid
				expect(report.summary.incompleteLocales.length).toBe(0);
			}
		});

		it('should return undefined for invalid locale', () => {
			// Requirement 9.5: Invalid locales should return empty array
			const missingKeys = getMissingKeysForLocale('invalid-locale');

			expect(missingKeys).toEqual([]);
		});
	});

	describe('Report Consistency', () => {
		it('should generate consistent reports', () => {
			// Requirement 9.5: Multiple report generations should be consistent
			const report1 = generateMissingTranslationReport();
			const report2 = generateMissingTranslationReport();

			expect(report1.summary.totalKeys).toBe(report2.summary.totalKeys);
			expect(report1.summary.totalMissing).toBe(report2.summary.totalMissing);

			report1.locales.forEach((locale) => {
				expect(report1.details[locale].missingCount).toBe(
					report2.details[locale].missingCount
				);
			});
		});

		it('should have matching missing counts in summary and details', () => {
			// Requirement 9.5: Report should be internally consistent
			const report = generateMissingTranslationReport();

			let totalMissing = 0;
			report.locales.forEach((locale) => {
				totalMissing += report.details[locale].missingCount;
			});

			expect(totalMissing).toBe(report.summary.totalMissing);
		});

		it('should have correct locale categorization', () => {
			// Requirement 9.5: Locales should be correctly categorized
			const report = generateMissingTranslationReport();

			const allCategorized = [
				...report.summary.completeLocales,
				...report.summary.incompleteLocales
			];

			expect(allCategorized.sort()).toEqual(report.locales.sort());
		});
	});
});
