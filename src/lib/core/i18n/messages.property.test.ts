import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load message files
const enMessages = JSON.parse(readFileSync(resolve('messages/en.json'), 'utf-8'));
const zhTwMessages = JSON.parse(readFileSync(resolve('messages/zh-tw.json'), 'utf-8'));
const jpMessages = JSON.parse(readFileSync(resolve('messages/jp.json'), 'utf-8'));

/**
 * Property 1: Message Key Consistency
 *
 * For any message key in the base locale (en), all other locales should have the same key defined.
 *
 * **Feature: i18n-integration, Property 1: Message Key Consistency**
 * **Validates: Requirements 9.2**
 *
 * This property test validates that all supported locales (zh-tw, jp) have exactly
 * the same message keys as the base locale (en). This ensures that:
 * 1. No keys are missing in any locale
 * 2. No extra keys exist in any locale
 * 3. The message structure is consistent across all locales
 * 4. Type-safe message access works uniformly across all locales
 */
describe('Property 1: Message Key Consistency', () => {
	// Get all message keys from each locale, excluding the schema reference
	const getMessageKeys = (messages: Record<string, unknown>): string[] => {
		return Object.keys(messages).filter((key) => key !== '$schema').sort();
	};

	const enKeys = getMessageKeys(enMessages);
	const zhTwKeys = getMessageKeys(zhTwMessages);
	const jpKeys = getMessageKeys(jpMessages);

	it('should have all English keys present in Traditional Chinese locale', () => {
		expect.assertions(1);

		// Property: For any key in the base locale (en), it should exist in zh-tw
		const missingKeys = enKeys.filter((key) => !zhTwKeys.includes(key));

		expect(missingKeys).toEqual([]);
	});

	it('should have all English keys present in Japanese locale', () => {
		expect.assertions(1);

		// Property: For any key in the base locale (en), it should exist in jp
		const missingKeys = enKeys.filter((key) => !jpKeys.includes(key));

		expect(missingKeys).toEqual([]);
	});

	it('should not have extra keys in Traditional Chinese locale', () => {
		expect.assertions(1);

		// Property: For any key in zh-tw, it should exist in the base locale (en)
		const extraKeys = zhTwKeys.filter((key) => !enKeys.includes(key));

		expect(extraKeys).toEqual([]);
	});

	it('should not have extra keys in Japanese locale', () => {
		expect.assertions(1);

		// Property: For any key in jp, it should exist in the base locale (en)
		const extraKeys = jpKeys.filter((key) => !enKeys.includes(key));

		expect(extraKeys).toEqual([]);
	});

	it('should have the same number of keys in all locales', () => {
		expect.assertions(3);

		// Property: All locales should have the same number of message keys
		expect(zhTwKeys.length).toBe(enKeys.length);
		expect(jpKeys.length).toBe(enKeys.length);
		expect(zhTwKeys.length).toBe(jpKeys.length);
	});

	it('should have identical key sets across all locales', () => {
		expect.assertions(1);

		// Property: For any locale, the set of keys should be identical to the base locale
		const allKeysMatch = zhTwKeys.every((key) => enKeys.includes(key)) &&
			jpKeys.every((key) => enKeys.includes(key)) &&
			enKeys.every((key) => zhTwKeys.includes(key)) &&
			enKeys.every((key) => jpKeys.includes(key));

		expect(allKeysMatch).toBe(true);
	});

	it('should have all keys defined as non-empty strings', () => {
		// Property: For any message key, the value should be a non-empty string
		const validateMessages = (messages: Record<string, unknown>) => {
			const keys = getMessageKeys(messages);
			for (const key of keys) {
				const value = messages[key];
				if (typeof value !== 'string' || value.length === 0) {
					throw new Error(`Invalid message value for key "${key}": ${JSON.stringify(value)}`);
				}
			}
		};

		validateMessages(enMessages);
		validateMessages(zhTwMessages);
		validateMessages(jpMessages);

		expect(true).toBe(true);
	});

	it('should have consistent key ordering across locales', () => {
		expect.assertions(2);

		// Property: When sorted, all locales should have keys in the same order
		expect(zhTwKeys).toEqual(enKeys);
		expect(jpKeys).toEqual(enKeys);
	});

	it('should have no duplicate keys within any locale', () => {
		expect.assertions(3);

		// Property: For any locale, there should be no duplicate keys
		const hasDuplicates = (keys: string[]): boolean => {
			return new Set(keys).size !== keys.length;
		};

		expect(hasDuplicates(enKeys)).toBe(false);
		expect(hasDuplicates(zhTwKeys)).toBe(false);
		expect(hasDuplicates(jpKeys)).toBe(false);
	});

	it('should have valid key names (alphanumeric and underscores only)', () => {
		expect.assertions(3);

		// Property: For any message key, it should only contain alphanumeric characters and underscores
		const isValidKeyName = (key: string): boolean => /^[a-zA-Z0-9_]+$/.test(key);

		const validateKeyNames = (keys: string[], localeName: string) => {
			const invalidKeys = keys.filter((key) => !isValidKeyName(key));
			expect(invalidKeys).toEqual([]);
		};

		validateKeyNames(enKeys, 'en');
		validateKeyNames(zhTwKeys, 'zh-tw');
		validateKeyNames(jpKeys, 'jp');
	});

	it('should have all required common UI message keys', () => {
		expect.assertions(1);

		// Property: All required common UI message keys should be present
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

		const missingKeys = requiredKeys.filter((key) => !enKeys.includes(key));
		expect(missingKeys).toEqual([]);
	});

	it('should have all required todo domain message keys', () => {
		expect.assertions(1);

		// Property: All required todo domain message keys should be present
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

		const missingKeys = requiredKeys.filter((key) => !enKeys.includes(key));
		expect(missingKeys).toEqual([]);
	});

	it('should have all locales with the same keys as the base locale', () => {
		expect.assertions(1);

		// Property: For any locale, the key set should be identical to the base locale
		const allLocalesMatch = [zhTwMessages, jpMessages].every((locale) => {
			const localeKeys = getMessageKeys(locale);
			return localeKeys.length === enKeys.length && localeKeys.every((key) => enKeys.includes(key));
		});

		expect(allLocalesMatch).toBe(true);
	});
});
