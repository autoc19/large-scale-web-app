<script lang="ts">
	/**
	 * HTTP Client Example Page
	 *
	 * Demonstrates HTTP client usage with error handling
	 */

	import Button from '$ui/primitives/Button.svelte';
	import Input from '$ui/primitives/Input.svelte';
	import Modal from '$ui/primitives/Modal.svelte';
	import { createHttpClient } from '$core/api/http-client';

	interface ApiExample {
		method: string;
		endpoint: string;
		description: string;
		code: string;
	}

	const examples: ApiExample[] = [
		{
			method: 'GET',
			endpoint: '/api/todos',
			description: 'Fetch all todos',
			code: `const client = createHttpClient(fetch);
const todos = await client.get('/api/todos');`
		},
		{
			method: 'POST',
			endpoint: '/api/todos',
			description: 'Create a new todo',
			code: `const client = createHttpClient(fetch);
const newTodo = await client.post('/api/todos', {
  title: 'New Todo'
});`
		},
		{
			method: 'PUT',
			endpoint: '/api/todos/:id',
			description: 'Update a todo',
			code: `const client = createHttpClient(fetch);
const updated = await client.put('/api/todos/1', {
  title: 'Updated Todo'
});`
		},
		{
			method: 'DELETE',
			endpoint: '/api/todos/:id',
			description: 'Delete a todo',
			code: `const client = createHttpClient(fetch);
await client.delete('/api/todos/1');`
		}
	];

	let isModalOpen = false;
	let modalTitle = '';
	let modalContent = '';

	function showExample(example: ApiExample) {
		modalTitle = `${example.method} ${example.endpoint}`;
		modalContent = example.code;
		isModalOpen = true;
	}
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-12">
			<h1 class="text-4xl font-bold text-gray-900 mb-2">HTTP Client Example</h1>
			<p class="text-lg text-gray-600">
				Type-safe HTTP requests with error handling
			</p>
		</div>

		<!-- Overview -->
		<section class="mb-12 bg-white rounded-lg shadow p-6">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
			<p class="text-gray-700 mb-4">
				The HTTP client provides a configured fetch wrapper with:
			</p>
			<ul class="list-disc list-inside space-y-2 text-gray-700">
				<li>Automatic base URL configuration from publicConfig</li>
				<li>Standardized error handling</li>
				<li>SSR compatibility with SvelteKit fetch</li>
				<li>Type-safe request and response handling</li>
			</ul>
		</section>

		<!-- API Methods -->
		<section class="mb-12 bg-white rounded-lg shadow overflow-hidden">
			<div class="p-6 border-b">
				<h2 class="text-2xl font-bold text-gray-900">HTTP Methods</h2>
			</div>
			<div class="divide-y">
				{#each examples as example}
					<div class="p-6 hover:bg-gray-50 transition">
						<div class="flex items-start justify-between mb-2">
							<div>
								<span class="inline-block px-3 py-1 rounded text-sm font-semibold text-white bg-blue-600 mr-3">
									{example.method}
								</span>
								<span class="font-mono text-gray-700">{example.endpoint}</span>
							</div>
							<Button size="sm" onclick={() => showExample(example)}>
								View Code
							</Button>
						</div>
						<p class="text-gray-600">{example.description}</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- Usage Examples -->
		<section class="mb-12 bg-white rounded-lg shadow p-6">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Usage Examples</h2>

			<div class="space-y-6">
				<!-- Basic Usage -->
				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">Basic Usage</h3>
					<pre class="bg-gray-100 p-4 rounded overflow-x-auto text-sm"><code>{`import { createHttpClient } from '$core/api/http-client';

export const load = async ({ fetch }) => {
  const client = createHttpClient(fetch);
  const data = await client.get('/api/todos');
  return { data };
};`}</code></pre>
				</div>

				<!-- Error Handling -->
				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">Error Handling</h3>
					<pre class="bg-gray-100 p-4 rounded overflow-x-auto text-sm"><code>{`try {
  const data = await client.get('/api/todos');
} catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
    // Error message includes status code
    // e.g., "API Error: 404 Not Found"
  }
}`}</code></pre>
				</div>

				<!-- POST Request -->
				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">POST Request</h3>
					<pre class="bg-gray-100 p-4 rounded overflow-x-auto text-sm"><code>{`const client = createHttpClient(fetch);

const newTodo = await client.post('/api/todos', {
  title: 'Learn Svelte',
  completed: false
});`}</code></pre>
				</div>

				<!-- Request Options -->
				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">Request Options</h3>
					<pre class="bg-gray-100 p-4 rounded overflow-x-auto text-sm"><code>{`const client = createHttpClient(fetch);

const data = await client.get('/api/todos', {
  headers: {
    'Authorization': 'Bearer token',
    'X-Custom-Header': 'value'
  }
});`}</code></pre>
				</div>

				<!-- Type Safety -->
				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">Type Safety</h3>
					<pre class="bg-gray-100 p-4 rounded overflow-x-auto text-sm"><code>{`interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
}

const client = createHttpClient(fetch);
const todos = await client.get<TodoItem[]>('/api/todos');
// todos is typed as TodoItem[]`}</code></pre>
				</div>
			</div>
		</section>

		<!-- Error Handling Guide -->
		<section class="mb-12 bg-white rounded-lg shadow p-6">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Error Handling</h2>

			<div class="space-y-4">
				<div class="border-l-4 border-blue-500 pl-4 py-2">
					<h3 class="font-semibold text-blue-900 mb-1">Network Error</h3>
					<code class="text-sm text-gray-700">Network request failed</code>
				</div>

				<div class="border-l-4 border-yellow-500 pl-4 py-2">
					<h3 class="font-semibold text-yellow-900 mb-1">4xx Error</h3>
					<code class="text-sm text-gray-700">API Error: 404 Not Found</code>
				</div>

				<div class="border-l-4 border-red-500 pl-4 py-2">
					<h3 class="font-semibold text-red-900 mb-1">5xx Error</h3>
					<code class="text-sm text-gray-700">API Error: 500 Internal Server Error</code>
				</div>

				<div class="border-l-4 border-purple-500 pl-4 py-2">
					<h3 class="font-semibold text-purple-900 mb-1">Parse Error</h3>
					<code class="text-sm text-gray-700">Failed to parse response</code>
				</div>
			</div>
		</section>

		<!-- Best Practices -->
		<section class="bg-white rounded-lg shadow p-6">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Best Practices</h2>

			<div class="space-y-4">
				<div class="border-l-4 border-green-500 pl-4">
					<h3 class="font-semibold text-green-900 mb-1">✅ DO</h3>
					<code class="text-sm text-gray-700">
						const client = createHttpClient(fetch);
					</code>
				</div>

				<div class="border-l-4 border-red-500 pl-4">
					<h3 class="font-semibold text-red-900 mb-1">❌ DON'T</h3>
					<code class="text-sm text-gray-700">
						fetch('/api/todos'); // No error handling
					</code>
				</div>

				<div class="border-l-4 border-green-500 pl-4">
					<h3 class="font-semibold text-green-900 mb-1">✅ DO</h3>
					<code class="text-sm text-gray-700">
						try { ... } catch (error) { ... }
					</code>
				</div>

				<div class="border-l-4 border-red-500 pl-4">
					<h3 class="font-semibold text-red-900 mb-1">❌ DON'T</h3>
					<code class="text-sm text-gray-700">
						await client.get('/api/todos'); // Unhandled error
					</code>
				</div>
			</div>
		</section>

		<!-- Navigation -->
		<div class="mt-12 flex gap-4">
			<Button onclick={() => window.history.back()} variant="secondary">
				Back
			</Button>
			<Button onclick={() => (window.location.href = '/examples')} variant="primary">
				All Examples
			</Button>
		</div>
	</div>
</div>

<!-- Code Modal -->
<Modal bind:open={isModalOpen} header={() => modalTitle} size="lg">
	<pre class="bg-gray-100 p-4 rounded overflow-x-auto text-sm"><code>{modalContent}</code></pre>
	<div class="mt-4 flex gap-2">
		<Button onclick={() => (isModalOpen = false)} variant="primary">
			Close
		</Button>
	</div>
</Modal>
