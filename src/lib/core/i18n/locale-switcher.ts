import { getLocale, setLocale as paraglideSetLocale, locales } from '$lib/paraglide/runtime';

export interface LocaleInfo {
	code: string;
	name: string;
	nativeName: string;
}

export const availableLocales: LocaleInfo[] = [
	{ code: 'en', name: 'English', nativeName: 'English' },
	{ code: 'zh-tw', name: 'Traditional Chinese', nativeName: '繁體中文' },
	{ code: 'jp', name: 'Japanese', nativeName: '日本語' }
];

const LOCALE_STORAGE_KEY = 'preferred-locale';

export function getCurrentLocale(): string {
	return getLocale();
}

export function setLocale(locale: string): void {
	if (!locales.includes(locale as any)) {
		console.error(`Invalid locale: ${locale}`);
		return;
	}
	
	paraglideSetLocale(locale as any, { reload: false });
	
	// Persist to localStorage
	if (typeof window !== 'undefined') {
		localStorage.setItem(LOCALE_STORAGE_KEY, locale);
		document.documentElement.lang = locale;
	}
}

export function detectBrowserLocale(): string {
	if (typeof window === 'undefined') {
		return 'en';
	}

	// Check localStorage first
	const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
	if (stored && locales.includes(stored as any)) {
		return stored;
	}

	// Detect from browser
	const browserLang = navigator.language.toLowerCase();
	
	// Try exact match
	if (locales.includes(browserLang as any)) {
		return browserLang;
	}

	// Try language code only (e.g., 'zh' from 'zh-CN')
	const langCode = browserLang.split('-')[0];
	const match = locales.find((tag) => tag.startsWith(langCode));
	
	return match || 'en';
}

export function initializeLocale(): void {
	const locale = detectBrowserLocale();
	setLocale(locale);
}
