import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Unit tests for message files
 *
 * Tests:
 * - All locales have same keys
 * - All messages have valid JSON syntax
 * - Parameter placeholders are consistent
 *
 * **Validates: Requirements 2.5, 9.2**
 */

describe('Message Files Unit Tests', () => {
	// Helper to load and parse message files
	const loadMessageFile = (locale: string): Record<string, unknown> => {
		const filePath = resolve(`messages/${locale}.json`);
		const content = readFileSync(filePath, 'utf-8');
		return JSON.parse(content);
	};

	// Load all message files
	const enMessages = loadMessageFile('en');
	const zhTwMessages = loadMessageFile('zh-tw');
	const jpMessages = loadMessageFile('jp');

	const allLocales = {
		en: enMessages,
		'zh-tw': zhTwMessages,
		jp: jpMessages
	};

	describe('JSON Syntax Validation', () => {
		it('should have valid JSON syntax in all message files', () => {
			// Test that all message files can be parsed without errors
			expect(() => loadMessageFile('en')).not.toThrow();
			expect(() => loadMessageFile('zh-tw')).not.toThrow();
			expect(() => loadMessageFile('jp')).not.toThrow();
		});

		it('should have valid JSON structure with string values', () => {
			// Test that all message values are strings
			const validateStructure = (messages: Record<string, unknown>, locale: string) => {
				Object.entries(messages).forEach(([key, value]) => {
					if (key === '$schema') return; // Skip schema reference

					expect(typeof value).toBe('string', `Message "${key}" in locale "${locale}" should be a string`);
					expect((value as string).length).toBeGreaterThan(
						0,
						`Message "${key}" in locale "${locale}" should not be empty`
					);
				});
			};

			validateStructure(enMessages, 'en');
			validateStructure(zhTwMessages, 'zh-tw');
			validateStructure(jpMessages, 'jp');
		});

		it('should have schema reference in all message files', () => {
			// Test that all message files have the inlang schema reference
			expect(enMessages).toHaveProperty('$schema');
			expect(zhTwMessages).toHaveProperty('$schema');
			expect(jpMessages).toHaveProperty('$schema');

			expect(enMessages.$schema).toBe('https://inlang.com/schema/inlang-message-format');
			expect(zhTwMessages.$schema).toBe('https://inlang.com/schema/inlang-message-format');
			expect(jpMessages.$schema).toBe('https://inlang.com/schema/inlang-message-format');
		});
	});

	describe('Key Consistency Across Locales', () => {
		const getMessageKeys = (messages: Record<string, unknown>): string[] => {
			return Object.keys(messages).filter((key) => key !== '$schema').sort();
		};

		const enKeys = getMessageKeys(enMessages);
		const zhTwKeys = getMessageKeys(zhTwMessages);
		const jpKeys = getMessageKeys(jpMessages);

		it('should have identical keys in all locales', () => {
			// Test that all locales have the same message keys
			expect(zhTwKeys).toEqual(enKeys);
			expect(jpKeys).toEqual(enKeys);
		});

		it('should not have missing keys in any locale', () => {
			// Test that no keys are missing in non-base locales
			const zhTwMissing = enKeys.filter((key) => !zhTwKeys.includes(key));
			const jpMissing = enKeys.filter((key) => !jpKeys.includes(key));

			expect(zhTwMissing).toEqual([]);
			expect(jpMissing).toEqual([]);
		});

		it('should not have extra keys in any locale', () => {
			// Test that no extra keys exist in non-base locales
			const zhTwExtra = zhTwKeys.filter((key) => !enKeys.includes(key));
			const jpExtra = jpKeys.filter((key) => !enKeys.includes(key));

			expect(zhTwExtra).toEqual([]);
			expect(jpExtra).toEqual([]);
		});

		it('should have the same number of keys in all locales', () => {
			// Test that all locales have the same number of message keys
			expect(zhTwKeys.length).toBe(enKeys.length);
			expect(jpKeys.length).toBe(enKeys.length);
		});
	});

	describe('Parameter Placeholder Consistency', () => {
		// Helper to extract parameter placeholders from a message
		const extractPlaceholders = (message: string): string[] => {
			const matches = message.match(/\{([^}]+)\}/g) || [];
			return matches.map((match) => match.slice(1, -1)).sort();
		};

		it('should have consistent parameter placeholders across locales', () => {
			// Test that all locales use the same parameters for the same message keys
			const getMessageKeys = (messages: Record<string, unknown>): string[] => {
				return Object.keys(messages).filter((key) => key !== '$schema');
			};

			const keys = getMessageKeys(enMessages);

			keys.forEach((key) => {
				const enMessage = enMessages[key] as string;
				const zhTwMessage = zhTwMessages[key] as string;
				const jpMessage = jpMessages[key] as string;

				const enPlaceholders = extractPlaceholders(enMessage);
				const zhTwPlaceholders = extractPlaceholders(zhTwMessage);
				const jpPlaceholders = extractPlaceholders(jpMessage);

				expect(zhTwPlaceholders).toEqual(
					enPlaceholders,
					`Message key "${key}" has inconsistent placeholders between en and zh-tw`
				);
				expect(jpPlaceholders).toEqual(
					enPlaceholders,
					`Message key "${key}" has inconsistent placeholders between en and jp`
				);
			});
		});

		it('should have valid parameter names (alphanumeric and underscores only)', () => {
			// Test that all parameter names follow naming conventions
			const getMessageKeys = (messages: Record<string, unknown>): string[] => {
				return Object.keys(messages).filter((key) => key !== '$schema');
			};

			const isValidParameterName = (name: string): boolean => /^[a-zA-Z0-9_]+$/.test(name);

			const keys = getMessageKeys(enMessages);

			keys.forEach((key) => {
				const message = enMessages[key] as string;
				const placeholders = extractPlaceholders(message);

				placeholders.forEach((placeholder) => {
					// Extract just the parameter name (before any comma for formatting)
					const paramName = placeholder.split(',')[0].trim();
					expect(isValidParameterName(paramName)).toBe(
						true,
						`Invalid parameter name "${paramName}" in message key "${key}"`
					);
				});
			});
		});

		it('should have no duplicate parameters in any message', () => {
			// Test that no message has duplicate parameters
			const getMessageKeys = (messages: Record<string, unknown>): string[] => {
				return Object.keys(messages).filter((key) => key !== '$schema');
			};

			const keys = getMessageKeys(enMessages);

			keys.forEach((key) => {
				const message = enMessages[key] as string;
				const placeholders = extractPlaceholders(message);

				const uniquePlaceholders = new Set(placeholders);
				expect(uniquePlaceholders.size).toBe(
					placeholders.length,
					`Message key "${key}" has duplicate parameters`
				);
			});
		});

		it('should have messages with parameters in all locales', () => {
			// Test that messages with parameters are present in all locales
			const getMessageKeys = (messages: Record<string, unknown>): string[] => {
				return Object.keys(messages).filter((key) => key !== '$schema');
			};

			const keys = getMessageKeys(enMessages);
			const messagesWithParams: string[] = [];

			keys.forEach((key) => {
				const message = enMessages[key] as string;
				const placeholders = extractPlaceholders(message);
				if (placeholders.length > 0) {
					messagesWithParams.push(key);
				}
			});

			// Verify that all messages with parameters are present in all locales
			messagesWithParams.forEach((key) => {
				expect(zhTwMessages).toHaveProperty(key);
				expect(jpMessages).toHaveProperty(key);
			});
		});

		it('should have consistent parameter count across locales', () => {
			// Test that all locales have the same number of parameters for each message
			const getMessageKeys = (messages: Record<string, unknown>): string[] => {
				return Object.keys(messages).filter((key) => key !== '$schema');
			};

			const keys = getMessageKeys(enMessages);

			keys.forEach((key) => {
				const enMessage = enMessages[key] as string;
				const zhTwMessage = zhTwMessages[key] as string;
				const jpMessage = jpMessages[key] as string;

				const enCount = extractPlaceholders(enMessage).length;
				const zhTwCount = extractPlaceholders(zhTwMessage).length;
				const jpCount = extractPlaceholders(jpMessage).length;

				expect(zhTwCount).toBe(
					enCount,
					`Message key "${key}" has different parameter count in zh-tw (${zhTwCount}) vs en (${enCount})`
				);
				expect(jpCount).toBe(
					enCount,
					`Message key "${key}" has different parameter count in jp (${jpCount}) vs en (${enCount})`
				);
			});
		});
	});

	describe('Message Content Validation', () => {
		it('should have non-empty message values in all locales', () => {
			// Test that all message values are non-empty strings
			const validateNonEmpty = (messages: Record<string, unknown>, locale: string) => {
				Object.entries(messages).forEach(([key, value]) => {
					if (key === '$schema') return;

					expect((value as string).trim().length).toBeGreaterThan(
						0,
						`Message "${key}" in locale "${locale}" should not be empty or whitespace-only`
					);
				});
			};

			validateNonEmpty(enMessages, 'en');
			validateNonEmpty(zhTwMessages, 'zh-tw');
			validateNonEmpty(jpMessages, 'jp');
		});

		it('should have all required common UI message keys', () => {
			// Test that all required common UI message keys are present
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

			requiredKeys.forEach((key) => {
				expect(enMessages).toHaveProperty(key);
				expect(zhTwMessages).toHaveProperty(key);
				expect(jpMessages).toHaveProperty(key);
			});
		});

		it('should have all required todo domain message keys', () => {
			// Test that all required todo domain message keys are present
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

			requiredKeys.forEach((key) => {
				expect(enMessages).toHaveProperty(key);
				expect(zhTwMessages).toHaveProperty(key);
				expect(jpMessages).toHaveProperty(key);
			});
		});
	});
});
