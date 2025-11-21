# i18n Usage Guide

This guide explains how to use Paraglide JS for internationalization in this SvelteKit application.

## Quick Start

### Using Messages in Components

Import the messages module and use message functions:

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';
</script>

<h1>{m.hello_world({ name: 'User' })}</h1>
<p>{m.loading()}</p>
```

### Switching Locales

Use the locale switcher utilities:

```typescript
import { getCurrentLocale, setLocale } from '$lib/core/i18n/locale-switcher';

// Get current locale
const locale = getCurrentLocale(); // 'en', 'zh-tw', or 'jp'

// Switch locale
setLocale('zh-tw');
```

## Adding New Messages

### 1. Define Message in All Locales

Add the message to all three locale files:

**messages/en.json**:
```json
{
	"my_new_message": "This is my new message",
	"greeting_with_name": "Hello, {name}!"
}
```

**messages/zh-tw.json**:
```json
{
	"my_new_message": "這是我的新訊息",
	"greeting_with_name": "你好，{name}！"
}
```

**messages/jp.json**:
```json
{
	"my_new_message": "これは私の新しいメッセージです",
	"greeting_with_name": "こんにちは、{name}！"
}
```

### 2. Use in Components

After adding the message, Paraglide will automatically generate TypeScript types:

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';
</script>

<p>{m.my_new_message()}</p>
<p>{m.greeting_with_name({ name: 'Alice' })}</p>
```

### 3. Message Parameters

Messages support different parameter types:

**String parameters**:
```json
{
	"welcome": "Welcome, {username}!"
}
```

**Number parameters**:
```json
{
	"item_count": "You have {count} items"
}
```

**Date parameters**:
```json
{
	"created_on": "Created on {date, date, short}"
}
```

## Pluralization

### English Pluralization

Use the `plural` syntax for singular/plural forms:

```json
{
	"todo_count": "You have {count} {count, plural, one {todo} other {todos}}"
}
```

Usage:
```svelte
<p>{m.todo_count({ count: 1 })}</p>  <!-- "You have 1 todo" -->
<p>{m.todo_count({ count: 5 })}</p>  <!-- "You have 5 todos" -->
```

### Chinese Pluralization

Chinese doesn't distinguish singular/plural, so use the same form:

```json
{
	"todo_count": "你有 {count} 個待辦事項"
}
```

### Japanese Pluralization

Japanese also doesn't distinguish singular/plural:

```json
{
	"todo_count": "{count}個のTODOがあります"
}
```

## Date and Number Formatting

### Date Formatting

```typescript
import { formatDate } from '$lib/core/i18n/formatters';
import { getCurrentLocale } from '$lib/core/i18n/locale-switcher';

const date = new Date();
const locale = getCurrentLocale();

// Short format
const short = formatDate(date, locale, { style: 'short' });
// en: "1/15/24"
// zh-tw: "2024/1/15"
// jp: "2024/01/15"

// Long format with time
const long = formatDate(date, locale, { style: 'long', includeTime: true });
// en: "January 15, 2024 at 3:30 PM"
// zh-tw: "2024年1月15日 下午3:30"
// jp: "2024年1月15日 15:30"
```

### Number Formatting

```typescript
import { formatNumber } from '$lib/core/i18n/formatters';
import { getCurrentLocale } from '$lib/core/i18n/locale-switcher';

const amount = 1234.56;
const locale = getCurrentLocale();

// Currency
const currency = formatNumber(amount, locale, {
	style: 'currency',
	currency: 'USD'
});
// en: "$1,234.56"
// zh-tw: "US$1,234.56"
// jp: "$1,234.56"

// Percentage
const percent = formatNumber(0.1234, locale, { style: 'percent' });
// All locales: "12.34%"
```

### Relative Time Formatting

```typescript
import { formatRelativeTime } from '$lib/core/i18n/formatters';
import { getCurrentLocale } from '$lib/core/i18n/locale-switcher';

const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
const locale = getCurrentLocale();

const relative = formatRelativeTime(pastDate, locale);
// en: "2 days ago"
// zh-tw: "2 天前"
// jp: "2 日前"
```

## Adding New Locales

### 1. Create Message File

Create a new message file in the `messages/` directory:

```
messages/
├── en.json
├── zh-tw.json
├── jp.json
└── fr.json  <!-- New locale -->
```

### 2. Update Paraglide Configuration

Edit `project.inlang/settings.json`:

```json
{
	"baseLocale": "en",
	"locales": ["en", "zh-tw", "jp", "fr"]
}
```

### 3. Update Locale Switcher

Edit `src/lib/core/i18n/locale-switcher.ts`:

```typescript
export const availableLocales: LocaleInfo[] = [
	{ code: 'en', name: 'English', nativeName: 'English' },
	{ code: 'zh-tw', name: 'Traditional Chinese', nativeName: '繁體中文' },
	{ code: 'jp', name: 'Japanese', nativeName: '日本語' },
	{ code: 'fr', name: 'French', nativeName: 'Français' }
];
```

### 4. Translate All Messages

Ensure all messages in the new locale file match the keys in the base locale.

## Locale Persistence

The application automatically persists locale preferences to localStorage:

```typescript
import { setLocale } from '$lib/core/i18n/locale-switcher';

// When user selects a locale
setLocale('zh-tw');

// On next visit, the locale is automatically restored
// If no preference exists, browser locale is detected
```

## Browser Locale Detection

The application automatically detects the user's browser locale on first visit:

```typescript
import { detectBrowserLocale } from '$lib/core/i18n/locale-switcher';

const browserLocale = detectBrowserLocale();
// Returns 'en', 'zh-tw', 'jp', or 'en' (fallback)
```

## Missing Translations

If a translation is missing:

1. **Development mode**: A warning is logged to the console
2. **Fallback**: The English (base locale) message is used
3. **Last resort**: The message key is displayed

To check for missing translations, run:

```bash
npm run build
```

The build will report any missing keys.

## Best Practices

### 1. Keep Messages Organized

Group related messages together in the JSON files:

```json
{
	"common_save": "Save",
	"common_cancel": "Cancel",
	"common_delete": "Delete",
	"todo_add": "Add Todo",
	"todo_edit": "Edit Todo",
	"todo_delete": "Delete Todo"
}
```

### 2. Use Descriptive Keys

Choose clear, descriptive message keys:

```json
{
	"button_save": "Save",        // ✅ Good
	"btn_s": "Save",              // ❌ Bad
	"save": "Save"                // ⚠️ Ambiguous
}
```

### 3. Provide Context for Translators

Add comments in message files to help translators:

```json
{
	"greeting": "Hello, {name}!",
	"greeting_comment": "Used in welcome screen, {name} is the user's first name"
}
```

### 4. Test All Locales

Always test your changes in all supported locales:

```bash
npm run dev
# Switch locale in UI and verify all messages display correctly
```

### 5. Use Type Safety

Leverage TypeScript's type checking for message parameters:

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';

	// TypeScript will error if parameters are missing or wrong type
	const greeting = m.greeting_with_name({ name: 'Alice' });
	// const bad = m.greeting_with_name({ age: 25 }); // ❌ Error
</script>
```

## Troubleshooting

### Message Not Found

If you see a message key instead of translated text:

1. Check that the key exists in all locale files
2. Verify the key name matches exactly (case-sensitive)
3. Run `npm run build` to regenerate types
4. Restart the dev server

### Type Errors

If TypeScript complains about message parameters:

1. Verify the message definition includes the parameter
2. Check parameter type matches (string, number, etc.)
3. Run `npm run check` to see all type errors

### Locale Not Switching

If the UI doesn't update when switching locales:

1. Verify `setLocale()` is being called
2. Check that components are using `$state` for reactive updates
3. Ensure `$effect` is syncing locale changes
4. Check browser console for errors

## Resources

- [Paraglide JS Documentation](https://inlang.com/documentation/paraglide-js)
- [Message Format Syntax](https://inlang.com/documentation/message-format)
- [Pluralization Rules](https://inlang.com/documentation/pluralization)
