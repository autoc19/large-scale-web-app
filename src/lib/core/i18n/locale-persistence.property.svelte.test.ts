import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setLocale, getCurrentLocale, availableLocales } from './locale-switcher';

/**
 * Property 9: Locale Persistence
 *
 * For any locale selection, the preference should be persisted and restored on next visit.
 *
 * **Feature: i18n-integration, Property 9: Locale Persistence**
 * **Validates: Requirements 6.4**
 *
 * This property test validates that the locale switching system correctly persists
 * locale preferences to localStorage and can restore them. This ensures that:
 * 1. When a locale is set, it's saved to localStorage
 * 2. The saved locale can be retrieved from localStorage
 * 3. Locale persistence works for all available locales
 * 4. Multiple locale changes are persisted correctly
 * 5. The persistence mechanism is reliable across different locales
 */
describe('Property 9: Locale Persistence', () => {
	beforeEach(() => {
		// Clear localStorage before each test
		localStorage.clear();
	});

	afterEach(() => {
		// Clean up after each test
		localStorage.clear();
	});

	it('should persist locale to localStorage when setLocale is called', () => {
		expect.assertions(3);

		// Property: For any available locale, setLocale should persist it to localStorage
		for (const localeInfo of availableLocales) {
			setLocale(localeInfo.code);

			// Property: The locale should be saved in localStorage
			const stored = localStorage.getItem('preferred-locale');
			expect(stored).toBe(localeInfo.code);
		}
	});

	it('should persist all available locales correctly', () => {
		expect.assertions(3);

		// Property: For each available locale, persistence should work
		const locales = availableLocales.map((l) => l.code);

		for (const locale of locales) {
			localStorage.clear();
			setLocale(locale);

			// Property: The locale should be persisted
			const stored = localStorage.getItem('preferred-locale');
			expect(stored).toBe(locale);
		}
	});

	it('should update localStorage when locale is changed', () => {
		expect.assertions(6);

		// Property: For any sequence of locale changes, localStorage should reflect the latest
		const locales = availableLocales.map((l) => l.code);

		for (let i = 0; i < locales.length; i++) {
			setLocale(locales[i]);

			// Property: localStorage should contain the current locale
			const stored = localStorage.getItem('preferred-locale');
			expect(stored).toBe(locales[i]);

			// Property: The stored value should match getCurrentLocale
			expect(stored).toBe(getCurrentLocale());
		}
	});

	it('should persist locale across multiple rapid changes', () => {
		expect.assertions(30);

		// Property: For any sequence of rapid locale changes, the final locale should be persisted
		const locales = availableLocales.map((l) => l.code);

		for (let i = 0; i < 10; i++) {
			for (const locale of locales) {
				setLocale(locale);

				// Property: After each change, localStorage should be updated
				const stored = localStorage.getItem('preferred-locale');
				expect(stored).toBe(locale);
			}
		}
	});

	it('should maintain persistence consistency across all locale pairs', () => {
		expect.assertions(18);

		// Property: For any pair of locales, switching between them should persist correctly
		const locales = availableLocales.map((l) => l.code);

		for (let i = 0; i < locales.length; i++) {
			for (let j = 0; j < locales.length; j++) {
				setLocale(locales[i]);
				let stored = localStorage.getItem('preferred-locale');
				expect(stored).toBe(locales[i]);

				setLocale(locales[j]);
				stored = localStorage.getItem('preferred-locale');
				expect(stored).toBe(locales[j]);
			}
		}
	});

	it('should persist locale when set multiple times to the same value', () => {
		expect.assertions(9);

		// Property: For any locale, calling setLocale multiple times should persist consistently
		for (const localeInfo of availableLocales) {
			setLocale(localeInfo.code);
			let stored = localStorage.getItem('preferred-locale');
			expect(stored).toBe(localeInfo.code);

			// Call setLocale again with the same locale
			setLocale(localeInfo.code);
			stored = localStorage.getItem('preferred-locale');
			expect(stored).toBe(localeInfo.code);

			// Call setLocale a third time
			setLocale(localeInfo.code);
			stored = localStorage.getItem('preferred-locale');
			expect(stored).toBe(localeInfo.code);
		}
	});

	it('should persist locale with all available locales in random order', () => {
		expect.assertions(30);

		// Property: For any order of locale switches, persistence should work correctly
		const locales = availableLocales.map((l) => l.code);

		for (let sequence = 0; sequence < 10; sequence++) {
			// Create a random order
			const randomOrder = [...locales].sort(() => Math.random() - 0.5);

			for (const locale of randomOrder) {
				setLocale(locale);

				// Property: The locale should be persisted
				const stored = localStorage.getItem('preferred-locale');
				expect(stored).toBe(locale);
			}
		}
	});

	it('should persist locale when switching from each locale to every other locale', () => {
		expect.assertions(12);

		// Property: For any source and target locale, persistence should work
		const locales = availableLocales.map((l) => l.code);

		for (const fromLocale of locales) {
			setLocale(fromLocale);
			let stored = localStorage.getItem('preferred-locale');
			expect(stored).toBe(fromLocale);

			for (const toLocale of locales) {
				setLocale(toLocale);
				stored = localStorage.getItem('preferred-locale');
				expect(stored).toBe(toLocale);
			}
		}
	});

	it('should maintain persistence after multiple locale switches', () => {
		expect.assertions(7);

		// Property: For any sequence of locale switches, the final persisted locale should be correct
		const switchSequence = ['en', 'zh-tw', 'jp', 'en', 'jp', 'zh-tw', 'en'];

		for (const locale of switchSequence) {
			setLocale(locale);

			// Property: After each switch, localStorage should contain the new locale
			const stored = localStorage.getItem('preferred-locale');
			expect(stored).toBe(locale);
		}
	});

	it('should persist locale with all available locales in sequence', () => {
		expect.assertions(30);

		// Property: For any sequence of locale switches, persistence should work
		const locales = availableLocales.map((l) => l.code);

		for (let i = 0; i < 10; i++) {
			for (const locale of locales) {
				setLocale(locale);

				// Property: After each switch, localStorage should be updated
				const stored = localStorage.getItem('preferred-locale');
				expect(stored).toBe(locale);
			}
		}
	});

	it('should persist locale with all available locales including non-ASCII characters', () => {
		expect.assertions(5);

		// Property: For any locale including those with non-ASCII characters, persistence should work
		const localeSequence = ['en', 'zh-tw', 'jp', 'en', 'zh-tw'];

		for (const locale of localeSequence) {
			setLocale(locale);

			// Property: The locale should be persisted correctly
			const stored = localStorage.getItem('preferred-locale');
			expect(stored).toBe(locale);
		}
	});

	it('should maintain persistence consistency across all available locales', () => {
		expect.assertions(3);

		// Property: For any available locale, persistence should be consistent
		for (const localeInfo of availableLocales) {
			setLocale(localeInfo.code);

			// Property: The persisted locale should match the set locale
			const stored = localStorage.getItem('preferred-locale');
			expect(stored).toBe(localeInfo.code);
		}
	});

	it('should persist locale and match getCurrentLocale', () => {
		expect.assertions(3);

		// Property: For any locale, the persisted value should match getCurrentLocale
		for (const localeInfo of availableLocales) {
			setLocale(localeInfo.code);

			const stored = localStorage.getItem('preferred-locale');
			const current = getCurrentLocale();

			// Property: Persisted locale should match the current locale
			expect(stored).toBe(current);
		}
	});
});
