<script lang="ts">
	/**
	 * Configuration Example Page
	 *
	 * Demonstrates type-safe configuration usage
	 */

	import { publicConfig } from '$config/env.public';
	import Button from '$ui/primitives/Button.svelte';

	interface ConfigItem {
		key: string;
		value: string | boolean;
		description: string;
	}

	const configItems: ConfigItem[] = [
		{
			key: 'apiBase',
			value: publicConfig.apiBase,
			description: 'Base URL for API requests'
		},
		{
			key: 'appName',
			value: publicConfig.appName,
			description: 'Application name'
		},
		{
			key: 'isDev',
			value: publicConfig.isDev,
			description: 'Whether running in development mode'
		},
		{
			key: 'isProd',
			value: publicConfig.isProd,
			description: 'Whether running in production mode'
		}
	];
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-12">
			<h1 class="text-4xl font-bold text-gray-900 mb-2">Configuration Example</h1>
			<p class="text-lg text-gray-600">
				Type-safe environment variable management
			</p>
		</div>

		<!-- Configuration Table -->
		<section class="mb-12 bg-white rounded-lg shadow overflow-hidden">
			<table class="w-full">
				<thead class="bg-gray-100 border-b">
					<tr>
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Key</th>
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Value</th>
						<th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
					</tr>
				</thead>
				<tbody class="divide-y">
					{#each configItems as item}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 text-sm font-mono text-gray-900">{item.key}</td>
							<td class="px-6 py-4 text-sm">
								<code class="bg-gray-100 px-2 py-1 rounded">
									{String(item.value)}
								</code>
							</td>
							<td class="px-6 py-4 text-sm text-gray-600">{item.description}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>

		<!-- Usage Examples -->
		<section class="mb-12 bg-white rounded-lg shadow p-6">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Usage Examples</h2>

			<div class="space-y-6">
				<!-- Public Config -->
				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">Public Configuration</h3>
					<p class="text-gray-600 mb-3">
						Use publicConfig for client-safe environment variables:
					</p>
					<pre class="bg-gray-100 p-4 rounded overflow-x-auto text-sm"><code>{`import { publicConfig } from '$config/env.public';

// Access configuration
const apiUrl = \`\${publicConfig.apiBase}/api\`;
const appName = publicConfig.appName;
const isDev = publicConfig.isDev;
const isProd = publicConfig.isProd;`}</code></pre>
				</div>

				<!-- Private Config -->
				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">Private Configuration</h3>
					<p class="text-gray-600 mb-3">
						Use privateConfig for server-only environment variables:
					</p>
					<pre class="bg-gray-100 p-4 rounded overflow-x-auto text-sm"><code>{`// In +page.server.ts or +server.ts
import { privateConfig } from '$config/env.private';

// Access server-only configuration
const apiSecret = privateConfig.apiSecret;
const dbUrl = privateConfig.databaseUrl;`}</code></pre>
				</div>

				<!-- Environment Variables -->
				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">Environment Variables</h3>
					<p class="text-gray-600 mb-3">
						Set these in your .env file:
					</p>
					<pre class="bg-gray-100 p-4 rounded overflow-x-auto text-sm"><code>{`# Public (client-safe)
PUBLIC_API_BASE=http://localhost:3000
PUBLIC_APP_NAME=My App

# Private (server-only)
API_SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://...`}</code></pre>
				</div>

				<!-- Type Safety -->
				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">Type Safety</h3>
					<p class="text-gray-600 mb-3">
						Configuration is fully typed with TypeScript:
					</p>
					<pre class="bg-gray-100 p-4 rounded overflow-x-auto text-sm"><code>{`import { publicConfig } from '$config/env.public';
import type { PublicConfig } from '$config/env.public';

// TypeScript knows all properties
const config: PublicConfig = publicConfig;

// Autocomplete works
const url = publicConfig.apiBase; // ✅ Works
const invalid = publicConfig.invalid; // ❌ Error`}</code></pre>
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
						import { publicConfig } from '$config/env.public';
					</code>
				</div>

				<div class="border-l-4 border-red-500 pl-4">
					<h3 class="font-semibold text-red-900 mb-1">❌ DON'T</h3>
					<code class="text-sm text-gray-700">
						import { PUBLIC_API_BASE } from '$env/static/public';
					</code>
				</div>

				<div class="border-l-4 border-green-500 pl-4">
					<h3 class="font-semibold text-green-900 mb-1">✅ DO</h3>
					<code class="text-sm text-gray-700">
						// In +page.server.ts<br />
						import { privateConfig } from '$config/env.private';
					</code>
				</div>

				<div class="border-l-4 border-red-500 pl-4">
					<h3 class="font-semibold text-red-900 mb-1">❌ DON'T</h3>
					<code class="text-sm text-gray-700">
						// In +page.svelte<br />
						import { privateConfig } from '$config/env.private';
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
