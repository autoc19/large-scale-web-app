# Critical Patterns & Common Pitfalls

## Critical Pattern: $effect Data Sync

### The Problem

When SvelteKit navigates between routes with different parameters, the `load` function reruns and updates `data`, but the Service constructor doesn't rerun. This causes the Service to hold stale data.

### The Solution

**Always use `$effect` to sync Service state with route data**

```svelte
<script lang="ts">
	import { setContext } from 'svelte';
	import { TodoService } from '$domains/todo/services/todo.service.svelte';
	import { HttpTodoRepository } from '$domains/todo/repositories/todo.repository.http';
	import { TODO_SERVICE_KEY } from '$core/context/keys';

	interface Props {
		data: { items: TodoItem[] };
	}

	let { data }: Props = $props();

	// 1. Dependency assembly (runs once on mount)
	const repo = new HttpTodoRepository(fetch);
	const service = new TodoService(repo, data.items);

	// 2. Inject context
	setContext(TODO_SERVICE_KEY, service);

	// 3. CRITICAL: Sync service when route data changes
	// Without this, service.items will be stale after navigation
	$effect(() => {
		service.items = data.items;
	});
</script>
```

### Why This Matters

- Client-side navigation doesn't remount the component
- Only the `data` prop changes
- Service instance persists across navigations
- Without `$effect`, Service shows old data

### When to Use

- **Always** in `+page.svelte` when using Services with route data
- Any time a Service depends on data from `load` function
- When route parameters change but component doesn't remount

## Repository Pattern

### Interface First

**Always define the interface before implementation**

```typescript
// todo.repository.ts
export interface TodoRepository {
	getAll(): Promise<TodoItem[]>;
	getById(id: string): Promise<TodoItem>;
	create(dto: CreateTodoDto): Promise<TodoItem>;
	update(id: string, dto: UpdateTodoDto): Promise<TodoItem>;
	delete(id: string): Promise<void>;
}
```

### Multiple Implementations

**Create different implementations for different contexts**

```typescript
// todo.repository.http.ts
export class HttpTodoRepository implements TodoRepository {
	constructor(private fetchFn: typeof fetch) {}

	async getAll(): Promise<TodoItem[]> {
		const res = await this.fetchFn(`${publicConfig.apiBase}/todos`);
		if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
		return res.json();
	}
}

// todo.repository.mock.ts (for testing)
export class MockTodoRepository implements TodoRepository {
	private items: TodoItem[] = [];

	async getAll(): Promise<TodoItem[]> {
		return [...this.items];
	}
}

// todo.repository.local.ts (for offline)
export class LocalTodoRepository implements TodoRepository {
	async getAll(): Promise<TodoItem[]> {
		const data = localStorage.getItem('todos');
		return data ? JSON.parse(data) : [];
	}
}
```

### Benefits

- Easy to swap implementations (HTTP → Mock → Local)
- Services depend on interface, not implementation
- Testable without real API calls
- Supports offline mode, caching, etc.

## Service Pattern with Runes

### State Management

**Use Runes for reactive state in Services**

```typescript
export class TodoService {
	// Reactive state
	items = $state<TodoItem[]>([]);
	loading = $state(false);
	error = $state<string | null>(null);
	selectedId = $state<string | null>(null);

	// Derived state (computed)
	get completedCount() {
		return this.items.filter((t) => t.completed).length;
	}

	get selectedItem() {
		return this.items.find((t) => t.id === this.selectedId);
	}

	// Constructor with initial data
	constructor(
		private repo: TodoRepository,
		initialData: TodoItem[] = []
	) {
		this.items = initialData;
	}

	// Async operations
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

	// Synchronous operations
	toggle(id: string) {
		const todo = this.items.find((t) => t.id === id);
		if (todo) todo.completed = !todo.completed;
	}

	select(id: string) {
		this.selectedId = id;
	}
}
```

### Error Handling in Services

**Catch errors, set error state, don't throw**

```typescript
// ✅ GOOD: Catch and set error state
async loadTodos() {
    this.loading = true;
    this.error = null;
    try {
        this.items = await this.repo.getAll();
    } catch (err) {
        this.error = (err as Error).message;
        // Optionally log for debugging
        console.error('Failed to load todos:', err);
    } finally {
        this.loading = false;
    }
}

// ❌ BAD: Throwing from service
async loadTodos() {
    this.items = await this.repo.getAll(); // Error bubbles up
}
```

## Dependency Injection Pattern

### Context Keys as Symbols

**Define all context keys in one place**

```typescript
// src/lib/core/context/keys.ts
export const TODO_SERVICE_KEY = Symbol('TODO_SERVICE');
export const AUTH_SERVICE_KEY = Symbol('AUTH_SERVICE');
export const USER_SERVICE_KEY = Symbol('USER_SERVICE');
```

### Injection in Pages

**Instantiate and inject in `+page.svelte`**

```svelte
<script lang="ts">
	import { setContext } from 'svelte';
	import { TodoService } from '$domains/todo/services/todo.service.svelte';
	import { TODO_SERVICE_KEY } from '$core/context/keys';

	interface Props {
		data: { items: TodoItem[] };
	}

	let { data }: Props = $props();

	const repo = new HttpTodoRepository(fetch);
	const service = new TodoService(repo, data.items);

	setContext(TODO_SERVICE_KEY, service);
</script>
```

### Consumption in Components

**Get from context in domain components**

```svelte
<script lang="ts">
	import { getContext } from 'svelte';
	import { TODO_SERVICE_KEY } from '$core/context/keys';
	import type { TodoService } from '../services/todo.service.svelte';

	const service = getContext<TodoService>(TODO_SERVICE_KEY);
</script>

<div>
	{#if service.loading}
		<p>Loading...</p>
	{:else}
		<p>Total: {service.items.length}</p>
	{/if}
</div>
```

## Form Handling with Superforms

### Complete Pattern

**Schema → Server Action → Client Binding**

**1. Schema** (`models/todo.schema.ts`):

```typescript
import { z } from 'zod';

export const createTodoSchema = z.object({
	title: z.string().min(2, 'Title must be at least 2 characters'),
	priority: z.enum(['low', 'medium', 'high']).default('medium'),
	dueDate: z.string().optional()
});

export type CreateTodoSchema = z.infer<typeof createTodoSchema>;
```

**2. Server** (`+page.server.ts`):

```typescript
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createTodoSchema } from '$domains/todo/models/todo.schema';
import { HttpTodoRepository } from '$domains/todo/repositories/todo.repository.http';

export const load = async () => {
	const form = await superValidate(zod(createTodoSchema));
	return { form };
};

export const actions = {
	create: async ({ request, fetch }) => {
		const form = await superValidate(request, zod(createTodoSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const repo = new HttpTodoRepository(fetch);
		await repo.create(form.data);

		return { form };
	}
};
```

**3. Client** (`+page.svelte`):

```svelte
<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	interface Props {
		data: { form: any };
	}

	let { data }: Props = $props();

	const { form, errors, enhance, submitting } = superForm(data.form, {
		resetForm: true,
		onResult: ({ result }) => {
			if (result.type === 'success') {
				// Handle success
			}
		}
	});
</script>

<form method="POST" action="?/create" use:enhance>
	<div>
		<label for="title">Title</label>
		<input id="title" name="title" bind:value={$form.title} class="rounded border p-2" />
		{#if $errors.title}
			<span class="text-sm text-red-500">{$errors.title}</span>
		{/if}
	</div>

	<button type="submit" disabled={$submitting}>
		{$submitting ? 'Creating...' : 'Create Todo'}
	</button>
</form>
```

## Environment Configuration

### Type-Safe Config Pattern

**Never import from `$env` directly**

```typescript
// ❌ BAD: Direct import in business code
import { PUBLIC_API_BASE } from '$env/static/public';
const url = `${PUBLIC_API_BASE}/todos`;

// ✅ GOOD: Use config wrapper
import { publicConfig } from '$config/env.public';
const url = `${publicConfig.apiBase}/todos`;
```

### Config with Validation

```typescript
// src/lib/config/env.public.ts
import { PUBLIC_API_BASE, PUBLIC_APP_NAME } from '$env/static/public';

// Validate required variables
if (!PUBLIC_API_BASE) {
	throw new Error('FATAL: PUBLIC_API_BASE environment variable is required');
}

export const publicConfig = {
	apiBase: PUBLIC_API_BASE,
	appName: PUBLIC_APP_NAME || 'My App',
	isDev: import.meta.env.DEV,
	isProd: import.meta.env.PROD
} as const;

// Type-safe access
export type PublicConfig = typeof publicConfig;
```

## Common Pitfalls

### ❌ Pitfall 1: Forgetting $effect Sync

```svelte
<!-- BAD: Service state becomes stale -->
<script lang="ts">
	interface Props {
		data: { items: TodoItem[] };
	}

	let { data }: Props = $props();
	const service = new TodoService(repo, data.items);
	setContext(TODO_SERVICE_KEY, service);
	// Missing $effect sync!
</script>
```

### ✅ Solution:

```svelte
<script lang="ts">
	interface Props {
		data: { items: TodoItem[] };
	}

	let { data }: Props = $props();
	const service = new TodoService(repo, data.items);
	setContext(TODO_SERVICE_KEY, service);

	$effect(() => {
		service.items = data.items;
	});
</script>
```

### ❌ Pitfall 2: Business Logic in Components

```svelte
<!-- BAD: Logic in component -->
<script lang="ts">
	let todos = $state<TodoItem[]>([]);

	async function loadTodos() {
		const res = await fetch('/api/todos');
		todos = await res.json();
	}

	function toggle(id: string) {
		const todo = todos.find((t) => t.id === id);
		if (todo) todo.completed = !todo.completed;
	}
</script>
```

### ✅ Solution: Move to Service

```typescript
// todo.service.svelte.ts
export class TodoService {
	items = $state<TodoItem[]>([]);

	constructor(private repo: TodoRepository) {}

	async loadTodos() {
		this.items = await this.repo.getAll();
	}

	toggle(id: string) {
		const todo = this.items.find((t) => t.id === id);
		if (todo) todo.completed = !todo.completed;
	}
}
```

### ❌ Pitfall 3: Direct API Calls

```typescript
// BAD: Service calls API directly
export class TodoService {
	async loadTodos() {
		const res = await fetch(`${publicConfig.apiBase}/todos`);
		this.items = await res.json();
	}
}
```

### ✅ Solution: Use Repository

```typescript
// GOOD: Service uses Repository
export class TodoService {
	constructor(private repo: TodoRepository) {}

	async loadTodos() {
		this.items = await this.repo.getAll();
	}
}
```

### ❌ Pitfall 4: Using `any` Type

```typescript
// BAD: Loses type safety
function processData(data: any) {
	return data.items.map((item: any) => item.title);
}
```

### ✅ Solution: Define Proper Types

```typescript
// GOOD: Type-safe
interface ApiResponse {
	items: TodoItem[];
}

function processData(data: ApiResponse): string[] {
	return data.items.map((item) => item.title);
}
```

### ❌ Pitfall 5: Throwing from Services

```typescript
// BAD: Error bubbles up to UI
async loadTodos() {
    this.items = await this.repo.getAll(); // Throws on error
}
```

### ✅ Solution: Catch and Set Error State

```typescript
// GOOD: Error is captured in state
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

## Performance Patterns

### Lazy Loading Services

```typescript
// Only create service when needed
let service = $state<TodoService | null>(null);

$effect(() => {
	if (shouldLoadTodos) {
		service = new TodoService(repo, data.items);
	}
});
```

### Debounced Actions

```typescript
import { debounce } from '$lib/utils/debounce';

export class SearchService {
	query = $state('');
	results = $state<SearchResult[]>([]);

	private debouncedSearch = debounce(async (q: string) => {
		this.results = await this.repo.search(q);
	}, 300);

	search(query: string) {
		this.query = query;
		this.debouncedSearch(query);
	}
}
```

### Optimistic Updates

```typescript
async toggle(id: string) {
    // Optimistic update
    const todo = this.items.find(t => t.id === id);
    if (!todo) return;

    const previousState = todo.completed;
    todo.completed = !todo.completed;

    try {
        await this.repo.update(id, { completed: todo.completed });
    } catch (err) {
        // Rollback on error
        todo.completed = previousState;
        this.error = (err as Error).message;
    }
}
```
