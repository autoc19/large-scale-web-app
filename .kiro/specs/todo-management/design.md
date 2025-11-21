# Design Document

## Overview

The Todo Management domain serves as a reference implementation of the DDD architecture, demonstrating the complete flow from data models through repositories, services, and UI components to page integration. This design showcases all critical patterns including the $effect sync pattern, Repository pattern, Service pattern with Svelte 5 Runes, form handling with Superforms + Zod, and proper error handling throughout the stack.

## Architecture

### Domain Structure

```
src/lib/domains/todo/
├── components/          # Domain-specific UI
│   ├── TodoList.svelte
│   ├── TodoItem.svelte
│   └── TodoForm.svelte
├── models/              # Data contracts
│   ├── todo.types.ts
│   └── todo.schema.ts
├── services/            # Business logic
│   └── todo.service.svelte.ts
└── repositories/        # Data access
    ├── todo.repository.ts
    └── todo.repository.http.ts

src/routes/todos/
├── +page.ts             # Data loading
├── +page.server.ts      # Server actions
└── +page.svelte         # Page component with DI
```

### Data Flow

```
User Action
    ↓
Component (TodoList.svelte)
    ↓
Service (TodoService) ← getContext
    ↓
Repository (TodoRepository interface)
    ↓
Implementation (HttpTodoRepository)
    ↓
API
```

### Critical Pattern: $effect Sync

```
Route Navigation
    ↓
load() function runs → fetches new data
    ↓
data prop updates
    ↓
$effect(() => { service.items = data.items })
    ↓
Service state synchronized
    ↓
UI updates reactively
```

## Components and Interfaces

### Data Models

#### Todo Types

```typescript
// src/lib/domains/todo/models/todo.types.ts

export interface TodoItem {
	id: string;
	title: string;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTodoDto {
	title: string;
}

export interface UpdateTodoDto {
	title?: string;
	completed?: boolean;
}
```

#### Todo Schemas

```typescript
// src/lib/domains/todo/models/todo.schema.ts
import { z } from 'zod';

export const createTodoSchema = z.object({
	title: z
		.string()
		.min(2, 'Title must be at least 2 characters')
		.max(100, 'Title must be less than 100 characters')
});

export const updateTodoSchema = z.object({
	title: z
		.string()
		.min(2, 'Title must be at least 2 characters')
		.max(100, 'Title must be less than 100 characters')
		.optional(),
	completed: z.boolean().optional()
});

export type CreateTodoSchema = z.infer<typeof createTodoSchema>;
export type UpdateTodoSchema = z.infer<typeof updateTodoSchema>;
```

### Repository Layer

#### Repository Interface

```typescript
// src/lib/domains/todo/repositories/todo.repository.ts

export interface TodoRepository {
	getAll(): Promise<TodoItem[]>;
	getById(id: string): Promise<TodoItem>;
	create(dto: CreateTodoDto): Promise<TodoItem>;
	update(id: string, dto: UpdateTodoDto): Promise<TodoItem>;
	delete(id: string): Promise<void>;
}
```

#### HTTP Repository Implementation

```typescript
// src/lib/domains/todo/repositories/todo.repository.http.ts

export class HttpTodoRepository implements TodoRepository {
	constructor(private fetchFn: typeof fetch) {}

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

	// ... other methods
}
```

### Service Layer

#### Todo Service

```typescript
// src/lib/domains/todo/services/todo.service.svelte.ts

export class TodoService {
	// Reactive state
	items = $state<TodoItem[]>([]);
	loading = $state(false);
	error = $state<string | null>(null);
	selectedId = $state<string | null>(null);

	// Derived state
	get completedCount(): number {
		return this.items.filter((t) => t.completed).length;
	}

	get pendingCount(): number {
		return this.items.filter((t) => !t.completed).length;
	}

	get selectedItem(): TodoItem | undefined {
		return this.items.find((t) => t.id === this.selectedId);
	}

	constructor(
		private repo: TodoRepository,
		initialData: TodoItem[] = []
	) {
		this.items = initialData;
	}

	async loadTodos(): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			this.items = await this.repo.getAll();
		} catch (err) {
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

	async toggle(id: string): Promise<void> {
		const todo = this.items.find((t) => t.id === id);
		if (!todo) return;

		// Optimistic update
		const previousState = todo.completed;
		todo.completed = !todo.completed;

		try {
			await this.repo.update(id, { completed: todo.completed });
		} catch (err) {
			// Rollback on error
			todo.completed = previousState;
			this.error = (err as Error).message;
			console.error('Failed to toggle todo:', err);
		}
	}

	async deleteTodo(id: string): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			await this.repo.delete(id);
			this.items = this.items.filter((t) => t.id !== id);
		} catch (err) {
			this.error = (err as Error).message;
			console.error('Failed to delete todo:', err);
		} finally {
			this.loading = false;
		}
	}

	select(id: string): void {
		this.selectedId = id;
	}

	clearSelection(): void {
		this.selectedId = null;
	}
}
```

### UI Components

#### TodoList Component

```typescript
// src/lib/domains/todo/components/TodoList.svelte
interface TodoListProps {
	// No props - gets service from context
}
```

#### TodoItem Component

```typescript
// src/lib/domains/todo/components/TodoItem.svelte
interface TodoItemProps {
	todo: TodoItem;
	onToggle: (id: string) => void;
	onDelete: (id: string) => void;
	onSelect: (id: string) => void;
	class?: string;
}
```

#### TodoForm Component

```typescript
// src/lib/domains/todo/components/TodoForm.svelte
interface TodoFormProps {
	// Uses Superforms - no direct props
}
```

### Page Integration

#### Load Function

```typescript
// src/routes/todos/+page.ts
export const load = async ({ fetch }) => {
	const repo = new HttpTodoRepository(fetch);
	const items = await repo.getAll();
	return { items };
};
```

#### Server Actions

```typescript
// src/routes/todos/+page.server.ts
export const load = async () => {
	const form = await superValidate(zod(createTodoSchema));
	return { form };
};

export const actions = {
	create: async ({ request, fetch }) => {
		const form = await superValidate(request, zod(createTodoSchema));
		if (!form.valid) return fail(400, { form });

		const repo = new HttpTodoRepository(fetch);
		await repo.create(form.data);

		return { form };
	}
};
```

## Data Models

### Todo State Machine

```
┌─────────┐
│ Pending │
└────┬────┘
     │ toggle()
     ↓
┌───────────┐
│ Completed │
└─────┬─────┘
      │ toggle()
      ↓
┌─────────┐
│ Pending │
└─────────┘
```

### Service State

```typescript
interface TodoServiceState {
	items: TodoItem[]; // Current todo list
	loading: boolean; // Loading indicator
	error: string | null; // Error message
	selectedId: string | null; // Selected todo ID
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Todo Creation Adds Item

_For any_ valid CreateTodoDto, calling createTodo should result in the items array growing by one and containing the new todo.

**Validates: Requirements 3.7**

### Property 2: Toggle Flips Completion Status

_For any_ todo item in the items array, calling toggle with its id should flip the completed status from true to false or false to true.

**Validates: Requirements 3.6**

### Property 3: Delete Removes Item

_For any_ todo item in the items array, calling deleteTodo with its id should result in that item no longer being in the items array.

**Validates: Requirements 3.8**

### Property 4: Loading State Management

_For any_ async operation (loadTodos, createTodo, deleteTodo), the loading state should be true during execution and false after completion (success or error).

**Validates: Requirements 3.4**

### Property 5: Error State on Repository Failure

_For any_ repository operation that throws an error, the service should catch it and set the error state with the error message.

**Validates: Requirements 8.2, 8.3**

### Property 6: Optimistic Update Rollback

_For any_ toggle operation that fails, the todo's completed status should be rolled back to its previous value.

**Validates: Requirements 8.2**

### Property 7: Completed Count Accuracy

_For any_ state of the items array, the completedCount getter should return the exact number of items where completed is true.

**Validates: Requirements 3.3**

### Property 8: $effect Sync on Route Change

_For any_ change to the data.items prop in the page component, the $effect should update service.items to match.

**Validates: Requirements 9.2, 9.5**

### Property 9: Form Validation Rejection

_For any_ CreateTodoDto with a title shorter than 2 characters, the Zod schema should reject it with a validation error.

**Validates: Requirements 1.4**

### Property 10: Repository Error Throwing

_For any_ HTTP response with a non-2xx status code, the repository should throw an Error with status and message.

**Validates: Requirements 2.3, 8.1**

## Error Handling

### Repository Layer

- **Network Errors**: Throw Error with "Failed to fetch todos: [details]"
- **HTTP Errors**: Throw Error with status code and status text
- **Timeout**: Throw Error with "Request timeout"
- **Parse Errors**: Throw Error with "Failed to parse response"

### Service Layer

- **Repository Errors**: Catch, set error state, log to console
- **Optimistic Update Failures**: Rollback state, set error
- **Validation Errors**: Handled by Superforms, not service
- **Loading State**: Always set to false in finally block

### UI Layer

- **Service Errors**: Display error message from service.error
- **Form Errors**: Display validation errors from Superforms
- **Loading States**: Show loading indicators from service.loading
- **Empty States**: Show "No todos" message when items.length === 0

## Testing Strategy

### Unit Tests

#### Service Tests

```typescript
// todo.service.test.ts
describe('TodoService', () => {
	it('should toggle todo status', () => {
		// Property 2: Toggle Flips Completion Status
	});

	it('should add todo on create', async () => {
		// Property 1: Todo Creation Adds Item
	});

	it('should remove todo on delete', async () => {
		// Property 3: Delete Removes Item
	});

	it('should manage loading state', async () => {
		// Property 4: Loading State Management
	});

	it('should set error on repository failure', async () => {
		// Property 5: Error State on Repository Failure
	});

	it('should rollback on toggle failure', async () => {
		// Property 6: Optimistic Update Rollback
	});

	it('should calculate completed count correctly', () => {
		// Property 7: Completed Count Accuracy
	});
});
```

#### Repository Tests

```typescript
// todo.repository.http.test.ts
describe('HttpTodoRepository', () => {
	it('should fetch all todos', async () => {
		// Test getAll method
	});

	it('should throw on HTTP errors', async () => {
		// Property 10: Repository Error Throwing
	});

	it('should create todo with correct payload', async () => {
		// Test create method
	});
});
```

#### Schema Tests

```typescript
// todo.schema.test.ts
describe('createTodoSchema', () => {
	it('should reject short titles', () => {
		// Property 9: Form Validation Rejection
	});

	it('should accept valid titles', () => {
		// Test valid input
	});
});
```

### Component Tests

#### TodoList Tests

```typescript
// TodoList.svelte.test.ts
describe('TodoList', () => {
	it('should render all todos', () => {
		// Test rendering
	});

	it('should call toggle on button click', () => {
		// Test event handling
	});

	it('should display error message', () => {
		// Test error display
	});
});
```

### Integration Tests

#### Page Integration Tests

```typescript
// +page.svelte.test.ts
describe('Todo Page', () => {
	it('should sync service state on data change', () => {
		// Property 8: $effect Sync on Route Change
	});

	it('should inject service into context', () => {
		// Test DI
	});
});
```

### E2E Tests

```typescript
// todos.test.ts
test('should create, toggle, and delete todo', async ({ page }) => {
	await page.goto('/todos');

	// Create todo
	await page.fill('input[name="title"]', 'Test Todo');
	await page.click('button[type="submit"]');
	await expect(page.locator('text=Test Todo')).toBeVisible();

	// Toggle todo
	await page.click('button:has-text("Done")');
	await expect(page.locator('text=Test Todo')).toHaveClass(/line-through/);

	// Delete todo
	await page.click('button:has-text("Delete")');
	await expect(page.locator('text=Test Todo')).not.toBeVisible();
});
```

## Implementation Notes

### Critical $effect Pattern

```svelte
<script lang="ts">
	interface Props {
		data: { items: TodoItem[] };
	}

	let { data }: Props = $props();

	const repo = new HttpTodoRepository(fetch);
	const service = new TodoService(repo, data.items);
	setContext(TODO_SERVICE_KEY, service);

	// CRITICAL: Sync service when route data changes
	$effect(() => {
		service.items = data.items;
	});
</script>
```

### Optimistic Updates

```typescript
async toggle(id: string): Promise<void> {
    const todo = this.items.find(t => t.id === id);
    if (!todo) return;

    // 1. Update UI immediately
    const previousState = todo.completed;
    todo.completed = !todo.completed;

    try {
        // 2. Persist to server
        await this.repo.update(id, { completed: todo.completed });
    } catch (err) {
        // 3. Rollback on error
        todo.completed = previousState;
        this.error = (err as Error).message;
    }
}
```

### Form Handling Pattern

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
				// Optionally reload todos
			}
		}
	});
</script>

<form method="POST" action="?/create" use:enhance>
	<input name="title" bind:value={$form.title} />
	{#if $errors.title}
		<span class="text-red-500">{$errors.title}</span>
	{/if}
	<button type="submit" disabled={$submitting}>
		{$submitting ? 'Creating...' : 'Create Todo'}
	</button>
</form>
```

## Performance Considerations

### Service Layer

- Use optimistic updates for better perceived performance
- Debounce rapid toggle operations
- Consider pagination for large todo lists
- Cache repository responses when appropriate

### UI Layer

- Use virtual scrolling for large lists
- Lazy load TodoForm component
- Minimize reactive statements
- Use keyed each blocks for efficient updates

## Security Considerations

### Input Validation

- Validate all user input with Zod schemas
- Sanitize todo titles to prevent XSS
- Limit title length to prevent DoS
- Validate IDs to prevent injection attacks

### API Security

- Use HTTPS for all API calls
- Implement CSRF protection for mutations
- Validate user permissions on server
- Rate limit API endpoints
