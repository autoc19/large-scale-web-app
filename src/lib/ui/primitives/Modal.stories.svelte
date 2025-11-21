<script module>
	/**
	 * Modal Component Stories
	 *
	 * Storybook stories for the Modal component demonstrating
	 * different sizes, configurations, and accessibility features.
	 *
	 * Requirements: 4.7
	 */

	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';

	const { Story } = defineMeta({
		title: 'UI/Primitives/Modal',
		component: Modal,
		tags: ['autodocs'],
		argTypes: {
			size: {
				control: 'select',
				options: ['sm', 'md', 'lg', 'xl'],
				description: 'Size of the modal'
			},
			open: {
				control: 'boolean',
				description: 'Whether the modal is open'
			}
		}
	});
</script>

<script lang="ts">
	let openSmall = $state(false);
	let openMedium = $state(false);
	let openLarge = $state(false);
	let openXL = $state(false);
	let openHeader = $state(false);
	let openFooter = $state(false);
	let openBoth = $state(false);
	let openMinimal = $state(false);
	let openForm = $state(false);
	let openAccessibility = $state(false);
	let openConfirm = $state(false);
	let openInfo = $state(false);
	let openLongContent = $state(false);
</script>

<!-- Story: Small Size -->
<Story name="Small">
	{#snippet children()}
		<div>
			<Button onclick={() => (openSmall = true)}>Open Small Modal</Button>
			<Modal bind:open={openSmall} size="sm">
				{#snippet children()}
					<p>This is a small modal. It's perfect for brief messages or simple confirmations.</p>
				{/snippet}
			</Modal>
		</div>
	{/snippet}
</Story>

<!-- Story: Medium Size (Default) -->
<Story name="Medium">
	{#snippet children()}
		<div>
			<Button onclick={() => (openMedium = true)}>Open Medium Modal</Button>
			<Modal bind:open={openMedium} size="md">
				{#snippet children()}
					<p>
						This is a medium modal (default size). It provides a good balance between content space
						and screen real estate.
					</p>
				{/snippet}
			</Modal>
		</div>
	{/snippet}
</Story>

<!-- Story: Large Size -->
<Story name="Large">
	{#snippet children()}
		<div>
			<Button onclick={() => (openLarge = true)}>Open Large Modal</Button>
			<Modal bind:open={openLarge} size="lg">
				{#snippet children()}
					<p>
						This is a large modal. Use it when you need more space for content, forms, or detailed
						information.
					</p>
				{/snippet}
			</Modal>
		</div>
	{/snippet}
</Story>

<!-- Story: Extra Large Size -->
<Story name="ExtraLarge">
	{#snippet children()}
		<div>
			<Button onclick={() => (openXL = true)}>Open Extra Large Modal</Button>
			<Modal bind:open={openXL} size="xl">
				{#snippet children()}
					<p>
						This is an extra large modal. Perfect for complex forms, data tables, or rich content
						that needs maximum space.
					</p>
				{/snippet}
			</Modal>
		</div>
	{/snippet}
</Story>

<!-- Story: With Header -->
<Story name="WithHeader">
	{#snippet children()}
		<div>
			<Button onclick={() => (openHeader = true)}>Open Modal with Header</Button>
			<Modal bind:open={openHeader}>
				{#snippet header({ close })}
					<h2 class="text-xl font-semibold text-gray-900">Modal Title</h2>
				{/snippet}
				{#snippet children()}
					<p>
						This modal has a header section. The header is separated from the content with a border
						and provides a clear title for the modal.
					</p>
				{/snippet}
			</Modal>
		</div>
	{/snippet}
</Story>

<!-- Story: With Footer -->
<Story name="WithFooter">
	{#snippet children()}
		<div>
			<Button onclick={() => (openFooter = true)}>Open Modal with Footer</Button>
			<Modal bind:open={openFooter}>
				{#snippet children()}
					<p>
						This modal has a footer section. Footers are typically used for action buttons or
						additional information.
					</p>
				{/snippet}
				{#snippet footer({ close })}
					<div class="flex justify-end gap-2">
						<Button variant="secondary" onclick={close}>Cancel</Button>
						<Button variant="primary" onclick={close}>Confirm</Button>
					</div>
				{/snippet}
			</Modal>
		</div>
	{/snippet}
</Story>

<!-- Story: With Header and Footer -->
<Story name="WithHeaderAndFooter">
	{#snippet children()}
		<div>
			<Button onclick={() => (openBoth = true)}>Open Modal with Header & Footer</Button>
			<Modal bind:open={openBoth}>
				{#snippet header({ close })}
					<h2 class="text-xl font-semibold text-gray-900">Confirm Action</h2>
				{/snippet}
				{#snippet children()}
					<p>Are you sure you want to proceed with this action? This cannot be undone.</p>
				{/snippet}
				{#snippet footer({ close })}
					<div class="flex justify-end gap-2">
						<Button variant="secondary" onclick={close}>Cancel</Button>
						<Button variant="danger" onclick={close}>Delete</Button>
					</div>
				{/snippet}
			</Modal>
		</div>
	{/snippet}
</Story>

<!-- Story: Without Header or Footer -->
<Story name="WithoutHeaderOrFooter">
	{#snippet children()}
		<div>
			<Button onclick={() => (openMinimal = true)}>Open Minimal Modal</Button>
			<Modal bind:open={openMinimal}>
				{#snippet children()}
					<div class="space-y-4">
						<p>
							This modal has no header or footer. It's a minimal design that focuses entirely on
							the content.
						</p>
						<p class="text-sm text-gray-600">
							Note: The close button (X) in the top-right corner is always available for closing
							the modal.
						</p>
					</div>
				{/snippet}
			</Modal>
		</div>
	{/snippet}
</Story>

<!-- Story: Form Example -->
<Story name="FormExample">
	{#snippet children()}
		<div>
			<Button onclick={() => (openForm = true)}>Open Form Modal</Button>
			<Modal bind:open={openForm} size="lg">
				{#snippet header({ close })}
					<h2 class="text-xl font-semibold text-gray-900">Create New Account</h2>
				{/snippet}
				{#snippet children()}
					<form class="space-y-4">
						<div>
							<label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
							<input
								type="text"
								id="name"
								class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								placeholder="John Doe"
							/>
						</div>
						<div>
							<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
							<input
								type="email"
								id="email"
								class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								placeholder="john@example.com"
							/>
						</div>
						<div>
							<label for="password" class="block text-sm font-medium text-gray-700"
								>Password</label
							>
							<input
								type="password"
								id="password"
								class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								placeholder="Enter password"
							/>
						</div>
					</form>
				{/snippet}
				{#snippet footer({ close })}
					<div class="flex justify-end gap-2">
						<Button variant="secondary" onclick={close}>Cancel</Button>
						<Button variant="primary" onclick={close}>Create Account</Button>
					</div>
				{/snippet}
			</Modal>
		</div>
	{/snippet}
</Story>

<!-- Story: Accessibility Features -->
<Story name="Accessibility">
	{#snippet children()}
		<div>
			<Button onclick={() => (openAccessibility = true)}>Open Accessibility Demo</Button>
			<Modal bind:open={openAccessibility} size="lg">
				{#snippet header({ close })}
					<h2 class="text-xl font-semibold text-gray-900">Accessibility Features</h2>
				{/snippet}
				{#snippet children()}
					<div class="space-y-4">
						<p class="font-medium">This modal demonstrates comprehensive accessibility features:</p>
						<ul class="list-inside list-disc space-y-2 text-sm text-gray-700">
							<li>
								<strong>ARIA Attributes:</strong> Includes <code>role="dialog"</code> and
								<code>aria-modal="true"</code> for screen readers
							</li>
							<li>
								<strong>Keyboard Navigation:</strong> Press <kbd
									class="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-xs">ESC</kbd
								> to close the modal
							</li>
							<li>
								<strong>Focus Management:</strong> Focus is trapped within the modal when open
							</li>
							<li>
								<strong>Close Button:</strong> Always visible close button with
								<code>aria-label="Close modal"</code>
							</li>
							<li>
								<strong>Backdrop Click:</strong> Clicking outside the modal closes it
								(configurable)
							</li>
							<li>
								<strong>Semantic HTML:</strong> Proper heading hierarchy and semantic elements
							</li>
						</ul>
						<div class="rounded-lg bg-blue-50 p-4">
							<p class="text-sm text-blue-800">
								<strong>Try it:</strong> Use your keyboard to navigate. Press ESC to close, or
								click the backdrop.
							</p>
						</div>
					</div>
				{/snippet}
				{#snippet footer({ close })}
					<div class="flex justify-end gap-2">
						<Button variant="secondary" onclick={close}>Close</Button>
						<Button variant="primary" onclick={close}>Got it!</Button>
					</div>
				{/snippet}
			</Modal>
		</div>
	{/snippet}
</Story>

<!-- Story: Confirmation Dialog -->
<Story name="ConfirmationDialog">
	{#snippet children()}
		<div>
			<Button variant="danger" onclick={() => (openConfirm = true)}>Delete Item</Button>
			<Modal bind:open={openConfirm} size="sm">
				{#snippet header({ close })}
					<h2 class="text-xl font-semibold text-gray-900">Delete Item?</h2>
				{/snippet}
				{#snippet children()}
					<p class="text-gray-600">
						Are you sure you want to delete this item? This action cannot be undone.
					</p>
				{/snippet}
				{#snippet footer({ close })}
					<div class="flex justify-end gap-2">
						<Button variant="secondary" onclick={close}>Cancel</Button>
						<Button variant="danger" onclick={close}>Delete</Button>
					</div>
				{/snippet}
			</Modal>
		</div>
	{/snippet}
</Story>

<!-- Story: Information Dialog -->
<Story name="InformationDialog">
	{#snippet children()}
		<div>
			<Button onclick={() => (openInfo = true)}>Show Welcome Message</Button>
			<Modal bind:open={openInfo}>
				{#snippet header({ close })}
					<h2 class="text-xl font-semibold text-gray-900">Welcome!</h2>
				{/snippet}
				{#snippet children()}
					<div class="space-y-3">
						<p>Thank you for joining our platform. Here are some quick tips to get started:</p>
						<ul class="list-inside list-disc space-y-1 text-sm text-gray-700">
							<li>Complete your profile to unlock all features</li>
							<li>Explore the dashboard to see your analytics</li>
							<li>Check out our help center for detailed guides</li>
						</ul>
					</div>
				{/snippet}
				{#snippet footer({ close })}
					<div class="flex justify-end">
						<Button variant="primary" onclick={close}>Get Started</Button>
					</div>
				{/snippet}
			</Modal>
		</div>
	{/snippet}
</Story>

<!-- Story: Long Content with Scroll -->
<Story name="LongContent">
	{#snippet children()}
		<div>
			<Button onclick={() => (openLongContent = true)}>View Terms & Conditions</Button>
			<Modal bind:open={openLongContent} size="lg">
				{#snippet header({ close })}
					<h2 class="text-xl font-semibold text-gray-900">Terms and Conditions</h2>
				{/snippet}
				{#snippet children()}
					<div class="max-h-96 space-y-4 overflow-y-auto">
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua.
						</p>
						<p>
							Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
							ex ea commodo consequat.
						</p>
						<p>
							Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
							fugiat nulla pariatur.
						</p>
						<p>
							Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
							mollit anim id est laborum.
						</p>
						<p>
							Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
							doloremque laudantium.
						</p>
						<p>
							Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
							beatae vitae dicta sunt explicabo.
						</p>
						<p>
							Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
							consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
						</p>
					</div>
				{/snippet}
				{#snippet footer({ close })}
					<div class="flex justify-end gap-2">
						<Button variant="secondary" onclick={close}>Decline</Button>
						<Button variant="primary" onclick={close}>Accept</Button>
					</div>
				{/snippet}
			</Modal>
		</div>
	{/snippet}
</Story>
