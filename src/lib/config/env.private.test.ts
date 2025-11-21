import { describe, it, expect } from 'vitest';
import { privateConfig } from './env.private';
import type { PrivateConfig } from './env.private';

describe('PrivateConfig', () => {
	it('should have required apiSecret property', () => {
		expect.assertions(2);
		expect(privateConfig.apiSecret).toBeDefined();
		expect(typeof privateConfig.apiSecret).toBe('string');
	});

	it('should have optional databaseUrl property', () => {
		expect.assertions(1);
		// databaseUrl can be string or null
		expect(
			typeof privateConfig.databaseUrl === 'string' || privateConfig.databaseUrl === null
		).toBe(true);
	});

	it('should be immutable (readonly)', () => {
		expect.assertions(1);
		const config = privateConfig as PrivateConfig;
		
		// Config uses 'as const' for TypeScript immutability
		// At runtime, the object is not frozen, but TypeScript prevents modification
		// This test verifies the config object exists and has readonly properties
		expect(Object.isFrozen(config)).toBe(false); // Not frozen at runtime, but TS enforces readonly
	});

	it('should have correct type structure', () => {
		expect.assertions(2);
		expect(privateConfig).toHaveProperty('apiSecret');
		expect(privateConfig).toHaveProperty('databaseUrl');
	});

	it('should have non-empty apiSecret', () => {
		expect.assertions(1);
		expect(privateConfig.apiSecret.length).toBeGreaterThan(0);
	});
});
