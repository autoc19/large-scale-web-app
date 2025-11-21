export interface DateFormatOptions {
	style?: 'short' | 'medium' | 'long' | 'full';
	includeTime?: boolean;
}

export interface NumberFormatOptions {
	style?: 'decimal' | 'currency' | 'percent';
	currency?: string;
	minimumFractionDigits?: number;
	maximumFractionDigits?: number;
}

export function formatDate(date: Date, locale: string, options?: DateFormatOptions): string {
	const { style = 'medium', includeTime = false } = options || {};

	const dateStyle = style;
	const timeStyle = includeTime ? style : undefined;

	try {
		return new Intl.DateTimeFormat(locale, {
			dateStyle,
			timeStyle
		}).format(date);
	} catch (err) {
		console.error('Date formatting error:', err);
		return date.toISOString();
	}
}

export function formatNumber(
	value: number,
	locale: string,
	options?: NumberFormatOptions
): string {
	const {
		style = 'decimal',
		currency = 'USD',
		minimumFractionDigits,
		maximumFractionDigits
	} = options || {};

	try {
		const formatOptions: Intl.NumberFormatOptions = {
			style,
			minimumFractionDigits,
			maximumFractionDigits
		};

		if (style === 'currency') {
			formatOptions.currency = currency;
		}

		return new Intl.NumberFormat(locale, formatOptions).format(value);
	} catch (err) {
		console.error('Number formatting error:', err);
		return value.toString();
	}
}

export function formatRelativeTime(date: Date, locale: string): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffSec = Math.floor(diffMs / 1000);
	const diffMin = Math.floor(diffSec / 60);
	const diffHour = Math.floor(diffMin / 60);
	const diffDay = Math.floor(diffHour / 24);
	const diffMonth = Math.floor(diffDay / 30);
	const diffYear = Math.floor(diffDay / 365);

	try {
		const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

		if (diffYear > 0) {
			return rtf.format(-diffYear, 'year');
		} else if (diffMonth > 0) {
			return rtf.format(-diffMonth, 'month');
		} else if (diffDay > 0) {
			return rtf.format(-diffDay, 'day');
		} else if (diffHour > 0) {
			return rtf.format(-diffHour, 'hour');
		} else if (diffMin > 0) {
			return rtf.format(-diffMin, 'minute');
		} else {
			return rtf.format(-diffSec, 'second');
		}
	} catch (err) {
		console.error('Relative time formatting error:', err);
		return date.toISOString();
	}
}
