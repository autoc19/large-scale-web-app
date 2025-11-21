# Development Workflow

## Feature Development Process

### Phase 1: Contract Definition

**Before writing any UI, define the data contracts**

1. **Create domain directory** (if new domain)

   ```
   src/lib/domains/[domain]/
   ├── components/
   ├── models/
   ├── services/
   └── repositories/
   ```

2. **Define TypeScript interfaces** (`models/*.types.ts`)

   ```typescript
   export interface TodoItem {
   	id: string;
   	title: string;
   	completed: boolean;
   }

   export interface CreateTodoDto {
   	title: string;
   }
   ```

3. **Define Zod schemas** (`models/*.schema.ts`)

   ```typescript
   import { z } from 'zod';

   export const createTodoSchema = z.object({
   	title: z.string().min(2, 'Title must be at least 2 characters')
   });
   ```

### Phase 2: Repository Layer

**Implement data access with Repository pattern**

1. **Define repository interface** (`repositories/*.repository.ts`)

   ```typescript
   export interface TodoRepository {
   	getAll(): Promise<TodoItem[]>;
   	create(dto: CreateTodoDto): Promise<TodoItem>;
   }
   ```

2. **Implement HTTP repository** (`repositories/*.repository.http.ts`)

   ```typescript
   export class HttpTodoRepository implements TodoRepository {
   	constructor(private fetchFn: typeof fetch) {}

   	async getAll(): Promise<TodoItem[]> {
   		const res = await this.fetchFn(`${publicConfig.apiBase}/todos`);
   		if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
   		return res.json();
   	}
   }
   ```

3. **Optional: Create mock repository for testing**

   ```typescript
   export class MockTodoRepository implements TodoRepository {
   	private items: TodoItem[] = [];

   	async getAll(): Promise<TodoItem[]> {
   		return [...this.items];
   	}
   }
   ```

### Phase 3: Service Layer

**Encapsulate business logic in Service classes**

1. **Create service with Runes** (`services/*.service.svelte.ts`)

   ```typescript
   export class TodoService {
   	items = $state<TodoItem[]>([]);
   	loading = $state(false);
   	error = $state<string | null>(null);

   	get completedCount() {
   		return this.items.filter((t) => t.completed).length;
   	}

   	constructor(
   		private repo: TodoRepository,
   		initialData: TodoItem[] = []
   	) {
   		this.items = initialData;
   	}

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

   	toggle(id: string) {
   		const todo = this.items.find((t) => t.id === id);
   		if (todo) todo.completed = !todo.completed;
   	}
   }
   ```

2. **Write unit tests** (`services/*.service.test.ts`)

   ```typescript
   import { describe, it, expect, vi } from 'vitest';
   import { TodoService } from './todo.service.svelte';

   const mockRepo = { getAll: vi.fn(), create: vi.fn() };

   describe('TodoService', () => {
   	it('toggles todo status', () => {
   		const service = new TodoService(mockRepo, [{ id: '1', title: 'Test', completed: false }]);
   		service.toggle('1');
   		expect(service.items[0].completed).toBe(true);
   	});
   });
   ```

### Phase 4: Dependency Injection Setup

**Define context keys for DI**

1. **Add context key** (`src/lib/core/context/keys.ts`)
   ```typescript
   export const TODO_SERVICE_KEY = Symbol('TODO_SERVICE');
   ```

### Phase 5: UI Components

**Build presentational components**

1. **Create UI primitives** (if needed) (`src/lib/ui/primitives/*.svelte`)

   ```svelte
   <script lang="ts">
   	import type { Snippet } from 'svelte';

   	interface Props {
   		children: Snippet;
   		onclick?: (e: MouseEvent) => void;
   		variant?: 'primary' | 'danger';
   	}

   	let { children, onclick, variant = 'primary' }: Props = $props();
   </script>

   <!-- ✅ CORRECT: onclick attribute, not on:click -->
   <button
   	class="rounded px-4 py-2 {variant === 'primary' ? 'bg-blue-600' : 'bg-red-600'}"
   	{onclick}
   >
   	{@render children()}
   </button>
   ```

2. **Create domain components** (`domains/[domain]/components/*.svelte`)

   ```svelte
   <script lang="ts">
   	import { getContext } from 'svelte';
   	import { TODO_SERVICE_KEY } from '$core/context/keys';
   	import type { TodoService } from '../services/todo.service.svelte';
   	import Button from '$ui/primitives/Button.svelte';

   	const service = getContext<TodoService>(TODO_SERVICE_KEY);
   </script>

   <div class="space-y-2">
   	{#each service.items as todo (todo.id)}
   		<div class="flex items-center justify-between rounded border p-3">
   			<span class:line-through={todo.completed}>{todo.title}</span>
   			<!-- ✅ CORRECT: onclick attribute -->
   			<Button
   				onclick={() => service.toggle(todo.id)}
   				variant={todo.completed ? 'danger' : 'primary'}
   			>
   				{todo.completed ? 'Undo' : 'Done'}
   			</Button>
   		</div>
   	{/each}
   </div>
   ```

### Phase 6: Route Integration

**Wire everything together in routes**

1. **Create load function** (`routes/[route]/+page.ts`)

   ```typescript
   import { HttpTodoRepository } from '$domains/todo/repositories/todo.repository.http';

   export const load = async ({ fetch }) => {
   	const repo = new HttpTodoRepository(fetch);
   	const items = await repo.getAll();
   	return { items };
   };
   ```

2. **Create page component** (`routes/[route]/+page.svelte`)

   ```svelte
   <script lang="ts">
   	import { setContext } from 'svelte';
   	import { TodoService } from '$domains/todo/services/todo.service.svelte';
   	import { HttpTodoRepository } from '$domains/todo/repositories/todo.repository.http';
   	import { TODO_SERVICE_KEY } from '$core/context/keys';
   	import TodoList from '$domains/todo/components/TodoList.svelte';

   	interface Props {
   		data: { items: TodoItem[] };
   	}

   	let { data }: Props = $props();

   	// 1. Dependency assembly
   	const repo = new HttpTodoRepository(fetch);
   	const service = new TodoService(repo, data.items);

   	// 2. Inject context
   	setContext(TODO_SERVICE_KEY, service);

   	// 3. CRITICAL: Sync service state when route data changes
   	$effect(() => {
   		service.items = data.items;
   	});
   </script>

   <main class="p-8">
   	{#if service.error}
   		<div class="rounded border border-red-200 p-4 text-red-500">
   			{service.error}
   		</div>
   	{/if}
   	<TodoList />
   </main>
   ```

3. **Add server actions** (if needed) (`routes/[route]/+page.server.ts`)

   ```typescript
   import { fail } from '@sveltejs/kit';
   import { superValidate } from 'sveltekit-superforms';
   import { zod } from 'sveltekit-superforms/adapters';
   import { createTodoSchema } from '$domains/todo/models/todo.schema';

   export const actions = {
   	default: async ({ request, fetch }) => {
   		const form = await superValidate(request, zod(createTodoSchema));
   		if (!form.valid) return fail(400, { form });

   		// Process form
   		return { form };
   	}
   };
   ```

### Phase 7: Testing & Documentation

**Ensure quality and maintainability**

1. **Run tests**

   ```bash
   npm run test:unit        # Unit tests
   npm run test:e2e         # E2E tests
   ```

2. **Type check**

   ```bash
   npm run check
   ```

3. **Lint and format**

   ```bash
   npm run lint
   npm run format
   ```

4. **Create Storybook stories** (for UI components)

   ```typescript
   // Button.stories.svelte
   import Button from './Button.svelte';

   export default {
   	component: Button,
   	title: 'UI/Primitives/Button'
   };
   ```

## Pre-Commit Checklist

Before committing code, verify:

- [ ] **Directory structure**: Files in correct domain/layer?
- [ ] **Logic separation**: UI components only render, logic in services?
- [ ] **Type safety**: All interfaces defined? No `any` types?
- [ ] **Config safety**: Using `$config` instead of `$env`?
- [ ] **Svelte 5 syntax**: Using `$props`, `$state`, `snippets`?
- [ ] **Data sync**: Using `$effect` for route data sync in pages?
- [ ] **Form validation**: Using Superforms + Zod for forms?
- [ ] **Error handling**: Proper error handling in repositories and services?
- [ ] **Tests**: Unit tests for services written and passing?
- [ ] **Type check**: `npm run check` passes?
- [ ] **Lint**: `npm run lint` passes?
- [ ] **Format**: Code formatted with Prettier?

## Common Development Commands

```bash
# Development
npm run dev                    # Start dev server
npm run dev -- --open          # Start dev server and open browser

# Type Checking
npm run check                  # Type-check once
npm run check:watch            # Type-check in watch mode

# Testing
npm run test:unit              # Run unit tests
npm run test:e2e               # Run E2E tests
npm test                       # Run all tests

# Code Quality
npm run lint                   # Check linting
npm run lint -- --fix          # Fix auto-fixable issues
npm run format                 # Format code with Prettier

# Building
npm run build                  # Production build
npm run preview                # Preview production build

# Storybook
npm run storybook              # Start Storybook (port 6006)
npm run build-storybook        # Build Storybook
```

## Debugging Tips

### Svelte 5 Reactivity Issues

- Check if using `$state` in `.svelte.ts` files
- Verify `$effect` is syncing route data in pages
- Use `$inspect(value)` to debug reactive values

### Type Errors

- Run `npm run check` to see all type errors
- Check if path aliases are configured correctly
- Verify imports use `import type` for types

### Test Failures

- Check if mocks are properly configured
- Verify test environment (client vs server)
- Use `vi.fn()` for function mocks

### Build Errors

- Clear `.svelte-kit` directory and rebuild
- Check for circular dependencies
- Verify all imports are correct

## Git Workflow

1. **Create feature branch**

   ```bash
   git checkout -b feature/todo-management
   ```

2. **Make changes following the development process**

3. **Run pre-commit checklist**

4. **Commit with descriptive message**

   ```bash
   git commit -m "feat(todo): add todo management with DDD architecture"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/todo-management
   ```

## Code Review Guidelines

When reviewing code, check for:

- Architecture compliance (DDD, layered architecture)
- Proper use of Svelte 5 Runes
- Type safety (no `any`, proper interfaces)
- Error handling patterns
- Test coverage
- Code style and formatting
- Documentation and comments
