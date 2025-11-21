# Svelte 5 Syntax Rules (MANDATORY)

**Version**: 1.1  
**Enforcement Level**: 🔴 MANDATORY  
**Applies To**: All `.svelte`, `.ts`, `.js` files

## Critical Rules

### ❌ FORBIDDEN Svelte 4 Syntax

These patterns are **COMPLETELY DEPRECATED** and must **NEVER** be used:

1. **NO `export let`** - Use `$props()` instead
2. **NO `<slot>`** - Use `{@render children()}` and Snippets instead
3. **NO `on:` directive** - Use standard HTML event attributes (e.g., `onclick`)
4. **NO `$:` reactive statements** - Use `$derived` or `$effect` instead
5. **NO `createEventDispatcher`** - Use callback props instead
6. **NO `writable` stores** - Use `.svelte.ts` classes with `$state` instead

## 1. Reactivity (Runes)

### State Management

```typescript
// ❌ WRONG (Svelte 4)
let count = 0;

// ✅ CORRECT (Svelte 5)
let count = $state(0);
```

### Derived State

```typescript
// ❌ WRONG (Svelte 4)
$: double = count * 2;

// ✅ CORRECT (Svelte 5)
let double = $derived(count * 2);
```

### Side Effects

```typescript
// ❌ WRONG (Svelte 4)
$: {
	console.log(count);
}

// ✅ CORRECT (Svelte 5)
$effect(() => {
	console.log(count);
});
```

### Props

```typescript
// ❌ WRONG (Svelte 4)
export let data;
export let count = 0;

// ✅ CORRECT (Svelte 5)
interface Props {
	data: string;
	count?: number;
}

let { data, count = 0 }: Props = $props();
```

### Bindable Props

```typescript
// ❌ WRONG (Svelte 4)
export let value;

// ✅ CORRECT (Svelte 5) - For two-way binding
interface Props {
	value?: string;
}

let { value = $bindable('') }: Props = $props();
```

**Critical**: If a prop needs to be bound with `bind:prop` from parent, it **MUST** use `$bindable()`.

## 2. Component Communication

### Slots → Snippets

```svelte
<!-- ❌ WRONG (Svelte 4) -->
<slot />
<slot name="header" />

<!-- ✅ CORRECT (Svelte 5) -->
{@render children?.()}
{@render header?.()}
```

### Defining Snippets in Parent

```svelte
<!-- ❌ WRONG (Svelte 4) -->
<Component>
	<div slot="header">Header</div>
</Component>

<!-- ✅ CORRECT (Svelte 5) -->
<Component>
	{#snippet header()}
		<div>Header</div>
	{/snippet}
</Component>
```

### Snippet Type Definitions

```typescript
import type { Snippet } from 'svelte';

interface Props {
	children?: Snippet; // No parameters
	header?: Snippet<[string]>; // With parameter
	footer?: Snippet<[{ close: () => void }]>; // With object parameter
}
```

### Rest Props

```typescript
// ❌ WRONG (Svelte 4)
$$props;
$$restProps;

// ✅ CORRECT (Svelte 5)
let { ...rest } = $props();
```

## 3. Event Handling

### DOM Events

```svelte
<!-- ❌ WRONG (Svelte 4) -->
<button on:click={handleClick}>Click</button>
<input on:input={handleInput} />

<!-- ✅ CORRECT (Svelte 5) -->
<button onclick={handleClick}>Click</button>
<input oninput={handleInput} />
```

### Event Modifiers

```svelte
<!-- ❌ WRONG (Svelte 4) -->
<button on:click|preventDefault={handleClick}>

<!-- ✅ CORRECT (Svelte 5) -->
<button onclick={(e) => {
    e.preventDefault();
    handleClick(e);
}}>
```

### Component Events

```typescript
// ❌ WRONG (Svelte 4)
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
dispatch('save', data);

// ✅ CORRECT (Svelte 5)
interface Props {
	onSave: (data: Data) => void;
}

let { onSave }: Props = $props();
onSave(data);
```

## 4. Lifecycle

### Cleanup

```typescript
// ❌ WRONG (Svelte 4)
import { onDestroy } from 'svelte';
onDestroy(() => {
	// cleanup
});

// ✅ CORRECT (Svelte 5)
$effect(() => {
	// setup

	return () => {
		// cleanup
	};
});
```

### Mount (Still Valid)

```typescript
// ✅ CORRECT (Both versions)
import { onMount } from 'svelte';

onMount(() => {
	// Non-reactive initialization
});

// ✅ ALSO CORRECT (Svelte 5)
$effect(() => {
	// Reactive initialization
});
```

## 5. Special Cases

### Class Prop

```typescript
// ✅ CORRECT - Rename 'class' since it's a reserved word
interface Props {
	class?: string;
}

let { class: className, ...rest }: Props = $props();
```

```svelte
<div class={className} {...rest}>
	<!-- content -->
</div>
```

### Debugging

```typescript
// ❌ WRONG (Less useful)
console.log(value);

// ✅ CORRECT (Svelte 5) - Tracks reactive dependencies
$inspect(value);
```

## 6. State Management

### Stores → Classes

```typescript
// ❌ WRONG (Svelte 4)
import { writable } from 'svelte/store';
export const count = writable(0);

// ✅ CORRECT (Svelte 5)
// In .svelte.ts file
export class CounterStore {
	count = $state(0);

	increment() {
		this.count++;
	}
}
```

## Standard Component Template

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	// 1. Props Interface
	interface Props {
		count: number;
		isOpen?: boolean;
		value?: string;
		children?: Snippet;
		header?: Snippet<[string]>;
		onToggle: (val: boolean) => void;
		class?: string;
		[key: string]: any;
	}

	// 2. Props Destructuring
	let {
		count,
		isOpen = false,
		value = $bindable(''), // For bind:value
		children,
		header,
		onToggle,
		class: className, // Rename reserved word
		...rest
	}: Props = $props();

	// 3. Reactive State
	let internalState = $state(false);

	// 4. Derived State
	let double = $derived(count * 2);

	// 5. Effects with Cleanup
	$effect(() => {
		console.log('Count updated:', count);
		$inspect(internalState); // Debug

		return () => {
			console.log('Cleanup');
		};
	});

	// 6. Event Handlers
	function handleClick(event: MouseEvent) {
		event.preventDefault(); // Manual modifier
		internalState = !internalState;
		onToggle(internalState);
	}
</script>

<div class={className} {...rest}>
	<button onclick={handleClick}>
		Double is {double}
	</button>

	<input bind:value placeholder="Bindable input" />

	<div class="content">
		{@render children?.()}
	</div>

	{#if header}
		<header>{@render header('Title Arg')}</header>
	{/if}
</div>
```

## Migration Checklist

When reviewing or writing Svelte code, verify:

- [ ] No `export let` - using `$props()` instead
- [ ] No `<slot>` - using `{@render}` and Snippets instead
- [ ] No `on:` directives - using standard event attributes instead
- [ ] No `$:` reactive statements - using `$derived` or `$effect` instead
- [ ] No `createEventDispatcher` - using callback props instead
- [ ] No `writable` stores - using `.svelte.ts` classes with `$state` instead
- [ ] All bindable props use `$bindable()`
- [ ] `class` prop is renamed to `className`
- [ ] Event modifiers are handled manually in functions
- [ ] Cleanup logic uses `$effect` return function

## Common Mistakes

### Mistake 1: Forgetting $bindable

```typescript
// ❌ WRONG - Parent cannot use bind:value
let { value = '' } = $props();

// ✅ CORRECT - Parent can use bind:value
let { value = $bindable('') } = $props();
```

### Mistake 2: Using on: with events

```svelte
<!-- ❌ WRONG -->
<button on:click={fn}>

<!-- ✅ CORRECT -->
<button onclick={fn}>
```

### Mistake 3: Using slot instead of render

```svelte
<!-- ❌ WRONG -->
<slot />

<!-- ✅ CORRECT -->
{@render children?.()}
```

### Mistake 4: Using $: for derived state

```typescript
// ❌ WRONG
$: double = count * 2;

// ✅ CORRECT
let double = $derived(count * 2);
```

### Mistake 5: Not renaming class prop

```typescript
// ❌ WRONG - Syntax error
let { class } = $props();

// ✅ CORRECT
let { class: className } = $props();
```

## Enforcement

All code must follow these rules. Any Svelte 4 syntax found in code review should be rejected and fixed immediately.

Use ESLint rules and TypeScript to enforce these patterns where possible.
