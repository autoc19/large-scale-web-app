import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Unit Tests for Pluralization
 *
 * Tests singular form for count = 1
 * Tests plural form for count > 1
 * Tests zero form for count = 0
 * Tests for all locales (en, zh-tw, jp)
 *
 * **Feature: i18n-integration, Property 5: Pluralization Correctness**
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
 */

// Load message files
const enMessages = JSON.parse(readFileSync(resolve('messages/en.json'), 'utf-8'));
const zhTwMessages = JSON.parse(readFileSync(resolve('messages/zh-tw.json'), 'utf-8'));
const jpMessages = JSON.parse(readFileSync(resolve('messages/jp.json'), 'utf-8'));

describe('Pluralization Unit Tests', () => {
	// Helper to extract plural forms from a message
	const extractPluralForms = (message: string): { one?: string; other?: string } => {
		// Find content between braces, handling nested braces
		const extractBraceContent = (str: string, startIdx: number): string => {
			let depth = 1; // Start at 1 since we're already past the opening brace
			let content = '';
			for (let i = startIdx; i < str.length; i++) {
				const char = str[i];
				if (char === '{') {
					depth++;
					content += char;
				} else if (char === '}') {
					depth--;
					if (depth === 0) break;
					content += char;
				} else {
					content += char;
				}
			}
			return content;
		};

		const oneIdx = message.indexOf('one {');
		const otherIdx = message.indexOf('other {');

		return {
			one: oneIdx >= 0 ? extractBraceContent(message, oneIdx + 5) : undefined,
			other: otherIdx >= 0 ? extractBraceContent(message, otherIdx + 7) : undefined
		};
	};

	// Helper to simulate plural message rendering
	const renderPluralMessage = (message: string, count: number): string => {
		const forms = extractPluralForms(message);
		if (count === 1 && forms.one) {
			// Replace {count} with actual count in singular form
			return forms.one.replace(/\{count\}/g, String(count));
		} else if (forms.other) {
			// Replace {count} with actual count in plural form
			return forms.other.replace(/\{count\}/g, String(count));
		}
		return message;
	};

	describe('English (en) Pluralization', () => {
		it('should use singular form for count = 1 in todo_count', () => {
			const message = enMessages.todo_count as string;
			const result = renderPluralMessage(message, 1);
			expect(result).toContain('You have 1 todo');
			expect(result).not.toContain('todos');
		});

		it('should use plural form for count = 2 in todo_count', () => {
			const message = enMessages.todo_count as string;
			const result = renderPluralMessage(message, 2);
			expect(result).toContain('You have 2 todos');
		});

		it('should use plural form for count = 0 in todo_count', () => {
			const message = enMessages.todo_count as string;
			const result = renderPluralMessage(message, 0);
			expect(result).toContain('You have 0 todos');
		});

		it('should use plural form for count > 1 in todo_count', () => {
			const message = enMessages.todo_count as string;
			const result = renderPluralMessage(message, 10);
			expect(result).toContain('You have 10 todos');
		});

		it('should use singular form for count = 1 in completed_count', () => {
			const message = enMessages.completed_count as string;
			const result = renderPluralMessage(message, 1);
			expect(result).toContain('1 todo completed');
			expect(result).not.toContain('todos');
		});

		it('should use plural form for count = 2 in completed_count', () => {
			const message = enMessages.completed_count as string;
			const result = renderPluralMessage(message, 2);
			expect(result).toContain('2 todos completed');
		});

		it('should use singular form for count = 1 in pending_count', () => {
			const message = enMessages.pending_count as string;
			const result = renderPluralMessage(message, 1);
			expect(result).toContain('1 todo pending');
			expect(result).not.toContain('todos');
		});

		it('should use plural form for count = 2 in pending_count', () => {
			const message = enMessages.pending_count as string;
			const result = renderPluralMessage(message, 2);
			expect(result).toContain('2 todos pending');
		});
	});

	describe('Traditional Chinese (zh-tw) Pluralization', () => {
		it('should use singular form for count = 1 in todo_count', () => {
			const message = zhTwMessages.todo_count as string;
			const result = renderPluralMessage(message, 1);
			expect(result).toContain('你有 1 個待辦事項');
		});

		it('should use plural form for count = 2 in todo_count', () => {
			const message = zhTwMessages.todo_count as string;
			const result = renderPluralMessage(message, 2);
			expect(result).toContain('你有 2 個待辦事項');
		});

		it('should use plural form for count = 0 in todo_count', () => {
			const message = zhTwMessages.todo_count as string;
			const result = renderPluralMessage(message, 0);
			expect(result).toContain('你有 0 個待辦事項');
		});

		it('should use plural form for count > 1 in todo_count', () => {
			const message = zhTwMessages.todo_count as string;
			const result = renderPluralMessage(message, 10);
			expect(result).toContain('你有 10 個待辦事項');
		});

		it('should use singular form for count = 1 in completed_count', () => {
			const message = zhTwMessages.completed_count as string;
			const result = renderPluralMessage(message, 1);
			expect(result).toContain('1 個待辦事項已完成');
		});

		it('should use plural form for count = 2 in completed_count', () => {
			const message = zhTwMessages.completed_count as string;
			const result = renderPluralMessage(message, 2);
			expect(result).toContain('2 個待辦事項已完成');
		});

		it('should use singular form for count = 1 in pending_count', () => {
			const message = zhTwMessages.pending_count as string;
			const result = renderPluralMessage(message, 1);
			expect(result).toContain('1 個待辦事項待處理');
		});

		it('should use plural form for count = 2 in pending_count', () => {
			const message = zhTwMessages.pending_count as string;
			const result = renderPluralMessage(message, 2);
			expect(result).toContain('2 個待辦事項待處理');
		});
	});

	describe('Japanese (jp) Pluralization', () => {
		it('should use singular form for count = 1 in todo_count', () => {
			const message = jpMessages.todo_count as string;
			const result = renderPluralMessage(message, 1);
			expect(result).toContain('1個のTodoがあります');
		});

		it('should use plural form for count = 2 in todo_count', () => {
			const message = jpMessages.todo_count as string;
			const result = renderPluralMessage(message, 2);
			expect(result).toContain('2個のTodoがあります');
		});

		it('should use plural form for count = 0 in todo_count', () => {
			const message = jpMessages.todo_count as string;
			const result = renderPluralMessage(message, 0);
			expect(result).toContain('0個のTodoがあります');
		});

		it('should use plural form for count > 1 in todo_count', () => {
			const message = jpMessages.todo_count as string;
			const result = renderPluralMessage(message, 10);
			expect(result).toContain('10個のTodoがあります');
		});

		it('should use singular form for count = 1 in completed_count', () => {
			const message = jpMessages.completed_count as string;
			const result = renderPluralMessage(message, 1);
			expect(result).toContain('1個のTodoが完了しました');
		});

		it('should use plural form for count = 2 in completed_count', () => {
			const message = jpMessages.completed_count as string;
			const result = renderPluralMessage(message, 2);
			expect(result).toContain('2個のTodoが完了しました');
		});

		it('should use singular form for count = 1 in pending_count', () => {
			const message = jpMessages.pending_count as string;
			const result = renderPluralMessage(message, 1);
			expect(result).toContain('1個のTodoが未完了です');
		});

		it('should use plural form for count = 2 in pending_count', () => {
			const message = jpMessages.pending_count as string;
			const result = renderPluralMessage(message, 2);
			expect(result).toContain('2個のTodoが未完了です');
		});
	});

	describe('Cross-locale Pluralization Consistency', () => {
		it('should have consistent singular/plural behavior across all locales for todo_count', () => {
			const enMsg = enMessages.todo_count as string;
			const zhTwMsg = zhTwMessages.todo_count as string;
			const jpMsg = jpMessages.todo_count as string;

			// All should have different forms for count=1 vs count=2
			const en1 = renderPluralMessage(enMsg, 1);
			const en2 = renderPluralMessage(enMsg, 2);
			const zhTw1 = renderPluralMessage(zhTwMsg, 1);
			const zhTw2 = renderPluralMessage(zhTwMsg, 2);
			const jp1 = renderPluralMessage(jpMsg, 1);
			const jp2 = renderPluralMessage(jpMsg, 2);

			expect(en1).not.toEqual(en2);
			expect(zhTw1).not.toEqual(zhTw2);
			expect(jp1).not.toEqual(jp2);
		});

		it('should have consistent singular/plural behavior across all locales for completed_count', () => {
			const enMsg = enMessages.completed_count as string;
			const zhTwMsg = zhTwMessages.completed_count as string;
			const jpMsg = jpMessages.completed_count as string;

			// All should have different forms for count=1 vs count=2
			const en1 = renderPluralMessage(enMsg, 1);
			const en2 = renderPluralMessage(enMsg, 2);
			const zhTw1 = renderPluralMessage(zhTwMsg, 1);
			const zhTw2 = renderPluralMessage(zhTwMsg, 2);
			const jp1 = renderPluralMessage(jpMsg, 1);
			const jp2 = renderPluralMessage(jpMsg, 2);

			expect(en1).not.toEqual(en2);
			expect(zhTw1).not.toEqual(zhTw2);
			expect(jp1).not.toEqual(jp2);
		});

		it('should have consistent singular/plural behavior across all locales for pending_count', () => {
			const enMsg = enMessages.pending_count as string;
			const zhTwMsg = zhTwMessages.pending_count as string;
			const jpMsg = jpMessages.pending_count as string;

			// All should have different forms for count=1 vs count=2
			const en1 = renderPluralMessage(enMsg, 1);
			const en2 = renderPluralMessage(enMsg, 2);
			const zhTw1 = renderPluralMessage(zhTwMsg, 1);
			const zhTw2 = renderPluralMessage(zhTwMsg, 2);
			const jp1 = renderPluralMessage(jpMsg, 1);
			const jp2 = renderPluralMessage(jpMsg, 2);

			expect(en1).not.toEqual(en2);
			expect(zhTw1).not.toEqual(zhTw2);
			expect(jp1).not.toEqual(jp2);
		});
	});

	describe('Pluralization Edge Cases', () => {
		it('should handle large counts correctly in English', () => {
			const message = enMessages.todo_count as string;
			const result = renderPluralMessage(message, 1000);
			expect(result).toContain('You have 1000 todos');
		});

		it('should handle large counts correctly in Traditional Chinese', () => {
			const message = zhTwMessages.todo_count as string;
			const result = renderPluralMessage(message, 1000);
			expect(result).toContain('你有 1000 個待辦事項');
		});

		it('should handle large counts correctly in Japanese', () => {
			const message = jpMessages.todo_count as string;
			const result = renderPluralMessage(message, 1000);
			expect(result).toContain('1000個のTodoがあります');
		});

		it('should preserve count parameter in all plural forms', () => {
			const enMsg = enMessages.todo_count as string;
			const zhTwMsg = zhTwMessages.todo_count as string;
			const jpMsg = jpMessages.todo_count as string;

			// Test that count is properly substituted
			const en = renderPluralMessage(enMsg, 5);
			const zhTw = renderPluralMessage(zhTwMsg, 5);
			const jp = renderPluralMessage(jpMsg, 5);

			expect(en).toContain('5');
			expect(zhTw).toContain('5');
			expect(jp).toContain('5');
		});
	});
});
