import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Missing Translation Report Generator
 *
 * Generates a report of missing translations across all locales.
 * Validates that all locales have the same message keys as the base locale.
 *
 * **Validates: Requirements 9.5**
 */

export interface MissingTranslationReport {
	baseLocale: string;
	locales: string[];
	timestamp: string;
	summary: {
		totalKeys: number;
		completeLocales: string[];
		incompleteLocales: string[];
		totalMissing: number;
	};
	details: Record<
		string,
		{
			locale: string;
			missingKeys: string[];
			missingCount: number;
			completionPercentage: number;
		}
	>;
}

/**
 * Helper function to get message keys excluding schema reference
 */
function getMessageKeys(messages: Record<string, unknown>): string[] {
	return Object.keys(messages).filter((key) => key !== '$schema');
}

/**
 * Load message files from disk
 */
function loadMessageFiles(): Record<string, Record<string, unknown>> {
	const locales = ['en', 'zh-tw', 'jp'];
	const messages: Record<string, Record<string, unknown>> = {};

	locales.forEach((locale) => {
		try {
			const filePath = resolve(`messages/${locale}.json`);
			const content = readFileSync(filePath, 'utf-8');
			messages[locale] = JSON.parse(content);
		} catch (error) {
			console.error(`Failed to load messages for locale "${locale}":`, error);
			messages[locale] = {};
		}
	});

	return messages;
}

/**
 * Generate a missing translation report
 *
 * Compares all locales against the base locale (en) and identifies missing keys.
 *
 * @returns MissingTranslationReport - Detailed report of missing translations
 */
export function generateMissingTranslationReport(): MissingTranslationReport {
	const messages = loadMessageFiles();
	const baseLocale = 'en';
	const locales = ['en', 'zh-tw', 'jp'];

	const baseKeys = getMessageKeys(messages[baseLocale]);
	const details: Record<
		string,
		{
			locale: string;
			missingKeys: string[];
			missingCount: number;
			completionPercentage: number;
		}
	> = {};

	let totalMissing = 0;
	const completeLocales: string[] = [];
	const incompleteLocales: string[] = [];

	// Check each locale against base locale
	locales.forEach((locale) => {
		if (locale === baseLocale) {
			// Base locale is always complete
			completeLocales.push(locale);
			details[locale] = {
				locale,
				missingKeys: [],
				missingCount: 0,
				completionPercentage: 100
			};
			return;
		}

		const localeKeys = getMessageKeys(messages[locale]);
		const missingKeys = baseKeys.filter((key) => !localeKeys.includes(key));
		const missingCount = missingKeys.length;
		const completionPercentage = ((baseKeys.length - missingCount) / baseKeys.length) * 100;

		details[locale] = {
			locale,
			missingKeys,
			missingCount,
			completionPercentage: Math.round(completionPercentage * 100) / 100
		};

		totalMissing += missingCount;

		if (missingCount === 0) {
			completeLocales.push(locale);
		} else {
			incompleteLocales.push(locale);
		}
	});

	return {
		baseLocale,
		locales,
		timestamp: new Date().toISOString(),
		summary: {
			totalKeys: baseKeys.length,
			completeLocales,
			incompleteLocales,
			totalMissing
		},
		details
	};
}

/**
 * Format the report as a human-readable string
 *
 * @param report - The missing translation report
 * @returns Formatted report string
 */
export function formatMissingTranslationReport(report: MissingTranslationReport): string {
	const lines: string[] = [];

	lines.push('='.repeat(60));
	lines.push('MISSING TRANSLATION REPORT');
	lines.push('='.repeat(60));
	lines.push('');

	lines.push(`Generated: ${report.timestamp}`);
	lines.push(`Base Locale: ${report.baseLocale}`);
	lines.push('');

	// Summary
	lines.push('SUMMARY');
	lines.push('-'.repeat(60));
	lines.push(`Total Message Keys: ${report.summary.totalKeys}`);
	lines.push(`Complete Locales: ${report.summary.completeLocales.join(', ')}`);
	lines.push(`Incomplete Locales: ${report.summary.incompleteLocales.join(', ')}`);
	lines.push(`Total Missing Translations: ${report.summary.totalMissing}`);
	lines.push('');

	// Details
	lines.push('DETAILS');
	lines.push('-'.repeat(60));

	report.locales.forEach((locale) => {
		const detail = report.details[locale];
		if (!detail) return;

		lines.push(`\n${locale.toUpperCase()}`);
		lines.push(`  Completion: ${detail.completionPercentage}%`);
		lines.push(`  Missing Keys: ${detail.missingCount}`);

		if (detail.missingKeys.length > 0) {
			lines.push('  Missing:');
			detail.missingKeys.forEach((key) => {
				lines.push(`    - ${key}`);
			});
		}
	});

	lines.push('');
	lines.push('='.repeat(60));

	return lines.join('\n');
}

/**
 * Log the missing translation report to console
 *
 * @param report - The missing translation report
 */
export function logMissingTranslationReport(report: MissingTranslationReport): void {
	const formatted = formatMissingTranslationReport(report);
	console.log(formatted);
}

/**
 * Check if there are any missing translations
 *
 * @returns true if there are missing translations, false otherwise
 */
export function hasMissingTranslations(): boolean {
	const report = generateMissingTranslationReport();
	return report.summary.totalMissing > 0;
}

/**
 * Get missing keys for a specific locale
 *
 * @param locale - The locale to check
 * @returns Array of missing message keys
 */
export function getMissingKeysForLocale(locale: string): string[] {
	const report = generateMissingTranslationReport();
	const detail = report.details[locale];
	return detail ? detail.missingKeys : [];
}
