# Component i18n Documentation

This guide explains how to use internationalization in Svelte components and provides examples for common patterns.

## Table of Contents

1. [Basic Message Usage](#basic-message-usage)
2. [Messages with Parameters](#messages-with-parameters)
3. [Pluralization in Components](#pluralization-in-components)
4. [Date and Number Formatting](#date-and-number-formatting)
5. [Locale-Aware Components](#locale-aware-components)
6. [Common Patterns](#common-patterns)
7. [Storybook Examples](#storybook-examples)

## Basic Message Usage

### Simple Messages

Import the messages module and use message functions:

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';
</script>

<button>{m.save()}</button>
<button>{m.cancel()}</button>
<button>{m.delete()}</button>
```

### Messages in Attributes

Use messages in HTML attributes:

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';
</script>

<button title={m.save()}>{m.save()}</button>
<input placeholder={m.todo_title()} />
<img alt={m.loading()} src="spinner.svg" />
```

### Conditional Messages

Use messages in conditional rendering:

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';

	let isLoading = $state(false);
</script>

{#if isLoading}
	<p>{m.loading()}</p>
{:else}
	<p>{m.success()}</p>
{/if}
```

## Messages with Parameters

### String Parameters

Pass string parameters to messages:

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';

	let userName = $state('Alice');
</script>

<h1>{m.hello_world({ name: userName })}</h1>
```

### Number Parameters

Pass number parameters for counts:

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';

	let todoCount = $state(5);
</script>

<p>{m.todo_count({ count: todoCount })}</p>
```

### Date Parameters

Pass dates for date formatting:

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';

	let createdDate = $state(new Date());
</script>

<p>{m.created_at({ date: createdDate })}</p>
```

### Multiple Parameters

Messages can have multiple parameters:

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';

	let userName = $state('Bob');
	let itemCount = $state(3);
</script>

<p>{m.user_has_items({ name: userName, count: itemCount })}</p>
```

## Pluralization in Components

### Singular/Plural Forms

Messages automatically handle pluralization:

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';

	let count = $state(1);
</script>

<!-- Displays "You have 1 todo" -->
<p>{m.todo_count({ count: 1 })}</p>

<!-- Displays "You have 5 todos" -->
<p>{m.todo_count({ count: 5 })}</p>

<!-- Displays "You have 0 todos" -->
<p>{m.todo_count({ count: 0 })}</p>
```

### Dynamic Pluralization

Update pluralization based on state:

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';

	let todos = $state<TodoItem[]>([]);

	let completedCount = $derived(todos.filter(t => t.completed).length);
</script>

<p>{m.completed_count({ count: completedCount })}</p>
```

## Date and Number Formatting

### Date Formatting

Use the date formatter for locale-aware date display:

```svelte
<script lang="ts">
	import { formatDate } from '$lib/core/i18n/formatters';
	import { getCurrentLocale } from '$lib/core/i18n/locale-switcher';

	let date = $state(new Date());
	let locale = $state(getCurrentLocale());
</script>

<!-- Short format: "1/15/24" (en), "2024/1/15" (zh-tw), "2024/01/15" (jp) -->
<p>{formatDate(date, locale, { style: 'short' })}</p>

<!-- Long format: "January 15, 2024" (en), "2024年1月15日" (zh-tw) -->
<p>{formatDate(date, locale, { style: 'long' })}</p>

<!-- With time: "January 15, 2024 at 3:30 PM" (en) -->
<p>{formatDate(date, locale, { style: 'long', includeTime: true })}</p>
```

### Number Formatting

Use the number formatter for locale-aware number display:

```svelte
<script lang="ts">
	import { formatNumber } from '$lib/core/i18n/formatters';
	import { getCurrentLocale } from '$lib/core/i18n/locale-switcher';

	let amount = $state(1234.56);
	let locale = $state(getCurrentLocale());
</script>

<!-- Decimal: "1,234.56" (en), "1.234,56" (de) -->
<p>{formatNumber(amount, locale, { style: 'decimal' })}</p>

<!-- Currency: "$1,234.56" (en), "¥1,234.56" (jp) -->
<p>{formatNumber(amount, locale, { style: 'currency', currency: 'USD' })}</p>

<!-- Percentage: "12.34%" -->
<p>{formatNumber(0.1234, locale, { style: 'percent' })}</p>
```

### Relative Time Formatting

Use the relative time formatter for "X days ago" style messages:

```svelte
<script lang="ts">
	import { formatRelativeTime } from '$lib/core/i18n/formatters';
	import { getCurrentLocale } from '$lib/core/i18n/locale-switcher';

	let pastDate = $state(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000));
	let locale = $state(getCurrentLocale());
</script>

<!-- "2 days ago" (en), "2 天前" (zh-tw), "2 日前" (jp) -->
<p>{formatRelativeTime(pastDate, locale)}</p>
```

## Locale-Aware Components

### Responding to Locale Changes

Components should update when the locale changes:

```svelte
<script lang="ts">
	import { getCurrentLocale } from '$lib/core/i18n/locale-switcher';
	import { formatDate } from '$lib/core/i18n/formatters';

	let locale = $state(getCurrentLocale());
	let date = $state(new Date());

	// Update locale when it changes
	$effect(() => {
		locale = getCurrentLocale();
	});
</script>

<p>{formatDate(date, locale, { style: 'long' })}</p>
```

### Locale-Specific Styling

Apply different styles based on locale:

```svelte
<script lang="ts">
	import { getCurrentLocale } from '$lib/core/i18n/locale-switcher';

	let locale = $state(getCurrentLocale());

	$effect(() => {
		locale = getCurrentLocale();
	});

	let isRTL = $derived(locale === 'ar'); // Example for RTL languages
</script>

<div class:rtl={isRTL}>
	<!-- Content -->
</div>

<style>
	:global(.rtl) {
		direction: rtl;
		text-align: right;
	}
</style>
```

## Common Patterns

### Form Labels and Placeholders

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';

	let title = $state('');
</script>

<label for="title">{m.todo_title()}</label>
<input
	id="title"
	bind:value={title}
	placeholder={m.todo_title()}
	type="text"
/>
```

### Button Groups

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';
	import Button from '$ui/primitives/Button.svelte';

	function handleSave() {
		// Save logic
	}

	function handleCancel() {
		// Cancel logic
	}
</script>

<div class="flex gap-2">
	<Button onclick={handleSave}>{m.save()}</Button>
	<Button onclick={handleCancel}>{m.cancel()}</Button>
</div>
```

### Error Messages

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';

	let error = $state<string | null>(null);
</script>

{#if error}
	<div class="rounded border border-red-200 bg-red-50 p-3 text-red-700">
		{error}
	</div>
{/if}
```

### Loading States

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';

	let isLoading = $state(false);
</script>

{#if isLoading}
	<div class="flex items-center gap-2">
		<div class="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
		<span>{m.loading()}</span>
	</div>
{/if}
```

### List Items with Counts

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';

	let todos = $state<TodoItem[]>([]);

	let completedCount = $derived(todos.filter(t => t.completed).length);
	let pendingCount = $derived(todos.filter(t => !t.completed).length);
</script>

<div class="space-y-2">
	<p>{m.completed_count({ count: completedCount })}</p>
	<p>{m.pending_count({ count: pendingCount })}</p>
	<p>{m.todo_count({ count: todos.length })}</p>
</div>
```

## Storybook Examples

### LocaleSwitcher Component

The LocaleSwitcher component allows users to change the application language:

```svelte
<script lang="ts">
	import LocaleSwitcher from '$ui/primitives/LocaleSwitcher.svelte';
</script>

<!-- Default -->
<LocaleSwitcher />

<!-- With custom styling -->
<LocaleSwitcher class="w-full max-w-xs" />

<!-- In navigation -->
<nav class="flex items-center justify-between p-4">
	<div>My App</div>
	<LocaleSwitcher />
</nav>
```

### Todo Component with i18n

Example of a todo component using i18n:

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';
	import Button from '$ui/primitives/Button.svelte';

	interface Props {
		title: string;
		completed: boolean;
		onToggle: () => void;
		onDelete: () => void;
	}

	let { title, completed, onToggle, onDelete }: Props = $props();
</script>

<div class="flex items-center justify-between rounded border p-3">
	<span class:line-through={completed}>{title}</span>
	<div class="flex gap-2">
		<Button onclick={onToggle}>
			{completed ? m.mark_incomplete() : m.mark_complete()}
		</Button>
		<Button onclick={onDelete}>{m.delete_todo()}</Button>
	</div>
</div>

<style>
	.line-through {
		text-decoration: line-through;
		opacity: 0.6;
	}
</style>
```

### Form Component with i18n

Example of a form component using i18n:

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';
	import Button from '$ui/primitives/Button.svelte';

	let title = $state('');
	let error = $state<string | null>(null);

	function handleSubmit() {
		if (!title.trim()) {
			error = m.title_required();
			return;
		}

		if (title.length < 2) {
			error = m.title_too_short();
			return;
		}

		if (title.length > 100) {
			error = m.title_too_long();
			return;
		}

		// Submit form
		error = null;
	}
</script>

<form onsubmit={handleSubmit}>
	<div class="space-y-2">
		<label for="title">{m.todo_title()}</label>
		<input
			id="title"
			bind:value={title}
			placeholder={m.todo_title()}
			type="text"
		/>
		{#if error}
			<p class="text-sm text-red-500">{error}</p>
		{/if}
	</div>

	<div class="mt-4 flex gap-2">
		<Button type="submit">{m.add_todo()}</Button>
		<Button type="button" onclick={() => (title = '')}>{m.cancel()}</Button>
	</div>
</form>
```

## Best Practices

### 1. Import Messages at Component Level

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';
</script>
```

### 2. Use Type-Safe Message Functions

TypeScript will catch missing or incorrect parameters:

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';

	// ✅ Correct
	const greeting = m.hello_world({ name: 'Alice' });

	// ❌ Error: missing required parameter
	// const bad = m.hello_world();
</script>
```

### 3. Keep Messages in Components

Don't pass messages as props:

```svelte
<!-- ❌ Bad: passing message as prop -->
<Button label={m.save()} />

<!-- ✅ Good: use message in component -->
<Button>{m.save()}</Button>
```

### 4. Use Derived State for Computed Messages

```svelte
<script lang="ts">
	import * as m from '$paraglide/messages';

	let count = $state(5);

	// ✅ Good: derived state updates automatically
	let message = $derived(m.todo_count({ count }));
</script>

<p>{message}</p>
```

### 5. Test All Locales

Always test components in all supported locales:

```bash
npm run dev
# Switch locale in UI and verify all messages display correctly
```

## Troubleshooting

### Message Not Displaying

1. Check that the message key exists in all locale files
2. Verify the key name matches exactly (case-sensitive)
3. Run `npm run build` to regenerate types
4. Restart the dev server

### Type Errors

1. Verify the message definition includes required parameters
2. Check parameter types match (string, number, etc.)
3. Run `npm run check` to see all type errors

### Locale Not Updating

1. Verify components are using `$state` for reactive updates
2. Check that `$effect` is syncing locale changes
3. Ensure `getCurrentLocale()` is called in `$effect`

## Resources

- [Paraglide JS Documentation](https://inlang.com/documentation/paraglide-js)
- [Message Format Syntax](https://inlang.com/documentation/message-format)
- [Svelte 5 Runes](https://svelte.dev/docs/runes)
- [Storybook Documentation](https://storybook.js.org/docs)
