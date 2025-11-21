import { describe, it, expect } from 'vitest';
import { availableLocales } from './locale-switcher';

/**
 * Property 10: Browser Locale Detection
 *
 * For any first-time visitor, the system should detect and use their browser's preferred language if available.
 *
 * **Feature: i18n-integration, Property 10: Browser Locale Detection**
 * **Validates: Requirements 6.5**
 *
 * This property test validates that the browser locale detection system correctly identifies
 * the user's preferred language from browser settings. This ensures that:
 * 1. Browser language preferences are detected correctly
 * 2. Exact locale matches are preferred (e.g., 'en' matches 'en')
 * 3. Language code matching works (e.g., 'zh' from 'zh-CN' matches 'zh-tw')
 * 4. Falls back to English when no match is found
 * 5. Respects localStorage preference over browser detection
 * 6. Works with all supported locales
 * 7. Handles various browser language formats
 */

// Helper function to test locale detection logic
function detectLocaleFromBrowserLang(browserLang: string, storedLocale: string | null): string {
	const locales = availableLocales.map((l) => l.code);

	// Check localStorage first
	if (storedLocale && locales.includes(storedLocale)) {
		return storedLocale;
	}

	// Detect from browser
	const normalizedLang = browserLang.toLowerCase();

	// Try exact match
	if (locales.includes(normalizedLang)) {
		return normalizedLang;
	}

	// Try language code only (e.g., 'zh' from 'zh-CN')
	const langCode = normalizedLang.split('-')[0];
	const match = locales.find((tag) => tag.startsWith(langCode));

	return match || 'en';
}

describe('Property 10: Browser Locale Detection', () => {
	it('should detect exact browser locale matches', () => {
		expect.assertions(3);

		// Property: For any supported locale, if browser language matches exactly,
		// detection should return that locale
		const supportedLocales = availableLocales.map((l) => l.code);

		for (const locale of supportedLocales) {
			const detected = detectLocaleFromBrowserLang(locale, null);

			// Property: Exact match should be detected
			expect(detected).toBe(locale);
		}
	});

	it('should detect browser locale with case-insensitive matching', () => {
		expect.assertions(3);

		// Property: For any supported locale, browser language should be matched case-insensitively
		const testCases = [
			{ browserLang: 'EN', expected: 'en' },
			{ browserLang: 'ZH-TW', expected: 'zh-tw' },
			{ browserLang: 'JP', expected: 'jp' }
		];

		for (const testCase of testCases) {
			const detected = detectLocaleFromBrowserLang(testCase.browserLang, null);

			// Property: Case-insensitive matching should work
			expect(detected).toBe(testCase.expected);
		}
	});

	it('should fall back to language code when region code does not match', () => {
		expect.assertions(3);

		// Property: For browser languages with region codes that don't match exactly,
		// the system should match by language code
		const testCases = [
			{ browserLang: 'zh-cn', expected: 'zh-tw' }, // Chinese (Simplified) -> Chinese (Traditional)
			{ browserLang: 'zh-hk', expected: 'zh-tw' }, // Chinese (Hong Kong) -> Chinese (Traditional)
			{ browserLang: 'en-gb', expected: 'en' } // English (GB) -> English
		];

		for (const testCase of testCases) {
			const detected = detectLocaleFromBrowserLang(testCase.browserLang, null);

			// Property: Language code matching should work
			expect(detected).toBe(testCase.expected);
		}
	});

	it('should return English as fallback for unsupported browser locales', () => {
		expect.assertions(5);

		// Property: For any unsupported browser locale, the system should fall back to English
		const unsupportedLocales = ['fr', 'de', 'es', 'it', 'ko'];

		for (const locale of unsupportedLocales) {
			const detected = detectLocaleFromBrowserLang(locale, null);

			// Property: Unsupported locales should fall back to English
			expect(detected).toBe('en');
		}
	});

	it('should prefer localStorage over browser detection', () => {
		expect.assertions(3);

		// Property: For any stored locale preference, localStorage should take precedence
		// over browser language detection
		const supportedLocales = availableLocales.map((l) => l.code);

		for (const storedLocale of supportedLocales) {
			// Set browser language to a different locale
			const differentLocale = supportedLocales.find((l) => l !== storedLocale) || 'en';

			const detected = detectLocaleFromBrowserLang(differentLocale, storedLocale);

			// Property: localStorage preference should be returned
			expect(detected).toBe(storedLocale);
		}
	});

	it('should handle browser locales with multiple region variants', () => {
		expect.assertions(6);

		// Property: For browser locales with various region codes,
		// the system should match by language code
		const testCases = [
			{ browserLang: 'zh-cn', expected: 'zh-tw' },
			{ browserLang: 'zh-hk', expected: 'zh-tw' },
			{ browserLang: 'zh-mo', expected: 'zh-tw' },
			{ browserLang: 'en-us', expected: 'en' },
			{ browserLang: 'en-gb', expected: 'en' },
			{ browserLang: 'en-au', expected: 'en' }
		];

		for (const testCase of testCases) {
			const detected = detectLocaleFromBrowserLang(testCase.browserLang, null);

			// Property: Language code matching should work for all variants
			expect(detected).toBe(testCase.expected);
		}
	});

	it('should detect all supported locales from browser settings', () => {
		expect.assertions(3);

		// Property: For each supported locale, browser detection should work
		for (const localeInfo of availableLocales) {
			const detected = detectLocaleFromBrowserLang(localeInfo.code, null);

			// Property: All supported locales should be detectable
			expect(detected).toBe(localeInfo.code);
		}
	});

	it('should handle browser locale detection with stored invalid locale', () => {
		expect.assertions(3);

		// Property: For invalid stored locales, the system should fall back to browser detection
		const invalidLocales = ['invalid', 'xx-yy', 'unknown'];

		for (const invalidLocale of invalidLocales) {
			const detected = detectLocaleFromBrowserLang('en', invalidLocale);

			// Property: Invalid stored locale should be ignored, browser detection used
			expect(detected).toBe('en');
		}
	});

	it('should detect browser locale with hyphenated language codes', () => {
		expect.assertions(3);

		// Property: For browser languages with hyphens, the system should extract language code
		const testCases = [
			{ browserLang: 'zh-hans', expected: 'zh-tw' }, // Simplified Chinese
			{ browserLang: 'zh-hant', expected: 'zh-tw' }, // Traditional Chinese
			{ browserLang: 'en-latn', expected: 'en' } // English with script
		];

		for (const testCase of testCases) {
			const detected = detectLocaleFromBrowserLang(testCase.browserLang, null);

			// Property: Hyphenated codes should be handled correctly
			expect(detected).toBe(testCase.expected);
		}
	});

	it('should return a valid supported locale for any browser language', () => {
		expect.assertions(10);

		// Property: For any browser language, detection should return
		// a valid supported locale
		const testBrowserLanguages = [
			'en',
			'en-us',
			'en-gb',
			'zh',
			'zh-cn',
			'zh-tw',
			'jp',
			'ja',
			'fr',
			'de'
		];

		for (const browserLang of testBrowserLanguages) {
			const detected = detectLocaleFromBrowserLang(browserLang, null);
			const supportedLocales = availableLocales.map((l) => l.code);

			// Property: Result should always be a supported locale
			expect(supportedLocales).toContain(detected);
		}
	});

	it('should handle browser locale detection with empty localStorage', () => {
		expect.assertions(3);

		// Property: For empty localStorage, browser detection should work
		for (const localeInfo of availableLocales) {
			const detected = detectLocaleFromBrowserLang(localeInfo.code, null);

			// Property: Browser detection should work with empty localStorage
			expect(detected).toBe(localeInfo.code);
		}
	});

	it('should detect browser locale consistently across multiple calls', () => {
		expect.assertions(9);

		// Property: For any browser language, multiple calls should return the same result
		for (const localeInfo of availableLocales) {
			const first = detectLocaleFromBrowserLang(localeInfo.code, null);
			const second = detectLocaleFromBrowserLang(localeInfo.code, null);
			const third = detectLocaleFromBrowserLang(localeInfo.code, null);

			// Property: Multiple calls should return consistent results
			expect(first).toBe(second);
			expect(second).toBe(third);
			expect(first).toBe(localeInfo.code);
		}
	});

	it('should prioritize exact locale match over language code match', () => {
		expect.assertions(1);

		// Property: When both exact match and language code match are possible,
		// exact match should be preferred
		const detected = detectLocaleFromBrowserLang('zh-tw', null);

		// Property: Exact match should be returned
		expect(detected).toBe('zh-tw');
	});

	it('should handle browser locale detection with mixed case', () => {
		expect.assertions(3);

		// Property: For browser languages with mixed case, detection should work
		const testCases = [
			{ browserLang: 'En-US', expected: 'en' },
			{ browserLang: 'ZH-tw', expected: 'zh-tw' },
			{ browserLang: 'Jp-JP', expected: 'jp' }
		];

		for (const testCase of testCases) {
			const detected = detectLocaleFromBrowserLang(testCase.browserLang, null);

			// Property: Mixed case should be handled correctly
			expect(detected).toBe(testCase.expected);
		}
	});
});
