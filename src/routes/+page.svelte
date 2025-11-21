<script lang="ts">
	import Button from '$ui/primitives/Button.svelte';
	import Input from '$ui/primitives/Input.svelte';
	import Modal from '$ui/primitives/Modal.svelte';

	let inputValue = $state('');
	let modalOpen = $state(false);
	let email = $state('');
	let emailError = $state('');

	function handleButtonClick() {
		console.log('Button clicked!');
		modalOpen = true;
	}

	function validateEmail() {
		if (!email.includes('@')) {
			emailError = 'Please enter a valid email address';
		} else {
			emailError = '';
		}
	}
</script>

<main class="container mx-auto max-w-4xl p-8">
	<h1 class="mb-8 text-4xl font-bold">UI Components Demo</h1>

	<!-- Button Examples -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-semibold">Buttons</h2>
		<div class="flex flex-wrap gap-4">
			<Button onclick={handleButtonClick}>Primary Button</Button>
			<Button variant="secondary">Secondary Button</Button>
			<Button variant="danger">Danger Button</Button>
			<Button disabled>Disabled Button</Button>
		</div>

		<div class="mt-4 flex flex-wrap gap-4">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</div>
	</section>

	<!-- Input Examples -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-semibold">Inputs</h2>
		<div class="max-w-md space-y-4">
			<Input bind:value={inputValue} label="Text Input" placeholder="Enter some text..." />

			<Input
				bind:value={email}
				type="email"
				label="Email"
				placeholder="your@email.com"
				error={emailError}
				required
			/>
			<Button onclick={validateEmail}>Validate Email</Button>

			<Input type="password" label="Password" placeholder="Enter password" required />

			<Input label="Disabled Input" disabled value="Cannot edit this" />
		</div>
	</section>

	<!-- Modal Example -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-semibold">Modal</h2>
		<Button onclick={() => (modalOpen = true)}>Open Modal</Button>

		<Modal bind:open={modalOpen} size="md">
			{#snippet header()}
				<h3 class="text-lg font-semibold">Modal Title</h3>
			{/snippet}

			<p class="text-gray-600">
				This is a modal dialog. It uses Svelte 5 Snippets for flexible content projection.
			</p>
			<p class="mt-2 text-gray-600">
				You can close it by clicking the X button, clicking outside, or pressing ESC.
			</p>

			{#snippet footer({ close })}
				<div class="flex justify-end gap-2">
					<Button variant="secondary" onclick={close}>Cancel</Button>
					<Button onclick={close}>Confirm</Button>
				</div>
			{/snippet}
		</Modal>
	</section>

	<!-- Current Values -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-semibold">Current Values</h2>
		<div class="rounded bg-gray-100 p-4">
			<p><strong>Input Value:</strong> {inputValue || '(empty)'}</p>
			<p><strong>Email:</strong> {email || '(empty)'}</p>
			<p><strong>Modal Open:</strong> {modalOpen}</p>
		</div>
	</section>
</main>
