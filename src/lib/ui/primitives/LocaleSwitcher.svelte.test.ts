import { describe, it, expect, vi, beforeEach } from 'vitest';
import { availableLocales, getCurrentLocale, setLocale } from '$lib/core/i18n/locale-switcher';

describe('LocaleSwitcher Component', () => {
	beforeEach(() => {
		// Reset localStorage before each test
		localStorage.clear();
		vi.clearAllMocks();
	});

	describe('Component Rendering', () => {
		it('should render all available locales', () => {
			expect.assertions(1);
			expect(availableLocales.length).toBe(3);
		});

		it('should have correct locale codes for all locales', () => {
			expect.assertions(3);
			expect(availableLocales[0].code).toBe('en');
			expect(availableLocales[1].code).toBe('zh-tw');
			expect(availableLocales[2].code).toBe('jp');
		});

		it('should display native names for each locale', () => {
			expect.assertions(3);
			expect(availableLocales[0].nativeName).toBe('English');
			expect(availableLocales[1].nativeName).toBe('繁體中文');
			expect(availableLocales[2].nativeName).toBe('日本語');
		});
	});

	describe('Locale State Management', () => {
		it('should update state when locale is changed', () => {
			expect.assertions(2);
			const initialLocale = getCurrentLocale();
			expect(initialLocale).toBeDefined();

			setLocale('zh-tw');
			const newLocale = getCurrentLocale();
			expect(newLocale).toBe('zh-tw');
		});

		it('should call setLocale with correct locale code', () => {
			expect.assertions(3);

			// Change to Chinese
			setLocale('zh-tw');
			expect(getCurrentLocale()).toBe('zh-tw');

			// Change to Japanese
			setLocale('jp');
			expect(getCurrentLocale()).toBe('jp');

			// Change back to English
			setLocale('en');
			expect(getCurrentLocale()).toBe('en');
		});

		it('should persist locale preference to localStorage', () => {
			expect.assertions(3);

			setLocale('zh-tw');
			expect(localStorage.getItem('preferred-locale')).toBe('zh-tw');

			setLocale('jp');
			expect(localStorage.getItem('preferred-locale')).toBe('jp');

			setLocale('en');
			expect(localStorage.getItem('preferred-locale')).toBe('en');
		});

		it('should set document lang attribute when locale changes', () => {
			expect.assertions(3);

			setLocale('zh-tw');
			expect(document.documentElement.lang).toBe('zh-tw');

			setLocale('jp');
			expect(document.documentElement.lang).toBe('jp');

			setLocale('en');
			expect(document.documentElement.lang).toBe('en');
		});
	});

	describe('Locale Validation', () => {
		it('should handle invalid locale gracefully', () => {
			expect.assertions(1);
			const initialLocale = getCurrentLocale();

			// Try to set invalid locale
			setLocale('invalid-locale');

			// Locale should remain unchanged
			expect(getCurrentLocale()).toBe(initialLocale);
		});

		it('should not persist invalid locale to localStorage', () => {
			expect.assertions(1);
			const validLocale = 'zh-tw';
			setLocale(validLocale);
			localStorage.clear();

			// Try to set invalid locale
			setLocale('invalid-locale');

			// localStorage should be empty (not persisted)
			expect(localStorage.getItem('preferred-locale')).toBeNull();
		});
	});

	describe('Component Integration', () => {
		it('should have all required locale information', () => {
			expect.assertions(9);

			availableLocales.forEach((locale) => {
				expect(locale.code).toBeDefined();
				expect(locale.name).toBeDefined();
				expect(locale.nativeName).toBeDefined();
			});
		});

		it('should support switching between all available locales', () => {
			expect.assertions(3);

			availableLocales.forEach((locale) => {
				setLocale(locale.code);
				expect(getCurrentLocale()).toBe(locale.code);
			});
		});
	});
});
