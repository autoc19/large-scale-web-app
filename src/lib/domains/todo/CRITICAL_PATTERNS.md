# Critical Patterns in Todo Domain

This document details the critical patterns used in the Todo domain implementation. These patterns are essential for understanding how the architecture works and must be followed when extending the domain.

## 1. The $effect Sync Pattern (MOST CRITICAL)

### The Problem

When using SvelteKit with client-side navigation, the page component doesn't remount when navigating between routes. This means:

1. The component's `<script>` block only runs once on initial mount
2. The `data` prop updates when the route changes
3. The Service instance persists across navigations
4. **Without syncing, the Service holds stale data**

### Example of the Problem

```typescript
// ❌ WRONG: Service becomes stale after navigation
interface Props {
  data: { items: TodoItem[] };
}

let { data }: Props = $props();

// This only runs once on mount
const service = new TodoService(repo, data.items);
setContext(TODO_SERVICE_KEY, service);

// When user navigates to a different route:
// - data.items updates with new data
// - service.items still has old data
// - UI shows stale todos
```

### The Solution

```typescript
// ✅ CORRECT: Use $effect to sync when data changes
interface Props {
  data: { items: TodoItem[] };
}

let { data }: Props = $props();

const service = new TodoService(repo, data.items);
setContext(TODO_SERVICE_KEY, service);

// CRITICAL: This runs whenever data.items changes
$effect(() => {
  service.items = data.items;
});
```

### Why It Works

- `$effect` runs whenever its dependencies change
- `data.items` is a dependency
- When route changes, `data` updates, triggering `$effect`
- `$effect` syncs the service state with the new data
- UI updates reactively because service.items is `$state`

### When to Use

**Always use this pattern when:**
- You have a Service with reactive state
- The Service is instantiated in a page component
- The page receives data from a `load` function
- The route can change (client-side navigation)

**Example scenarios:**
- Todo list page with different filters
- User profile page with different user IDs
- Product detail page with different product IDs
- Any page where route parameters affect the data

### Common Mistakes

#### Mistake 1: Forgetting the $effect

```typescript
// ❌ WRONG
const service = new TodoService(repo, data.items);
setContext(TODO_SERVICE_KEY, service);
// Missing $effect - service becomes stale!
```

#### Mistake 2: Using $effect incorrectly

```typescript
// ❌ WRONG: Recreating service on every change
$effect(() => {
  const service = new TodoService(repo, data.items);
  setContext(TODO_SERVICE_KEY, service);
});
// This creates a new service instance every time data changes
// Loses all state modifications
```

#### Mistake 3: Not including data in dependency

```typescript
// ❌ WRONG: $effect doesn't track data changes
$effect(() => {
  // This doesn't reference data, so it never runs
  service.items = [];
});
```

### Testing the Pattern

```typescript
import { render } from 'vitest-browser-vue';
import TodoPage from './+page.svelte';

it('should sync service state when data changes', async () => {
  const { rerender } = render(TodoPage, {
    props: {
      data: { items: [{ id: '1', title: 'Todo 1', completed: false }] }
    }
  });

  // Initial render
  expect(screen.getByText('Todo 1')).toBeVisible();

  // Simulate route change with new data
  await rerender({
    data: { items: [{ id: '2', title: 'Todo 2', completed: false }] }
  });

  // Service should be synced with new data
  expect(screen.getByText('Todo 2')).toBeVisible();
  expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
});
```

---

## 2. Optimistic Updates Pattern

### The Problem

When users toggle a todo or delete an item, there's a delay between the action and the server response. This creates a poor user experience where the UI doesn't respond immediately.

### The Solution

Update the UI immediately (optimistically), then sync with the server. If the server request fails, rollback the change.

### Implementation

```typescript
// src/lib/domains/todo/services/todo.service.svelte.ts
async toggle(id: string): Promise<void> {
  const todo = this.items.find((t) => t.id === id);
  if (!todo) return;

  // Step 1: Store previous state for rollback
  const previousState = todo.completed;

  // Step 2: Update UI immediately (optimistic)
  todo.completed = !todo.completed;

  try {
    // Step 3: Persist to server
    await this.repo.update(id, { completed: todo.completed });
    // Success - UI is already updated
  } catch (err) {
    // Step 4: Rollback on error
    todo.completed = previousState;
    this.error = (err as Error).message;
    console.error('Failed to toggle todo:', err);
  }
}
```

### User Experience Flow

```
User clicks toggle button
         ↓
UI updates immediately (optimistic)
         ↓
Request sent to server
         ↓
Server responds
    ↙        ↘
Success    Error
   ↓          ↓
Keep UI    Rollback UI
updated    to previous
           state
```

### Benefits

- **Instant feedback**: UI responds immediately
- **Better perceived performance**: Feels faster
- **Graceful degradation**: Rollback on error
- **Consistent state**: Server and UI stay in sync

### When to Use

- Toggle operations (completed status)
- Delete operations
- Quick updates (priority, category)
- Any operation where immediate feedback improves UX

### When NOT to Use

- Complex operations with validation
- Operations that depend on server state
- Operations that could conflict with other users
- Operations where consistency is critical

---

## 3. Error Handling Pattern

### The Pattern

Errors flow through the system in a specific way:

```
Repository Layer
    ↓
  Throws Error
    ↓
Service Layer
    ↓
  Catches Error
  Sets error state
  Logs to console
    ↓
UI Layer
    ↓
  Displays error message
```

### Repository Layer: Throw Errors

Repositories throw standard Error objects with descriptive messages:

```typescript
// src/lib/domains/todo/repositories/todo.repository.http.ts
async getAll(): Promise<TodoItem[]> {
  const res = await this.fetchFn(`${publicConfig.apiBase}/todos`);
  if (!res.ok) {
    throw new Error(`Failed to fetch todos: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async create(dto: CreateTodoDto): Promise<TodoItem> {
  const res = await this.fetchFn(`${publicConfig.apiBase}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  });
  if (!res.ok) {
    throw new Error(`Failed to create todo: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
```

### Service Layer: Catch and Set Error State

Services catch errors and set error state (don't throw):

```typescript
// src/lib/domains/todo/services/todo.service.svelte.ts
async loadTodos(): Promise<void> {
  this.loading = true;
  this.error = null;  // Clear previous error
  try {
    this.items = await this.repo.getAll();
  } catch (err) {
    // Catch error and set state
    this.error = (err as Error).message;
    console.error('Failed to load todos:', err);
  } finally {
    this.loading = false;
  }
}

async createTodo(dto: CreateTodoDto): Promise<void> {
  this.loading = true;
  this.error = null;
  try {
    const newTodo = await this.repo.create(dto);
    this.items = [...this.items, newTodo];
  } catch (err) {
    this.error = (err as Error).message;
    console.error('Failed to create todo:', err);
  } finally {
    this.loading = false;
  }
}
```

### UI Layer: Display Error Messages

Components display error messages from the service:

```svelte
<!-- src/routes/todos/+page.svelte -->
<script lang="ts">
  const service = getContext(TODO_SERVICE_KEY);
</script>

{#if service.error}
  <div class="rounded border border-red-200 bg-red-50 p-4 text-red-700">
    <p class="font-semibold">Error</p>
    <p>{service.error}</p>
  </div>
{/if}

<TodoList />
```

### Error Handling Checklist

- [ ] Repository throws descriptive errors
- [ ] Service catches all errors
- [ ] Service sets error state
- [ ] Service logs errors to console
- [ ] Service clears error on new operation
- [ ] UI displays error message
- [ ] Error message is user-friendly
- [ ] Loading state is cleared in finally block

---

## 4. Form Handling Pattern

### The Pattern

Forms use a three-layer approach:

```
Schema (Zod)
    ↓
Server Action (Validation + Processing)
    ↓
Client Binding (Superforms)
```

### Step 1: Define Schema

```typescript
// src/lib/domains/todo/models/todo.schema.ts
import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters')
});

export type CreateTodoSchema = z.infer<typeof createTodoSchema>;
```

### Step 2: Server Action

```typescript
// src/routes/todos/+page.server.ts
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createTodoSchema } from '$domains/todo/models/todo.schema';

export const load = async () => {
  // Initialize empty form
  // @ts-expect-error - sveltekit-superforms zod adapter type issue
  const form = await superValidate(zod(createTodoSchema));
  return { form };
};

export const actions = {
  create: async ({ request, fetch }) => {
    // Validate form data
    // @ts-expect-error - sveltekit-superforms zod adapter type issue
    const form = await superValidate(request, zod(createTodoSchema));

    // Return validation errors
    if (!form.valid) {
      return fail(400, { form });
    }

    // Process form data
    const repo = new HttpTodoRepository(fetch);
    await repo.create(form.data);

    // Return success
    return { form };
  }
};
```

### Step 3: Client Binding

```svelte
<!-- src/lib/domains/todo/components/TodoForm.svelte -->
<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import type { SuperValidated } from 'sveltekit-superforms';
  import type { CreateTodoSchema } from '../models/todo.schema';

  interface Props {
    data: { form: SuperValidated<CreateTodoSchema> };
  }

  let { data }: Props = $props();

  const { form, errors, enhance, submitting } = superForm(data.form, {
    resetForm: true,
    onResult: ({ result }) => {
      if (result.type === 'success') {
        // Optional: reload todos or show success message
      }
    }
  });
</script>

<form method="POST" action="?/create" use:enhance>
  <div>
    <label for="title">Title</label>
    <input
      id="title"
      name="title"
      bind:value={$form.title}
      class="rounded border p-2"
      disabled={$submitting}
    />
    {#if $errors.title}
      <span class="text-sm text-red-500">{$errors.title}</span>
    {/if}
  </div>

  <button type="submit" disabled={$submitting}>
    {$submitting ? 'Creating...' : 'Create Todo'}
  </button>
</form>
```

### Benefits

- **Type-safe**: Schema defines types
- **Validated**: Zod validates at runtime
- **Progressive enhancement**: Works without JavaScript
- **Error handling**: Validation errors displayed
- **Loading state**: Submitting state managed
- **Reset**: Form resets after success

---

## 5. Dependency Injection Pattern

### The Pattern

Services are injected into the component tree using Svelte's context API:

```
Page Component
    ↓
setContext(TODO_SERVICE_KEY, service)
    ↓
Component Tree
    ↓
Domain Components
    ↓
getContext(TODO_SERVICE_KEY)
```

### Define Context Keys

```typescript
// src/lib/core/context/keys.ts
export const TODO_SERVICE_KEY = Symbol('TODO_SERVICE');
export const AUTH_SERVICE_KEY = Symbol('AUTH_SERVICE');
export const USER_SERVICE_KEY = Symbol('USER_SERVICE');
```

### Inject in Page

```typescript
// src/routes/todos/+page.svelte
import { setContext } from 'svelte';
import { TODO_SERVICE_KEY } from '$core/context/keys';

const repo = new HttpTodoRepository(fetch);
const service = new TodoService(repo, data.items);

setContext(TODO_SERVICE_KEY, service);
```

### Consume in Components

```typescript
// src/lib/domains/todo/components/TodoList.svelte
import { getContext } from 'svelte';
import { TODO_SERVICE_KEY } from '$core/context/keys';
import type { TodoService } from '../services/todo.service.svelte';

const service = getContext<TodoService>(TODO_SERVICE_KEY);
```

### Benefits

- **Avoid prop drilling**: No need to pass props through multiple levels
- **Loose coupling**: Components don't depend on parent structure
- **Easy testing**: Mock service in tests
- **Follows DDD**: Services are injected, not created in components

### Testing with DI

```typescript
import { render } from 'vitest-browser-vue';
import { setContext } from 'svelte';
import TodoList from './TodoList.svelte';

it('should render todos from service', () => {
  const mockService = {
    items: [{ id: '1', title: 'Test', completed: false }],
    loading: false,
    error: null
  };

  render(TodoList, {
    setup() {
      setContext(TODO_SERVICE_KEY, mockService);
    }
  });

  expect(screen.getByText('Test')).toBeVisible();
});
```

---

## Summary

These five patterns work together to create a maintainable, testable, and scalable architecture:

1. **$effect Sync**: Keeps Service state in sync with route data
2. **Optimistic Updates**: Provides instant feedback to users
3. **Error Handling**: Flows errors through layers consistently
4. **Form Handling**: Type-safe form validation and processing
5. **Dependency Injection**: Decouples components and services

Master these patterns and you'll be able to extend the Todo domain and create new domains following the same principles.

---

## Related Documentation

- [README.md](./README.md) - Domain overview
- [../../steering/critical-patterns.md](../../steering/critical-patterns.md) - Global critical patterns
- [../../steering/development-workflow.md](../../steering/development-workflow.md) - Development process
