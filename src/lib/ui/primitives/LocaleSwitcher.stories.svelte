<script module>
	/**
	 * LocaleSwitcher Component Stories
	 *
	 * Storybook stories for the LocaleSwitcher component demonstrating
	 * all available locales and locale switching functionality.
	 *
	 * Requirements: 6.1
	 */

	import { defineMeta } from '@storybook/addon-svelte-csf';
	import LocaleSwitcher from './LocaleSwitcher.svelte';

	const { Story } = defineMeta({
		title: 'UI/Primitives/LocaleSwitcher',
		component: LocaleSwitcher,
		tags: ['autodocs'],
		argTypes: {
			class: {
				control: 'text',
				description: 'Additional CSS classes to apply to the select element'
			}
		}
	});
</script>

<!-- Story: Default LocaleSwitcher -->
<Story name="Default">
	<LocaleSwitcher />
</Story>

<!-- Story: With Custom Styling -->
<Story name="WithCustomStyling">
	<LocaleSwitcher class="w-full max-w-xs" />
</Story>

<!-- Story: All Available Locales -->
<Story name="AllAvailableLocales">
	<div class="space-y-4">
		<div>
			<p class="mb-2 text-sm font-semibold text-gray-700">Available Locales:</p>
			<ul class="space-y-1 text-sm text-gray-600">
				<li>• English (en)</li>
				<li>• Traditional Chinese (zh-tw) - 繁體中文</li>
				<li>• Japanese (jp) - 日本語</li>
			</ul>
		</div>
		<LocaleSwitcher />
	</div>
</Story>

<!-- Story: Locale Switching Demo -->
<Story name="LocaleSwitchingDemo">
	<div class="space-y-4">
		<div>
			<p class="mb-2 text-sm font-semibold text-gray-700">
				Select a language to switch the interface:
			</p>
			<p class="mb-4 text-sm text-gray-600">
				The LocaleSwitcher component allows users to change the application language. 
				When a locale is selected, the component persists the preference and updates the UI.
			</p>
		</div>
		<LocaleSwitcher />
		<div class="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-700">
			<p>
				<strong>Note:</strong> In this Storybook environment, the locale switching may not 
				affect the entire application. In the actual application, changing the locale will 
				update all translated content throughout the interface.
			</p>
		</div>
	</div>
</Story>

<!-- Story: Compact Size -->
<Story name="CompactSize">
	<div class="space-y-2">
		<p class="text-sm font-semibold text-gray-700">Compact LocaleSwitcher:</p>
		<LocaleSwitcher class="text-sm" />
	</div>
</Story>

<!-- Story: In Navigation Context -->
<Story name="InNavigationContext">
	<nav class="flex items-center justify-between rounded-md border border-gray-200 bg-white p-4">
		<div class="text-lg font-semibold text-gray-900">My App</div>
		<div class="flex items-center gap-4">
			<a href="#" class="text-sm text-gray-600 hover:text-gray-900">Home</a>
			<a href="#" class="text-sm text-gray-600 hover:text-gray-900">About</a>
			<LocaleSwitcher />
		</div>
	</nav>
</Story>

<!-- Story: With Label -->
<Story name="WithLabel">
	<div class="space-y-2">
		<label for="locale-select" class="block text-sm font-semibold text-gray-700">
			Select Language
		</label>
		<LocaleSwitcher />
	</div>
</Story>

<!-- Story: Dark Background -->
<Story name="DarkBackground">
	<div class="rounded-md bg-gray-900 p-6">
		<label class="block text-sm font-semibold text-white mb-2">
			Select Language
		</label>
		<LocaleSwitcher class="bg-gray-800 border-gray-700 text-white" />
	</div>
</Story>

<!-- Story: Multiple LocaleSwitchers -->
<Story name="MultipleLocaleSwitchers">
	<div class="space-y-4">
		<div>
			<p class="mb-2 text-sm font-semibold text-gray-700">Header LocaleSwitcher:</p>
			<LocaleSwitcher />
		</div>
		<hr />
		<div>
			<p class="mb-2 text-sm font-semibold text-gray-700">Footer LocaleSwitcher:</p>
			<LocaleSwitcher />
		</div>
	</div>
</Story>

</content>
