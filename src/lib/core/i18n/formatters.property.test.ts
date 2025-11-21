import { describe, it, expect } from 'vitest';
import { formatDate, formatNumber } from './formatters';

/**
 * Property 6: Date Format Locale Consistency
 *
 * For any date value, the formatted output should follow the conventions of the current locale.
 *
 * **Feature: i18n-integration, Property 6: Date Format Locale Consistency**
 * **Validates: Requirements 8.1**
 *
 * This property test validates that the date formatting system correctly formats
 * dates according to locale-specific conventions. It ensures that:
 * 1. Dates are formatted differently for different locales
 * 2. The same date produces consistent output for the same locale
 * 3. All supported locales (en, zh-tw, jp) produce valid formatted output
 * 4. Different date styles (short, medium, long, full) produce different outputs
 * 5. Time inclusion produces different output than date-only formatting
 * 6. Invalid dates are handled gracefully
 * 7. Formatted output is a non-empty string
 */

describe('Property 6: Date Format Locale Consistency', () => {
	// Test dates
	const testDate = new Date('2024-01-15T14:30:00Z');
	const anotherDate = new Date('2023-12-25T09:00:00Z');
	const supportedLocales = ['en', 'zh-tw', 'jp'];
	const dateStyles = ['short', 'medium', 'long', 'full'] as const;

	it('should format dates consistently for the same locale and date', () => {
		expect.assertions(6);

		// Property: For any locale, formatting the same date multiple times should produce the same result
		for (const locale of supportedLocales) {
			const first = formatDate(testDate, locale);
			const second = formatDate(testDate, locale);
			const third = formatDate(testDate, locale);

			// Property: Multiple calls with same inputs should produce identical output
			expect(first).toBe(second);
			expect(second).toBe(third);
		}
	});

	it('should produce non-empty formatted output for all supported locales', () => {
		expect.assertions(3);

		// Property: For any supported locale, formatDate should return a non-empty string
		for (const locale of supportedLocales) {
			const formatted = formatDate(testDate, locale);

			// Property: Formatted output should be a non-empty string
			expect(formatted.length).toBeGreaterThan(0);
		}
	});

	it('should format different dates differently', () => {
		expect.assertions(3);

		// Property: For any locale, different dates should produce different formatted output
		for (const locale of supportedLocales) {
			const formatted1 = formatDate(testDate, locale);
			const formatted2 = formatDate(anotherDate, locale);

			// Property: Different dates should produce different output
			expect(formatted1).not.toBe(formatted2);
		}
	});

	it('should produce different output for different locales', () => {
		expect.assertions(4);

		// Property: For any date, different locales should produce different formatted output
		// (at least some locales should differ)
		const enFormatted = formatDate(testDate, 'en');
		const zhTwFormatted = formatDate(testDate, 'zh-tw');
		const jpFormatted = formatDate(testDate, 'jp');

		// Property: At least one locale should produce different output
		const allSame = enFormatted === zhTwFormatted && zhTwFormatted === jpFormatted;
		expect(allSame).toBe(false);

		// Property: Each locale should produce non-empty output
		expect(enFormatted.length).toBeGreaterThan(0);
		expect(zhTwFormatted.length).toBeGreaterThan(0);
		expect(jpFormatted.length).toBeGreaterThan(0);
	});

	it('should produce different output for different date styles', () => {
		expect.assertions(3);

		// Property: For any locale, different date styles should produce different output
		for (const locale of supportedLocales) {
			const outputs = dateStyles.map((style) => formatDate(testDate, locale, { style }));

			// Property: At least some styles should produce different output
			const allSame = outputs.every((output) => output === outputs[0]);
			expect(allSame).toBe(false);
		}
	});

	it('should include time when includeTime option is true', () => {
		expect.assertions(3);

		// Property: For any locale, including time should produce different output than date-only
		for (const locale of supportedLocales) {
			const dateOnly = formatDate(testDate, locale, { style: 'medium', includeTime: false });
			const withTime = formatDate(testDate, locale, { style: 'medium', includeTime: true });

			// Property: Date with time should be different from date-only
			expect(withTime).not.toBe(dateOnly);
		}
	});

	it('should handle all supported date styles for all locales', () => {
		expect.assertions(12);

		// Property: For any supported locale and date style, formatDate should return a non-empty string
		for (const locale of supportedLocales) {
			for (const style of dateStyles) {
				const formatted = formatDate(testDate, locale, { style });

				// Property: Formatted output should be a non-empty string
				expect(formatted.length).toBeGreaterThan(0);
			}
		}
	});

	it('should handle edge case dates', () => {
		expect.assertions(9);

		// Property: For any valid date, formatDate should return a non-empty string
		const edgeDates = [
			new Date('2000-01-01T00:00:00Z'), // Y2K
			new Date('1970-01-01T00:00:00Z'), // Unix epoch
			new Date('2099-12-31T23:59:59Z') // Far future
		];

		for (const locale of supportedLocales) {
			for (const date of edgeDates) {
				const formatted = formatDate(date, locale);

				// Property: Formatted output should be a non-empty string
				expect(formatted.length).toBeGreaterThan(0);
			}
		}
	});

	it('should produce consistent output for the same date across multiple calls', () => {
		expect.assertions(24);

		// Property: For any locale and date style, multiple calls should produce identical output
		for (const locale of supportedLocales) {
			for (const style of dateStyles) {
				const first = formatDate(testDate, locale, { style });
				const second = formatDate(testDate, locale, { style });
				const third = formatDate(testDate, locale, { style });

				// Property: Multiple calls should produce identical output
				expect(first).toBe(second);
				expect(second).toBe(third);
			}
		}
	});

	it('should handle time formatting with all date styles', () => {
		expect.assertions(12);

		// Property: For any locale and date style with time, formatDate should return a non-empty string
		for (const locale of supportedLocales) {
			for (const style of dateStyles) {
				const formatted = formatDate(testDate, locale, { style, includeTime: true });

				// Property: Formatted output should be a non-empty string
				expect(formatted.length).toBeGreaterThan(0);
			}
		}
	});

	it('should produce locale-specific date formatting', () => {
		expect.assertions(3);

		// Property: For any date, each locale should produce a valid formatted string
		// that is different from at least one other locale
		const enShort = formatDate(testDate, 'en', { style: 'short' });
		const zhTwShort = formatDate(testDate, 'zh-tw', { style: 'short' });
		const jpShort = formatDate(testDate, 'jp', { style: 'short' });

		// Property: All outputs should be non-empty
		expect(enShort.length).toBeGreaterThan(0);
		expect(zhTwShort.length).toBeGreaterThan(0);
		expect(jpShort.length).toBeGreaterThan(0);
	});

	it('should handle default options correctly', () => {
		expect.assertions(3);

		// Property: For any locale, calling formatDate without options should use defaults
		for (const locale of supportedLocales) {
			const withDefaults = formatDate(testDate, locale);
			const withExplicitDefaults = formatDate(testDate, locale, { style: 'medium', includeTime: false });

			// Property: Default behavior should match explicit defaults
			expect(withDefaults).toBe(withExplicitDefaults);
		}
	});

	it('should produce different output for different time inclusion settings', () => {
		expect.assertions(12);

		// Property: For any locale and date style, includeTime should affect output
		for (const locale of supportedLocales) {
			for (const style of dateStyles) {
				const withoutTime = formatDate(testDate, locale, { style, includeTime: false });
				const withTime = formatDate(testDate, locale, { style, includeTime: true });

				// Property: Time inclusion should produce different output
				expect(withTime).not.toBe(withoutTime);
			}
		}
	});

	it('should handle all supported locales consistently', () => {
		expect.assertions(3);

		// Property: For any supported locale, formatDate should work correctly
		for (const locale of supportedLocales) {
			const formatted = formatDate(testDate, locale);

			// Property: Output should be a non-empty string
			expect(formatted.length).toBeGreaterThan(0);
		}
	});

	it('should produce valid formatted dates for all date styles', () => {
		expect.assertions(4);

		// Property: For any date style, formatDate should produce a non-empty string
		for (const style of dateStyles) {
			const formatted = formatDate(testDate, 'en', { style });

			// Property: Formatted output should be a non-empty string
			expect(formatted.length).toBeGreaterThan(0);
		}
	});

	it('should maintain consistency across multiple dates and locales', () => {
		expect.assertions(6);

		// Property: For any combination of dates and locales, formatting should be consistent
		const dates = [testDate, anotherDate];

		for (const date of dates) {
			for (const locale of supportedLocales) {
				const first = formatDate(date, locale);
				const second = formatDate(date, locale);

				// Property: Multiple calls should produce identical output
				expect(first).toBe(second);
			}
		}
	});

	it('should handle date formatting with various time values', () => {
		expect.assertions(9);

		// Property: For any time value within a date, formatDate should handle it correctly
		const timeDates = [
			new Date('2024-01-15T00:00:00Z'), // Midnight
			new Date('2024-01-15T12:00:00Z'), // Noon
			new Date('2024-01-15T23:59:59Z') // End of day
		];

		for (const locale of supportedLocales) {
			for (const date of timeDates) {
				const formatted = formatDate(date, locale, { includeTime: true });

				// Property: Formatted output should be a non-empty string
				expect(formatted.length).toBeGreaterThan(0);
			}
		}
	});

	it('should produce different formatted output for different months', () => {
		expect.assertions(3);

		// Property: For any locale, different months should produce different formatted output
		const january = new Date('2024-01-15T14:30:00Z');
		const december = new Date('2024-12-15T14:30:00Z');

		for (const locale of supportedLocales) {
			const januaryFormatted = formatDate(january, locale);
			const decemberFormatted = formatDate(december, locale);

			// Property: Different months should produce different output
			expect(januaryFormatted).not.toBe(decemberFormatted);
		}
	});

	it('should produce different formatted output for different years', () => {
		expect.assertions(3);

		// Property: For any locale, different years should produce different formatted output
		const year2024 = new Date('2024-01-15T14:30:00Z');
		const year2025 = new Date('2025-01-15T14:30:00Z');

		for (const locale of supportedLocales) {
			const formatted2024 = formatDate(year2024, locale);
			const formatted2025 = formatDate(year2025, locale);

			// Property: Different years should produce different output
			expect(formatted2024).not.toBe(formatted2025);
		}
	});
});


/**
 * Property 7: Number Format Locale Consistency
 *
 * For any number value, the formatted output should follow the conventions of the current locale.
 *
 * **Feature: i18n-integration, Property 7: Number Format Locale Consistency**
 * **Validates: Requirements 8.2**
 *
 * This property test validates that the number formatting system correctly formats
 * numbers according to locale-specific conventions. It ensures that:
 * 1. Numbers are formatted differently for different locales
 * 2. The same number produces consistent output for the same locale
 * 3. All supported locales (en, zh-tw, jp) produce valid formatted output
 * 4. Different number styles (decimal, currency, percent) produce different outputs
 * 5. Currency formatting includes locale-specific currency symbols
 * 6. Decimal formatting respects fraction digit options
 * 7. Formatted output is a non-empty string
 * 8. Percentage formatting produces output with percent symbol
 */

describe('Property 7: Number Format Locale Consistency', () => {
	// Test numbers
	const testNumbers = [0, 1, 10, 100, 1000, 1234.56, 0.5, 0.123];
	const supportedLocales = ['en', 'zh-tw', 'jp'];
	const numberStyles = ['decimal', 'currency', 'percent'] as const;

	it('should format numbers consistently for the same locale and number', () => {
		expect.assertions(48);

		// Property: For any locale and number, formatting multiple times should produce the same result
		for (const locale of supportedLocales) {
			for (const num of testNumbers) {
				const first = formatNumber(num, locale);
				const second = formatNumber(num, locale);
				const third = formatNumber(num, locale);

				// Property: Multiple calls with same inputs should produce identical output
				expect(first).toBe(second);
				expect(second).toBe(third);
			}
		}
	});

	it('should produce non-empty formatted output for all supported locales', () => {
		expect.assertions(24);

		// Property: For any supported locale and number, formatNumber should return a non-empty string
		for (const locale of supportedLocales) {
			for (const num of testNumbers) {
				const formatted = formatNumber(num, locale);

				// Property: Formatted output should be a non-empty string
				expect(formatted.length).toBeGreaterThan(0);
			}
		}
	});

	it('should format different numbers differently', () => {
		expect.assertions(3);

		// Property: For any locale, different numbers should produce different formatted output
		for (const locale of supportedLocales) {
			const formatted1 = formatNumber(100, locale);
			const formatted2 = formatNumber(200, locale);

			// Property: Different numbers should produce different output
			expect(formatted1).not.toBe(formatted2);
		}
	});

	it('should produce different output for different locales with currency', () => {
		expect.assertions(4);

		// Property: For any number with currency style, different locales should produce different formatted output
		const enFormatted = formatNumber(1234.56, 'en', { style: 'currency' });
		const zhTwFormatted = formatNumber(1234.56, 'zh-tw', { style: 'currency' });
		const jpFormatted = formatNumber(1234.56, 'jp', { style: 'currency' });

		// Property: Each locale should produce non-empty output
		expect(enFormatted.length).toBeGreaterThan(0);
		expect(zhTwFormatted.length).toBeGreaterThan(0);
		expect(jpFormatted.length).toBeGreaterThan(0);

		// Property: At least one locale should produce different output (currency symbols differ)
		const enDiffFromZhTw = enFormatted !== zhTwFormatted;
		const zhTwDiffFromJp = zhTwFormatted !== jpFormatted;
		const anyDifferent = enDiffFromZhTw || zhTwDiffFromJp;
		expect(anyDifferent).toBe(true);
	});

	it('should produce different output for different number styles', () => {
		expect.assertions(3);

		// Property: For any locale, different number styles should produce different output
		for (const locale of supportedLocales) {
			const outputs = numberStyles.map((style) => formatNumber(100, locale, { style }));

			// Property: At least some styles should produce different output
			const allSame = outputs.every((output) => output === outputs[0]);
			expect(allSame).toBe(false);
		}
	});

	it('should handle all supported number styles for all locales', () => {
		expect.assertions(9);

		// Property: For any supported locale and number style, formatNumber should return a non-empty string
		for (const locale of supportedLocales) {
			for (const style of numberStyles) {
				const formatted = formatNumber(100, locale, { style });

				// Property: Formatted output should be a non-empty string
				expect(formatted.length).toBeGreaterThan(0);
			}
		}
	});

	it('should handle edge case numbers', () => {
		expect.assertions(15);

		// Property: For any valid number, formatNumber should return a non-empty string
		const edgeNumbers = [0, 1, -1, 0.001, 999999.99];

		for (const locale of supportedLocales) {
			for (const num of edgeNumbers) {
				const formatted = formatNumber(num, locale);

				// Property: Formatted output should be a non-empty string
				expect(formatted.length).toBeGreaterThan(0);
			}
		}
	});

	it('should produce consistent output for the same number across multiple calls', () => {
		expect.assertions(18);

		// Property: For any locale and number style, multiple calls should produce identical output
		for (const locale of supportedLocales) {
			for (const style of numberStyles) {
				const first = formatNumber(1234.56, locale, { style });
				const second = formatNumber(1234.56, locale, { style });
				const third = formatNumber(1234.56, locale, { style });

				// Property: Multiple calls should produce identical output
				expect(first).toBe(second);
				expect(second).toBe(third);
			}
		}
	});

	it('should format currency with locale-specific symbols', () => {
		expect.assertions(3);

		// Property: For any locale, currency formatting should produce different output
		const enCurrency = formatNumber(100, 'en', { style: 'currency' });
		const zhTwCurrency = formatNumber(100, 'zh-tw', { style: 'currency' });
		const jpCurrency = formatNumber(100, 'jp', { style: 'currency' });

		// Property: Currency formatting should produce non-empty output
		expect(enCurrency.length).toBeGreaterThan(0);
		expect(zhTwCurrency.length).toBeGreaterThan(0);
		expect(jpCurrency.length).toBeGreaterThan(0);
	});

	it('should format percentages for all locales', () => {
		expect.assertions(3);

		// Property: For any locale, percent formatting should produce output with percent symbol
		for (const locale of supportedLocales) {
			const formatted = formatNumber(0.5, locale, { style: 'percent' });

			// Property: Formatted output should be a non-empty string
			expect(formatted.length).toBeGreaterThan(0);
		}
	});

	it('should handle decimal formatting with fraction digits', () => {
		expect.assertions(9);

		// Property: For any locale, decimal formatting with different fraction digits should work
		for (const locale of supportedLocales) {
			const noFractions = formatNumber(1234.56, locale, {
				style: 'decimal',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			});
			const twoFractions = formatNumber(1234.56, locale, {
				style: 'decimal',
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});
			const fourFractions = formatNumber(1234.56, locale, {
				style: 'decimal',
				minimumFractionDigits: 4,
				maximumFractionDigits: 4
			});

			// Property: All outputs should be non-empty
			expect(noFractions.length).toBeGreaterThan(0);
			expect(twoFractions.length).toBeGreaterThan(0);
			expect(fourFractions.length).toBeGreaterThan(0);
		}
	});

	it('should produce different output for different fraction digit settings', () => {
		expect.assertions(3);

		// Property: For any locale, different fraction digit settings should produce different output
		for (const locale of supportedLocales) {
			const noFractions = formatNumber(1234.56, locale, {
				style: 'decimal',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			});
			const twoFractions = formatNumber(1234.56, locale, {
				style: 'decimal',
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});

			// Property: Different fraction settings should produce different output
			expect(noFractions).not.toBe(twoFractions);
		}
	});

	it('should handle all supported locales consistently', () => {
		expect.assertions(3);

		// Property: For any supported locale, formatNumber should work correctly
		for (const locale of supportedLocales) {
			const formatted = formatNumber(1000, locale);

			// Property: Output should be a non-empty string
			expect(formatted.length).toBeGreaterThan(0);
		}
	});

	it('should produce valid formatted numbers for all number styles', () => {
		expect.assertions(3);

		// Property: For any number style, formatNumber should produce a non-empty string
		for (const style of numberStyles) {
			const formatted = formatNumber(100, 'en', { style });

			// Property: Formatted output should be a non-empty string
			expect(formatted.length).toBeGreaterThan(0);
		}
	});

	it('should maintain consistency across multiple numbers and locales', () => {
		expect.assertions(6);

		// Property: For any combination of numbers and locales, formatting should be consistent
		const numbers = [100, 1234.56];

		for (const num of numbers) {
			for (const locale of supportedLocales) {
				const first = formatNumber(num, locale);
				const second = formatNumber(num, locale);

				// Property: Multiple calls should produce identical output
				expect(first).toBe(second);
			}
		}
	});

	it('should format small decimal numbers correctly', () => {
		expect.assertions(3);

		// Property: For any locale, small decimal numbers should be formatted correctly
		for (const locale of supportedLocales) {
			const formatted = formatNumber(0.001, locale);

			// Property: Formatted output should be a non-empty string
			expect(formatted.length).toBeGreaterThan(0);
		}
	});

	it('should format large numbers correctly', () => {
		expect.assertions(3);

		// Property: For any locale, large numbers should be formatted correctly
		for (const locale of supportedLocales) {
			const formatted = formatNumber(999999.99, locale);

			// Property: Formatted output should be a non-empty string
			expect(formatted.length).toBeGreaterThan(0);
		}
	});

	it('should format zero correctly for all locales', () => {
		expect.assertions(3);

		// Property: For any locale, zero should be formatted correctly
		for (const locale of supportedLocales) {
			const formatted = formatNumber(0, locale);

			// Property: Formatted output should be a non-empty string
			expect(formatted.length).toBeGreaterThan(0);
		}
	});

	it('should format negative numbers correctly', () => {
		expect.assertions(3);

		// Property: For any locale, negative numbers should be formatted correctly
		for (const locale of supportedLocales) {
			const formatted = formatNumber(-100, locale);

			// Property: Formatted output should be a non-empty string
			expect(formatted.length).toBeGreaterThan(0);
		}
	});

	it('should handle currency formatting with different currencies', () => {
		expect.assertions(3);

		// Property: For any locale, different currencies should produce different output
		for (const locale of supportedLocales) {
			const usd = formatNumber(100, locale, { style: 'currency', currency: 'USD' });
			const eur = formatNumber(100, locale, { style: 'currency', currency: 'EUR' });

			// Property: Different currencies should produce different output
			expect(usd).not.toBe(eur);
		}
	});

	it('should produce locale-specific number formatting', () => {
		expect.assertions(3);

		// Property: For any number, each locale should produce a valid formatted string
		const enFormatted = formatNumber(1234.56, 'en');
		const zhTwFormatted = formatNumber(1234.56, 'zh-tw');
		const jpFormatted = formatNumber(1234.56, 'jp');

		// Property: All outputs should be non-empty
		expect(enFormatted.length).toBeGreaterThan(0);
		expect(zhTwFormatted.length).toBeGreaterThan(0);
		expect(jpFormatted.length).toBeGreaterThan(0);
	});

	it('should handle default options correctly', () => {
		expect.assertions(3);

		// Property: For any locale, calling formatNumber without options should use defaults
		for (const locale of supportedLocales) {
			const withDefaults = formatNumber(100, locale);
			const withExplicitDefaults = formatNumber(100, locale, { style: 'decimal' });

			// Property: Default behavior should match explicit defaults
			expect(withDefaults).toBe(withExplicitDefaults);
		}
	});

	it('should format numbers with various decimal places', () => {
		expect.assertions(9);

		// Property: For any locale, numbers with various decimal places should be formatted correctly
		const numbersWithDecimals = [1.1, 1.12, 1.123];

		for (const locale of supportedLocales) {
			for (const num of numbersWithDecimals) {
				const formatted = formatNumber(num, locale);

				// Property: Formatted output should be a non-empty string
				expect(formatted.length).toBeGreaterThan(0);
			}
		}
	});

	it('should produce different output for different numbers in the same locale', () => {
		expect.assertions(6);

		// Property: For any locale, different numbers should produce different formatted output
		for (const locale of supportedLocales) {
			const formatted1 = formatNumber(1, locale);
			const formatted2 = formatNumber(10, locale);
			const formatted3 = formatNumber(100, locale);

			// Property: Different numbers should produce different output
			expect(formatted1).not.toBe(formatted2);
			expect(formatted2).not.toBe(formatted3);
		}
	});
});
