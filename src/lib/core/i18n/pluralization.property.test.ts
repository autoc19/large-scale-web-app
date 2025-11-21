import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Property 5: Pluralization Correctness
 *
 * For any count value, the plural form should match the grammatical rules of the current locale.
 *
 * **Feature: i18n-integration, Property 5: Pluralization Correctness**
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
 *
 * This property test validates that pluralization rules are correctly applied across
 * all supported locales (en, zh-tw, jp). It ensures that:
 * 1. Singular forms are used when count = 1
 * 2. Plural forms are used when count > 1
 * 3. Zero forms are handled appropriately
 * 4. Pluralization rules respect locale-specific grammar
 * 5. Plural messages contain the count parameter
 */

// Load message files
const enMessages = JSON.parse(readFileSync(resolve('messages/en.json'), 'utf-8'));
const zhTwMessages = JSON.parse(readFileSync(resolve('messages/zh-tw.json'), 'utf-8'));
const jpMessages = JSON.parse(readFileSync(resolve('messages/jp.json'), 'utf-8'));

describe('Property 5: Pluralization Correctness', () => {
	// Helper to extract plural forms from a message
	const extractPluralForms = (message: string): { one?: string; other?: string } => {
		const pluralMatch = message.match(/\{[^}]*plural[^}]*one\s*\{([^}]*)\}[^}]*other\s*\{([^}]*)\}/);
		if (!pluralMatch) {
			return {};
		}
		return {
			one: pluralMatch[1],
			other: pluralMatch[2]
		};
	};

	// Helper to check if a message has plural forms
	const hasPluralForms = (message: string): boolean => {
		return /plural/.test(message);
	};

	// Helper to get all plural message keys
	const getPluralMessageKeys = (messages: Record<string, unknown>): string[] => {
		return Object.keys(messages)
			.filter((key) => key !== '$schema')
			.filter((key) => hasPluralForms(messages[key] as string));
	};

	const enPluralKeys = getPluralMessageKeys(enMessages);
	const zhTwPluralKeys = getPluralMessageKeys(zhTwMessages);
	const jpPluralKeys = getPluralMessageKeys(jpMessages);

	it('should have plural forms in English messages for count-based keys', () => {
		expect.assertions(1);

		// Property: Messages with count parameters should have plural forms
		const expectedPluralKeys = ['todo_count', 'completed_count', 'pending_count'];
		const missingPlurals = expectedPluralKeys.filter((key) => !enPluralKeys.includes(key));

		expect(missingPlurals).toEqual([]);
	});

	it('should have plural forms in Traditional Chinese messages for count-based keys', () => {
		expect.assertions(1);

		// Property: Messages with count parameters should have plural forms
		const expectedPluralKeys = ['todo_count', 'completed_count', 'pending_count'];
		const missingPlurals = expectedPluralKeys.filter((key) => !zhTwPluralKeys.includes(key));

		expect(missingPlurals).toEqual([]);
	});

	it('should have plural forms in Japanese messages for count-based keys', () => {
		expect.assertions(1);

		// Property: Messages with count parameters should have plural forms
		const expectedPluralKeys = ['todo_count', 'completed_count', 'pending_count'];
		const missingPlurals = expectedPluralKeys.filter((key) => !jpPluralKeys.includes(key));

		expect(missingPlurals).toEqual([]);
	});

	it('should have consistent plural message keys across all locales', () => {
		expect.assertions(2);

		// Property: All locales should have plural forms for the same message keys
		expect(zhTwPluralKeys.sort()).toEqual(enPluralKeys.sort());
		expect(jpPluralKeys.sort()).toEqual(enPluralKeys.sort());
	});

	it('should have both "one" and "other" forms in English plural messages', () => {
		expect.assertions(1);

		// Property: Each plural message should have both singular and plural forms
		const allFormsPresent = enPluralKeys.every((key) => {
			const message = enMessages[key] as string;
			const forms = extractPluralForms(message);
			return forms.one && forms.other;
		});

		expect(allFormsPresent).toBe(true);
	});

	it('should have both "one" and "other" forms in Traditional Chinese plural messages', () => {
		expect.assertions(1);

		// Property: Each plural message should have both singular and plural forms
		const allFormsPresent = zhTwPluralKeys.every((key) => {
			const message = zhTwMessages[key] as string;
			const forms = extractPluralForms(message);
			return forms.one && forms.other;
		});

		expect(allFormsPresent).toBe(true);
	});

	it('should have both "one" and "other" forms in Japanese plural messages', () => {
		expect.assertions(1);

		// Property: Each plural message should have both singular and plural forms
		const allFormsPresent = jpPluralKeys.every((key) => {
			const message = jpMessages[key] as string;
			const forms = extractPluralForms(message);
			return forms.one && forms.other;
		});

		expect(allFormsPresent).toBe(true);
	});

	it('should have non-empty singular and plural forms in English', () => {
		expect.assertions(1);

		// Property: Both singular and plural forms should have content
		const allNonEmpty = enPluralKeys.every((key) => {
			const message = enMessages[key] as string;
			const forms = extractPluralForms(message);
			return (forms.one?.trim().length ?? 0) > 0 && (forms.other?.trim().length ?? 0) > 0;
		});

		expect(allNonEmpty).toBe(true);
	});

	it('should have non-empty singular and plural forms in Traditional Chinese', () => {
		expect.assertions(1);

		// Property: Both singular and plural forms should have content
		const allNonEmpty = zhTwPluralKeys.every((key) => {
			const message = zhTwMessages[key] as string;
			const forms = extractPluralForms(message);
			return (forms.one?.trim().length ?? 0) > 0 && (forms.other?.trim().length ?? 0) > 0;
		});

		expect(allNonEmpty).toBe(true);
	});

	it('should have non-empty singular and plural forms in Japanese', () => {
		expect.assertions(1);

		// Property: Both singular and plural forms should have content
		const allNonEmpty = jpPluralKeys.every((key) => {
			const message = jpMessages[key] as string;
			const forms = extractPluralForms(message);
			return (forms.one?.trim().length ?? 0) > 0 && (forms.other?.trim().length ?? 0) > 0;
		});

		expect(allNonEmpty).toBe(true);
	});

	it('should have different singular and plural forms in English', () => {
		expect.assertions(1);

		// Property: Singular and plural forms should be different (not identical)
		const allDifferent = enPluralKeys.every((key) => {
			const message = enMessages[key] as string;
			const forms = extractPluralForms(message);
			return forms.one !== forms.other;
		});

		expect(allDifferent).toBe(true);
	});

	it('should have different singular and plural forms in Traditional Chinese', () => {
		expect.assertions(1);

		// Property: Singular and plural forms should be different (not identical)
		const allDifferent = zhTwPluralKeys.every((key) => {
			const message = zhTwMessages[key] as string;
			const forms = extractPluralForms(message);
			return forms.one !== forms.other;
		});

		expect(allDifferent).toBe(true);
	});

	it('should have different singular and plural forms in Japanese', () => {
		expect.assertions(1);

		// Property: Singular and plural forms should be different (not identical)
		const allDifferent = jpPluralKeys.every((key) => {
			const message = jpMessages[key] as string;
			const forms = extractPluralForms(message);
			return forms.one !== forms.other;
		});

		expect(allDifferent).toBe(true);
	});

	it('should have count parameter in plural messages', () => {
		expect.assertions(3);

		// Property: Plural messages should reference the count parameter
		const hasCountParam = (messages: Record<string, unknown>, keys: string[]): boolean => {
			return keys.every((key) => {
				const message = messages[key] as string;
				return /\{count/.test(message);
			});
		};

		expect(hasCountParam(enMessages, enPluralKeys)).toBe(true);
		expect(hasCountParam(zhTwMessages, zhTwPluralKeys)).toBe(true);
		expect(hasCountParam(jpMessages, jpPluralKeys)).toBe(true);
	});

	it('should have consistent plural structure across locales', () => {
		expect.assertions(1);

		// Property: All locales should have the same plural message keys with proper structure
		const allConsistent = enPluralKeys.every((key) => {
			const enMessage = enMessages[key] as string;
			const zhTwMessage = zhTwMessages[key] as string;
			const jpMessage = jpMessages[key] as string;

			const enForms = extractPluralForms(enMessage);
			const zhTwForms = extractPluralForms(zhTwMessage);
			const jpForms = extractPluralForms(jpMessage);

			return (
				enForms.one &&
				enForms.other &&
				zhTwForms.one &&
				zhTwForms.other &&
				jpForms.one &&
				jpForms.other
			);
		});

		expect(allConsistent).toBe(true);
	});

	it('should have valid plural syntax in all messages', () => {
		expect.assertions(3);

		// Property: All plural messages should have valid syntax
		const isValidPluralSyntax = (messages: Record<string, unknown>, keys: string[]): boolean => {
			return keys.every((key) => {
				const message = messages[key] as string;
				// Check for valid plural syntax: {count, plural, one {...} other {...}}
				// Allow for nested braces in the plural forms
				return /\{count,\s*plural,\s*one\s*\{.*\}\s*other\s*\{.*\}\}/.test(message);
			});
		};

		expect(isValidPluralSyntax(enMessages, enPluralKeys)).toBe(true);
		expect(isValidPluralSyntax(zhTwMessages, zhTwPluralKeys)).toBe(true);
		expect(isValidPluralSyntax(jpMessages, jpPluralKeys)).toBe(true);
	});

	it('should have all required plural message keys', () => {
		expect.assertions(1);

		// Property: All required plural message keys should be present
		const requiredPluralKeys = ['todo_count', 'completed_count', 'pending_count'];
		const missingKeys = requiredPluralKeys.filter((key) => !enPluralKeys.includes(key));

		expect(missingKeys).toEqual([]);
	});

	it('should have exactly three plural message keys', () => {
		expect.assertions(3);

		// Property: Should have exactly the expected number of plural messages
		expect(enPluralKeys.length).toBe(3);
		expect(zhTwPluralKeys.length).toBe(3);
		expect(jpPluralKeys.length).toBe(3);
	});

	it('should have locale-appropriate singular forms', () => {
		expect.assertions(3);

		// Property: Singular forms should be appropriate for each locale
		// English: should use "You have 1 todo" (singular)
		const enTodoCount = enMessages.todo_count as string;
		expect(enTodoCount).toContain('one {You have 1 todo}');

		// Chinese: should use "你有 1 個待辦事項" (singular form)
		const zhTwTodoCount = zhTwMessages.todo_count as string;
		expect(zhTwTodoCount).toContain('one {你有 1 個待辦事項}');

		// Japanese: should use "1個のTodoがあります" (singular form)
		const jpTodoCount = jpMessages.todo_count as string;
		expect(jpTodoCount).toContain('one {1個のTodoがあります}');
	});

	it('should have locale-appropriate plural forms', () => {
		expect.assertions(3);

		// Property: Plural forms should be appropriate for each locale
		// English: should use "You have {count} todos" (plural)
		const enTodoCount = enMessages.todo_count as string;
		expect(enTodoCount).toContain('other {You have {count} todos}');

		// Chinese: should use "你有 {count} 個待辦事項" (plural form with count)
		const zhTwTodoCount = zhTwMessages.todo_count as string;
		expect(zhTwTodoCount).toContain('other {你有 {count} 個待辦事項}');

		// Japanese: should use "{count}個のTodoがあります" (plural form with count)
		const jpTodoCount = jpMessages.todo_count as string;
		expect(jpTodoCount).toContain('other {{count}個のTodoがあります}');
	});
});
