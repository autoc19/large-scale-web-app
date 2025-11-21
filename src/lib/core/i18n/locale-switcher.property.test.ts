import { describe, it, expect } from 'vitest';
import { getCurrentLocale, setLocale, availableLocales } from './locale-switcher';

/**
 * Property 4: Locale Switching Updates UI
 *
 * For any locale change, all displayed messages should update to the new locale immediately.
 *
 * **Feature: i18n-integration, Property 4: Locale Switching Updates UI**
 * **Validates: Requirements 6.2, 6.3**
 *
 * This property test validates that the locale switching system correctly updates
 * the current locale when setLocale is called, and that the change is immediately
 * reflected in getCurrentLocale(). This ensures that:
 * 1. Locale changes are applied immediately
 * 2. The current locale is always accurate
 * 3. Multiple locale switches work correctly
 * 4. All available locales can be switched to
 * 5. Locale changes persist across function calls
 */
describe('Property 4: Locale Switching Updates UI', () => {
	it('should update current locale when setLocale is called with any available locale', () => {
		expect.assertions(3);

		// Property: For any available locale, setLocale should update getCurrentLocale
		for (const localeInfo of availableLocales) {
			setLocale(localeInfo.code);

			// Property: getCurrentLocale should immediately return the new locale
			expect(getCurrentLocale()).toBe(localeInfo.code);
		}
	});

	it('should switch between all available locales correctly', () => {
		expect.assertions(7);

		// Property: For any sequence of locale switches, each switch should be reflected immediately
		const locales = availableLocales.map((l) => l.code);

		// Test switching in order
		for (const locale of locales) {
			setLocale(locale);
			expect(getCurrentLocale()).toBe(locale);
		}

		// Test switching in reverse order
		for (let i = locales.length - 1; i >= 0; i--) {
			setLocale(locales[i]);
			expect(getCurrentLocale()).toBe(locales[i]);
		}

		// Test switching to same locale multiple times
		setLocale('en');
		expect(getCurrentLocale()).toBe('en');
	});

	it('should handle rapid successive locale switches', () => {
		expect.assertions(30);

		// Property: For any sequence of rapid locale switches, the final locale should be correct
		const locales = availableLocales.map((l) => l.code);

		// Perform 10 rapid switches to each locale
		for (let i = 0; i < 10; i++) {
			for (const locale of locales) {
				setLocale(locale);
				// Property: After each switch, getCurrentLocale should return the new locale
				expect(getCurrentLocale()).toBe(locale);
			}
		}
	});

	it('should maintain locale consistency across multiple calls', () => {
		expect.assertions(15);

		// Property: For any locale, multiple calls to getCurrentLocale should return the same value
		for (const localeInfo of availableLocales) {
			setLocale(localeInfo.code);

			// Property: Multiple consecutive calls should return the same locale
			const first = getCurrentLocale();
			const second = getCurrentLocale();
			const third = getCurrentLocale();

			expect(first).toBe(localeInfo.code);
			expect(second).toBe(localeInfo.code);
			expect(third).toBe(localeInfo.code);
			expect(first).toBe(second);
			expect(second).toBe(third);
		}
	});

	it('should handle switching between all locale pairs', () => {
		expect.assertions(18);

		// Property: For any pair of locales, switching between them should work correctly
		const locales = availableLocales.map((l) => l.code);

		for (let i = 0; i < locales.length; i++) {
			for (let j = 0; j < locales.length; j++) {
				setLocale(locales[i]);
				expect(getCurrentLocale()).toBe(locales[i]);

				setLocale(locales[j]);
				expect(getCurrentLocale()).toBe(locales[j]);
			}
		}
	});

	it('should preserve locale across multiple setLocale calls to the same locale', () => {
		expect.assertions(9);

		// Property: For any locale, calling setLocale multiple times with the same locale
		// should not change the current locale
		for (const localeInfo of availableLocales) {
			setLocale(localeInfo.code);
			expect(getCurrentLocale()).toBe(localeInfo.code);

			// Call setLocale again with the same locale
			setLocale(localeInfo.code);
			expect(getCurrentLocale()).toBe(localeInfo.code);

			// Call setLocale a third time
			setLocale(localeInfo.code);
			expect(getCurrentLocale()).toBe(localeInfo.code);
		}
	});

	it('should handle locale switching with all available locales in random order', () => {
		expect.assertions(30);

		// Property: For any order of locale switches, each switch should be reflected immediately
		const locales = availableLocales.map((l) => l.code);

		// Test multiple random sequences
		for (let sequence = 0; sequence < 10; sequence++) {
			// Create a random order
			const randomOrder = [...locales].sort(() => Math.random() - 0.5);

			for (const locale of randomOrder) {
				setLocale(locale);
				// Property: getCurrentLocale should match the switched locale
				expect(getCurrentLocale()).toBe(locale);
			}
		}
	});

	it('should handle switching to each locale from every other locale', () => {
		expect.assertions(12);

		// Property: For any source locale and target locale, switching should work correctly
		const locales = availableLocales.map((l) => l.code);

		// Start from each locale
		for (const fromLocale of locales) {
			setLocale(fromLocale);
			expect(getCurrentLocale()).toBe(fromLocale);

			// Switch to each other locale
			for (const toLocale of locales) {
				setLocale(toLocale);
				expect(getCurrentLocale()).toBe(toLocale);
			}
		}
	});

	it('should maintain correct locale after switching multiple times', () => {
		expect.assertions(7);

		// Property: For any sequence of locale switches, the final locale should be correct
		const switchSequence = ['en', 'zh-tw', 'jp', 'en', 'jp', 'zh-tw', 'en'];

		for (const locale of switchSequence) {
			setLocale(locale);
			// Property: After each switch, getCurrentLocale should return the switched locale
			expect(getCurrentLocale()).toBe(locale);
		}
	});

	it('should handle locale switching with all available locales in sequence', () => {
		expect.assertions(30);

		// Property: For any sequence of locale switches, each switch should be reflected immediately
		const locales = availableLocales.map((l) => l.code);

		// Perform 10 sequences of switching through all locales
		for (let i = 0; i < 10; i++) {
			for (const locale of locales) {
				setLocale(locale);
				// Property: After each switch, getCurrentLocale should return the new locale
				expect(getCurrentLocale()).toBe(locale);
			}
		}
	});

	it('should handle switching between locales with different character sets', () => {
		expect.assertions(5);

		// Property: For any locale including those with non-ASCII characters,
		// switching should work correctly
		const localeSequence = ['en', 'zh-tw', 'jp', 'en', 'zh-tw'];

		for (const locale of localeSequence) {
			setLocale(locale);

			// Property: getCurrentLocale should return the correct locale code
			expect(getCurrentLocale()).toBe(locale);
		}
	});

	it('should maintain locale state consistency across all available locales', () => {
		expect.assertions(3);

		// Property: For any available locale, the state should be consistent
		for (const localeInfo of availableLocales) {
			setLocale(localeInfo.code);

			// Property: getCurrentLocale should match the set locale
			const current = getCurrentLocale();
			expect(current).toBe(localeInfo.code);
		}
	});
});
