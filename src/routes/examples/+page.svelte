<script lang="ts">
	/**
	 * Examples Page
	 *
	 * Demonstrates usage of infrastructure components:
	 * - UI Primitives (Button, Input, Modal)
	 * - Configuration
	 * - HTTP Client
	 */

	import Button from '$ui/primitives/Button.svelte';
	import Input from '$ui/primitives/Input.svelte';
	import Modal from '$ui/primitives/Modal.svelte';
	import { publicConfig } from '$config/env.public';

	let email = '';
	let emailError = '';
	let isModalOpen = false;
	let modalMessage = '';

	function handleEmailChange() {
		emailError = '';
	}

	function handleSubscribe() {
		if (!email) {
			emailError = 'Email is required';
			return;
		}

		if (!email.includes('@')) {
			emailError = 'Please enter a valid email';
			return;
		}

		modalMessage = `Successfully subscribed with ${email}!`;
		isModalOpen = true;
		email = '';
	}

	function handleModalClose() {
		isModalOpen = false;
		modalMessage = '';
	}
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-12">
			<h1 class="text-4xl font-bold text-gray-900 mb-2">Infrastructure Examples</h1>
			<p class="text-lg text-gray-600">
				Demonstrating UI Primitives, Configuration, and HTTP Client usage
			</p>
		</div>

		<!-- Configuration Section -->
		<section class="mb-12 bg-white rounded-lg shadow p-6">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">Configuration</h2>
			<div class="space-y-2 text-gray-700">
				<p><strong>App Name:</strong> {publicConfig.appName}</p>
				<p><strong>API Base:</strong> {publicConfig.apiBase}</p>
				<p><strong>Environment:</strong> {publicConfig.isDev ? 'Development' : 'Production'}</p>
				<p><strong>Mode:</strong> {publicConfig.isDev ? 'Dev' : 'Prod'}</p>
			</div>
		</section>

		<!-- UI Primitives Section -->
		<section class="mb-12 bg-white rounded-lg shadow p-6">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">UI Primitives</h2>

			<!-- Button Examples -->
			<div class="mb-8">
				<h3 class="text-xl font-semibold text-gray-800 mb-4">Buttons</h3>
				<div class="flex flex-wrap gap-4">
					<Button variant="primary">Primary Button</Button>
					<Button variant="secondary">Secondary Button</Button>
					<Button variant="danger">Danger Button</Button>
					<Button size="sm">Small</Button>
					<Button size="md">Medium</Button>
					<Button size="lg">Large</Button>
					<Button disabled>Disabled</Button>
				</div>
			</div>

			<!-- Input Examples -->
			<div class="mb-8">
				<h3 class="text-xl font-semibold text-gray-800 mb-4">Inputs</h3>
				<div class="space-y-4 max-w-md">
					<Input type="text" label="Text Input" placeholder="Enter text" />
					<Input type="email" label="Email Input" placeholder="Enter email" />
					<Input type="password" label="Password Input" placeholder="Enter password" />
					<Input type="number" label="Number Input" placeholder="Enter number" />
					<Input label="Required Field" required />
					<Input label="Disabled Field" disabled />
					<Input label="With Error" error="This field has an error" />
				</div>
			</div>

			<!-- Modal Example -->
			<div class="mb-8">
				<h3 class="text-xl font-semibold text-gray-800 mb-4">Modal</h3>
				<Button onclick={() => (isModalOpen = true)}>Open Modal</Button>
			</div>
		</section>

		<!-- Form Example -->
		<section class="mb-12 bg-white rounded-lg shadow p-6">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Form Example</h2>
			<div class="max-w-md">
				<form
					onsubmit={(e) => {
						e.preventDefault();
						handleSubscribe();
					}}
					class="space-y-4"
				>
					<Input
						bind:value={email}
						type="email"
						label="Email Address"
						placeholder="Enter your email"
						error={emailError}
						required
					/>

					<Button type="submit" variant="primary" class="w-full">
						Subscribe
					</Button>
				</form>
			</div>
		</section>

		<!-- Code Examples -->
		<section class="bg-white rounded-lg shadow p-6">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>

			<div class="space-y-6">
				<!-- Button Example -->
				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">Button Component</h3>
					<pre class="bg-gray-100 p-4 rounded overflow-x-auto text-sm"><code>{`<script lang="ts">
  import Button from '$ui/primitives/Button.svelte';
</script>

<Button variant="primary" onclick={() => console.log('clicked')}>
  Click me
</Button>`}</code></pre>
				</div>

				<!-- Input Example -->
				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">Input Component</h3>
					<pre class="bg-gray-100 p-4 rounded overflow-x-auto text-sm"><code>{`<script lang="ts">
  import Input from '$ui/primitives/Input.svelte';
  let email = '';
</script>

<Input
  bind:value={email}
  type="email"
  label="Email"
  placeholder="Enter email"
/>`}</code></pre>
				</div>

				<!-- Configuration Example -->
				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">Configuration Usage</h3>
					<pre class="bg-gray-100 p-4 rounded overflow-x-auto text-sm"><code>{`import { publicConfig } from '$config/env.public';

const apiUrl = \`\${publicConfig.apiBase}/api\`;
const appName = publicConfig.appName;`}</code></pre>
				</div>

				<!-- HTTP Client Example -->
				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">HTTP Client Usage</h3>
					<pre class="bg-gray-100 p-4 rounded overflow-x-auto text-sm"><code>{`import { createHttpClient } from '$core/api/http-client';

export const load = async ({ fetch }) => {
  const client = createHttpClient(fetch);
  const data = await client.get('/api/todos');
  return { data };
};`}</code></pre>
				</div>
			</div>
		</section>
	</div>
</div>

<!-- Modal -->
<Modal bind:open={isModalOpen} onclose={handleModalClose}>
	{#snippet header({ close })}
		<span>Success</span>
	{/snippet}
	<p class="text-gray-700">{modalMessage}</p>
	<div class="mt-4 flex gap-2">
		<Button variant="primary" onclick={handleModalClose}>
			Close
		</Button>
	</div>
</Modal>
