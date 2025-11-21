import { describe, it, expect, beforeEach } from 'vitest';
import { TodoService } from './todo.service.svelte';
import { MockTodoRepository } from '../repositories/todo.repository.mock';
import type { TodoItem, CreateTodoDto } from '../models/todo.types';

/**
 * Property 1: Todo Creation Adds Item
 * 
 * For any valid CreateTodoDto, calling createTodo should result in the items array
 * growing by one and containing the new todo.
 * 
 * **Feature: todo-management, Property 1: Todo Creation Adds Item**
 * **Validates: Requirements 3.7**
 * 
 * This property test validates that the TodoService correctly adds new todos to
 * the items array when createTodo is called with valid input.
 */
describe('Property 1: Todo Creation Adds Item', () => {
	let repo: MockTodoRepository;
	let service: TodoService;

	beforeEach(() => {
		repo = new MockTodoRepository();
		service = new TodoService(repo);
	});

	it('should increase items array length by one when creating a todo', async () => {
		expect.assertions(10);
		
		// Property: For any valid CreateTodoDto, items.length should increase by 1
		const testTitles = [
			'Buy groceries',
			'Complete project',
			'Call mom',
			'Fix bug #123',
			'Write documentation',
			'Review pull request',
			'Schedule meeting',
			'Update dependencies',
			'Refactor code',
			'Deploy to production'
		];

		for (const title of testTitles) {
			const initialLength = service.items.length;
			const dto: CreateTodoDto = { title };

			await service.createTodo(dto);

			// Property: Length should increase by exactly 1
			expect(service.items.length).toBe(initialLength + 1);
		}
	});

	it('should add the created todo to the items array', async () => {
		expect.assertions(15);
		
		// Property: For any valid CreateTodoDto, the new todo should be in items array
		const testTitles = [
			'Task 1',
			'Task 2',
			'Task 3',
			'Task 4',
			'Task 5'
		];

		for (const title of testTitles) {
			const dto: CreateTodoDto = { title };

			await service.createTodo(dto);

			// Property: The new todo should exist in items
			const createdTodo = service.items.find(item => item.title === title);
			expect(createdTodo).toBeDefined();
			
			// Property: The created todo should have the correct title
			expect(createdTodo?.title).toBe(title);
			
			// Property: The created todo should have completed = false by default
			expect(createdTodo?.completed).toBe(false);
		}
	});

	it('should preserve existing todos when adding new ones', async () => {
		expect.assertions(15);
		
		// Property: For any sequence of createTodo calls, all previously created todos
		// should remain in the items array
		
		const titles = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
		
		for (let i = 0; i < titles.length; i++) {
			await service.createTodo({ title: titles[i] });
			
			// Property: All previously added todos should still be present
			for (let j = 0; j <= i; j++) {
				const todo = service.items.find(item => item.title === titles[j]);
				expect(todo).toBeDefined();
			}
		}
	});

	it('should add todos with unique IDs', async () => {
		expect.assertions(11);
		
		// Property: For any sequence of createTodo calls, each todo should have a unique ID
		
		const titles = ['Todo 1', 'Todo 2', 'Todo 3', 'Todo 4', 'Todo 5'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Property: All IDs should be unique
		const ids = service.items.map(item => item.id);
		const uniqueIds = new Set(ids);
		expect(uniqueIds.size).toBe(ids.length);
		
		// Property: Each ID should be defined and non-empty
		for (const id of ids) {
			expect(id).toBeDefined();
			expect(id.length).toBeGreaterThan(0);
		}
	});

	it('should handle todos with various title lengths', async () => {
		expect.assertions(12);
		
		// Property: For any valid title length (2-100 chars), createTodo should succeed
		const testCases = [
			{ title: 'ab', description: 'minimum length (2)' },
			{ title: 'abc', description: '3 characters' },
			{ title: 'A normal todo title', description: 'normal length' },
			{ title: 'A'.repeat(50), description: 'mid-range length (50)' },
			{ title: 'B'.repeat(99), description: 'near maximum (99)' },
			{ title: 'C'.repeat(100), description: 'maximum length (100)' }
		];

		for (const { title } of testCases) {
			const initialLength = service.items.length;
			
			await service.createTodo({ title });

			// Property: Items length should increase
			expect(service.items.length).toBe(initialLength + 1);
			
			// Property: The todo should be added with correct title
			const addedTodo = service.items[service.items.length - 1];
			expect(addedTodo.title).toBe(title);
		}
	});

	it('should handle todos with special characters', async () => {
		expect.assertions(10);
		
		// Property: For any title with special characters, createTodo should succeed
		const specialTitles = [
			'Todo with numbers 123',
			'Todo with symbols !@#$%',
			'Todo with (parentheses)',
			'Todo with "quotes"',
			'Unicode todo 你好世界'
		];

		for (const title of specialTitles) {
			const initialLength = service.items.length;
			
			await service.createTodo({ title });

			// Property: Items length should increase
			expect(service.items.length).toBe(initialLength + 1);
			
			// Property: Title should be preserved exactly
			const addedTodo = service.items[service.items.length - 1];
			expect(addedTodo.title).toBe(title);
		}
	});

	it('should set loading state correctly during creation', async () => {
		expect.assertions(6);
		
		// Property: For any createTodo call, loading should be true during execution
		// and false after completion
		
		const titles = ['Task A', 'Task B', 'Task C'];
		
		for (const title of titles) {
			// Before creation
			expect(service.loading).toBe(false);
			
			const promise = service.createTodo({ title });
			
			// After completion
			await promise;
			expect(service.loading).toBe(false);
		}
	});

	it('should clear error state on successful creation', async () => {
		expect.assertions(4);
		
		// Property: For any successful createTodo call, error should be null
		
		// Set an initial error
		service.error = 'Previous error';
		
		await service.createTodo({ title: 'Test Todo' });
		
		// Property: Error should be cleared
		expect(service.error).toBeNull();
		
		// Test with multiple creations
		service.error = 'Another error';
		await service.createTodo({ title: 'Test Todo 2' });
		expect(service.error).toBeNull();
		
		service.error = 'Yet another error';
		await service.createTodo({ title: 'Test Todo 3' });
		expect(service.error).toBeNull();
		
		// Verify all todos were created
		expect(service.items.length).toBe(3);
	});

	it('should maintain correct order of todos', async () => {
		expect.assertions(5);
		
		// Property: For any sequence of createTodo calls, todos should be added
		// in the order they were created
		
		const titles = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Property: Order should match creation order
		for (let i = 0; i < titles.length; i++) {
			expect(service.items[i].title).toBe(titles[i]);
		}
	});

	it('should work correctly with initial data', async () => {
		expect.assertions(6);
		
		// Property: For any service with initial data, createTodo should add to existing items
		
		const initialData: TodoItem[] = [
			{
				id: '1',
				title: 'Initial Todo 1',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '2',
				title: 'Initial Todo 2',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		];
		
		const repoWithData = new MockTodoRepository(initialData);
		const serviceWithData = new TodoService(repoWithData, initialData);
		
		// Property: Initial data should be present
		expect(serviceWithData.items.length).toBe(2);
		
		// Add new todos
		await serviceWithData.createTodo({ title: 'New Todo 1' });
		expect(serviceWithData.items.length).toBe(3);
		
		await serviceWithData.createTodo({ title: 'New Todo 2' });
		expect(serviceWithData.items.length).toBe(4);
		
		// Property: Initial todos should still be present
		expect(serviceWithData.items[0].title).toBe('Initial Todo 1');
		expect(serviceWithData.items[1].title).toBe('Initial Todo 2');
		
		// Property: New todos should be at the end
		expect(serviceWithData.items[2].title).toBe('New Todo 1');
	});

	it('should create todos with proper timestamps', async () => {
		expect.assertions(10);
		
		// Property: For any created todo, createdAt and updatedAt should be defined
		// and should be valid ISO 8601 timestamps
		
		const titles = ['Todo 1', 'Todo 2', 'Todo 3', 'Todo 4', 'Todo 5'];
		
		for (const title of titles) {
			await service.createTodo({ title });
			
			const createdTodo = service.items[service.items.length - 1];
			
			// Property: Timestamps should be defined
			expect(createdTodo.createdAt).toBeDefined();
			expect(createdTodo.updatedAt).toBeDefined();
		}
	});

	it('should handle rapid successive creations', async () => {
		expect.assertions(21);
		
		// Property: For any sequence of rapid createTodo calls, all todos should be created
		
		const titles = Array.from({ length: 20 }, (_, i) => `Rapid Todo ${i + 1}`);
		
		// Create all todos rapidly without awaiting individually
		await Promise.all(titles.map(title => service.createTodo({ title })));
		
		// Property: All todos should be created
		expect(service.items.length).toBe(20);
		
		// Property: All titles should be present
		const createdTitles = service.items.map(item => item.title);
		for (const title of titles) {
			expect(createdTitles).toContain(title);
		}
	});
});

/**
 * Property 2: Toggle Flips Completion Status
 * 
 * For any todo item in the items array, calling toggle with its id should flip
 * the completed status from true to false or false to true.
 * 
 * **Feature: todo-management, Property 2: Toggle Flips Completion Status**
 * **Validates: Requirements 3.6**
 * 
 * This property test validates that the TodoService correctly toggles the completion
 * status of todos, ensuring that the status flips from true to false or false to true.
 */
describe('Property 2: Toggle Flips Completion Status', () => {
	let repo: MockTodoRepository;
	let service: TodoService;

	beforeEach(() => {
		repo = new MockTodoRepository();
		service = new TodoService(repo);
	});

	it('should flip completed status from false to true', async () => {
		expect.assertions(10);
		
		// Property: For any todo with completed=false, toggle should set it to true
		const titles = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];
		
		// Create todos (all start with completed=false)
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Toggle each todo and verify it flips to true
		for (let i = 0; i < titles.length; i++) {
			const todo = service.items[i];
			expect(todo.completed).toBe(false);
			
			await service.toggle(todo.id);
			
			expect(todo.completed).toBe(true);
		}
	});

	it('should flip completed status from true to false', async () => {
		expect.assertions(10);
		
		// Property: For any todo with completed=true, toggle should set it to false
		const initialData: TodoItem[] = [
			{
				id: '1',
				title: 'Completed Task 1',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '2',
				title: 'Completed Task 2',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '3',
				title: 'Completed Task 3',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '4',
				title: 'Completed Task 4',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '5',
				title: 'Completed Task 5',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		];
		
		const repoWithData = new MockTodoRepository(initialData);
		const serviceWithData = new TodoService(repoWithData, initialData);
		
		// Toggle each todo and verify it flips to false
		for (let i = 0; i < initialData.length; i++) {
			const todo = serviceWithData.items[i];
			expect(todo.completed).toBe(true);
			
			await serviceWithData.toggle(todo.id);
			
			expect(todo.completed).toBe(false);
		}
	});

	it('should toggle back and forth multiple times', async () => {
		expect.assertions(33);
		
		// Property: For any todo, toggling multiple times should flip status each time
		const titles = ['Toggle Test 1', 'Toggle Test 2', 'Toggle Test 3'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Toggle each todo multiple times
		for (const todo of service.items) {
			// Initial state: false
			expect(todo.completed).toBe(false);
			
			// First toggle: false -> true
			await service.toggle(todo.id);
			expect(todo.completed).toBe(true);
			
			// Second toggle: true -> false
			await service.toggle(todo.id);
			expect(todo.completed).toBe(false);
			
			// Third toggle: false -> true
			await service.toggle(todo.id);
			expect(todo.completed).toBe(true);
			
			// Fourth toggle: true -> false
			await service.toggle(todo.id);
			expect(todo.completed).toBe(false);
			
			// Fifth toggle: false -> true
			await service.toggle(todo.id);
			expect(todo.completed).toBe(true);
			
			// Sixth toggle: true -> false
			await service.toggle(todo.id);
			expect(todo.completed).toBe(false);
			
			// Seventh toggle: false -> true
			await service.toggle(todo.id);
			expect(todo.completed).toBe(true);
			
			// Eighth toggle: true -> false
			await service.toggle(todo.id);
			expect(todo.completed).toBe(false);
			
			// Ninth toggle: false -> true
			await service.toggle(todo.id);
			expect(todo.completed).toBe(true);
			
			// Tenth toggle: true -> false
			await service.toggle(todo.id);
			expect(todo.completed).toBe(false);
		}
	});

	it('should only toggle the specified todo', async () => {
		expect.assertions(15);
		
		// Property: For any todo being toggled, other todos should remain unchanged
		const titles = ['Task A', 'Task B', 'Task C', 'Task D', 'Task E'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Toggle middle todo
		const middleTodo = service.items[2];
		await service.toggle(middleTodo.id);
		
		// Property: Only the middle todo should be toggled
		expect(service.items[0].completed).toBe(false);
		expect(service.items[1].completed).toBe(false);
		expect(service.items[2].completed).toBe(true);
		expect(service.items[3].completed).toBe(false);
		expect(service.items[4].completed).toBe(false);
		
		// Toggle first todo
		await service.toggle(service.items[0].id);
		
		// Property: First and middle should be true, others false
		expect(service.items[0].completed).toBe(true);
		expect(service.items[1].completed).toBe(false);
		expect(service.items[2].completed).toBe(true);
		expect(service.items[3].completed).toBe(false);
		expect(service.items[4].completed).toBe(false);
		
		// Toggle last todo
		await service.toggle(service.items[4].id);
		
		// Property: First, middle, and last should be true
		expect(service.items[0].completed).toBe(true);
		expect(service.items[1].completed).toBe(false);
		expect(service.items[2].completed).toBe(true);
		expect(service.items[3].completed).toBe(false);
		expect(service.items[4].completed).toBe(true);
	});

	it('should handle toggling with mixed initial states', async () => {
		expect.assertions(10);
		
		// Property: For any mix of completed/incomplete todos, toggle should flip each correctly
		const initialData: TodoItem[] = [
			{
				id: '1',
				title: 'Task 1',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '2',
				title: 'Task 2',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '3',
				title: 'Task 3',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '4',
				title: 'Task 4',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '5',
				title: 'Task 5',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		];
		
		const repoWithData = new MockTodoRepository(initialData);
		const serviceWithData = new TodoService(repoWithData, initialData);
		
		// Verify initial states
		expect(serviceWithData.items[0].completed).toBe(false);
		expect(serviceWithData.items[1].completed).toBe(true);
		expect(serviceWithData.items[2].completed).toBe(false);
		expect(serviceWithData.items[3].completed).toBe(true);
		expect(serviceWithData.items[4].completed).toBe(false);
		
		// Toggle all todos
		for (const todo of serviceWithData.items) {
			await serviceWithData.toggle(todo.id);
		}
		
		// Property: All states should be flipped
		expect(serviceWithData.items[0].completed).toBe(true);
		expect(serviceWithData.items[1].completed).toBe(false);
		expect(serviceWithData.items[2].completed).toBe(true);
		expect(serviceWithData.items[3].completed).toBe(false);
		expect(serviceWithData.items[4].completed).toBe(true);
	});

	it('should handle toggling non-existent todo gracefully', async () => {
		expect.assertions(2);
		
		// Property: For any non-existent id, toggle should not throw and items should remain unchanged
		await service.createTodo({ title: 'Test Todo' });
		
		const initialLength = service.items.length;
		const initialCompleted = service.items[0].completed;
		
		// Toggle with non-existent ID
		await service.toggle('non-existent-id');
		
		// Property: Items should remain unchanged
		expect(service.items.length).toBe(initialLength);
		expect(service.items[0].completed).toBe(initialCompleted);
	});

	it('should preserve todo properties other than completed', async () => {
		expect.assertions(20);
		
		// Property: For any toggle operation, only completed should change
		const titles = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Store original properties
		const originalTodos = service.items.map(todo => ({
			id: todo.id,
			title: todo.title,
			createdAt: todo.createdAt,
			updatedAt: todo.updatedAt
		}));
		
		// Toggle all todos
		for (const todo of service.items) {
			await service.toggle(todo.id);
		}
		
		// Property: All properties except completed should be unchanged
		for (let i = 0; i < service.items.length; i++) {
			expect(service.items[i].id).toBe(originalTodos[i].id);
			expect(service.items[i].title).toBe(originalTodos[i].title);
			expect(service.items[i].createdAt).toBe(originalTodos[i].createdAt);
			expect(service.items[i].updatedAt).toBe(originalTodos[i].updatedAt);
		}
	});

	it('should handle rapid successive toggles', async () => {
		expect.assertions(9);
		
		// Property: For any sequence of rapid toggle calls, final state should be correct
		await service.createTodo({ title: 'Rapid Toggle Test' });
		
		const todo = service.items[0];
		const initialState = todo.completed;
		
		// Perform 10 rapid toggles
		for (let i = 0; i < 10; i++) {
			await service.toggle(todo.id);
		}
		
		// Property: After even number of toggles, should be back to initial state
		expect(todo.completed).toBe(initialState);
		
		// Perform 5 more toggles (odd number)
		for (let i = 0; i < 5; i++) {
			await service.toggle(todo.id);
		}
		
		// Property: After odd number of toggles, should be opposite of initial state
		expect(todo.completed).toBe(!initialState);
		
		// Verify by toggling one more time
		await service.toggle(todo.id);
		expect(todo.completed).toBe(initialState);
		
		// Test with multiple todos
		await service.createTodo({ title: 'Test 2' });
		await service.createTodo({ title: 'Test 3' });
		
		// Toggle each 3 times (odd)
		for (const t of service.items) {
			for (let i = 0; i < 3; i++) {
				await service.toggle(t.id);
			}
		}
		
		// Property: All should be toggled (opposite of initial false)
		expect(service.items[0].completed).toBe(true);
		expect(service.items[1].completed).toBe(true);
		expect(service.items[2].completed).toBe(true);
		
		// Toggle each 3 more times (total 6, even)
		for (const t of service.items) {
			for (let i = 0; i < 3; i++) {
				await service.toggle(t.id);
			}
		}
		
		// Property: All should be back to false
		expect(service.items[0].completed).toBe(false);
		expect(service.items[1].completed).toBe(false);
		expect(service.items[2].completed).toBe(false);
	});

	it('should update completedCount correctly when toggling', async () => {
		expect.assertions(10);
		
		// Property: For any toggle operation, completedCount should reflect the change
		const titles = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Initial state: all incomplete
		expect(service.completedCount).toBe(0);
		
		// Toggle first todo
		await service.toggle(service.items[0].id);
		expect(service.completedCount).toBe(1);
		
		// Toggle second todo
		await service.toggle(service.items[1].id);
		expect(service.completedCount).toBe(2);
		
		// Toggle third todo
		await service.toggle(service.items[2].id);
		expect(service.completedCount).toBe(3);
		
		// Toggle first todo back
		await service.toggle(service.items[0].id);
		expect(service.completedCount).toBe(2);
		
		// Toggle fourth and fifth
		await service.toggle(service.items[3].id);
		await service.toggle(service.items[4].id);
		expect(service.completedCount).toBe(4);
		
		// Toggle all back to incomplete
		await service.toggle(service.items[1].id);
		expect(service.completedCount).toBe(3);
		
		await service.toggle(service.items[2].id);
		expect(service.completedCount).toBe(2);
		
		await service.toggle(service.items[3].id);
		expect(service.completedCount).toBe(1);
		
		await service.toggle(service.items[4].id);
		expect(service.completedCount).toBe(0);
	});

	it('should work correctly with todos of various title lengths', async () => {
		expect.assertions(12);
		
		// Property: For any todo regardless of title length, toggle should work correctly
		const testCases = [
			{ title: 'ab', description: 'minimum length' },
			{ title: 'Short', description: 'short title' },
			{ title: 'A medium length todo title', description: 'medium title' },
			{ title: 'A'.repeat(50), description: 'long title' },
			{ title: 'B'.repeat(100), description: 'maximum length' },
			{ title: 'Todo with special chars !@#$%', description: 'special chars' }
		];
		
		for (const { title } of testCases) {
			await service.createTodo({ title });
		}
		
		// Toggle all and verify
		for (let i = 0; i < testCases.length; i++) {
			expect(service.items[i].completed).toBe(false);
			
			await service.toggle(service.items[i].id);
			
			expect(service.items[i].completed).toBe(true);
		}
	});
});

/**
 * Property 3: Delete Removes Item
 * 
 * For any todo item in the items array, calling deleteTodo with its id should
 * result in that item no longer being in the items array.
 * 
 * **Feature: todo-management, Property 3: Delete Removes Item**
 * **Validates: Requirements 3.8**
 * 
 * This property test validates that the TodoService correctly removes todos from
 * the items array when deleteTodo is called with a valid id.
 */
describe('Property 3: Delete Removes Item', () => {
	let repo: MockTodoRepository;
	let service: TodoService;

	beforeEach(() => {
		repo = new MockTodoRepository();
		service = new TodoService(repo);
	});

	it('should decrease items array length by one when deleting a todo', async () => {
		expect.assertions(5);
		
		// Property: For any todo in items, deleting it should decrease length by 1
		const titles = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];
		
		// Create todos
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Delete each todo and verify length decreases
		for (let i = titles.length; i > 0; i--) {
			const currentLength = service.items.length;
			const todoToDelete = service.items[0];
			
			await service.deleteTodo(todoToDelete.id);
			
			// Property: Length should decrease by exactly 1
			expect(service.items.length).toBe(currentLength - 1);
		}
	});

	it('should remove the deleted todo from the items array', async () => {
		expect.assertions(10);
		
		// Property: For any deleted todo, it should no longer exist in items array
		const titles = ['Task A', 'Task B', 'Task C', 'Task D', 'Task E'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Delete each todo and verify it's removed
		for (const title of titles) {
			const todoToDelete = service.items.find(item => item.title === title);
			expect(todoToDelete).toBeDefined();
			
			await service.deleteTodo(todoToDelete!.id);
			
			// Property: The deleted todo should not exist in items
			const deletedTodo = service.items.find(item => item.title === title);
			expect(deletedTodo).toBeUndefined();
		}
	});

	it('should preserve remaining todos when deleting one', async () => {
		expect.assertions(17);
		
		// Property: For any delete operation, all other todos should remain unchanged
		const titles = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Delete middle todo
		const middleTodo = service.items[2];
		await service.deleteTodo(middleTodo.id);
		
		// Property: Other todos should still be present
		expect(service.items.length).toBe(4);
		expect(service.items.find(item => item.title === 'First')).toBeDefined();
		expect(service.items.find(item => item.title === 'Second')).toBeDefined();
		expect(service.items.find(item => item.title === 'Third')).toBeUndefined();
		expect(service.items.find(item => item.title === 'Fourth')).toBeDefined();
		expect(service.items.find(item => item.title === 'Fifth')).toBeDefined();
		
		// Delete first todo
		const firstTodo = service.items.find(item => item.title === 'First');
		await service.deleteTodo(firstTodo!.id);
		
		// Property: Remaining todos should still be present
		expect(service.items.length).toBe(3);
		expect(service.items.find(item => item.title === 'First')).toBeUndefined();
		expect(service.items.find(item => item.title === 'Second')).toBeDefined();
		expect(service.items.find(item => item.title === 'Fourth')).toBeDefined();
		expect(service.items.find(item => item.title === 'Fifth')).toBeDefined();
		
		// Delete last todo
		const lastTodo = service.items.find(item => item.title === 'Fifth');
		await service.deleteTodo(lastTodo!.id);
		
		// Property: Remaining todos should still be present
		expect(service.items.length).toBe(2);
		expect(service.items.find(item => item.title === 'Second')).toBeDefined();
		expect(service.items.find(item => item.title === 'Fourth')).toBeDefined();
		expect(service.items.find(item => item.title === 'Fifth')).toBeUndefined();
		
		// Delete remaining todos
		const secondTodo = service.items.find(item => item.title === 'Second');
		await service.deleteTodo(secondTodo!.id);
		
		expect(service.items.length).toBe(1);
		
		const fourthTodo = service.items.find(item => item.title === 'Fourth');
		await service.deleteTodo(fourthTodo!.id);
		
		expect(service.items.length).toBe(0);
	});

	it('should delete todos by ID regardless of position', async () => {
		expect.assertions(16);
		
		// Property: For any todo at any position, delete should work correctly
		const titles = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Store IDs
		const ids = service.items.map(item => item.id);
		
		// Delete by ID in non-sequential order (middle, last, first, etc.)
		await service.deleteTodo(ids[2]); // Delete middle
		expect(service.items.length).toBe(4);
		expect(service.items.find(item => item.id === ids[2])).toBeUndefined();
		
		await service.deleteTodo(ids[4]); // Delete what was last
		expect(service.items.length).toBe(3);
		expect(service.items.find(item => item.id === ids[4])).toBeUndefined();
		
		await service.deleteTodo(ids[0]); // Delete what was first
		expect(service.items.length).toBe(2);
		expect(service.items.find(item => item.id === ids[0])).toBeUndefined();
		
		await service.deleteTodo(ids[3]); // Delete one of remaining
		expect(service.items.length).toBe(1);
		expect(service.items.find(item => item.id === ids[3])).toBeUndefined();
		
		await service.deleteTodo(ids[1]); // Delete last remaining
		expect(service.items.length).toBe(0);
		expect(service.items.find(item => item.id === ids[1])).toBeUndefined();
		
		// Property: All todos should be deleted
		expect(service.items.length).toBe(0);
		
		// Verify none of the original IDs exist
		for (const id of ids) {
			expect(service.items.find(item => item.id === id)).toBeUndefined();
		}
	});

	it('should handle deleting all todos sequentially', async () => {
		expect.assertions(7);
		
		// Property: For any sequence of delete operations, all todos can be removed
		const titles = ['Todo 1', 'Todo 2', 'Todo 3', 'Todo 4', 'Todo 5'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		expect(service.items.length).toBe(5);
		
		// Delete all todos one by one
		while (service.items.length > 0) {
			const currentLength = service.items.length;
			const todoToDelete = service.items[0];
			
			await service.deleteTodo(todoToDelete.id);
			
			// Property: Length should decrease by 1
			expect(service.items.length).toBe(currentLength - 1);
		}
		
		// Property: All todos should be deleted
		expect(service.items.length).toBe(0);
	});

	it('should handle deleting todos with different completion states', async () => {
		expect.assertions(7);
		
		// Property: For any todo regardless of completion state, delete should work
		const initialData: TodoItem[] = [
			{
				id: '1',
				title: 'Incomplete Task 1',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '2',
				title: 'Completed Task 1',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '3',
				title: 'Incomplete Task 2',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '4',
				title: 'Completed Task 2',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '5',
				title: 'Incomplete Task 3',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		];
		
		const repoWithData = new MockTodoRepository(initialData);
		const serviceWithData = new TodoService(repoWithData, initialData);
		
		expect(serviceWithData.items.length).toBe(5);
		
		// Delete completed todo
		await serviceWithData.deleteTodo('2');
		expect(serviceWithData.items.length).toBe(4);
		expect(serviceWithData.items.find(item => item.id === '2')).toBeUndefined();
		
		// Delete incomplete todo
		await serviceWithData.deleteTodo('1');
		expect(serviceWithData.items.length).toBe(3);
		expect(serviceWithData.items.find(item => item.id === '1')).toBeUndefined();
		
		// Delete another completed todo
		await serviceWithData.deleteTodo('4');
		expect(serviceWithData.items.length).toBe(2);
		expect(serviceWithData.items.find(item => item.id === '4')).toBeUndefined();
		
		// Delete remaining incomplete todos
		await serviceWithData.deleteTodo('3');
		await serviceWithData.deleteTodo('5');
	});

	it('should update completedCount correctly when deleting completed todos', async () => {
		expect.assertions(7);
		
		// Property: For any delete of a completed todo, completedCount should decrease
		const titles = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Toggle all to completed
		for (const todo of service.items) {
			await service.toggle(todo.id);
		}
		
		expect(service.completedCount).toBe(5);
		
		// Delete completed todos one by one
		const ids = service.items.map(item => item.id);
		
		await service.deleteTodo(ids[0]);
		expect(service.completedCount).toBe(4);
		
		await service.deleteTodo(ids[1]);
		expect(service.completedCount).toBe(3);
		
		await service.deleteTodo(ids[2]);
		expect(service.completedCount).toBe(2);
		
		await service.deleteTodo(ids[3]);
		expect(service.completedCount).toBe(1);
		
		await service.deleteTodo(ids[4]);
		expect(service.completedCount).toBe(0);
		
		// Property: completedCount should be 0 when all completed todos are deleted
		expect(service.completedCount).toBe(0);
	});

	it('should update pendingCount correctly when deleting incomplete todos', async () => {
		expect.assertions(7);
		
		// Property: For any delete of an incomplete todo, pendingCount should decrease
		const titles = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// All todos start as incomplete
		expect(service.pendingCount).toBe(5);
		
		// Delete incomplete todos one by one
		const ids = service.items.map(item => item.id);
		
		await service.deleteTodo(ids[0]);
		expect(service.pendingCount).toBe(4);
		
		await service.deleteTodo(ids[1]);
		expect(service.pendingCount).toBe(3);
		
		await service.deleteTodo(ids[2]);
		expect(service.pendingCount).toBe(2);
		
		await service.deleteTodo(ids[3]);
		expect(service.pendingCount).toBe(1);
		
		await service.deleteTodo(ids[4]);
		expect(service.pendingCount).toBe(0);
		
		// Property: pendingCount should be 0 when all incomplete todos are deleted
		expect(service.pendingCount).toBe(0);
	});

	it('should preserve todo properties of remaining items after delete', async () => {
		expect.assertions(17);
		
		// Property: For any delete operation, remaining todos should be unchanged
		const titles = ['Task 1', 'Task 2', 'Task 3', 'Task 4'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Store original properties of todos we'll keep
		const todo1 = { ...service.items[0] };
		const todo2 = { ...service.items[1] };
		const todo3 = { ...service.items[3] };
		
		// Delete middle todo
		await service.deleteTodo(service.items[2].id);
		
		// Property: Remaining todos should have unchanged properties
		const remaining1 = service.items.find(item => item.id === todo1.id);
		expect(remaining1?.id).toBe(todo1.id);
		expect(remaining1?.title).toBe(todo1.title);
		expect(remaining1?.completed).toBe(todo1.completed);
		expect(remaining1?.createdAt).toBe(todo1.createdAt);
		
		const remaining2 = service.items.find(item => item.id === todo2.id);
		expect(remaining2?.id).toBe(todo2.id);
		expect(remaining2?.title).toBe(todo2.title);
		expect(remaining2?.completed).toBe(todo2.completed);
		expect(remaining2?.createdAt).toBe(todo2.createdAt);
		
		const remaining3 = service.items.find(item => item.id === todo3.id);
		expect(remaining3?.id).toBe(todo3.id);
		expect(remaining3?.title).toBe(todo3.title);
		expect(remaining3?.completed).toBe(todo3.completed);
		expect(remaining3?.createdAt).toBe(todo3.createdAt);
		
		// Property: Only 3 todos should remain
		expect(service.items.length).toBe(3);
		
		// Property: Deleted todo should not exist
		const deletedTodo = service.items.find(item => item.title === 'Task 3');
		expect(deletedTodo).toBeUndefined();
		
		// Property: Remaining todos should be the correct ones
		expect(service.items.find(item => item.title === 'Task 1')).toBeDefined();
		expect(service.items.find(item => item.title === 'Task 2')).toBeDefined();
		expect(service.items.find(item => item.title === 'Task 4')).toBeDefined();
	});

	it('should handle deleting todos with various title lengths', async () => {
		expect.assertions(8);
		
		// Property: For any todo regardless of title length, delete should work
		const testCases = [
			{ title: 'ab', description: 'minimum length' },
			{ title: 'Short', description: 'short title' },
			{ title: 'A medium length todo title', description: 'medium title' },
			{ title: 'A'.repeat(50), description: 'long title' },
			{ title: 'B'.repeat(100), description: 'maximum length' },
			{ title: 'Todo with special chars !@#$%', description: 'special chars' }
		];
		
		for (const { title } of testCases) {
			await service.createTodo({ title });
		}
		
		expect(service.items.length).toBe(6);
		
		// Delete all and verify
		for (let i = 0; i < testCases.length; i++) {
			const currentLength = service.items.length;
			const todoToDelete = service.items[0];
			
			await service.deleteTodo(todoToDelete.id);
			
			// Property: Length should decrease by 1
			expect(service.items.length).toBe(currentLength - 1);
		}
		
		// Property: All todos should be deleted
		expect(service.items.length).toBe(0);
	});

	it('should set loading state correctly during deletion', async () => {
		expect.assertions(6);
		
		// Property: For any deleteTodo call, loading should be true during execution
		// and false after completion
		
		const titles = ['Task A', 'Task B', 'Task C'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		for (const todo of service.items.slice()) {
			// Before deletion
			expect(service.loading).toBe(false);
			
			const promise = service.deleteTodo(todo.id);
			
			// After completion
			await promise;
			expect(service.loading).toBe(false);
		}
	});

	it('should clear error state on successful deletion', async () => {
		expect.assertions(4);
		
		// Property: For any successful deleteTodo call, error should be null
		
		const titles = ['Task 1', 'Task 2', 'Task 3'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Set an initial error
		service.error = 'Previous error';
		
		await service.deleteTodo(service.items[0].id);
		
		// Property: Error should be cleared
		expect(service.error).toBeNull();
		
		// Test with multiple deletions
		service.error = 'Another error';
		await service.deleteTodo(service.items[0].id);
		expect(service.error).toBeNull();
		
		service.error = 'Yet another error';
		await service.deleteTodo(service.items[0].id);
		expect(service.error).toBeNull();
		
		// Verify all todos were deleted
		expect(service.items.length).toBe(0);
	});

	it('should handle rapid successive deletions', async () => {
		expect.assertions(2);
		
		// Property: For any sequence of rapid delete calls, all todos should be deleted
		const titles = Array.from({ length: 20 }, (_, i) => `Rapid Delete Test ${i + 1}`);
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		expect(service.items.length).toBe(20);
		
		// Store IDs before deletion
		const ids = service.items.map(item => item.id);
		
		// Delete all todos rapidly
		await Promise.all(ids.map(id => service.deleteTodo(id)));
		
		// Property: All todos should be deleted
		expect(service.items.length).toBe(0);
	});

	it('should handle deleting from empty array gracefully', async () => {
		expect.assertions(2);
		
		// Property: For any delete on empty array, should not throw and remain empty
		expect(service.items.length).toBe(0);
		
		// Try to delete non-existent todo
		await service.deleteTodo('non-existent-id');
		
		// Property: Should still be empty
		expect(service.items.length).toBe(0);
	});

	it('should clear selectedId when deleting the selected todo', async () => {
		expect.assertions(4);
		
		// Property: For any delete of the selected todo, selectedId should be cleared
		await service.createTodo({ title: 'Task 1' });
		await service.createTodo({ title: 'Task 2' });
		await service.createTodo({ title: 'Task 3' });
		
		const todoToSelect = service.items[1];
		service.select(todoToSelect.id);
		
		expect(service.selectedId).toBe(todoToSelect.id);
		expect(service.selectedItem).toBeDefined();
		
		// Delete the selected todo
		await service.deleteTodo(todoToSelect.id);
		
		// Property: selectedItem should be undefined after deleting selected todo
		expect(service.selectedItem).toBeUndefined();
		
		// Property: Items should be reduced
		expect(service.items.length).toBe(2);
	});
});

/**
 * Property 4: Loading State Management
 * 
 * For any async operation (loadTodos, createTodo, deleteTodo), the loading state
 * should be true during execution and false after completion (success or error).
 * 
 * **Feature: todo-management, Property 4: Loading State Management**
 * **Validates: Requirements 3.4**
 * 
 * This property test validates that the TodoService correctly manages the loading
 * state during async operations, ensuring it's true during execution and false
 * after completion regardless of success or failure.
 */
describe('Property 4: Loading State Management', () => {
	let repo: MockTodoRepository;
	let service: TodoService;

	beforeEach(() => {
		repo = new MockTodoRepository();
		service = new TodoService(repo);
	});

	it('should set loading to false initially', () => {
		expect.assertions(1);
		
		// Property: For any new service instance, loading should be false
		expect(service.loading).toBe(false);
	});

	it('should set loading to false after loadTodos completes successfully', async () => {
		expect.assertions(2);
		
		// Property: For any loadTodos operation, loading should be false after completion
		
		// Before loading
		expect(service.loading).toBe(false);
		
		await service.loadTodos();
		
		// After loading completes
		expect(service.loading).toBe(false);
	});

	it('should set loading to false after createTodo completes successfully', async () => {
		expect.assertions(6);
		
		// Property: For any createTodo operation, loading should be false after completion
		const titles = ['Task 1', 'Task 2', 'Task 3'];
		
		for (const title of titles) {
			// Before creation
			expect(service.loading).toBe(false);
			
			await service.createTodo({ title });
			
			// After creation completes
			expect(service.loading).toBe(false);
		}
	});

	it('should set loading to false after deleteTodo completes successfully', async () => {
		expect.assertions(8);
		
		// Property: For any deleteTodo operation, loading should be false after completion
		const titles = ['Task 1', 'Task 2', 'Task 3', 'Task 4'];
		
		// Create todos first
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Delete todos and verify loading state
		for (const todo of service.items.slice()) {
			// Before deletion
			expect(service.loading).toBe(false);
			
			await service.deleteTodo(todo.id);
			
			// After deletion completes
			expect(service.loading).toBe(false);
		}
	});

	it('should set loading to false after loadTodos fails', async () => {
		expect.assertions(2);
		
		// Property: For any failed loadTodos operation, loading should be false after completion
		
		// Create a repository that throws an error
		const errorRepo = new MockTodoRepository();
		errorRepo.getAll = async () => {
			throw new Error('Network error');
		};
		
		const errorService = new TodoService(errorRepo);
		
		// Before loading
		expect(errorService.loading).toBe(false);
		
		await errorService.loadTodos();
		
		// After loading fails, loading should still be false
		expect(errorService.loading).toBe(false);
	});

	it('should set loading to false after createTodo fails', async () => {
		expect.assertions(2);
		
		// Property: For any failed createTodo operation, loading should be false after completion
		
		// Create a repository that throws an error
		const errorRepo = new MockTodoRepository();
		errorRepo.create = async () => {
			throw new Error('Server error');
		};
		
		const errorService = new TodoService(errorRepo);
		
		// Before creation
		expect(errorService.loading).toBe(false);
		
		await errorService.createTodo({ title: 'Test Todo' });
		
		// After creation fails, loading should still be false
		expect(errorService.loading).toBe(false);
	});

	it('should set loading to false after deleteTodo fails', async () => {
		expect.assertions(2);
		
		// Property: For any failed deleteTodo operation, loading should be false after completion
		
		// Create a repository that throws an error
		const errorRepo = new MockTodoRepository();
		errorRepo.delete = async () => {
			throw new Error('Delete failed');
		};
		
		const errorService = new TodoService(errorRepo);
		
		// Before deletion
		expect(errorService.loading).toBe(false);
		
		await errorService.deleteTodo('some-id');
		
		// After deletion fails, loading should still be false
		expect(errorService.loading).toBe(false);
	});

	it('should manage loading state correctly for multiple sequential operations', async () => {
		expect.assertions(11);
		
		// Property: For any sequence of operations, loading should be false between operations
		
		// Initial state
		expect(service.loading).toBe(false);
		
		// Load todos
		await service.loadTodos();
		expect(service.loading).toBe(false);
		
		// Create todo
		await service.createTodo({ title: 'Task 1' });
		expect(service.loading).toBe(false);
		
		// Create another todo
		await service.createTodo({ title: 'Task 2' });
		expect(service.loading).toBe(false);
		
		// Load todos again
		await service.loadTodos();
		expect(service.loading).toBe(false);
		
		// Delete first todo
		const firstId = service.items[0].id;
		await service.deleteTodo(firstId);
		expect(service.loading).toBe(false);
		
		// Create another todo
		await service.createTodo({ title: 'Task 3' });
		expect(service.loading).toBe(false);
		
		// Delete another todo
		const secondId = service.items[0].id;
		await service.deleteTodo(secondId);
		expect(service.loading).toBe(false);
		
		// Load todos one more time
		await service.loadTodos();
		expect(service.loading).toBe(false);
		
		// Create final todo
		await service.createTodo({ title: 'Task 4' });
		expect(service.loading).toBe(false);
		
		// Final state
		expect(service.loading).toBe(false);
	});

	it('should manage loading state correctly for mixed success and failure operations', async () => {
		expect.assertions(8);
		
		// Property: For any mix of successful and failed operations, loading should be false after each
		
		// Create a repository that fails on specific operations
		let shouldFailCreate = false;
		let shouldFailDelete = false;
		
		const mixedRepo = new MockTodoRepository();
		const originalCreate = mixedRepo.create.bind(mixedRepo);
		const originalDelete = mixedRepo.delete.bind(mixedRepo);
		
		mixedRepo.create = async (dto: CreateTodoDto) => {
			if (shouldFailCreate) {
				throw new Error('Create failed');
			}
			return originalCreate(dto);
		};
		
		mixedRepo.delete = async (id: string) => {
			if (shouldFailDelete) {
				throw new Error('Delete failed');
			}
			return originalDelete(id);
		};
		
		const mixedService = new TodoService(mixedRepo);
		
		// Initial state
		expect(mixedService.loading).toBe(false);
		
		// Successful create
		await mixedService.createTodo({ title: 'Task 1' });
		expect(mixedService.loading).toBe(false);
		
		// Failed create
		shouldFailCreate = true;
		await mixedService.createTodo({ title: 'Task 2' });
		expect(mixedService.loading).toBe(false);
		
		// Successful create
		shouldFailCreate = false;
		await mixedService.createTodo({ title: 'Task 3' });
		expect(mixedService.loading).toBe(false);
		
		// Successful delete
		const firstId = mixedService.items[0].id;
		await mixedService.deleteTodo(firstId);
		expect(mixedService.loading).toBe(false);
		
		// Failed delete (try to delete non-existent item)
		shouldFailDelete = true;
		await mixedService.deleteTodo('non-existent-id');
		expect(mixedService.loading).toBe(false);
		
		// Successful delete
		shouldFailDelete = false;
		const secondId = mixedService.items[0].id;
		await mixedService.deleteTodo(secondId);
		expect(mixedService.loading).toBe(false);
		
		// Final state
		expect(mixedService.loading).toBe(false);
	});

	it('should handle loading state correctly for rapid successive operations', async () => {
		expect.assertions(2);
		
		// Property: For any sequence of rapid operations, loading should be false after all complete
		
		// Initial state
		expect(service.loading).toBe(false);
		
		// Perform multiple operations rapidly
		const operations = [
			service.loadTodos(),
			service.createTodo({ title: 'Task 1' }),
			service.createTodo({ title: 'Task 2' }),
			service.createTodo({ title: 'Task 3' })
		];
		
		await Promise.all(operations);
		
		// After all operations complete, loading should be false
		expect(service.loading).toBe(false);
	});

	it('should not affect loading state during toggle operations', async () => {
		expect.assertions(7);
		
		// Property: For any toggle operation, loading state should remain unchanged
		// (toggle uses optimistic updates and doesn't set loading)
		
		const titles = ['Task 1', 'Task 2', 'Task 3'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Verify loading is false after creation
		expect(service.loading).toBe(false);
		
		// Toggle operations should not change loading state
		for (const todo of service.items) {
			expect(service.loading).toBe(false);
			await service.toggle(todo.id);
			expect(service.loading).toBe(false);
		}
	});

	it('should maintain loading state independence across multiple service instances', async () => {
		expect.assertions(6);
		
		// Property: For any service instance, loading state should be independent
		
		const repo1 = new MockTodoRepository();
		const repo2 = new MockTodoRepository();
		const service1 = new TodoService(repo1);
		const service2 = new TodoService(repo2);
		
		// Initial states
		expect(service1.loading).toBe(false);
		expect(service2.loading).toBe(false);
		
		// Perform operation on service1
		await service1.createTodo({ title: 'Task 1' });
		
		// Both should be false after service1 operation
		expect(service1.loading).toBe(false);
		expect(service2.loading).toBe(false);
		
		// Perform operation on service2
		await service2.loadTodos();
		
		// Both should still be false
		expect(service1.loading).toBe(false);
		expect(service2.loading).toBe(false);
	});

	it('should set loading to false even if repository operation takes time', async () => {
		expect.assertions(2);
		
		// Property: For any async operation regardless of duration, loading should be false after completion
		
		// Create a repository with delayed operations
		const delayedRepo = new MockTodoRepository();
		delayedRepo.getAll = async () => {
			await new Promise(resolve => setTimeout(resolve, 100));
			return [];
		};
		
		const delayedService = new TodoService(delayedRepo);
		
		// Before loading
		expect(delayedService.loading).toBe(false);
		
		await delayedService.loadTodos();
		
		// After loading completes (even with delay)
		expect(delayedService.loading).toBe(false);
	});

	it('should handle loading state correctly when operations are cancelled or interrupted', async () => {
		expect.assertions(3);
		
		// Property: For any operation that completes (even if interrupted), loading should be false
		
		// Initial state
		expect(service.loading).toBe(false);
		
		// Start multiple operations but don't wait for all
		const promise1 = service.createTodo({ title: 'Task 1' });
		const promise2 = service.createTodo({ title: 'Task 2' });
		
		// Wait for first to complete
		await promise1;
		
		// Loading might still be true if second is still running, but eventually should be false
		await promise2;
		
		// After all operations complete
		expect(service.loading).toBe(false);
		
		// Verify both todos were created
		expect(service.items.length).toBe(2);
	});

	it('should preserve loading state behavior with initial data', async () => {
		expect.assertions(5);
		
		// Property: For any service with initial data, loading state should work the same
		
		const initialData: TodoItem[] = [
			{
				id: '1',
				title: 'Initial Task',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		];
		
		const repoWithData = new MockTodoRepository(initialData);
		const serviceWithData = new TodoService(repoWithData, initialData);
		
		// Initial state
		expect(serviceWithData.loading).toBe(false);
		
		// Load todos
		await serviceWithData.loadTodos();
		expect(serviceWithData.loading).toBe(false);
		
		// Create todo
		await serviceWithData.createTodo({ title: 'New Task' });
		expect(serviceWithData.loading).toBe(false);
		
		// Delete todo
		await serviceWithData.deleteTodo(serviceWithData.items[0].id);
		expect(serviceWithData.loading).toBe(false);
		
		// Final state
		expect(serviceWithData.loading).toBe(false);
	});
});

/**
 * Property 5: Error State on Repository Failure
 * 
 * For any repository operation that throws an error, the service should catch it
 * and set the error state with the error message.
 * 
 * **Feature: todo-management, Property 5: Error State on Repository Failure**
 * **Validates: Requirements 8.2, 8.3**
 * 
 * This property test validates that the TodoService correctly handles repository
 * errors by catching them and setting the error state, ensuring the application
 * remains stable even when operations fail.
 */
describe('Property 5: Error State on Repository Failure', () => {
	let repo: MockTodoRepository;
	let service: TodoService;

	beforeEach(() => {
		repo = new MockTodoRepository();
		service = new TodoService(repo);
	});

	it('should set error state when loadTodos fails', async () => {
		expect.assertions(3);
		
		// Property: For any loadTodos operation that throws an error, error state should be set
		
		const errorMessage = 'Network error: Failed to fetch todos';
		repo.getAll = async () => {
			throw new Error(errorMessage);
		};
		
		// Before operation
		expect(service.error).toBeNull();
		
		await service.loadTodos();
		
		// Property: Error should be set with the error message
		expect(service.error).toBe(errorMessage);
		
		// Property: Loading should be false (Requirements 8.3)
		expect(service.loading).toBe(false);
	});

	it('should set error state when createTodo fails', async () => {
		expect.assertions(3);
		
		// Property: For any createTodo operation that throws an error, error state should be set
		
		const errorMessage = 'Server error: Failed to create todo';
		repo.create = async () => {
			throw new Error(errorMessage);
		};
		
		// Before operation
		expect(service.error).toBeNull();
		
		await service.createTodo({ title: 'Test Todo' });
		
		// Property: Error should be set with the error message
		expect(service.error).toBe(errorMessage);
		
		// Property: Loading should be false (Requirements 8.3)
		expect(service.loading).toBe(false);
	});

	it('should set error state when deleteTodo fails', async () => {
		expect.assertions(3);
		
		// Property: For any deleteTodo operation that throws an error, error state should be set
		
		const errorMessage = 'Delete failed: Todo not found';
		repo.delete = async () => {
			throw new Error(errorMessage);
		};
		
		// Before operation
		expect(service.error).toBeNull();
		
		await service.deleteTodo('some-id');
		
		// Property: Error should be set with the error message
		expect(service.error).toBe(errorMessage);
		
		// Property: Loading should be false (Requirements 8.3)
		expect(service.loading).toBe(false);
	});

	it('should set error state when toggle fails', async () => {
		expect.assertions(4);
		
		// Property: For any toggle operation that throws an error, error state should be set
		
		// Create a todo first
		await service.createTodo({ title: 'Test Todo' });
		const todo = service.items[0];
		
		const errorMessage = 'Update failed: Connection timeout';
		repo.update = async () => {
			throw new Error(errorMessage);
		};
		
		// Before operation
		expect(service.error).toBeNull();
		
		await service.toggle(todo.id);
		
		// Property: Error should be set with the error message
		expect(service.error).toBe(errorMessage);
		
		// Property: Todo should be rolled back to previous state
		expect(todo.completed).toBe(false);
		
		// Property: Loading should remain false (toggle doesn't set loading)
		expect(service.loading).toBe(false);
	});

	it('should preserve error message across multiple failed operations', async () => {
		expect.assertions(6);
		
		// Property: For any sequence of failed operations, each error should be captured
		
		const errors = [
			'Error 1: Network timeout',
			'Error 2: Server unavailable',
			'Error 3: Invalid request'
		];
		
		// Test loadTodos error
		repo.getAll = async () => {
			throw new Error(errors[0]);
		};
		await service.loadTodos();
		expect(service.error).toBe(errors[0]);
		expect(service.loading).toBe(false);
		
		// Test createTodo error
		repo.create = async () => {
			throw new Error(errors[1]);
		};
		await service.createTodo({ title: 'Test' });
		expect(service.error).toBe(errors[1]);
		expect(service.loading).toBe(false);
		
		// Test deleteTodo error
		repo.delete = async () => {
			throw new Error(errors[2]);
		};
		await service.deleteTodo('some-id');
		expect(service.error).toBe(errors[2]);
		expect(service.loading).toBe(false);
	});

	it('should handle errors with various error messages', async () => {
		expect.assertions(15);
		
		// Property: For any error message, the service should capture it correctly
		
		const errorMessages = [
			'Network error',
			'Server returned 500',
			'Timeout after 30 seconds',
			'Invalid response format',
			'Authentication failed'
		];
		
		for (const errorMessage of errorMessages) {
			repo.getAll = async () => {
				throw new Error(errorMessage);
			};
			
			await service.loadTodos();
			
			// Property: Error should match the thrown error message
			expect(service.error).toBe(errorMessage);
			
			// Property: Loading should be false
			expect(service.loading).toBe(false);
			
			// Property: Items should remain unchanged (empty in this case)
			expect(service.items.length).toBe(0);
		}
	});

	it('should clear error state when a new operation starts', async () => {
		expect.assertions(6);
		
		// Property: For any new operation, previous error should be cleared (Requirements 8.5)
		
		// Set up initial error
		repo.getAll = async () => {
			throw new Error('Initial error');
		};
		await service.loadTodos();
		expect(service.error).toBe('Initial error');
		
		// Start new operation that succeeds - error should be cleared
		repo.getAll = async () => [];
		await service.loadTodos();
		expect(service.error).toBeNull();
		
		// Set up another error
		repo.create = async () => {
			throw new Error('Create error');
		};
		await service.createTodo({ title: 'Test' });
		expect(service.error).toBe('Create error');
		
		// Start new operation that succeeds - error should be cleared
		repo.create = async (dto) => ({
			id: '1',
			title: dto.title,
			completed: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		});
		await service.createTodo({ title: 'Test 2' });
		expect(service.error).toBeNull();
		
		// Set up delete error
		repo.delete = async () => {
			throw new Error('Delete error');
		};
		await service.deleteTodo('some-id');
		expect(service.error).toBe('Delete error');
		
		// Start new operation that succeeds - error should be cleared
		repo.delete = async () => {};
		await service.deleteTodo('some-id');
		expect(service.error).toBeNull();
	});

	it('should not modify items array when operation fails', async () => {
		expect.assertions(9);
		
		// Property: For any failed operation, items array should remain unchanged
		
		// Test failed loadTodos
		await service.createTodo({ title: 'Existing Todo' });
		const initialLength = service.items.length;
		
		repo.getAll = async () => {
			throw new Error('Load failed');
		};
		await service.loadTodos();
		
		// Property: Items should remain unchanged
		expect(service.items.length).toBe(initialLength);
		expect(service.items[0].title).toBe('Existing Todo');
		
		// Test failed createTodo
		repo.create = async () => {
			throw new Error('Create failed');
		};
		await service.createTodo({ title: 'New Todo' });
		
		// Property: Items should remain unchanged (new todo not added)
		expect(service.items.length).toBe(initialLength);
		expect(service.items[0].title).toBe('Existing Todo');
		
		// Test failed deleteTodo
		const todoId = service.items[0].id;
		repo.delete = async () => {
			throw new Error('Delete failed');
		};
		await service.deleteTodo(todoId);
		
		// Property: Items should remain unchanged (todo not deleted)
		expect(service.items.length).toBe(initialLength);
		expect(service.items[0].id).toBe(todoId);
		expect(service.items[0].title).toBe('Existing Todo');
		
		// Property: Error should be set
		expect(service.error).toBe('Delete failed');
		expect(service.loading).toBe(false);
	});

	it('should handle errors from different error types', async () => {
		expect.assertions(8);
		
		// Property: For any type of error thrown, service should handle it correctly
		
		// Test with Error object
		repo.getAll = async () => {
			throw new Error('Standard error');
		};
		await service.loadTodos();
		expect(service.error).toBe('Standard error');
		expect(service.loading).toBe(false);
		
		// Test with TypeError
		repo.create = async () => {
			throw new TypeError('Type error occurred');
		};
		await service.createTodo({ title: 'Test' });
		expect(service.error).toBe('Type error occurred');
		expect(service.loading).toBe(false);
		
		// Test with custom error message
		repo.delete = async () => {
			throw new Error('Custom error: Operation not permitted');
		};
		await service.deleteTodo('some-id');
		expect(service.error).toBe('Custom error: Operation not permitted');
		expect(service.loading).toBe(false);
		
		// Test with RangeError
		repo.getAll = async () => {
			throw new RangeError('Range error');
		};
		await service.loadTodos();
		expect(service.error).toBe('Range error');
		expect(service.loading).toBe(false);
	});

	it('should handle rapid successive failures correctly', async () => {
		expect.assertions(6);
		
		// Property: For any sequence of rapid failures, each error should be captured
		
		const errors = [
			'Error 1',
			'Error 2',
			'Error 3'
		];
		
		let errorIndex = 0;
		repo.create = async () => {
			throw new Error(errors[errorIndex++]);
		};
		
		// Perform rapid successive operations that fail
		await service.createTodo({ title: 'Test 1' });
		expect(service.error).toBe('Error 1');
		expect(service.loading).toBe(false);
		
		await service.createTodo({ title: 'Test 2' });
		expect(service.error).toBe('Error 2');
		expect(service.loading).toBe(false);
		
		await service.createTodo({ title: 'Test 3' });
		expect(service.error).toBe('Error 3');
		expect(service.loading).toBe(false);
	});

	it('should maintain error state independence across service instances', async () => {
		expect.assertions(6);
		
		// Property: For any service instance, error state should be independent
		
		const repo1 = new MockTodoRepository();
		const repo2 = new MockTodoRepository();
		const service1 = new TodoService(repo1);
		const service2 = new TodoService(repo2);
		
		// Set up error for service1
		repo1.getAll = async () => {
			throw new Error('Service 1 error');
		};
		
		// Set up success for service2
		repo2.getAll = async () => [];
		
		// Trigger operations
		await service1.loadTodos();
		await service2.loadTodos();
		
		// Property: service1 should have error
		expect(service1.error).toBe('Service 1 error');
		expect(service1.loading).toBe(false);
		
		// Property: service2 should not have error
		expect(service2.error).toBeNull();
		expect(service2.loading).toBe(false);
		
		// Verify independence
		expect(service1.error).not.toBe(service2.error);
		expect(service1.error).toBeTruthy();
	});

	it('should handle errors with empty or whitespace messages', async () => {
		expect.assertions(6);
		
		// Property: For any error message (including empty), service should handle it
		
		// Test with empty string
		repo.getAll = async () => {
			throw new Error('');
		};
		await service.loadTodos();
		expect(service.error).toBe('');
		expect(service.loading).toBe(false);
		
		// Test with whitespace
		repo.create = async () => {
			throw new Error('   ');
		};
		await service.createTodo({ title: 'Test' });
		expect(service.error).toBe('   ');
		expect(service.loading).toBe(false);
		
		// Test with newline
		repo.delete = async () => {
			throw new Error('\n');
		};
		await service.deleteTodo('some-id');
		expect(service.error).toBe('\n');
		expect(service.loading).toBe(false);
	});

	it('should handle errors with special characters in messages', async () => {
		expect.assertions(10);
		
		// Property: For any error message with special characters, service should handle it
		
		const specialMessages = [
			'Error: <script>alert("xss")</script>',
			'Error with "quotes" and \'apostrophes\'',
			'Error with unicode: 你好世界',
			'Error with symbols: !@#$%^&*()',
			'Error with newlines:\nLine 2\nLine 3'
		];
		
		for (const message of specialMessages) {
			repo.getAll = async () => {
				throw new Error(message);
			};
			
			await service.loadTodos();
			
			// Property: Error message should be preserved exactly
			expect(service.error).toBe(message);
			expect(service.loading).toBe(false);
		}
	});

	it('should handle mixed success and failure operations correctly', async () => {
		expect.assertions(12);
		
		// Property: For any mix of successful and failed operations, error state should be correct
		
		// Successful operation - no error
		await service.createTodo({ title: 'Success 1' });
		expect(service.error).toBeNull();
		expect(service.items.length).toBe(1);
		
		// Failed operation - error set
		repo.create = async () => {
			throw new Error('Create failed');
		};
		await service.createTodo({ title: 'Failed' });
		expect(service.error).toBe('Create failed');
		expect(service.items.length).toBe(1); // Not added
		
		// Successful operation - error cleared
		repo.create = async (dto) => ({
			id: '2',
			title: dto.title,
			completed: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		});
		await service.createTodo({ title: 'Success 2' });
		expect(service.error).toBeNull();
		expect(service.items.length).toBe(2);
		
		// Failed delete - error set
		repo.delete = async () => {
			throw new Error('Delete failed');
		};
		await service.deleteTodo(service.items[0].id);
		expect(service.error).toBe('Delete failed');
		expect(service.items.length).toBe(2); // Not deleted
		
		// Successful delete - error cleared
		repo.delete = async () => {};
		await service.deleteTodo(service.items[0].id);
		expect(service.error).toBeNull();
		expect(service.items.length).toBe(1);
		
		// Final state verification
		expect(service.loading).toBe(false);
		expect(service.error).toBeNull();
	});

	it('should handle errors during operations with initial data', async () => {
		expect.assertions(6);
		
		// Property: For any service with initial data, error handling should work the same
		
		const initialData: TodoItem[] = [
			{
				id: '1',
				title: 'Initial Todo',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		];
		
		const repoWithData = new MockTodoRepository(initialData);
		const serviceWithData = new TodoService(repoWithData, initialData);
		
		// Initial state
		expect(serviceWithData.error).toBeNull();
		expect(serviceWithData.items.length).toBe(1);
		
		// Failed operation
		repoWithData.create = async () => {
			throw new Error('Create failed with initial data');
		};
		await serviceWithData.createTodo({ title: 'New Todo' });
		
		// Property: Error should be set
		expect(serviceWithData.error).toBe('Create failed with initial data');
		
		// Property: Initial data should be preserved
		expect(serviceWithData.items.length).toBe(1);
		expect(serviceWithData.items[0].title).toBe('Initial Todo');
		
		// Property: Loading should be false
		expect(serviceWithData.loading).toBe(false);
	});

	it('should handle errors that occur after successful operations', async () => {
		expect.assertions(10);
		
		// Property: For any error after successful operations, previous data should be preserved
		
		// Successful operations
		await service.createTodo({ title: 'Todo 1' });
		await service.createTodo({ title: 'Todo 2' });
		await service.createTodo({ title: 'Todo 3' });
		
		expect(service.items.length).toBe(3);
		expect(service.error).toBeNull();
		
		// Failed operation
		repo.create = async () => {
			throw new Error('Subsequent create failed');
		};
		await service.createTodo({ title: 'Todo 4' });
		
		// Property: Previous todos should be preserved
		expect(service.items.length).toBe(3);
		expect(service.items[0].title).toBe('Todo 1');
		expect(service.items[1].title).toBe('Todo 2');
		expect(service.items[2].title).toBe('Todo 3');
		
		// Property: Error should be set
		expect(service.error).toBe('Subsequent create failed');
		expect(service.loading).toBe(false);
		
		// Property: Failed todo should not be in items
		const failedTodo = service.items.find(item => item.title === 'Todo 4');
		expect(failedTodo).toBeUndefined();
		
		// Property: Completed count should be correct
		expect(service.completedCount).toBe(0);
	});
});

/**
 * Property 6: Optimistic Update Rollback
 * 
 * For any toggle operation that fails, the todo's completed status should be
 * rolled back to its previous value.
 * 
 * **Feature: todo-management, Property 6: Optimistic Update Rollback**
 * **Validates: Requirements 8.2**
 * 
 * This property test validates that the TodoService correctly rolls back optimistic
 * updates when the repository operation fails, ensuring data consistency.
 */
describe('Property 6: Optimistic Update Rollback', () => {
	let repo: MockTodoRepository;
	let service: TodoService;

	beforeEach(() => {
		repo = new MockTodoRepository();
		service = new TodoService(repo);
	});

	it('should rollback from true to false when toggle fails', async () => {
		expect.assertions(6);
		
		// Property: For any todo with completed=true, if toggle fails, it should remain true
		
		// Create a completed todo
		const initialData: TodoItem[] = [
			{
				id: '1',
				title: 'Completed Task',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		];
		
		const repoWithData = new MockTodoRepository(initialData);
		const serviceWithData = new TodoService(repoWithData, initialData);
		
		// Verify initial state
		expect(serviceWithData.items[0].completed).toBe(true);
		expect(serviceWithData.error).toBeNull();
		
		// Make update fail
		repoWithData.update = async () => {
			throw new Error('Update failed');
		};
		
		// Attempt to toggle
		await serviceWithData.toggle(serviceWithData.items[0].id);
		
		// Property: Status should be rolled back to true
		expect(serviceWithData.items[0].completed).toBe(true);
		
		// Property: Error should be set
		expect(serviceWithData.error).toBe('Update failed');
		
		// Property: Todo should still exist
		expect(serviceWithData.items.length).toBe(1);
		expect(serviceWithData.items[0].title).toBe('Completed Task');
	});

	it('should rollback from false to true when toggle fails', async () => {
		expect.assertions(6);
		
		// Property: For any todo with completed=false, if toggle fails, it should remain false
		
		// Create an incomplete todo
		await service.createTodo({ title: 'Incomplete Task' });
		
		// Verify initial state
		expect(service.items[0].completed).toBe(false);
		expect(service.error).toBeNull();
		
		// Make update fail
		repo.update = async () => {
			throw new Error('Network error');
		};
		
		// Attempt to toggle
		await service.toggle(service.items[0].id);
		
		// Property: Status should be rolled back to false
		expect(service.items[0].completed).toBe(false);
		
		// Property: Error should be set
		expect(service.error).toBe('Network error');
		
		// Property: Todo should still exist
		expect(service.items.length).toBe(1);
		expect(service.items[0].title).toBe('Incomplete Task');
	});

	it('should rollback multiple failed toggles correctly', async () => {
		expect.assertions(15);
		
		// Property: For any sequence of failed toggles, each should rollback correctly
		
		const initialData: TodoItem[] = [
			{
				id: '1',
				title: 'Task 1',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '2',
				title: 'Task 2',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '3',
				title: 'Task 3',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		];
		
		const repoWithData = new MockTodoRepository(initialData);
		const serviceWithData = new TodoService(repoWithData, initialData);
		
		// Make all updates fail
		repoWithData.update = async () => {
			throw new Error('Server error');
		};
		
		// Store initial states
		const initialStates = serviceWithData.items.map(item => item.completed);
		expect(initialStates).toEqual([false, true, false]);
		
		// Attempt to toggle all todos
		for (const todo of serviceWithData.items) {
			await serviceWithData.toggle(todo.id);
		}
		
		// Property: All todos should be rolled back to their initial states
		expect(serviceWithData.items[0].completed).toBe(false);
		expect(serviceWithData.items[1].completed).toBe(true);
		expect(serviceWithData.items[2].completed).toBe(false);
		
		// Property: Error should be set (from last operation)
		expect(serviceWithData.error).toBe('Server error');
		
		// Property: All todos should still exist
		expect(serviceWithData.items.length).toBe(3);
		expect(serviceWithData.items[0].title).toBe('Task 1');
		expect(serviceWithData.items[1].title).toBe('Task 2');
		expect(serviceWithData.items[2].title).toBe('Task 3');
		
		// Property: Completed count should match initial state
		expect(serviceWithData.completedCount).toBe(1);
		
		// Property: Pending count should match initial state
		expect(serviceWithData.pendingCount).toBe(2);
		
		// Verify the exact states
		const finalStates = serviceWithData.items.map(item => item.completed);
		expect(finalStates).toEqual(initialStates);
		
		// Property: All properties should be preserved
		expect(serviceWithData.items[0].id).toBe('1');
		expect(serviceWithData.items[1].id).toBe('2');
		expect(serviceWithData.items[2].id).toBe('3');
	});

	it('should rollback correctly after multiple toggle attempts on same todo', async () => {
		expect.assertions(11);
		
		// Property: For any todo, multiple failed toggle attempts should maintain original state
		
		await service.createTodo({ title: 'Test Todo' });
		const todo = service.items[0];
		
		// Verify initial state
		expect(todo.completed).toBe(false);
		
		// Make update fail
		repo.update = async () => {
			throw new Error('Persistent error');
		};
		
		// Attempt to toggle multiple times
		await service.toggle(todo.id);
		expect(todo.completed).toBe(false);
		expect(service.error).toBe('Persistent error');
		
		await service.toggle(todo.id);
		expect(todo.completed).toBe(false);
		expect(service.error).toBe('Persistent error');
		
		await service.toggle(todo.id);
		expect(todo.completed).toBe(false);
		expect(service.error).toBe('Persistent error');
		
		await service.toggle(todo.id);
		expect(todo.completed).toBe(false);
		expect(service.error).toBe('Persistent error');
		
		// Property: After all failed attempts, state should still be false
		expect(todo.completed).toBe(false);
		expect(service.items.length).toBe(1);
	});

	it('should preserve other todo properties during rollback', async () => {
		expect.assertions(10);
		
		// Property: For any rollback, only completed status should be affected
		
		await service.createTodo({ title: 'Test Todo' });
		const todo = service.items[0];
		
		// Store original properties
		const originalId = todo.id;
		const originalTitle = todo.title;
		const originalCreatedAt = todo.createdAt;
		const originalUpdatedAt = todo.updatedAt;
		const originalCompleted = todo.completed;
		
		// Make update fail
		repo.update = async () => {
			throw new Error('Update failed');
		};
		
		// Attempt to toggle
		await service.toggle(todo.id);
		
		// Property: All properties except completed should be unchanged
		expect(todo.id).toBe(originalId);
		expect(todo.title).toBe(originalTitle);
		expect(todo.createdAt).toBe(originalCreatedAt);
		expect(todo.updatedAt).toBe(originalUpdatedAt);
		expect(todo.completed).toBe(originalCompleted);
		
		// Property: Error should be set
		expect(service.error).toBe('Update failed');
		
		// Property: Todo should still be in items array
		expect(service.items.length).toBe(1);
		expect(service.items[0]).toBe(todo);
		
		// Property: Completed count should be correct
		expect(service.completedCount).toBe(0);
		expect(service.pendingCount).toBe(1);
	});

	it('should handle rollback with different error types', async () => {
		expect.assertions(10);
		
		// Property: For any error type, rollback should work correctly
		
		const errorTypes = [
			new Error('Standard error'),
			new TypeError('Type error'),
			new RangeError('Range error')
		];
		
		for (const error of errorTypes) {
			await service.createTodo({ title: `Task for ${error.name}` });
		}
		
		// Test rollback with different error types
		for (let i = 0; i < errorTypes.length; i++) {
			const todo = service.items[i];
			const initialState = todo.completed;
			
			repo.update = async () => {
				throw errorTypes[i];
			};
			
			await service.toggle(todo.id);
			
			// Property: Status should be rolled back
			expect(todo.completed).toBe(initialState);
			
			// Property: Error message should be set
			expect(service.error).toBe(errorTypes[i].message);
			
			// Property: Todo should still exist
			expect(service.items[i]).toBe(todo);
		}
		
		// Property: All todos should still exist
		expect(service.items.length).toBe(3);
	});

	it('should rollback correctly when toggling non-existent todo fails', async () => {
		expect.assertions(4);
		
		// Property: For any non-existent todo, toggle should not throw and items should remain unchanged
		
		await service.createTodo({ title: 'Existing Todo' });
		const initialLength = service.items.length;
		const initialCompleted = service.items[0].completed;
		
		// Make update fail (though it won't be called for non-existent todo)
		repo.update = async () => {
			throw new Error('Should not be called');
		};
		
		// Attempt to toggle non-existent todo
		await service.toggle('non-existent-id');
		
		// Property: Items should remain unchanged
		expect(service.items.length).toBe(initialLength);
		expect(service.items[0].completed).toBe(initialCompleted);
		
		// Property: Error should not be set (operation returns early)
		expect(service.error).toBeNull();
		
		// Property: Existing todo should be unchanged
		expect(service.items[0].title).toBe('Existing Todo');
	});

	it('should handle rollback with rapid successive failed toggles', async () => {
		expect.assertions(8);
		
		// Property: For any sequence of rapid failed toggles, all should rollback correctly
		
		const initialData: TodoItem[] = [
			{
				id: '1',
				title: 'Task 1',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '2',
				title: 'Task 2',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		];
		
		const repoWithData = new MockTodoRepository(initialData);
		const serviceWithData = new TodoService(repoWithData, initialData);
		
		// Store initial states
		const initialStates = serviceWithData.items.map(item => item.completed);
		
		// Make all updates fail
		repoWithData.update = async () => {
			throw new Error('Rapid failure');
		};
		
		// Perform rapid toggles sequentially to avoid race conditions
		await serviceWithData.toggle('1');
		await serviceWithData.toggle('2');
		await serviceWithData.toggle('1');
		await serviceWithData.toggle('2');
		
		// Property: All todos should be rolled back to initial states
		expect(serviceWithData.items[0].completed).toBe(initialStates[0]);
		expect(serviceWithData.items[1].completed).toBe(initialStates[1]);
		
		// Property: Error should be set
		expect(serviceWithData.error).toBe('Rapid failure');
		
		// Property: All todos should still exist
		expect(serviceWithData.items.length).toBe(2);
		
		// Property: Completed count should match initial state
		expect(serviceWithData.completedCount).toBe(1);
		
		// Property: Pending count should match initial state
		expect(serviceWithData.pendingCount).toBe(1);
		
		// Verify exact states
		const finalStates = serviceWithData.items.map(item => item.completed);
		expect(finalStates).toEqual(initialStates);
		
		// Property: IDs should be unchanged
		expect(serviceWithData.items.map(item => item.id)).toEqual(['1', '2']);
	});

	it('should rollback correctly after successful toggle followed by failed toggle', async () => {
		expect.assertions(8);
		
		// Property: For any todo, a failed toggle after a successful one should rollback correctly
		
		await service.createTodo({ title: 'Test Todo' });
		const todo = service.items[0];
		
		// Initial state: false
		expect(todo.completed).toBe(false);
		
		// First toggle succeeds
		await service.toggle(todo.id);
		expect(todo.completed).toBe(true);
		expect(service.error).toBeNull();
		
		// Make next update fail
		repo.update = async () => {
			throw new Error('Second toggle failed');
		};
		
		// Second toggle fails
		await service.toggle(todo.id);
		
		// Property: Should rollback to true (the state before failed toggle)
		expect(todo.completed).toBe(true);
		expect(service.error).toBe('Second toggle failed');
		
		// Fix the repository
		repo.update = async (id, dto) => ({
			...todo,
			completed: dto.completed!
		});
		
		// Third toggle succeeds (but doesn't clear error - toggle doesn't clear errors)
		await service.toggle(todo.id);
		expect(todo.completed).toBe(false);
		
		// Property: Todo should still exist
		expect(service.items.length).toBe(1);
		expect(service.items[0].title).toBe('Test Todo');
	});

	it('should maintain completedCount accuracy during rollback', async () => {
		expect.assertions(12);
		
		// Property: For any rollback, completedCount should reflect the rolled-back state
		
		const initialData: TodoItem[] = [
			{
				id: '1',
				title: 'Task 1',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '2',
				title: 'Task 2',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '3',
				title: 'Task 3',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		];
		
		const repoWithData = new MockTodoRepository(initialData);
		const serviceWithData = new TodoService(repoWithData, initialData);
		
		// Initial completed count
		expect(serviceWithData.completedCount).toBe(2);
		expect(serviceWithData.pendingCount).toBe(1);
		
		// Make updates fail
		repoWithData.update = async () => {
			throw new Error('Update failed');
		};
		
		// Attempt to toggle incomplete todo (would increase completedCount if successful)
		await serviceWithData.toggle('1');
		
		// Property: completedCount should remain 2 (rollback occurred)
		expect(serviceWithData.completedCount).toBe(2);
		expect(serviceWithData.pendingCount).toBe(1);
		
		// Attempt to toggle completed todo (would decrease completedCount if successful)
		await serviceWithData.toggle('2');
		
		// Property: completedCount should remain 2 (rollback occurred)
		expect(serviceWithData.completedCount).toBe(2);
		expect(serviceWithData.pendingCount).toBe(1);
		
		// Attempt to toggle another completed todo
		await serviceWithData.toggle('3');
		
		// Property: completedCount should remain 2 (rollback occurred)
		expect(serviceWithData.completedCount).toBe(2);
		expect(serviceWithData.pendingCount).toBe(1);
		
		// Property: Error should be set
		expect(serviceWithData.error).toBe('Update failed');
		
		// Property: All todos should maintain their original states
		expect(serviceWithData.items[0].completed).toBe(false);
		expect(serviceWithData.items[1].completed).toBe(true);
		expect(serviceWithData.items[2].completed).toBe(true);
	});

	it('should rollback correctly with todos of various title lengths', async () => {
		expect.assertions(14);
		
		// Property: For any todo regardless of title length, rollback should work correctly
		
		const testCases = [
			{ title: 'ab', completed: false },
			{ title: 'Short title', completed: true },
			{ title: 'A medium length todo title', completed: false },
			{ title: 'A'.repeat(50), completed: true },
			{ title: 'B'.repeat(100), completed: false },
			{ title: 'Todo with special chars !@#$%', completed: true }
		];
		
		const initialData: TodoItem[] = testCases.map((tc, i) => ({
			id: `${i + 1}`,
			title: tc.title,
			completed: tc.completed,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}));
		
		const repoWithData = new MockTodoRepository(initialData);
		const serviceWithData = new TodoService(repoWithData, initialData);
		
		// Make all updates fail
		repoWithData.update = async () => {
			throw new Error('Update failed');
		};
		
		// Store initial states
		const initialStates = serviceWithData.items.map(item => item.completed);
		
		// Attempt to toggle all todos
		for (const todo of serviceWithData.items) {
			await serviceWithData.toggle(todo.id);
		}
		
		// Property: All todos should be rolled back to their initial states
		for (let i = 0; i < testCases.length; i++) {
			expect(serviceWithData.items[i].completed).toBe(initialStates[i]);
		}
		
		// Property: Error should be set
		expect(serviceWithData.error).toBe('Update failed');
		
		// Property: All todos should still exist
		expect(serviceWithData.items.length).toBe(6);
		
		// Property: Titles should be unchanged
		for (let i = 0; i < testCases.length; i++) {
			expect(serviceWithData.items[i].title).toBe(testCases[i].title);
		}
	});

	it('should handle rollback when error message contains special characters', async () => {
		expect.assertions(6);
		
		// Property: For any error message, rollback should work correctly
		
		const specialErrorMessages = [
			'Error: <script>alert("xss")</script>',
			'Error with "quotes" and \'apostrophes\'',
			'Error with unicode: 你好世界'
		];
		
		for (const errorMessage of specialErrorMessages) {
			await service.createTodo({ title: `Task for ${errorMessage}` });
		}
		
		// Test rollback with different error messages
		for (let i = 0; i < specialErrorMessages.length; i++) {
			const todo = service.items[i];
			const initialState = todo.completed;
			
			repo.update = async () => {
				throw new Error(specialErrorMessages[i]);
			};
			
			await service.toggle(todo.id);
			
			// Property: Status should be rolled back
			expect(todo.completed).toBe(initialState);
			
			// Property: Error message should be preserved exactly
			expect(service.error).toBe(specialErrorMessages[i]);
		}
	});

	it('should rollback correctly when repository throws Error objects', async () => {
		expect.assertions(6);
		
		// Property: For any Error thrown, rollback should work correctly
		
		await service.createTodo({ title: 'Test Todo' });
		const todo = service.items[0];
		const initialState = todo.completed;
		
		// Test with standard Error
		repo.update = async () => {
			throw new Error('Standard error');
		};
		
		await service.toggle(todo.id);
		
		// Property: Should rollback with standard error
		expect(todo.completed).toBe(initialState);
		expect(service.error).toBe('Standard error');
		
		// Test with TypeError
		repo.update = async () => {
			throw new TypeError('Type error');
		};
		
		await service.toggle(todo.id);
		
		// Property: Should rollback with TypeError
		expect(todo.completed).toBe(initialState);
		expect(service.error).toBe('Type error');
		
		// Property: Todo should still exist
		expect(service.items.length).toBe(1);
		expect(service.items[0].title).toBe('Test Todo');
	});
});

/**
 * Property 7: Completed Count Accuracy
 * 
 * For any state of the items array, the completedCount getter should return
 * the exact number of items where completed is true.
 * 
 * **Feature: todo-management, Property 7: Completed Count Accuracy**
 * **Validates: Requirements 3.3**
 * 
 * This property test validates that the TodoService completedCount getter
 * accurately reflects the number of completed todos in all states.
 */
describe('Property 7: Completed Count Accuracy', () => {
	let repo: MockTodoRepository;
	let service: TodoService;

	beforeEach(() => {
		repo = new MockTodoRepository();
		service = new TodoService(repo);
	});

	it('should return 0 for empty items array', () => {
		expect.assertions(1);
		
		// Property: For any empty items array, completedCount should be 0
		expect(service.completedCount).toBe(0);
	});

	it('should return 0 when all todos are incomplete', async () => {
		expect.assertions(6);
		
		// Property: For any items array with all incomplete todos, completedCount should be 0
		const titles = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// All todos start as incomplete
		expect(service.completedCount).toBe(0);
		
		// Verify each todo is incomplete
		for (const todo of service.items) {
			expect(todo.completed).toBe(false);
		}
	});

	it('should return correct count when all todos are completed', async () => {
		expect.assertions(2);
		
		// Property: For any items array with all completed todos, completedCount should equal items.length
		const titles = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Toggle all to completed
		for (const todo of service.items) {
			await service.toggle(todo.id);
		}
		
		// Property: completedCount should equal total count
		expect(service.completedCount).toBe(5);
		expect(service.completedCount).toBe(service.items.length);
	});

	it('should return correct count for mixed completion states', async () => {
		expect.assertions(11);
		
		// Property: For any items array with mixed states, completedCount should match actual completed count
		const titles = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Initial state: all incomplete
		expect(service.completedCount).toBe(0);
		
		// Toggle first todo
		await service.toggle(service.items[0].id);
		expect(service.completedCount).toBe(1);
		
		// Toggle third todo
		await service.toggle(service.items[2].id);
		expect(service.completedCount).toBe(2);
		
		// Toggle fifth todo
		await service.toggle(service.items[4].id);
		expect(service.completedCount).toBe(3);
		
		// Toggle second todo
		await service.toggle(service.items[1].id);
		expect(service.completedCount).toBe(4);
		
		// Toggle all back to incomplete
		await service.toggle(service.items[0].id);
		expect(service.completedCount).toBe(3);
		
		await service.toggle(service.items[1].id);
		expect(service.completedCount).toBe(2);
		
		await service.toggle(service.items[2].id);
		expect(service.completedCount).toBe(1);
		
		await service.toggle(service.items[4].id);
		expect(service.completedCount).toBe(0);
		
		// Toggle fourth todo
		await service.toggle(service.items[3].id);
		expect(service.completedCount).toBe(1);
		
		// Final verification
		const actualCompletedCount = service.items.filter(t => t.completed).length;
		expect(service.completedCount).toBe(actualCompletedCount);
	});

	it('should update correctly when creating new todos', async () => {
		expect.assertions(11);
		
		// Property: For any createTodo operation, completedCount should remain accurate
		
		// Create first todo (incomplete)
		await service.createTodo({ title: 'Task 1' });
		expect(service.completedCount).toBe(0);
		
		// Toggle it to completed
		await service.toggle(service.items[0].id);
		expect(service.completedCount).toBe(1);
		
		// Create second todo (incomplete)
		await service.createTodo({ title: 'Task 2' });
		expect(service.completedCount).toBe(1);
		
		// Create third todo (incomplete)
		await service.createTodo({ title: 'Task 3' });
		expect(service.completedCount).toBe(1);
		
		// Toggle second todo to completed
		await service.toggle(service.items[1].id);
		expect(service.completedCount).toBe(2);
		
		// Create fourth todo (incomplete)
		await service.createTodo({ title: 'Task 4' });
		expect(service.completedCount).toBe(2);
		
		// Toggle third and fourth to completed
		await service.toggle(service.items[2].id);
		expect(service.completedCount).toBe(3);
		
		await service.toggle(service.items[3].id);
		expect(service.completedCount).toBe(4);
		
		// Create fifth todo (incomplete)
		await service.createTodo({ title: 'Task 5' });
		expect(service.completedCount).toBe(4);
		
		// Verify total and completed count
		expect(service.items.length).toBe(5);
		expect(service.completedCount).toBe(4);
	});

	it('should update correctly when deleting todos', async () => {
		expect.assertions(11);
		
		// Property: For any deleteTodo operation, completedCount should remain accurate
		const titles = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];
		
		for (const title of titles) {
			await service.createTodo({ title });
		}
		
		// Toggle some to completed
		await service.toggle(service.items[0].id); // Task 1: completed
		await service.toggle(service.items[2].id); // Task 3: completed
		await service.toggle(service.items[4].id); // Task 5: completed
		
		expect(service.completedCount).toBe(3);
		
		// Delete an incomplete todo (Task 2)
		await service.deleteTodo(service.items[1].id);
		expect(service.completedCount).toBe(3);
		expect(service.items.length).toBe(4);
		
		// Delete a completed todo (Task 1)
		const task1Id = service.items[0].id;
		await service.deleteTodo(task1Id);
		expect(service.completedCount).toBe(2);
		expect(service.items.length).toBe(3);
		
		// Delete another incomplete todo (Task 4)
		const task4 = service.items.find(t => t.title === 'Task 4');
		await service.deleteTodo(task4!.id);
		expect(service.completedCount).toBe(2);
		expect(service.items.length).toBe(2);
		
		// Delete a completed todo (Task 3)
		const task3 = service.items.find(t => t.title === 'Task 3');
		await service.deleteTodo(task3!.id);
		expect(service.completedCount).toBe(1);
		expect(service.items.length).toBe(1);
		
		// Delete last completed todo (Task 5)
		await service.deleteTodo(service.items[0].id);
		expect(service.completedCount).toBe(0);
		expect(service.items.length).toBe(0);
	});

	it('should remain accurate with initial data', () => {
		expect.assertions(3);
		
		// Property: For any service with initial data, completedCount should be accurate
		const initialData: TodoItem[] = [
			{
				id: '1',
				title: 'Task 1',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '2',
				title: 'Task 2',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '3',
				title: 'Task 3',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '4',
				title: 'Task 4',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '5',
				title: 'Task 5',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		];
		
		const repoWithData = new MockTodoRepository(initialData);
		const serviceWithData = new TodoService(repoWithData, initialData);
		
		// Property: completedCount should match initial data
		expect(serviceWithData.completedCount).toBe(3);
		
		// Verify against actual count
		const actualCount = serviceWithData.items.filter(t => t.completed).length;
		expect(serviceWithData.completedCount).toBe(actualCount);
		expect(serviceWithData.items.length).toBe(5);
	});

	it('should remain accurate after loadTodos', async () => {
		expect.assertions(4);
		
		// Property: For any loadTodos operation, completedCount should reflect loaded data
		const loadedData: TodoItem[] = [
			{
				id: '1',
				title: 'Loaded Task 1',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '2',
				title: 'Loaded Task 2',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '3',
				title: 'Loaded Task 3',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		];
		
		repo.getAll = async () => loadedData;
		
		// Initial state
		expect(service.completedCount).toBe(0);
		
		// Load todos
		await service.loadTodos();
		
		// Property: completedCount should match loaded data
		expect(service.completedCount).toBe(2);
		expect(service.items.length).toBe(3);
		
		// Verify against actual count
		const actualCount = service.items.filter(t => t.completed).length;
		expect(service.completedCount).toBe(actualCount);
	});

	it('should remain accurate with rapid successive operations', async () => {
		expect.assertions(11);
		
		// Property: For any sequence of rapid operations, completedCount should remain accurate
		
		// Create multiple todos rapidly
		await Promise.all([
			service.createTodo({ title: 'Task 1' }),
			service.createTodo({ title: 'Task 2' }),
			service.createTodo({ title: 'Task 3' }),
			service.createTodo({ title: 'Task 4' }),
			service.createTodo({ title: 'Task 5' })
		]);
		
		expect(service.completedCount).toBe(0);
		expect(service.items.length).toBe(5);
		
		// Toggle multiple todos rapidly
		await Promise.all([
			service.toggle(service.items[0].id),
			service.toggle(service.items[2].id),
			service.toggle(service.items[4].id)
		]);
		
		expect(service.completedCount).toBe(3);
		
		// Toggle some back
		await Promise.all([
			service.toggle(service.items[0].id),
			service.toggle(service.items[2].id)
		]);
		
		expect(service.completedCount).toBe(1);
		
		// Create more todos
		await Promise.all([
			service.createTodo({ title: 'Task 6' }),
			service.createTodo({ title: 'Task 7' })
		]);
		
		expect(service.completedCount).toBe(1);
		expect(service.items.length).toBe(7);
		
		// Toggle new todos
		await Promise.all([
			service.toggle(service.items[5].id),
			service.toggle(service.items[6].id)
		]);
		
		expect(service.completedCount).toBe(3);
		
		// Delete some todos sequentially to avoid race conditions
		// Items at indices 0 and 2 are not completed (toggled back), so deleting them leaves 3 completed
		const idsToDelete = [service.items[0].id, service.items[2].id];
		for (const id of idsToDelete) {
			await service.deleteTodo(id);
		}
		
		expect(service.completedCount).toBe(3);
		expect(service.items.length).toBe(5);
		
		// Verify against actual count
		const actualCount = service.items.filter(t => t.completed).length;
		expect(service.completedCount).toBe(actualCount);
		expect(service.completedCount).toBe(3);
	});

	it('should remain accurate after failed operations', async () => {
		expect.assertions(8);
		
		// Property: For any failed operation, completedCount should remain accurate
		
		// Create some todos
		await service.createTodo({ title: 'Task 1' });
		await service.createTodo({ title: 'Task 2' });
		await service.createTodo({ title: 'Task 3' });
		
		// Toggle some to completed
		await service.toggle(service.items[0].id);
		await service.toggle(service.items[2].id);
		
		expect(service.completedCount).toBe(2);
		
		// Make create fail
		repo.create = async () => {
			throw new Error('Create failed');
		};
		
		// Attempt to create (fails)
		await service.createTodo({ title: 'Task 4' });
		
		// Property: completedCount should remain unchanged
		expect(service.completedCount).toBe(2);
		expect(service.items.length).toBe(3);
		
		// Make delete fail
		repo.delete = async () => {
			throw new Error('Delete failed');
		};
		
		// Attempt to delete (fails)
		await service.deleteTodo(service.items[0].id);
		
		// Property: completedCount should remain unchanged
		expect(service.completedCount).toBe(2);
		expect(service.items.length).toBe(3);
		
		// Make toggle fail
		repo.update = async () => {
			throw new Error('Toggle failed');
		};
		
		// Attempt to toggle (fails, should rollback)
		await service.toggle(service.items[1].id);
		
		// Property: completedCount should remain unchanged (rollback occurred)
		expect(service.completedCount).toBe(2);
		
		// Verify against actual count
		const actualCount = service.items.filter(t => t.completed).length;
		expect(service.completedCount).toBe(actualCount);
		expect(service.completedCount).toBe(2);
	});

	it('should match manual count for any state', async () => {
		expect.assertions(20);
		
		// Property: For any state, completedCount should equal manual filter count
		
		// Test with various states
		const states = [
			{ create: 5, toggleIndices: [] },
			{ create: 5, toggleIndices: [0] },
			{ create: 5, toggleIndices: [0, 2, 4] },
			{ create: 5, toggleIndices: [0, 1, 2, 3, 4] },
			{ create: 10, toggleIndices: [1, 3, 5, 7, 9] }
		];
		
		for (const state of states) {
			// Reset service
			service = new TodoService(repo);
			
			// Create todos
			for (let i = 0; i < state.create; i++) {
				await service.createTodo({ title: `Task ${i + 1}` });
			}
			
			// Toggle specified indices
			for (const index of state.toggleIndices) {
				await service.toggle(service.items[index].id);
			}
			
			// Property: completedCount should match manual count
			const manualCount = service.items.filter(t => t.completed).length;
			expect(service.completedCount).toBe(manualCount);
			
			// Property: completedCount should match toggle count
			expect(service.completedCount).toBe(state.toggleIndices.length);
			
			// Property: completedCount + pendingCount should equal total
			expect(service.completedCount + service.pendingCount).toBe(service.items.length);
			
			// Property: completedCount should be non-negative
			expect(service.completedCount).toBeGreaterThanOrEqual(0);
		}
	});

	it('should remain accurate with todos of various title lengths', async () => {
		expect.assertions(8);
		
		// Property: For any todo regardless of title length, completedCount should be accurate
		const testCases = [
			{ title: 'ab', shouldComplete: true },
			{ title: 'Short', shouldComplete: false },
			{ title: 'A medium length todo title', shouldComplete: true },
			{ title: 'A'.repeat(50), shouldComplete: false },
			{ title: 'B'.repeat(100), shouldComplete: true },
			{ title: 'Todo with special chars !@#$%', shouldComplete: true }
		];
		
		for (const { title } of testCases) {
			await service.createTodo({ title });
		}
		
		expect(service.completedCount).toBe(0);
		
		// Toggle based on shouldComplete
		for (let i = 0; i < testCases.length; i++) {
			if (testCases[i].shouldComplete) {
				await service.toggle(service.items[i].id);
			}
		}
		
		// Property: completedCount should match expected count
		const expectedCount = testCases.filter(tc => tc.shouldComplete).length;
		expect(service.completedCount).toBe(expectedCount);
		expect(service.completedCount).toBe(4);
		
		// Verify against actual count
		const actualCount = service.items.filter(t => t.completed).length;
		expect(service.completedCount).toBe(actualCount);
		
		// Property: completedCount + pendingCount should equal total
		expect(service.completedCount + service.pendingCount).toBe(6);
		expect(service.items.length).toBe(6);
		
		// Toggle all back
		for (const todo of service.items) {
			if (todo.completed) {
				await service.toggle(todo.id);
			}
		}
		
		expect(service.completedCount).toBe(0);
		expect(service.pendingCount).toBe(6);
	});

	it('should be consistent with pendingCount', async () => {
		expect.assertions(11);
		
		// Property: For any state, completedCount + pendingCount should equal items.length
		
		// Test with various operations
		await service.createTodo({ title: 'Task 1' });
		expect(service.completedCount + service.pendingCount).toBe(service.items.length);
		
		await service.createTodo({ title: 'Task 2' });
		expect(service.completedCount + service.pendingCount).toBe(service.items.length);
		
		await service.toggle(service.items[0].id);
		expect(service.completedCount + service.pendingCount).toBe(service.items.length);
		
		await service.createTodo({ title: 'Task 3' });
		expect(service.completedCount + service.pendingCount).toBe(service.items.length);
		
		await service.toggle(service.items[2].id);
		expect(service.completedCount + service.pendingCount).toBe(service.items.length);
		
		await service.createTodo({ title: 'Task 4' });
		expect(service.completedCount + service.pendingCount).toBe(service.items.length);
		
		await service.toggle(service.items[1].id);
		expect(service.completedCount + service.pendingCount).toBe(service.items.length);
		
		await service.deleteTodo(service.items[0].id);
		expect(service.completedCount + service.pendingCount).toBe(service.items.length);
		
		await service.createTodo({ title: 'Task 5' });
		expect(service.completedCount + service.pendingCount).toBe(service.items.length);
		
		await service.toggle(service.items[0].id);
		expect(service.completedCount + service.pendingCount).toBe(service.items.length);
		
		// Final verification
		expect(service.completedCount + service.pendingCount).toBe(service.items.length);
	});

	it('should handle edge case of single todo', async () => {
		expect.assertions(5);
		
		// Property: For any single todo, completedCount should be 0 or 1
		
		await service.createTodo({ title: 'Single Task' });
		
		// Initially incomplete
		expect(service.completedCount).toBe(0);
		expect(service.pendingCount).toBe(1);
		
		// Toggle to completed
		await service.toggle(service.items[0].id);
		expect(service.completedCount).toBe(1);
		expect(service.pendingCount).toBe(0);
		
		// Property: completedCount + pendingCount should equal 1
		expect(service.completedCount + service.pendingCount).toBe(1);
	});

	it('should handle large number of todos', async () => {
		expect.assertions(6);
		
		// Property: For any large number of todos, completedCount should remain accurate
		
		// Create 100 todos
		for (let i = 0; i < 100; i++) {
			await service.createTodo({ title: `Task ${i + 1}` });
		}
		
		expect(service.completedCount).toBe(0);
		expect(service.items.length).toBe(100);
		
		// Toggle every other todo (50 todos)
		for (let i = 0; i < 100; i += 2) {
			await service.toggle(service.items[i].id);
		}
		
		expect(service.completedCount).toBe(50);
		expect(service.pendingCount).toBe(50);
		
		// Verify against actual count
		const actualCount = service.items.filter(t => t.completed).length;
		expect(service.completedCount).toBe(actualCount);
		expect(service.completedCount + service.pendingCount).toBe(100);
	});

	it('should remain accurate across multiple service instances', () => {
		expect.assertions(6);
		
		// Property: For any service instance, completedCount should be independent
		
		const repo1 = new MockTodoRepository();
		const repo2 = new MockTodoRepository();
		
		const initialData1: TodoItem[] = [
			{
				id: '1',
				title: 'Task 1',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '2',
				title: 'Task 2',
				completed: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		];
		
		const initialData2: TodoItem[] = [
			{
				id: '3',
				title: 'Task 3',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '4',
				title: 'Task 4',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			{
				id: '5',
				title: 'Task 5',
				completed: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		];
		
		const service1 = new TodoService(repo1, initialData1);
		const service2 = new TodoService(repo2, initialData2);
		
		// Property: Each service should have independent completedCount
		expect(service1.completedCount).toBe(1);
		expect(service2.completedCount).toBe(3);
		
		expect(service1.items.length).toBe(2);
		expect(service2.items.length).toBe(3);
		
		// Property: Counts should not affect each other
		expect(service1.completedCount).not.toBe(service2.completedCount);
		expect(service1.completedCount + service2.completedCount).toBe(4);
	});
});
