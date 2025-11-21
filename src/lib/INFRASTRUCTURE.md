# Infrastructure Layer Documentation

This document provides comprehensive guidance on using the infrastructure layer components: configuration management, HTTP client, dependency injection, and UI primitives.

## Table of Contents

1. [Configuration Management](#configuration-management)
2. [HTTP Client](#http-client)
3. [Dependency Injection](#dependency-injection)
4. [UI Primitives](#ui-primitives)
5. [Best Practices](#best-practices)

## Configuration Management

### Overview

The configuration layer provides type-safe access to environment variables with clear separation between client-safe and server-only configuration.

### Public Configuration

Use `publicConfig` for client-safe environment variables that are exposed to the browser.

```typescript
// src/lib/config/env.public.ts
import { publicConfig } from '$config/env.public';

// Access configuration
const apiUrl = `${publicConfig.apiBase}/api`;
const appName = publicConfig.appName;
const isDev = publicConfig.isDev;
const isProd = publicConfig.isProd;
```

**Available Properties:**
- `apiBase` (string): Base URL for API requests
- `appName` (string): Application name with default value
- `isDev` (boolean): Whether running in development mode
- `isProd` (boolean): Whether running in production mode

**Environment Variables:**
- `PUBLIC_API_BASE` (required): Base URL for API
- `PUBLIC_APP_NAME` (optional): Application name

### Private Configuration

Use `privateConfig` for server-only environment variables. **Never import this in client code.**

```typescript
// In +page.server.ts or +server.ts
import { privateConfig } from '$config/env.private';

// Access server-only configuration
const apiSecret = privateConfig.apiSecret;
const dbUrl = privateConfig.databaseUrl;
```

**Available Properties:**
- `apiSecret` (string): API secret key for authentication
- `databaseUrl` (string | null): Database connection URL

**Environment Variables:**
- `API_SECRET_KEY` (required): Secret key for API
- `DATABASE_URL` (optional): Database connection string

### Configuration Validation

Configuration is validated at module load time. If required variables are missing, an error is thrown immediately:

```
FATAL: PUBLIC_API_BASE environment variable is required
FATAL: API_SECRET_KEY environment variable is required
```

### Configuration Immutability

Configuration objects are immutable using `as const`. Attempting to modify them will throw an error:

```typescript
// This will throw an error
publicConfig.apiBase = 'new-value'; // ❌ Error
```

## HTTP Client

### Overview

The HTTP client provides a configured fetch wrapper with error handling and SSR compatibility.

### Creating an HTTP Client

```typescript
import { createHttpClient } from '$core/api/http-client';

// In a load function (SSR-compatible)
export const load = async ({ fetch }) => {
	const client = createHttpClient(fetch);
	const data = await client.get('/api/todos');
	return { data };
};

// In a component (client-side)
const client = createHttpClient(window.fetch);
```

### HTTP Methods

```typescript
// GET request
const data = await client.get<TodoItem[]>('/todos');

// POST request
const newTodo = await client.post<TodoItem>('/todos', {
	title: 'New Todo'
});

// PUT request
const updated = await client.put<TodoItem>('/todos/1', {
	title: 'Updated Todo'
});

// DELETE request
await client.delete('/todos/1');
```

### Error Handling

The HTTP client throws standardized Error objects for non-2xx responses:

```typescript
try {
	const data = await client.get('/todos');
} catch (error) {
	if (error instanceof Error) {
		console.error('API Error:', error.message);
		// Error message includes status code and details
	}
}
```

**Error Messages:**
- `API Error: 404 Not Found`
- `API Error: 500 Internal Server Error`
- `Network request failed`
- `Failed to parse response`

### Base URL Configuration

The HTTP client automatically uses `publicConfig.apiBase` as the base URL:

```typescript
// If PUBLIC_API_BASE=https://api.example.com
const client = createHttpClient(fetch);
await client.get('/todos'); // Requests https://api.example.com/todos
```

### Request Options

Pass additional fetch options:

```typescript
const data = await client.get('/todos', {
	headers: {
		'Authorization': 'Bearer token'
	}
});
```

## Dependency Injection

### Overview

The dependency injection system uses Svelte context with Symbol keys to provide services to components without prop drilling.

### Context Keys

All context keys are defined in `src/lib/core/context/keys.ts`:

```typescript
import { HTTP_CLIENT_KEY, TODO_SERVICE_KEY } from '$core/context/keys';
```

**Available Keys:**
- `HTTP_CLIENT_KEY`: HTTP client instance
- `TODO_SERVICE_KEY`: Todo service instance

### Injecting Services

In your page component (`+page.svelte`):

```typescript
<script lang="ts">
	import { setContext } from 'svelte';
	import { createHttpClient } from '$core/api/http-client';
	import { HTTP_CLIENT_KEY } from '$core/context/keys';

	const client = createHttpClient(fetch);
	setContext(HTTP_CLIENT_KEY, client);
</script>
```

### Consuming Services

In child components:

```typescript
<script lang="ts">
	import { getContext } from 'svelte';
	import { HTTP_CLIENT_KEY } from '$core/context/keys';
	import type { HttpClient } from '$core/api/http-client';

	const client = getContext<HttpClient>(HTTP_CLIENT_KEY);

	async function loadData() {
		const data = await client.get('/api/data');
	}
</script>
```

### Adding New Context Keys

To add a new service:

1. Define the key in `src/lib/core/context/keys.ts`:

```typescript
export const MY_SERVICE_KEY = Symbol('MY_SERVICE');
```

2. Inject in your page:

```typescript
import { MY_SERVICE_KEY } from '$core/context/keys';

const service = new MyService();
setContext(MY_SERVICE_KEY, service);
```

3. Consume in components:

```typescript
const service = getContext<MyService>(MY_SERVICE_KEY);
```

## UI Primitives

### Overview

UI primitives are reusable, accessible components built with Svelte 5 Snippets and Tailwind CSS.

### Button Component

A versatile button component with multiple variants and sizes.

```svelte
<script lang="ts">
	import Button from '$ui/primitives/Button.svelte';
</script>

<!-- Basic button -->
<Button>Click me</Button>

<!-- With variant -->
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>

<!-- With size -->
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

<!-- With click handler -->
<Button onclick={() => console.log('clicked')}>
	Click me
</Button>

<!-- Disabled state -->
<Button disabled>Disabled</Button>

<!-- Submit button -->
<Button type="submit">Submit</Button>

<!-- Custom class -->
<Button class="custom-class">Custom</Button>
```

**Props:**
- `children` (Snippet): Button content
- `onclick` (function): Click handler
- `variant` ('primary' | 'secondary' | 'danger'): Button style
- `size` ('sm' | 'md' | 'lg'): Button size
- `disabled` (boolean): Disable button
- `type` ('button' | 'submit' | 'reset'): Button type
- `class` (string): Custom CSS classes

### Input Component

A form input with label, error display, and two-way binding.

```svelte
<script lang="ts">
	import Input from '$ui/primitives/Input.svelte';

	let email = '';
</script>

<!-- Basic input -->
<Input bind:value={email} />

<!-- With label -->
<Input bind:value={email} label="Email" />

<!-- With placeholder -->
<Input bind:value={email} placeholder="Enter email" />

<!-- Different types -->
<Input type="email" />
<Input type="password" />
<Input type="number" />
<Input type="tel" />

<!-- With error -->
<Input bind:value={email} error="Email is required" />

<!-- Required field -->
<Input bind:value={email} required />

<!-- Disabled -->
<Input bind:value={email} disabled />

<!-- Custom class -->
<Input bind:value={email} class="custom-class" />
```

**Props:**
- `value` (string): Input value (use `bind:value`)
- `type` (string): Input type (text, email, password, number, tel, url)
- `label` (string): Label text
- `placeholder` (string): Placeholder text
- `error` (string): Error message
- `required` (boolean): Mark as required
- `disabled` (boolean): Disable input
- `id` (string): Input ID (auto-generated if not provided)
- `class` (string): Custom CSS classes

### Modal Component

A dialog modal with header, footer, and backdrop.

```svelte
<script lang="ts">
	import Modal from '$ui/primitives/Modal.svelte';

	let isOpen = false;
</script>

<!-- Basic modal -->
<Modal bind:open={isOpen}>
	Modal content
</Modal>

<!-- With header -->
<Modal bind:open={isOpen} header={() => 'Modal Title'}>
	Modal content
</Modal>

<!-- With footer -->
<Modal bind:open={isOpen} footer={() => 'Footer content'}>
	Modal content
</Modal>

<!-- With header and footer -->
<Modal
	bind:open={isOpen}
	header={() => 'Title'}
	footer={({ close }) => 'Close Button'}
>
	Modal content
</Modal>

<!-- Different sizes -->
<Modal bind:open={isOpen} size="sm">Content</Modal>
<Modal bind:open={isOpen} size="md">Content</Modal>
<Modal bind:open={isOpen} size="lg">Content</Modal>
<Modal bind:open={isOpen} size="xl">Content</Modal>

<!-- With close handler -->
<Modal bind:open={isOpen} onclose={() => console.log('closed')}>
	Content
</Modal>

<!-- Custom class -->
<Modal bind:open={isOpen} class="custom-class">
	Content
</Modal>
```

**Props:**
- `open` (boolean): Modal visibility (use `bind:open`)
- `children` (Snippet): Modal content
- `header` (Snippet): Header content with close function
- `footer` (Snippet): Footer content with close function
- `size` ('sm' | 'md' | 'lg' | 'xl'): Modal size
- `onclose` (function): Close handler
- `class` (string): Custom CSS classes

## Best Practices

### 1. Configuration Usage

✅ **DO:**
```typescript
import { publicConfig } from '$config/env.public';
const url = `${publicConfig.apiBase}/api`;
```

❌ **DON'T:**
```typescript
import { PUBLIC_API_BASE } from '$env/static/public';
const url = `${PUBLIC_API_BASE}/api`;
```

### 2. HTTP Client Error Handling

✅ **DO:**
```typescript
try {
	const data = await client.get('/todos');
} catch (error) {
	console.error('Failed to load todos:', error);
}
```

❌ **DON'T:**
```typescript
const data = await client.get('/todos'); // Unhandled error
```

### 3. Dependency Injection

✅ **DO:**
```typescript
// In page component
const service = new TodoService(repo);
setContext(TODO_SERVICE_KEY, service);

// In child component
const service = getContext<TodoService>(TODO_SERVICE_KEY);
```

❌ **DON'T:**
```typescript
// Prop drilling
<TodoList service={service} />
```

### 4. UI Component Props

✅ **DO:**
```svelte
<Button onclick={handleClick}>Click me</Button>
<Input bind:value={email} />
<Modal bind:open={isOpen}>Content</Modal>
```

❌ **DON'T:**
```svelte
<Button on:click={handleClick}>Click me</Button>
<Input on:input={handleInput} />
<Modal {open}>Content</Modal>
```

### 5. Accessibility

✅ **DO:**
```svelte
<Input label="Email" required />
<Button>Submit</Button>
<Modal header={() => 'Title'}>Content</Modal>
```

❌ **DON'T:**
```svelte
<input />
<button>Submit</button>
<div>Modal</div>
```

## Examples

### Complete Form Example

```svelte
<script lang="ts">
	import { getContext } from 'svelte';
	import Button from '$ui/primitives/Button.svelte';
	import Input from '$ui/primitives/Input.svelte';
	import { HTTP_CLIENT_KEY } from '$core/context/keys';
	import type { HttpClient } from '$core/api/http-client';

	const client = getContext<HttpClient>(HTTP_CLIENT_KEY);

	let email = '';
	let error = '';
	let loading = false;

	async function handleSubmit() {
		loading = true;
		error = '';

		try {
			await client.post('/subscribe', { email });
			email = '';
		} catch (err) {
			error = (err as Error).message;
		} finally {
			loading = false;
		}
	}
</script>

<form onsubmit|preventDefault={handleSubmit}>
	<Input
		bind:value={email}
		type="email"
		label="Email"
		placeholder="Enter your email"
		error={error}
		required
	/>

	<Button type="submit" disabled={loading}>
		{loading ? 'Subscribing...' : 'Subscribe'}
	</Button>
</form>
```

### Modal with Form Example

```svelte
<script lang="ts">
	import Modal from '$ui/primitives/Modal.svelte';
	import Button from '$ui/primitives/Button.svelte';
	import Input from '$ui/primitives/Input.svelte';

	let isOpen = false;
	let name = '';
</script>

<Button onclick={() => (isOpen = true)}>Open Modal</Button>

<Modal
	bind:open={isOpen}
	header={() => 'Create Item'}
	footer={({ close }) => (
		<div class="flex gap-2">
			<Button onclick={close} variant="secondary">Cancel</Button>
			<Button onclick={close} variant="primary">Create</Button>
		</div>
	)}
>
	<Input bind:value={name} label="Name" placeholder="Enter name" />
</Modal>
```

## Troubleshooting

### Configuration Not Found

**Error:** `FATAL: PUBLIC_API_BASE environment variable is required`

**Solution:** Add the required environment variable to `.env`:
```
PUBLIC_API_BASE=http://localhost:3000
```

### HTTP Client Errors

**Error:** `API Error: 404 Not Found`

**Solution:** Check that the endpoint exists and the URL is correct.

### Context Key Not Found

**Error:** `Cannot read property of undefined`

**Solution:** Ensure the service is injected in the parent component before consuming in child components.

### UI Component Not Rendering

**Error:** Component doesn't appear

**Solution:** Check that all required props are provided (e.g., `children` for Button, `open` for Modal).

## Additional Resources

- [Svelte 5 Documentation](https://svelte.dev)
- [SvelteKit Documentation](https://kit.svelte.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Architecture Principles](../../steering/architecture-principles.md)
- [Coding Standards](../../steering/coding-standards.md)
