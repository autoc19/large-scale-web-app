# Coding Standards

## TypeScript Standards

### Type Safety

- **Strict mode enabled**: All TypeScript strict checks are on
- **No `any` type**: Use `unknown` if type is truly unknown, then narrow it
- **Explicit return types**: Always specify return types for functions
- **Interface over type**: Prefer `interface` for object shapes
- **Const assertions**: Use `as const` for literal types

### Naming Conventions

- **Interfaces**: PascalCase, descriptive names (e.g., `TodoItem`, `UserProfile`)
- **DTOs**: PascalCase with `Dto` suffix (e.g., `CreateTodoDto`)
- **Types**: PascalCase (e.g., `TodoStatus`, `ApiResponse<T>`)
- **Enums**: PascalCase for enum, UPPER_CASE for values
- **Functions**: camelCase, verb-based (e.g., `loadTodos`, `validateInput`)
- **Variables**: camelCase (e.g., `todoItems`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`, `API_TIMEOUT`)
- **Private fields**: Prefix with underscore (e.g., `private _cache`)

## Svelte 5 Standards

### Runes Usage

**Always use Runes in .svelte.ts files**:

- `$state`: For reactive state
- `$derived`: For computed values (replaces `$:`)
- `$effect`: For side effects (replaces `$:` statements)
- `$props`: For component props (replaces `export let`)
- `$bindable`: For two-way binding props

**Example Service**:

```typescript
export class TodoService {
	items = $state<TodoItem[]>([]);
	loading = $state(false);

	get completedCount() {
		return this.items.filter((t) => t.completed).length;
	}
}
```

**Example Component**:

```svelte
<script lang="ts">
	interface Props {
		title: string;
		count?: number;
	}

	let { title, count = 0 }: Props = $props();
</script>
```

### Component Standards

- **Props**: Always define Props interface, use `$props()`
- **Snippets over Slots**: Use `Snippet` type for content projection (NO `<slot>`)
- **Event handlers**: Use `onclick` not `on:click` (Svelte 5) - NO `on:` directive
- **Event modifiers**: Handle manually in function (NO `|preventDefault` syntax)
- **Bindable props**: Use `$bindable()` for two-way binding
- **Class prop**: Rename to `className` (reserved word)
- **Class directives**: Use `class:active={isActive}` syntax
- **Each blocks**: Always provide key `{#each items as item (item.id)}`

### Snippet Pattern (NO <slot> allowed)

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		header?: Snippet<[string]>; // Snippet with parameter
	}

	let { children, header }: Props = $props();
</script>

{#if header}
	{@render header('Title')}
{/if}
{@render children?.()}
```

### Event Handling Pattern (NO on: directive)

```svelte
<script lang="ts">
	interface Props {
		onSave: (data: Data) => void;
	}

	let { onSave }: Props = $props();

	function handleClick(event: MouseEvent) {
		event.preventDefault(); // Manual modifier handling
		event.stopPropagation();
		onSave(data);
	}
</script>

<!-- ❌ WRONG: on:click directive -->
<!-- <button on:click|preventDefault={handleClick}> -->

<!-- ✅ CORRECT: onclick attribute -->
<button onclick={handleClick}>Save</button>
```

### Bindable Props Pattern

```svelte
<script lang="ts">
	interface Props {
		value?: string;
	}

	// ✅ CORRECT: Use $bindable() for two-way binding
	let { value = $bindable('') }: Props = $props();
</script>

<input bind:value placeholder="Enter text" />
```

### Class Prop Pattern

```svelte
<script lang="ts">
	interface Props {
		class?: string;
	}

	// ✅ CORRECT: Rename 'class' to avoid reserved word
	let { class: className, ...rest }: Props = $props();
</script>

<div class={className} {...rest}>
	<!-- content -->
</div>
```

## File Organization Standards

### File Naming

- **Components**: PascalCase (e.g., `Button.svelte`, `TodoList.svelte`)
- **Services**: camelCase + `.service.svelte.ts` (e.g., `todo.service.svelte.ts`)
- **Repositories**: camelCase + `.repository[.impl].ts`
  - Interface: `todo.repository.ts`
  - Implementation: `todo.repository.http.ts`
- **Models**: camelCase + `.types.ts` or `.schema.ts`
  - Types: `todo.types.ts`
  - Schemas: `todo.schema.ts`
- **Tests**: Same as source + `.test.ts` or `.spec.ts`
  - Unit: `todo.service.test.ts`
  - Component: `Button.svelte.test.ts`

### Import Order

1. External libraries (React, Svelte, etc.)
2. SvelteKit imports (`$app`, `$env`)
3. Path alias imports (`$lib`, `$core`, `$ui`, `$domains`)
4. Relative imports (`./`, `../`)
5. Type imports (use `import type`)

**Example**:

```typescript
import { setContext } from 'svelte';
import { goto } from '$app/navigation';
import { publicConfig } from '$config/env.public';
import { TODO_SERVICE_KEY } from '$core/context/keys';
import Button from '$ui/primitives/Button.svelte';
import type { TodoItem } from './models/todo.types';
```

## Environment Variables

### Configuration Pattern

**Never import from `$env` directly in business code**

**Public Config** (`src/lib/config/env.public.ts`):

```typescript
import { PUBLIC_API_BASE } from '$env/static/public';

if (!PUBLIC_API_BASE) {
	throw new Error('FATAL: PUBLIC_API_BASE is missing');
}

export const publicConfig = {
	apiBase: PUBLIC_API_BASE,
	isDev: import.meta.env.DEV
} as const;
```

**Private Config** (`src/lib/config/env.private.ts`):

```typescript
import { API_SECRET_KEY } from '$env/static/private';

if (!API_SECRET_KEY) {
	throw new Error('FATAL: API_SECRET_KEY is missing');
}

export const privateConfig = {
	apiSecret: API_SECRET_KEY
} as const;
```

**Usage**:

```typescript
import { publicConfig } from '$config/env.public';

const url = `${publicConfig.apiBase}/todos`;
```

## Form Handling Standards

### Superforms + Zod Pattern

**Always use Superforms with Zod for forms**

**1. Define Schema** (`models/*.schema.ts`):

```typescript
import { z } from 'zod';

export const createTodoSchema = z.object({
	title: z.string().min(2, '標題至少需要 2 個字符'),
	priority: z.enum(['low', 'medium', 'high']).default('medium')
});

export type CreateTodoSchema = z.infer<typeof createTodoSchema>;
```

**2. Server Action** (`+page.server.ts`):

```typescript
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createTodoSchema } from '$domains/todo/models/todo.schema';

export const load = async () => {
	const form = await superValidate(zod(createTodoSchema));
	return { form };
};

export const actions = {
	default: async ({ request, fetch }) => {
		const form = await superValidate(request, zod(createTodoSchema));
		if (!form.valid) return fail(400, { form });

		// Process form.data
		return { form };
	}
};
```

**3. Client Binding** (`+page.svelte`):

```svelte
<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form, {
		resetForm: true
	});
</script>

<form method="POST" use:enhance>
	<input name="title" bind:value={$form.title} />
	{#if $errors.title}<span class="text-red-500">{$errors.title}</span>{/if}
	<button type="submit">Submit</button>
</form>
```

## Error Handling Standards

### Repository Layer

- **Throw standard Error objects**
- Include meaningful error messages
- Don't catch errors, let them bubble up

```typescript
async getAll(): Promise<TodoItem[]> {
    const res = await this.fetchFn(`${publicConfig.apiBase}/todos`);
    if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    return res.json();
}
```

### Service Layer

- **Catch errors and set error state**
- Don't throw errors from services
- Always use try-catch-finally for loading states

```typescript
async loadTodos() {
    this.loading = true;
    this.error = null;
    try {
        this.items = await this.repo.getAll();
    } catch (err) {
        this.error = (err as Error).message;
    } finally {
        this.loading = false;
    }
}
```

### UI Layer

- **Local errors**: Display from `service.error`
- **Global errors**: Use `src/routes/+error.svelte`
- Show user-friendly messages, log technical details

```svelte
{#if service.error}
	<div class="rounded border border-red-200 p-4 text-red-500">
		{service.error}
	</div>
{/if}
```

## Testing Standards

### Unit Tests (Services)

- Test business logic in isolation
- Mock repository dependencies
- Use Vitest with `describe`, `it`, `expect`
- File: `*.service.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { TodoService } from './todo.service.svelte';

const mockRepo = {
	getAll: vi.fn(),
	create: vi.fn()
};

describe('TodoService', () => {
	it('should toggle todo status', () => {
		const service = new TodoService(mockRepo, [{ id: '1', title: 'Test', completed: false }]);
		service.toggle('1');
		expect(service.items[0].completed).toBe(true);
	});
});
```

### Component Tests

- Use Vitest browser mode or Storybook
- Test user interactions and rendering
- File: `*.svelte.test.ts`

### E2E Tests

- Use Playwright in `e2e/` directory
- Test complete user flows
- File: `*.test.ts` in `e2e/`

## Code Style

### Formatting

- Use Prettier (configured in `.prettierrc`)
- Run `npm run format` before committing
- Tailwind classes sorted by prettier-plugin-tailwindcss

### Linting

- Use ESLint (configured in `eslint.config.js`)
- Run `npm run lint` before committing
- Fix auto-fixable issues with `npm run lint -- --fix`

### Comments

- Use JSDoc for public APIs
- Explain "why", not "what"
- Keep comments up-to-date with code
- Use `// TODO:` for future work
- Use `// FIXME:` for known issues

## Internationalization

### Paraglide Pattern

**Message files**: `messages/{locale}.json`

```json
{
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"hello_world": "Hello, {name}!",
	"todo_count": "You have {count} todos"
}
```

**Usage in components**:

```svelte
<script>
	import * as m from '$paraglide/messages';
</script>

<h1>{m.hello_world({ name: 'User' })}</h1><p>{m.todo_count({ count: 5 })}</p>
```

**Supported locales**: en, zh-tw, jp
