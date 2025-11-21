import { describe, it, expect } from 'vitest';
import { HTTP_CLIENT_KEY, TODO_SERVICE_KEY } from './keys';

describe('Context Keys', () => {
	it('should create unique Symbol keys', () => {
		expect.assertions(2);
		expect(typeof HTTP_CLIENT_KEY).toBe('symbol');
		expect(typeof TODO_SERVICE_KEY).toBe('symbol');
	});

	it('should have different Symbol instances for different keys', () => {
		expect.assertions(1);
		expect(HTTP_CLIENT_KEY).not.toBe(TODO_SERVICE_KEY);
	});

	it('should have descriptive Symbol descriptions', () => {
		expect.assertions(2);
		expect(HTTP_CLIENT_KEY.description).toBe('HTTP_CLIENT');
		expect(TODO_SERVICE_KEY.description).toBe('TODO_SERVICE');
	});

	it('should not be equal to Symbols with same description', () => {
		expect.assertions(2);
		const duplicateHttpKey = Symbol('HTTP_CLIENT');
		const duplicateTodoKey = Symbol('TODO_SERVICE');
		
		expect(HTTP_CLIENT_KEY).not.toBe(duplicateHttpKey);
		expect(TODO_SERVICE_KEY).not.toBe(duplicateTodoKey);
	});

	it('should be usable as object keys', () => {
		expect.assertions(2);
		const context = {
			[HTTP_CLIENT_KEY]: 'http-client-instance',
			[TODO_SERVICE_KEY]: 'todo-service-instance'
		};

		expect(context[HTTP_CLIENT_KEY]).toBe('http-client-instance');
		expect(context[TODO_SERVICE_KEY]).toBe('todo-service-instance');
	});
});
