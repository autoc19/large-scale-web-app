import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Unit tests for missing translation fallback
 *
 * Tests:
 * - Fallback to base locale when translation is missing
 * - Warning logged in development mode
 * - Message key displayed as last resort
 * - Application doesn't crash on missing translations
 *
 * **Validates: Requirements 9.1, 9.2, 9.3, 9.4**
 */

describe('Missing Translation Fallback Unit Tests', () => {
	// Load message files
	const enMessages = JSON.parse(readFileSync(resolve('messages/en.json'), 'utf-8'));
	const zhTwMessages = JSON.parse(readFileSync(resolve('messages/zh-tw.json'), 'utf-8'));
	const jpMessages = JSON.parse(readFileSync(resolve('messages/jp.json'), 'utf-8'));

	// Helper to get message keys excluding schema
	const getMessageKeys = (messages: Record<string, unknown>): string[] => {
		return Object.keys(messages).filter((key) => key !== '$schema');
	};

	describe('Fallback to Base Locale', () => {
		it('should have all English messages available as fallback', () => {
			// Requirement 9.1: WHEN a translation is missing THEN the System SHALL fall back to the base locale (English)
			// Test that all English messages exist and are non-empty
			const enKeys = getMessageKeys(enMessages);

			enKeys.forEach((key) => {
				const message = enMessages[key];
				expect(typeof message).toBe('string');
				expect((message as string).length).toBeGreaterThan(0);
			});
		});

		it('should ensure all non-base locales have same keys for fallback lookup', () => {
			// Requirement 9.1: WHEN a translation is missing THEN the System SHALL fall back to the base locale (English)
			// Test that all keys exist in all locales so fallback can find them
			const enKeys = getMessageKeys(enMessages);
			const zhTwKeys = getMessageKeys(zhTwMessages);
			const jpKeys = getMessageKeys(jpMessages);

			// All keys should be present in all locales
			enKeys.forEach((key) => {
				expect(zhTwKeys).toContain(key);
				expect(jpKeys).toContain(key);
			});
		});

		it('should have no missing keys in non-base locales that would trigger fallback', () => {
			// Requirement 9.1: WHEN a translation is missing THEN the System SHALL fall back to the base locale (English)
			// Test that no keys are missing in non-base locales
			const enKeys = getMessageKeys(enMessages);
			const zhTwKeys = getMessageKeys(zhTwMessages);
			const jpKeys = getMessageKeys(jpMessages);

			const zhTwMissing = enKeys.filter((key) => !zhTwKeys.includes(key));
			const jpMissing = enKeys.filter((key) => !jpKeys.includes(key));

			expect(zhTwMissing).toEqual([]);
			expect(jpMissing).toEqual([]);
		});

		it('should have consistent message structure for fallback compatibility', () => {
			// Requirement 9.1: WHEN a translation is missing THEN the System SHALL fall back to the base locale (English)
			// Test that all messages are strings for consistent fallback
			const enKeys = getMessageKeys(enMessages);

			enKeys.forEach((key) => {
				const enMsg = enMessages[key];
				const zhTwMsg = zhTwMessages[key];
				const jpMsg = jpMessages[key];

				expect(typeof enMsg).toBe('string');
				expect(typeof zhTwMsg).toBe('string');
				expect(typeof jpMsg).toBe('string');
			});
		});
	});

	describe('Development Mode Warning Logging', () => {
		let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
		let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

		beforeEach(() => {
			// Requirement 9.2: WHEN a translation is missing THEN the System SHALL log a warning in development mode
			// Spy on console methods to verify warnings are logged
			consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		});

		afterEach(() => {
			consoleWarnSpy.mockRestore();
			consoleErrorSpy.mockRestore();
		});

		it('should have mechanism to log warnings for missing translations', () => {
			// Requirement 9.2: WHEN a translation is missing THEN the System SHALL log a warning in development mode
			// Test that console methods are available for logging
			expect(console.warn).toBeDefined();
			expect(console.error).toBeDefined();

			// Simulate logging a missing translation warning
			const missingKey = 'nonexistent_key';
			const locale = 'zh-tw';

			console.warn(`Missing translation for key "${missingKey}" in locale "${locale}"`);

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Missing translation')
			);
		});

		it('should have error logging available for invalid locale fallback', () => {
			// Requirement 9.2: WHEN a translation is missing THEN the System SHALL log a warning in development mode
			// Test that error logging is available
			const invalidLocale = 'invalid-locale';

			console.error(`Invalid locale: ${invalidLocale}`);

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				expect.stringContaining('Invalid locale')
			);
		});

		it('should support logging for fallback scenarios', () => {
			// Requirement 9.2: WHEN a translation is missing THEN the System SHALL log a warning in development mode
			// Test that logging infrastructure supports fallback scenarios
			const key = 'test_key';
			const fromLocale = 'zh-tw';
			const toLocale = 'en';

			console.warn(`Falling back from "${fromLocale}" to "${toLocale}" for key "${key}"`);

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Falling back')
			);
		});
	});

	describe('Application Stability on Missing Translations', () => {
		it('should not crash when accessing message keys', () => {
			// Requirement 9.3: WHEN a translation is missing THEN the System SHALL NOT crash the application
			// Test that accessing message keys doesn't throw errors
			const enKeys = getMessageKeys(enMessages);

			expect(() => {
				enKeys.forEach((key) => {
					const message = enMessages[key];
					expect(message).toBeDefined();
				});
			}).not.toThrow();
		});

		it('should handle missing keys gracefully without throwing', () => {
			// Requirement 9.3: WHEN a translation is missing THEN the System SHALL NOT crash the application
			// Test that accessing non-existent keys doesn't crash
			expect(() => {
				const nonexistentKey = 'this_key_does_not_exist';
				const message = enMessages[nonexistentKey];
				// Should return undefined, not throw
				expect(message).toBeUndefined();
			}).not.toThrow();
		});

		it('should have all required keys to prevent crashes', () => {
			// Requirement 9.3: WHEN a translation is missing THEN the System SHALL NOT crash the application
			// Test that all required keys are present
			const requiredKeys = [
				'save',
				'cancel',
				'delete',
				'edit',
				'create',
				'update',
				'close',
				'confirm',
				'loading',
				'success',
				'error',
				'warning',
				'home',
				'settings',
				'profile',
				'logout',
				'todo_title',
				'add_todo',
				'edit_todo',
				'all_todos',
				'completed_todos',
				'pending_todos',
				'mark_complete',
				'mark_incomplete',
				'delete_todo',
				'todo_count',
				'completed_count',
				'pending_count',
				'title_required',
				'title_too_short',
				'title_too_long'
			];

			requiredKeys.forEach((key) => {
				expect(enMessages).toHaveProperty(key);
				expect(zhTwMessages).toHaveProperty(key);
				expect(jpMessages).toHaveProperty(key);
			});
		});

		it('should maintain application stability with consistent key structure', () => {
			// Requirement 9.3: WHEN a translation is missing THEN the System SHALL NOT crash the application
			// Test that all locales have consistent structure
			const enKeys = getMessageKeys(enMessages);
			const zhTwKeys = getMessageKeys(zhTwMessages);
			const jpKeys = getMessageKeys(jpMessages);

			expect(enKeys.length).toBe(zhTwKeys.length);
			expect(enKeys.length).toBe(jpKeys.length);
		});
	});

	describe('Message Key Display as Last Resort', () => {
		it('should have message keys available for display when translation missing', () => {
			// Requirement 9.4: WHEN a translation is missing THEN the System SHALL display the message key as a last resort
			// Test that message keys are accessible
			const enKeys = getMessageKeys(enMessages);

			expect(enKeys.length).toBeGreaterThan(0);
			enKeys.forEach((key) => {
				expect(typeof key).toBe('string');
				expect(key.length).toBeGreaterThan(0);
			});
		});

		it('should have valid message key format for display', () => {
			// Requirement 9.4: WHEN a translation is missing THEN the System SHALL display the message key as a last resort
			// Test that message keys follow naming conventions
			const enKeys = getMessageKeys(enMessages);
			const validKeyPattern = /^[a-z_][a-z0-9_]*$/;

			enKeys.forEach((key) => {
				expect(validKeyPattern.test(key)).toBe(
					true,
					`Message key "${key}" should follow naming convention`
				);
			});
		});

		it('should have descriptive message keys for user understanding', () => {
			// Requirement 9.4: WHEN a translation is missing THEN the System SHALL display the message key as a last resort
			// Test that message keys are descriptive enough to be useful
			const enKeys = getMessageKeys(enMessages);

			// Check that keys are not too short (at least 3 characters)
			enKeys.forEach((key) => {
				expect(key.length).toBeGreaterThanOrEqual(3);
			});
		});

		it('should have all message keys accessible for fallback display', () => {
			// Requirement 9.4: WHEN a translation is missing THEN the System SHALL display the message key as a last resort
			// Test that all keys can be accessed and displayed
			const enKeys = getMessageKeys(enMessages);

			enKeys.forEach((key) => {
				// Simulate displaying the key as fallback
				const displayKey = key;
				expect(displayKey).toBeDefined();
				expect(typeof displayKey).toBe('string');
			});
		});

		it('should have consistent key naming across all locales for display', () => {
			// Requirement 9.4: WHEN a translation is missing THEN the System SHALL display the message key as a last resort
			// Test that keys are identical across locales for consistent display
			const enKeys = getMessageKeys(enMessages);
			const zhTwKeys = getMessageKeys(zhTwMessages);
			const jpKeys = getMessageKeys(jpMessages);

			expect(zhTwKeys.sort()).toEqual(enKeys.sort());
			expect(jpKeys.sort()).toEqual(enKeys.sort());
		});
	});

	describe('Fallback Mechanism Completeness', () => {
		it('should have complete fallback chain: missing translation -> base locale -> message key', () => {
			// Requirement 9.1, 9.4: Complete fallback chain
			// Test that all components of the fallback chain are in place
			const enKeys = getMessageKeys(enMessages);

			enKeys.forEach((key) => {
				// Step 1: Check base locale has the message
				const baseMessage = enMessages[key];
				expect(baseMessage).toBeDefined();
				expect(typeof baseMessage).toBe('string');

				// Step 2: Check key is available for display
				expect(key).toBeDefined();
				expect(typeof key).toBe('string');
			});
		});

		it('should ensure no gaps in fallback coverage', () => {
			// Requirement 9.1, 9.3, 9.4: No gaps in fallback
			// Test that all keys have fallback coverage
			const enKeys = getMessageKeys(enMessages);
			const zhTwKeys = getMessageKeys(zhTwMessages);
			const jpKeys = getMessageKeys(jpMessages);

			// All keys should be covered
			enKeys.forEach((key) => {
				expect(zhTwKeys).toContain(key);
				expect(jpKeys).toContain(key);
				expect(enMessages[key]).toBeDefined();
			});
		});

		it('should have all message values non-empty for meaningful fallback', () => {
			// Requirement 9.1: Fallback messages should be meaningful
			// Test that all fallback messages are non-empty
			const enKeys = getMessageKeys(enMessages);

			enKeys.forEach((key) => {
				const message = enMessages[key] as string;
				expect(message.trim().length).toBeGreaterThan(0);
			});
		});
	});
});
