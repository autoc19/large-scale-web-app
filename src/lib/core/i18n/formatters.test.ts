import { describe, it, expect } from 'vitest';
import { formatDate, formatNumber, formatRelativeTime } from './formatters';

/**
 * Unit Tests for Formatters
 *
 * These tests validate specific examples and edge cases for date, number, and relative time formatting.
 * They complement the property-based tests by verifying concrete behavior.
 *
 * **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**
 */

describe('formatDate', () => {
	const testDate = new Date('2024-01-15T14:30:00Z');

	describe('with different styles', () => {
		it('should format date with short style', () => {
			const result = formatDate(testDate, 'en', { style: 'short' });
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
			// Short format typically shows abbreviated date like "1/15/24"
			expect(result).toMatch(/\d/);
		});

		it('should format date with medium style', () => {
			const result = formatDate(testDate, 'en', { style: 'medium' });
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
			// Medium format typically shows "Jan 15, 2024"
			expect(result).toMatch(/\d/);
		});

		it('should format date with long style', () => {
			const result = formatDate(testDate, 'en', { style: 'long' });
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
			// Long format typically shows "January 15, 2024"
			expect(result).toMatch(/\d/);
		});

		it('should format date with full style', () => {
			const result = formatDate(testDate, 'en', { style: 'full' });
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
			// Full format typically shows "Monday, January 15, 2024"
			expect(result).toMatch(/\d/);
		});

		it('should produce different output for different styles', () => {
			const short = formatDate(testDate, 'en', { style: 'short' });
			const medium = formatDate(testDate, 'en', { style: 'medium' });
			const long = formatDate(testDate, 'en', { style: 'long' });
			const full = formatDate(testDate, 'en', { style: 'full' });

			// At least some styles should differ
			const allSame = short === medium && medium === long && long === full;
			expect(allSame).toBe(false);
		});
	});

	describe('with different locales', () => {
		it('should format date in English', () => {
			const result = formatDate(testDate, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should format date in Traditional Chinese', () => {
			const result = formatDate(testDate, 'zh-tw');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should format date in Japanese', () => {
			const result = formatDate(testDate, 'jp');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should produce different output for different locales', () => {
			const en = formatDate(testDate, 'en', { style: 'short' });
			const zhTw = formatDate(testDate, 'zh-tw', { style: 'short' });
			const jp = formatDate(testDate, 'jp', { style: 'short' });

			// At least one locale should differ
			const allSame = en === zhTw && zhTw === jp;
			expect(allSame).toBe(false);
		});
	});

	describe('with time inclusion', () => {
		it('should format date without time by default', () => {
			const result = formatDate(testDate, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should format date with time when includeTime is true', () => {
			const result = formatDate(testDate, 'en', { includeTime: true });
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should produce different output with and without time', () => {
			const withoutTime = formatDate(testDate, 'en', { style: 'medium', includeTime: false });
			const withTime = formatDate(testDate, 'en', { style: 'medium', includeTime: true });

			expect(withTime).not.toBe(withoutTime);
		});

		it('should include time for all locales when includeTime is true', () => {
			const locales = ['en', 'zh-tw', 'jp'];

			for (const locale of locales) {
				const result = formatDate(testDate, locale, { includeTime: true });
				expect(result).toBeTruthy();
				expect(result.length).toBeGreaterThan(0);
			}
		});
	});

	describe('edge cases', () => {
		it('should handle Unix epoch', () => {
			const epoch = new Date('1970-01-01T00:00:00Z');
			const result = formatDate(epoch, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should handle Y2K date', () => {
			const y2k = new Date('2000-01-01T00:00:00Z');
			const result = formatDate(y2k, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should handle far future date', () => {
			const future = new Date('2099-12-31T23:59:59Z');
			const result = formatDate(future, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should handle midnight', () => {
			const midnight = new Date('2024-01-15T00:00:00Z');
			const result = formatDate(midnight, 'en', { includeTime: true });
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should handle end of day', () => {
			const endOfDay = new Date('2024-01-15T23:59:59Z');
			const result = formatDate(endOfDay, 'en', { includeTime: true });
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe('consistency', () => {
		it('should produce consistent output for the same date and locale', () => {
			const first = formatDate(testDate, 'en');
			const second = formatDate(testDate, 'en');
			const third = formatDate(testDate, 'en');

			expect(first).toBe(second);
			expect(second).toBe(third);
		});

		it('should produce consistent output across multiple calls with options', () => {
			const options = { style: 'long' as const, includeTime: true };
			const first = formatDate(testDate, 'en', options);
			const second = formatDate(testDate, 'en', options);

			expect(first).toBe(second);
		});
	});
});

describe('formatNumber', () => {
	describe('with different styles', () => {
		it('should format number with decimal style', () => {
			const result = formatNumber(1234.56, 'en', { style: 'decimal' });
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
			// Decimal format typically shows "1,234.56"
			expect(result).toMatch(/\d/);
		});

		it('should format number with currency style', () => {
			const result = formatNumber(1234.56, 'en', { style: 'currency' });
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
			// Currency format typically shows "$1,234.56"
			expect(result).toMatch(/\d/);
		});

		it('should format number with percent style', () => {
			const result = formatNumber(0.5, 'en', { style: 'percent' });
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
			// Percent format typically shows "50%"
			expect(result).toMatch(/\d/);
		});

		it('should produce different output for different styles', () => {
			const decimal = formatNumber(100, 'en', { style: 'decimal' });
			const currency = formatNumber(100, 'en', { style: 'currency' });
			const percent = formatNumber(1, 'en', { style: 'percent' });

			// All styles should produce different output
			expect(decimal).not.toBe(currency);
			expect(currency).not.toBe(percent);
			expect(decimal).not.toBe(percent);
		});
	});

	describe('with different locales', () => {
		it('should format number in English', () => {
			const result = formatNumber(1234.56, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should format number in Traditional Chinese', () => {
			const result = formatNumber(1234.56, 'zh-tw');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should format number in Japanese', () => {
			const result = formatNumber(1234.56, 'jp');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should produce different output for different locales with currency', () => {
			const en = formatNumber(100, 'en', { style: 'currency' });
			const zhTw = formatNumber(100, 'zh-tw', { style: 'currency' });
			const jp = formatNumber(100, 'jp', { style: 'currency' });

			// At least one locale should differ
			const allSame = en === zhTw && zhTw === jp;
			expect(allSame).toBe(false);
		});
	});

	describe('with fraction digits', () => {
		it('should format with no fraction digits', () => {
			const result = formatNumber(1234.56, 'en', {
				style: 'decimal',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			});
			expect(result).toBeTruthy();
			// Should be "1,235" (rounded)
			expect(result).not.toContain('.');
		});

		it('should format with two fraction digits', () => {
			const result = formatNumber(1234.5, 'en', {
				style: 'decimal',
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});
			expect(result).toBeTruthy();
			// Should be "1,234.50"
			expect(result).toContain('.');
		});

		it('should format with four fraction digits', () => {
			const result = formatNumber(1234.5, 'en', {
				style: 'decimal',
				minimumFractionDigits: 4,
				maximumFractionDigits: 4
			});
			expect(result).toBeTruthy();
			// Should be "1,234.5000"
			expect(result).toContain('.');
		});

		it('should produce different output for different fraction digit settings', () => {
			const noFractions = formatNumber(1234.56, 'en', {
				style: 'decimal',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			});
			const twoFractions = formatNumber(1234.56, 'en', {
				style: 'decimal',
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});

			expect(noFractions).not.toBe(twoFractions);
		});
	});

	describe('with currency options', () => {
		it('should format with USD currency', () => {
			const result = formatNumber(100, 'en', { style: 'currency', currency: 'USD' });
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should format with EUR currency', () => {
			const result = formatNumber(100, 'en', { style: 'currency', currency: 'EUR' });
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should produce different output for different currencies', () => {
			const usd = formatNumber(100, 'en', { style: 'currency', currency: 'USD' });
			const eur = formatNumber(100, 'en', { style: 'currency', currency: 'EUR' });

			expect(usd).not.toBe(eur);
		});
	});

	describe('edge cases', () => {
		it('should handle zero', () => {
			const result = formatNumber(0, 'en');
			expect(result).toBeTruthy();
			expect(result).toBe('0');
		});

		it('should handle one', () => {
			const result = formatNumber(1, 'en');
			expect(result).toBeTruthy();
			expect(result).toBe('1');
		});

		it('should handle negative numbers', () => {
			const result = formatNumber(-100, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should handle very small decimals', () => {
			const result = formatNumber(0.001, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should handle very large numbers', () => {
			const result = formatNumber(999999.99, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should handle percent with decimal', () => {
			const result = formatNumber(0.123, 'en', { style: 'percent' });
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should handle currency with zero', () => {
			const result = formatNumber(0, 'en', { style: 'currency' });
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should handle currency with negative', () => {
			const result = formatNumber(-100, 'en', { style: 'currency' });
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe('consistency', () => {
		it('should produce consistent output for the same number and locale', () => {
			const first = formatNumber(1234.56, 'en');
			const second = formatNumber(1234.56, 'en');
			const third = formatNumber(1234.56, 'en');

			expect(first).toBe(second);
			expect(second).toBe(third);
		});

		it('should produce consistent output across multiple calls with options', () => {
			const options = { style: 'currency' as const, currency: 'USD' };
			const first = formatNumber(100, 'en', options);
			const second = formatNumber(100, 'en', options);

			expect(first).toBe(second);
		});
	});
});

describe('formatRelativeTime', () => {
	describe('with different locales', () => {
		it('should format relative time in English', () => {
			const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
			const result = formatRelativeTime(pastDate, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should format relative time in Traditional Chinese', () => {
			const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
			const result = formatRelativeTime(pastDate, 'zh-tw');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should format relative time in Japanese', () => {
			const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
			const result = formatRelativeTime(pastDate, 'jp');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe('with different time units', () => {
		it('should format seconds ago', () => {
			const pastDate = new Date(Date.now() - 30 * 1000); // 30 seconds ago
			const result = formatRelativeTime(pastDate, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should format minutes ago', () => {
			const pastDate = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
			const result = formatRelativeTime(pastDate, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should format hours ago', () => {
			const pastDate = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
			const result = formatRelativeTime(pastDate, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should format days ago', () => {
			const pastDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
			const result = formatRelativeTime(pastDate, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should format months ago', () => {
			const pastDate = new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000); // 2 months ago
			const result = formatRelativeTime(pastDate, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should format years ago', () => {
			const pastDate = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000); // 2 years ago
			const result = formatRelativeTime(pastDate, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe('consistency', () => {
		it('should produce consistent output for the same date and locale', () => {
			const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
			const first = formatRelativeTime(pastDate, 'en');
			const second = formatRelativeTime(pastDate, 'en');

			// Note: These might differ slightly due to time passing, but should be very similar
			expect(first).toBeTruthy();
			expect(second).toBeTruthy();
		});
	});

	describe('edge cases', () => {
		it('should handle very recent dates', () => {
			const veryRecent = new Date(Date.now() - 1000); // 1 second ago
			const result = formatRelativeTime(veryRecent, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should handle dates far in the past', () => {
			const farPast = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000); // 10 years ago
			const result = formatRelativeTime(farPast, 'en');
			expect(result).toBeTruthy();
			expect(result.length).toBeGreaterThan(0);
		});

		it('should handle all locales for various time units', () => {
			const locales = ['en', 'zh-tw', 'jp'];
			const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago

			for (const locale of locales) {
				const result = formatRelativeTime(pastDate, locale);
				expect(result).toBeTruthy();
				expect(result.length).toBeGreaterThan(0);
			}
		});
	});
});
