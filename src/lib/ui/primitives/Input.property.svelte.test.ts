import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Input from './Input.svelte';

/**
 * Property 7: Input Value Binding
 * 
 * For any Input component, when the value prop changes, 
 * the input element's value should update to match.
 * 
 * **Feature: infrastructure-setup, Property 7: Input Value Binding**
 * **Validates: Requirements 4.6**
 * 
 * This property test validates that the Input component correctly
 * binds its value prop to the underlying input element's value,
 * ensuring two-way data binding works correctly across various
 * input values and types.
 */
describe('Property 7: Input Value Binding', () => {
	it('should bind value prop to input element value for any string', async () => {
		expect.assertions(9);
		
		// Test various string values to ensure binding works universally
		// Note: HTML input elements don't support newlines (use textarea for that)
		const testValues = [
			'',
			'a',
			'test',
			'hello world',
			'123',
			'special@chars!',
			'   spaces   ',
			'very long string that contains many characters to test if binding works with longer inputs',
			'unicode: 你好世界 🌍'
		];

		for (const testValue of testValues) {
			const { container } = await render(Input, {
				props: {
					value: testValue
				}
			});

			const input = container.querySelector('input') as HTMLInputElement;
			
			// Property: For any value, the input element's value should match the prop
			expect(input.value).toBe(testValue);
		}
	});

	it('should update input element value when value prop changes', async () => {
		expect.assertions(5);
		
		// Test that value binding is reactive across different value changes
		const testSequence = ['initial', 'updated', '', 'final', '123'];

		const { container, rerender } = await render(Input, {
			props: {
				value: testSequence[0]
			}
		});

		const input = container.querySelector('input') as HTMLInputElement;

		for (const newValue of testSequence) {
			await rerender({
				value: newValue
			});

			// Property: When value prop changes, input element value should update to match
			expect(input.value).toBe(newValue);
		}
	});

	it('should bind value correctly for different input types', async () => {
		expect.assertions(5);
		
		// Test that value binding works across different input types
		const typeValuePairs: Array<{ type: 'text' | 'email' | 'password' | 'number' | 'tel'; value: string }> = [
			{ type: 'text', value: 'plain text' },
			{ type: 'email', value: 'test@example.com' },
			{ type: 'password', value: 'secret123' },
			{ type: 'number', value: '42' },
			{ type: 'tel', value: '+1234567890' }
		];

		for (const { type, value } of typeValuePairs) {
			const { container } = await render(Input, {
				props: {
					type,
					value
				}
			});

			const input = container.querySelector('input') as HTMLInputElement;
			
			// Property: For any input type, value binding should work correctly
			expect(input.value).toBe(value);
		}
	});

	it('should maintain value binding when other props change', async () => {
		expect.assertions(4);
		
		// Test that value binding persists when other props are modified
		const testValue = 'persistent value';

		const { container, rerender } = await render(Input, {
			props: {
				value: testValue,
				placeholder: 'initial'
			}
		});

		const input = container.querySelector('input') as HTMLInputElement;
		expect(input.value).toBe(testValue);

		// Change placeholder
		await rerender({
			value: testValue,
			placeholder: 'updated placeholder'
		});
		expect(input.value).toBe(testValue);

		// Add label
		await rerender({
			value: testValue,
			label: 'Test Label'
		});
		expect(input.value).toBe(testValue);

		// Add error
		await rerender({
			value: testValue,
			error: 'Test error'
		});
		expect(input.value).toBe(testValue);
	});

	it('should bind empty string correctly', async () => {
		expect.assertions(2);
		
		// Test edge case: empty string should be bound correctly
		const { container } = await render(Input, {
			props: {
				value: ''
			}
		});

		const input = container.querySelector('input') as HTMLInputElement;
		
		// Property: Empty string should be a valid bound value
		expect(input.value).toBe('');
		expect(input.value.length).toBe(0);
	});

	it('should handle rapid value changes', async () => {
		expect.assertions(100);
		
		// Test that binding works correctly with rapid successive changes
		const { container, rerender } = await render(Input, {
			props: {
				value: 'start'
			}
		});

		const input = container.querySelector('input') as HTMLInputElement;

		// Simulate rapid value changes
		for (let i = 0; i < 100; i++) {
			const newValue = `value-${i}`;
			await rerender({
				value: newValue
			});

			// Property: Value binding should work correctly even with rapid changes
			expect(input.value).toBe(newValue);
		}
	});

	it('should bind value correctly when disabled', async () => {
		expect.assertions(2);
		
		// Test that value binding works even when input is disabled
		const testValue = 'disabled value';

		const { container } = await render(Input, {
			props: {
				value: testValue,
				disabled: true
			}
		});

		const input = container.querySelector('input') as HTMLInputElement;
		
		// Property: Value binding should work regardless of disabled state
		expect(input.value).toBe(testValue);
		expect(input.disabled).toBe(true);
	});

	it('should bind value correctly with custom class', async () => {
		expect.assertions(2);
		
		// Test that value binding works with custom styling
		const testValue = 'styled value';

		const { container } = await render(Input, {
			props: {
				value: testValue,
				class: 'custom-class'
			}
		});

		const input = container.querySelector('input') as HTMLInputElement;
		
		// Property: Value binding should work regardless of custom classes
		expect(input.value).toBe(testValue);
		expect(input.className).toContain('custom-class');
	});

	it('should preserve value binding across multiple rerenders with different props', async () => {
		expect.assertions(6);
		
		// Test that value binding is stable across complex prop changes
		const values = ['first', 'second', 'third'];
		
		const { container, rerender } = await render(Input, {
			props: {
				value: values[0],
				type: 'text'
			}
		});

		const input = container.querySelector('input') as HTMLInputElement;
		expect(input.value).toBe(values[0]);

		// Change type and value
		await rerender({
			value: values[1],
			type: 'email'
		});
		expect(input.value).toBe(values[1]);

		// Add multiple props
		await rerender({
			value: values[2],
			type: 'text',
			placeholder: 'Enter text',
			label: 'Label',
			required: true
		});
		expect(input.value).toBe(values[2]);

		// Remove some props
		await rerender({
			value: values[2],
			type: 'text'
		});
		expect(input.value).toBe(values[2]);

		// Change back to first value
		await rerender({
			value: values[0],
			type: 'text'
		});
		expect(input.value).toBe(values[0]);

		// Test with error state
		await rerender({
			value: values[1],
			error: 'Error message'
		});
		expect(input.value).toBe(values[1]);
	});

	it('should handle whitespace-only values correctly', async () => {
		expect.assertions(3);
		
		// Test edge case: whitespace-only strings
		// Note: HTML input elements strip newlines, so we only test spaces and tabs
		const whitespaceValues = [
			' ',
			'  ',
			'\t'
		];

		for (const value of whitespaceValues) {
			const { container } = await render(Input, {
				props: {
					value
				}
			});

			const input = container.querySelector('input') as HTMLInputElement;
			
			// Property: Whitespace values should be bound correctly
			expect(input.value).toBe(value);
		}
	});
});
