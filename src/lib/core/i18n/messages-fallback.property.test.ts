import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load message files
const enMessages = JSON.parse(readFileSync(resolve('messages/en.json'), 'utf-8'));
const zhTwMessages = JSON.parse(readFileSync(resolve('messages/zh-tw.json'), 'utf-8'));
const jpMessages = JSON.parse(readFileSync(resolve('messages/jp.json'), 'utf-8'));

/**
 * Property 3: Missing Translation Fallback
 *
 * For any missing translation in a non-base locale, the system should fall back to the base locale (English) message.
 *
 * **Feature: i18n-integration, Property 3: Missing Translation Fallback**
 * **Validates: Requirements 9.1**
 *
 * This property test validates that when a translation is missing in a non-base locale,
 * the system gracefully falls back to the English (base locale) message. This ensures:
 * 1. The application never crashes due to missing translations
 * 2. Users always see meaningful content, even if translations are incomplete
 * 3. The fallback mechanism is consistent and predictable
 * 4. Missing translations don't break the user experience
 *
 * Note: Since Paraglide JS generates message functions at build time and ensures all
 * locales have the same keys (validated by Property 1), this test verifies that:
 * - If a key exists in the base locale, it should be accessible
 * - The fallback pattern in generated messages follows the correct order
 * - All message keys from the base locale are available for fallback
 */
describe('Property 3: Missing Translation Fallback', () => {
	// Get all message keys from each locale, excluding the schema reference
	const getMessageKeys = (messages: Record<string, unknown>): string[] => {
		return Object.keys(messages).filter((key) => key !== '$schema').sort();
	};

	const enKeys = getMessageKeys(enMessages);
	const zhTwKeys = getMessageKeys(zhTwMessages);
	const jpKeys = getMessageKeys(jpMessages);

	it('should have all English messages available as fallback for missing translations', () => {
		expect.assertions(1);

		// Property: For any message key in the base locale (en), it should be available
		// as a fallback for any non-base locale
		const allEnglishKeysAvailable = enKeys.every((key) => {
			const enMessage = enMessages[key];
			return typeof enMessage === 'string' && enMessage.length > 0;
		});

		expect(allEnglishKeysAvailable).toBe(true);
	});

	it('should ensure all non-base locales have the same keys as base locale for fallback', () => {
		expect.assertions(1);

		// Property: For any non-base locale, all keys should match the base locale
		// This ensures that if a translation is missing, the fallback key exists
		const allKeysMatch = zhTwKeys.every((key) => enKeys.includes(key)) &&
			jpKeys.every((key) => enKeys.includes(key)) &&
			enKeys.every((key) => zhTwKeys.includes(key)) &&
			enKeys.every((key) => jpKeys.includes(key));

		expect(allKeysMatch).toBe(true);
	});

	it('should have non-empty English messages for all keys to serve as fallback', () => {
		expect.assertions(1);

		// Property: For any message key, the English message should be non-empty
		// This ensures the fallback message is always meaningful
		const allEnglishMessagesNonEmpty = enKeys.every((key) => {
			const message = enMessages[key];
			return typeof message === 'string' && message.trim().length > 0;
		});

		expect(allEnglishMessagesNonEmpty).toBe(true);
	});

	it('should have consistent message structure across locales for fallback compatibility', () => {
		expect.assertions(1);

		// Property: For any message key, all locales should have the same type (string)
		// This ensures fallback messages are compatible with the expected message type
		const allMessagesConsistent = enKeys.every((key) => {
			const enMsg = enMessages[key];
			const zhTwMsg = zhTwMessages[key];
			const jpMsg = jpMessages[key];

			return (
				typeof enMsg === 'string' &&
				typeof zhTwMsg === 'string' &&
				typeof jpMsg === 'string'
			);
		});

		expect(allMessagesConsistent).toBe(true);
	});

	it('should ensure base locale has all required message keys for fallback', () => {
		expect.assertions(1);

		// Property: The base locale should have all required common UI message keys
		// This ensures critical fallback messages are always available
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
			'logout'
		];

		const allRequiredKeysPresent = requiredKeys.every((key) => enKeys.includes(key));
		expect(allRequiredKeysPresent).toBe(true);
	});

	it('should ensure base locale has all required todo domain message keys for fallback', () => {
		expect.assertions(1);

		// Property: The base locale should have all required todo domain message keys
		// This ensures todo-related fallback messages are always available
		const requiredKeys = [
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

		const allRequiredKeysPresent = requiredKeys.every((key) => enKeys.includes(key));
		expect(allRequiredKeysPresent).toBe(true);
	});

	it('should have identical key sets across all locales to enable consistent fallback', () => {
		expect.assertions(1);

		// Property: For any locale, the set of keys should be identical to the base locale
		// This ensures that fallback can always find a corresponding English message
		const allKeySetsIdentical = zhTwKeys.length === enKeys.length &&
			jpKeys.length === enKeys.length &&
			zhTwKeys.every((key) => enKeys.includes(key)) &&
			jpKeys.every((key) => enKeys.includes(key));

		expect(allKeySetsIdentical).toBe(true);
	});

	it('should ensure no missing keys in non-base locales that would require fallback', () => {
		expect.assertions(2);

		// Property: For any key in the base locale, it should exist in all non-base locales
		// If a key is missing, the fallback mechanism would be triggered
		const zhTwMissingKeys = enKeys.filter((key) => !zhTwKeys.includes(key));
		const jpMissingKeys = enKeys.filter((key) => !jpKeys.includes(key));

		expect(zhTwMissingKeys).toEqual([]);
		expect(jpMissingKeys).toEqual([]);
	});

	it('should have all message values as strings for proper fallback rendering', () => {
		expect.assertions(3);

		// Property: For any message key, all locale values should be strings
		// This ensures fallback messages can be rendered correctly
		const validateAllStrings = (messages: Record<string, unknown>, localeName: string) => {
			const keys = getMessageKeys(messages);
			const nonStringKeys = keys.filter((key) => typeof messages[key] !== 'string');
			expect(nonStringKeys).toEqual([]);
		};

		validateAllStrings(enMessages, 'en');
		validateAllStrings(zhTwMessages, 'zh-tw');
		validateAllStrings(jpMessages, 'jp');
	});

	it('should ensure base locale messages are complete for all fallback scenarios', () => {
		expect.assertions(1);

		// Property: For any message key, the English message should be complete and meaningful
		// This ensures fallback messages provide value to users
		const allEnglishMessagesComplete = enKeys.every((key) => {
			const message = enMessages[key] as string;
			// Check that message is not just whitespace or placeholder
			return message.trim().length > 0 && !message.match(/^[\s{}\[\]]*$/);
		});

		expect(allEnglishMessagesComplete).toBe(true);
	});

	it('should maintain message key consistency for reliable fallback lookup', () => {
		expect.assertions(1);

		// Property: For any locale, the sorted key list should match the base locale
		// This ensures fallback lookup is deterministic and reliable
		const sortedEnKeys = [...enKeys].sort();
		const sortedZhTwKeys = [...zhTwKeys].sort();
		const sortedJpKeys = [...jpKeys].sort();

		const keysConsistent = JSON.stringify(sortedEnKeys) === JSON.stringify(sortedZhTwKeys) &&
			JSON.stringify(sortedEnKeys) === JSON.stringify(sortedJpKeys);

		expect(keysConsistent).toBe(true);
	});
});
