# Design Document

## Overview

The infrastructure setup provides the foundational architecture for a large-scale SvelteKit application. It establishes the configuration layer, core utilities, dependency injection system, and UI primitives library that all business domains will depend on. This design follows the four core principles: Contract-First, Screaming Architecture, Logic Externalization, and Anti-Corruption Layer.

## Architecture

### Layered Structure

```
┌─────────────────────────────────────┐
│         Route Layer                 │  (Glue code)
├─────────────────────────────────────┤
│         Domain Layer                │  (Business logic - future specs)
├─────────────────────────────────────┤
│      Presentation Layer (UI)        │  ← This spec
├─────────────────────────────────────┤
│         Core Layer                  │  ← This spec
├─────────────────────────────────────┤
│      Configuration Layer            │  ← This spec
└─────────────────────────────────────┘
```

### Directory Structure

```
src/lib/
├── config/
│   ├── env.public.ts          # Client-safe configuration
│   └── env.private.ts         # Server-only configuration
├── core/
│   ├── api/
│   │   └── http-client.ts     # Configured fetch wrapper
│   ├── context/
│   │   └── keys.ts            # DI Symbol keys
│   └── i18n/
│       └── (future)           # i18n utilities
└── ui/
    ├── primitives/
    │   ├── Button.svelte      # Button component
    │   ├── Input.svelte       # Input component
    │   └── Modal.svelte       # Modal component
    └── layouts/
        └── (future)           # Layout components
```

## Components and Interfaces

### Configuration Layer

#### Public Configuration Interface

```typescript
// src/lib/config/env.public.ts
export interface PublicConfig {
	readonly apiBase: string;
	readonly appName: string;
	readonly isDev: boolean;
	readonly isProd: boolean;
}

export const publicConfig: PublicConfig;
```

#### Private Configuration Interface

```typescript
// src/lib/config/env.private.ts
export interface PrivateConfig {
	readonly apiSecret: string;
	readonly databaseUrl: string;
}

export const privateConfig: PrivateConfig;
```

### Core Layer

#### HTTP Client Interface

```typescript
// src/lib/core/api/http-client.ts
export interface HttpClient {
	get<T>(url: string, options?: RequestInit): Promise<T>;
	post<T>(url: string, body: unknown, options?: RequestInit): Promise<T>;
	put<T>(url: string, body: unknown, options?: RequestInit): Promise<T>;
	delete<T>(url: string, options?: RequestInit): Promise<T>;
}

export function createHttpClient(fetchFn: typeof fetch): HttpClient;
```

#### Context Keys

```typescript
// src/lib/core/context/keys.ts
// Symbol keys for dependency injection
// Future domains will add their keys here
export const HTTP_CLIENT_KEY = Symbol('HTTP_CLIENT');
```

### UI Primitives Layer

#### Button Component Interface

```typescript
// src/lib/ui/primitives/Button.svelte
import type { Snippet } from 'svelte';

interface ButtonProps {
	children: Snippet;
	onclick?: (e: MouseEvent) => void;
	variant?: 'primary' | 'secondary' | 'danger';
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset';
	class?: string;
}
```

#### Input Component Interface

```typescript
// src/lib/ui/primitives/Input.svelte
interface InputProps {
	value?: string;
	oninput?: (e: Event) => void;
	type?: 'text' | 'email' | 'password' | 'number';
	placeholder?: string;
	label?: string;
	error?: string;
	disabled?: boolean;
	required?: boolean;
	class?: string;
}

// Note: For two-way binding, use $bindable()
// let { value = $bindable('') } = $props();
```

#### Modal Component Interface

```typescript
// src/lib/ui/primitives/Modal.svelte
import type { Snippet } from 'svelte';

interface ModalProps {
	open: boolean;
	onclose?: () => void;
	children: Snippet;
	header?: Snippet<[{ close: () => void }]>;
	footer?: Snippet<[{ close: () => void }]>;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	class?: string;
}
```

## Data Models

### Configuration Models

```typescript
// Environment variable types
interface EnvironmentVariables {
	// Public (client-safe)
	PUBLIC_API_BASE: string;
	PUBLIC_APP_NAME?: string;

	// Private (server-only)
	API_SECRET_KEY: string;
	DATABASE_URL?: string;
}
```

### HTTP Response Models

```typescript
// Standard API response wrapper
interface ApiResponse<T> {
	data: T;
	error?: string;
	status: number;
}

// Standard error response
interface ApiError {
	message: string;
	code: string;
	status: number;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Configuration Validation

_For any_ required environment variable, if it is missing at startup, the system should throw a descriptive error before any code execution.

**Validates: Requirements 2.3**

### Property 2: Configuration Immutability

_For any_ configuration object (publicConfig or privateConfig), attempting to modify its properties should result in a TypeScript error or runtime error.

**Validates: Requirements 2.5**

### Property 3: Path Alias Resolution

_For any_ valid path alias ($lib, $core, $ui, etc.), TypeScript should resolve imports correctly and provide autocomplete.

**Validates: Requirements 1.7**

### Property 4: HTTP Client Error Handling

_For any_ HTTP request that returns a non-2xx status code, the HTTP client should throw a standardized Error object with status and message.

**Validates: Requirements 5.2**

### Property 5: Context Key Uniqueness

_For any_ two different context keys, they should be unique Symbol instances that cannot collide.

**Validates: Requirements 3.1**

### Property 6: Button Variant Rendering

_For any_ Button component with a variant prop, the rendered output should include the correct Tailwind classes for that variant.

**Validates: Requirements 4.3**

### Property 7: Input Value Binding

_For any_ Input component, when the value prop changes, the input element's value should update to match.

**Validates: Requirements 4.6**

### Property 8: Modal Open State

_For any_ Modal component, when the open prop is false, the modal should not be visible in the DOM or should have display:none.

**Validates: Requirements 4.7**

### Property 9: UI Primitive Accessibility

_For any_ UI primitive component, it should include appropriate ARIA attributes and support keyboard navigation.

**Validates: Requirements 4.10**

### Property 10: TypeScript Strict Mode

_For any_ TypeScript file in the project, it should be checked with all strict mode flags enabled, and `any` types should be flagged as errors.

**Validates: Requirements 6.1**

## Error Handling

### Configuration Layer Errors

- **Missing Required Variable**: Throw immediately at module load with clear message
- **Invalid Variable Format**: Throw with validation error details
- **Type Mismatch**: Caught by TypeScript at compile time

### HTTP Client Errors

- **Network Errors**: Throw Error with "Network request failed" message
- **HTTP Errors (4xx/5xx)**: Throw Error with status code and response body
- **Timeout**: Throw Error with "Request timeout" message
- **Parse Errors**: Throw Error with "Failed to parse response" message

### UI Component Errors

- **Invalid Props**: Caught by TypeScript at compile time
- **Missing Required Props**: TypeScript error
- **Runtime Errors**: Caught by Svelte error boundary (future)

## Testing Strategy

### Unit Tests

#### Configuration Tests

```typescript
// config/env.public.test.ts
describe('publicConfig', () => {
	it('should throw when PUBLIC_API_BASE is missing', () => {
		// Test missing required variable
	});

	it('should provide correct isDev value', () => {
		// Test computed properties
	});
});
```

#### HTTP Client Tests

```typescript
// core/api/http-client.test.ts
describe('HttpClient', () => {
	it('should make GET requests with correct URL', async () => {
		// Test GET method
	});

	it('should throw on 404 errors', async () => {
		// Test error handling
	});

	it('should include auth headers when provided', async () => {
		// Test request configuration
	});
});
```

#### UI Primitive Tests

```typescript
// ui/primitives/Button.svelte.test.ts
describe('Button', () => {
	it('should render children content', () => {
		// Test snippet rendering
	});

	it('should call onclick handler', () => {
		// Test event handling
	});

	it('should apply variant classes', () => {
		// Test styling
	});

	it('should be keyboard accessible', () => {
		// Test accessibility
	});
});
```

### Integration Tests

#### Path Alias Tests

- Verify all path aliases resolve correctly
- Test imports from different layers
- Verify no circular dependencies

#### Configuration Integration

- Test that configuration is available in both client and server contexts
- Verify server-only config is not accessible in client code

### Storybook Stories

#### Button Stories

- All variants (primary, secondary, danger)
- All sizes (sm, md, lg)
- Disabled state
- With icons
- Loading state

#### Input Stories

- All types (text, email, password, number)
- With label
- With error
- Disabled state
- Required state

#### Modal Stories

- Different sizes
- With header and footer
- Without header/footer
- Nested modals
- Accessibility features

## Implementation Notes

### Svelte 5 Patterns

#### Using $props (MANDATORY)

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary';
		children: Snippet;
		class?: string;
	}

	// ✅ CORRECT: Rename 'class' to avoid reserved word
	let { variant = 'primary', children, class: className }: Props = $props();
</script>

<div class={className}>
	{@render children()}
</div>
```

#### Using Snippets (NO <slot> allowed)

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		header?: Snippet<[{ title: string }]>;
		children?: Snippet;
	}

	let { header, children }: Props = $props();
</script>

{#if header}
	{@render header({ title: 'Modal Title' })}
{/if}

{@render children?.()}
```

#### Event Handling (NO on: directive)

```svelte
<script lang="ts">
	interface Props {
		onclick?: (e: MouseEvent) => void;
	}

	let { onclick }: Props = $props();

	function handleClick(event: MouseEvent) {
		event.preventDefault(); // Manual modifier
		onclick?.(event);
	}
</script>

<!-- ❌ WRONG: on:click directive -->
<!-- <button on:click|preventDefault={handleClick}> -->

<!-- ✅ CORRECT: onclick attribute -->
<button {onclick}>Click</button>
```

#### Bindable Props (For two-way binding)

```svelte
<script lang="ts">
	interface Props {
		value?: string;
	}

	// ✅ CORRECT: Use $bindable() for bind:value
	let { value = $bindable('') }: Props = $props();
</script>

<input bind:value placeholder="Enter text" />
```

### TypeScript Configuration

```json
{
	"compilerOptions": {
		"strict": true,
		"noImplicitAny": true,
		"strictNullChecks": true,
		"strictFunctionTypes": true,
		"strictBindCallApply": true,
		"strictPropertyInitialization": true,
		"noImplicitThis": true,
		"alwaysStrict": true
	}
}
```

### Path Alias Configuration

```javascript
// svelte.config.js
export default {
	kit: {
		alias: {
			$core: 'src/lib/core',
			$ui: 'src/lib/ui',
			$domains: 'src/lib/domains',
			$config: 'src/lib/config',
			$server: 'src/lib/server',
			$paraglide: 'src/lib/paraglide'
		}
	}
};
```

## Performance Considerations

### Configuration

- Configuration objects are created once at startup
- Use `as const` for immutability and better tree-shaking
- No runtime overhead for accessing config values

### HTTP Client

- Reuse fetch function from SvelteKit for SSR compatibility
- Consider adding request caching for repeated calls
- Implement request deduplication for concurrent identical requests

### UI Components

- Use Svelte's compile-time optimizations
- Minimize reactive statements
- Use CSS classes instead of inline styles
- Lazy load Modal component when needed

## Security Considerations

### Configuration

- Never expose private config to client code
- Validate all environment variables at startup
- Use TypeScript to enforce client/server boundaries
- Sanitize any user-provided configuration values

### HTTP Client

- Always use HTTPS in production
- Implement CSRF protection for mutations
- Sanitize URLs to prevent injection attacks
- Set appropriate CORS headers

### UI Components

- Sanitize any user-provided content
- Use Svelte's built-in XSS protection
- Implement proper ARIA labels for accessibility
- Validate all user inputs before processing
