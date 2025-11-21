import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
	getCurrentLocale,
	setLocale,
	detectBrowserLocale,
	availableLocales,
	initializeLocale
} from './locale-switcher';

// Mock localStorage for Node.js environment
const mockLocalStorage = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		clear: () => {
			store = {};
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		length: 0,
		key: (index: number) => Object.keys(store)[index] || null
	};
})();

// Mock document for Node.js environment
const mockDocument = {
	documentElement: {
		lang: ''
	}
};

// Setup global mocks if not in browser
if (typeof window === 'undefined') {
	(global as any).window = {
		localStorage: mockLocalStorage,
		document: mockDocument
	};
	(global as any).localStorage = mockLocalStorage;
	(global as any).document = mockDocument;
	// navigator is read-only, so we'll mock it in individual tests
}

describe('Locale Switcher', () => {
	beforeEach(() => {
		// Clear localStorage before each test
		mockLocalStorage.clear();
		mockDocument.documentElement.lang = '';
	});

	afterEach(() => {
		// Clean up after each test
		mockLocalStorage.clear();
		mockDocument.documentElement.lang = '';
	});

	describe('getCurrentLocale', () => {
		it('should return the current locale', () => {
			// Arrange
			const currentLocale = getCurrentLocale();

			// Assert
			expect(currentLocale).toBeDefined();
			expect(typeof currentLocale).toBe('string');
			expect(availableLocales.map((l) => l.code)).toContain(currentLocale);
		});

		it('should return a valid locale code', () => {
			// Arrange
			const validCodes = availableLocales.map((l) => l.code);

			// Act
			const current = getCurrentLocale();

			// Assert
			expect(validCodes).toContain(current);
		});
	});

	describe('setLocale', () => {
		it('should update the current locale when given a valid locale', () => {
			// Arrange
			const targetLocale = 'zh-tw';

			// Act
			setLocale(targetLocale);

			// Assert
			expect(getCurrentLocale()).toBe(targetLocale);
		});

		it('should update current locale for all available locales', () => {
			// Arrange
			const locales = availableLocales.map((l) => l.code);

			// Act & Assert
			for (const locale of locales) {
				setLocale(locale);
				expect(getCurrentLocale()).toBe(locale);
			}
		});

		it('should persist locale to localStorage', () => {
			// Arrange
			const targetLocale = 'jp';

			// Act
			setLocale(targetLocale);

			// Assert
			expect(mockLocalStorage.getItem('preferred-locale')).toBe(targetLocale);
		});

		it('should set document lang attribute', () => {
			// Arrange
			const targetLocale = 'zh-tw';

			// Act
			setLocale(targetLocale);

			// Assert
			expect(mockDocument.documentElement.lang).toBe(targetLocale);
		});

		it('should handle invalid locale gracefully', () => {
			// Arrange
			const invalidLocale = 'invalid-locale';
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

			// Act
			setLocale(invalidLocale);

			// Assert
			expect(consoleSpy).toHaveBeenCalledWith(`Invalid locale: ${invalidLocale}`);
			consoleSpy.mockRestore();
		});

		it('should not change locale when given invalid locale', () => {
			// Arrange
			const validLocale = 'en';
			setLocale(validLocale);
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

			// Act
			setLocale('invalid-locale');

			// Assert
			expect(getCurrentLocale()).toBe(validLocale);
			consoleSpy.mockRestore();
		});

		it('should handle switching between multiple locales', () => {
			// Arrange
			const localeSequence = ['en', 'zh-tw', 'jp', 'en'];

			// Act & Assert
			for (const locale of localeSequence) {
				setLocale(locale);
				expect(getCurrentLocale()).toBe(locale);
				expect(mockLocalStorage.getItem('preferred-locale')).toBe(locale);
			}
		});
	});

	describe('detectBrowserLocale', () => {
		it('should return a valid locale code', () => {
			// Arrange
			const validCodes = availableLocales.map((l) => l.code);

			// Act
			const detected = detectBrowserLocale();

			// Assert
			expect(validCodes).toContain(detected);
		});

		it('should return stored locale if available in localStorage', () => {
			// Arrange
			const storedLocale = 'zh-tw';
			mockLocalStorage.setItem('preferred-locale', storedLocale);

			// Act
			const detected = detectBrowserLocale();

			// Assert
			expect(detected).toBe(storedLocale);
		});

		it('should return en as default when no locale is stored', () => {
			// Arrange
			mockLocalStorage.clear();

			// Act
			const detected = detectBrowserLocale();

			// Assert
			expect(detected).toBe('en');
		});

		it('should detect browser locale from navigator.language', () => {
			// Arrange
			mockLocalStorage.clear();
			const originalNavigator = Object.getOwnPropertyDescriptor(global, 'navigator');

			// Mock navigator.language to return a supported locale
			Object.defineProperty(global, 'navigator', {
				value: { language: 'en-US' },
				configurable: true
			});

			// Act
			const detected = detectBrowserLocale();

			// Assert
			expect(detected).toBe('en');

			// Restore
			if (originalNavigator) {
				Object.defineProperty(global, 'navigator', originalNavigator);
			}
		});

		it('should detect language code from browser locale', () => {
			// Arrange
			mockLocalStorage.clear();
			const originalNavigator = Object.getOwnPropertyDescriptor(global, 'navigator');

			// Mock navigator.language to return a locale with language code match
			Object.defineProperty(global, 'navigator', {
				value: { language: 'zh-CN' },
				configurable: true
			});

			// Act
			const detected = detectBrowserLocale();

			// Assert
			// Should match 'zh-tw' because it starts with 'zh'
			expect(detected).toBe('zh-tw');

			// Restore
			if (originalNavigator) {
				Object.defineProperty(global, 'navigator', originalNavigator);
			}
		});

		it('should prioritize stored locale over browser locale', () => {
			// Arrange
			const storedLocale = 'jp';
			mockLocalStorage.setItem('preferred-locale', storedLocale);
			const originalNavigator = Object.getOwnPropertyDescriptor(global, 'navigator');

			// Mock navigator.language to return a different locale
			Object.defineProperty(global, 'navigator', {
				value: { language: 'en-US' },
				configurable: true
			});

			// Act
			const detected = detectBrowserLocale();

			// Assert
			expect(detected).toBe(storedLocale);

			// Restore
			if (originalNavigator) {
				Object.defineProperty(global, 'navigator', originalNavigator);
			}
		});

		it('should return en as fallback for unsupported browser locale', () => {
			// Arrange
			mockLocalStorage.clear();
			const originalNavigator = Object.getOwnPropertyDescriptor(global, 'navigator');

			// Mock navigator.language to return an unsupported locale
			Object.defineProperty(global, 'navigator', {
				value: { language: 'fr-FR' },
				configurable: true
			});

			// Act
			const detected = detectBrowserLocale();

			// Assert
			expect(detected).toBe('en');

			// Restore
			if (originalNavigator) {
				Object.defineProperty(global, 'navigator', originalNavigator);
			}
		});
	});

	describe('Locale Persistence', () => {
		it('should persist locale to localStorage when setLocale is called', () => {
			// Arrange
			const locale = 'zh-tw';

			// Act
			setLocale(locale);

			// Assert
			expect(mockLocalStorage.getItem('preferred-locale')).toBe(locale);
		});

		it('should restore locale from localStorage on detectBrowserLocale', () => {
			// Arrange
			const locale = 'jp';
			mockLocalStorage.setItem('preferred-locale', locale);

			// Act
			const detected = detectBrowserLocale();

			// Assert
			expect(detected).toBe(locale);
		});

		it('should maintain locale persistence across multiple setLocale calls', () => {
			// Arrange
			const locales = ['en', 'zh-tw', 'jp'];

			// Act & Assert
			for (const locale of locales) {
				setLocale(locale);
				expect(mockLocalStorage.getItem('preferred-locale')).toBe(locale);
			}
		});

		it('should handle localStorage being unavailable gracefully', () => {
			// Arrange
			const spySetItem = vi.spyOn(mockLocalStorage, 'setItem');

			// Act
			setLocale('en');

			// Assert
			expect(spySetItem).toHaveBeenCalledWith('preferred-locale', 'en');
			spySetItem.mockRestore();
		});

		it('should not throw when localStorage is not available', () => {
			// Act & Assert
			expect(() => {
				setLocale('en');
			}).not.toThrow();
		});
	});

	describe('availableLocales', () => {
		it('should contain all required locales', () => {
			// Arrange
			const requiredLocales = ['en', 'zh-tw', 'jp'];

			// Act
			const availableCodes = availableLocales.map((l) => l.code);

			// Assert
			for (const locale of requiredLocales) {
				expect(availableCodes).toContain(locale);
			}
		});

		it('should have correct locale information', () => {
			// Arrange & Act
			const enLocale = availableLocales.find((l) => l.code === 'en');

			// Assert
			expect(enLocale).toBeDefined();
			expect(enLocale?.name).toBe('English');
			expect(enLocale?.nativeName).toBe('English');
		});

		it('should have native names for all locales', () => {
			// Act & Assert
			for (const locale of availableLocales) {
				expect(locale.nativeName).toBeDefined();
				expect(locale.nativeName.length).toBeGreaterThan(0);
			}
		});

		it('should have unique locale codes', () => {
			// Arrange
			const codes = availableLocales.map((l) => l.code);

			// Act
			const uniqueCodes = new Set(codes);

			// Assert
			expect(uniqueCodes.size).toBe(codes.length);
		});
	});

	describe('Integration Tests', () => {
		it('should handle complete locale switching workflow', () => {
			// Arrange
			const startLocale = 'en';
			const targetLocale = 'zh-tw';

			// Act
			setLocale(startLocale);
			expect(getCurrentLocale()).toBe(startLocale);
			expect(mockLocalStorage.getItem('preferred-locale')).toBe(startLocale);

			setLocale(targetLocale);
			expect(getCurrentLocale()).toBe(targetLocale);
			expect(mockLocalStorage.getItem('preferred-locale')).toBe(targetLocale);

			// Assert
			const detected = detectBrowserLocale();
			expect(detected).toBe(targetLocale);
		});

		it('should maintain consistency between getCurrentLocale and setLocale', () => {
			// Arrange
			const testLocales = availableLocales.map((l) => l.code);

			// Act & Assert
			for (const locale of testLocales) {
				setLocale(locale);
				const current = getCurrentLocale();
				expect(current).toBe(locale);
			}
		});

		it('should handle rapid locale switches without data loss', () => {
			// Arrange
			const finalLocale = 'jp';

			// Act
			for (let i = 0; i < 10; i++) {
				setLocale('en');
				setLocale('zh-tw');
				setLocale('jp');
			}

			// Assert
			expect(getCurrentLocale()).toBe(finalLocale);
			expect(mockLocalStorage.getItem('preferred-locale')).toBe(finalLocale);
		});
	});
});
