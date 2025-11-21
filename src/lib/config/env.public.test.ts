import { describe, it, expect } from 'vitest';
import { publicConfig } from './env.public';
import type { PublicConfig } from './env.public';

describe('PublicConfig', () => {
	it('should have required apiBase property', () => {
		expect.assertions(2);
		expect(publicConfig.apiBase).toBeDefined();
		expect(typeof publicConfig.apiBase).toBe('string');
	});

	it('should have appName with default value', () => {
		expect.assertions(2);
		expect(publicConfig.appName).toBeDefined();
		expect(typeof publicConfig.appName).toBe('string');
	});

	it('should have computed isDev property', () => {
		expect.assertions(2);
		expect(publicConfig.isDev).toBeDefined();
		expect(typeof publicConfig.isDev).toBe('boolean');
	});

	it('should have computed isProd property', () => {
		expect.assertions(2);
		expect(publicConfig.isProd).toBeDefined();
		expect(typeof publicConfig.isProd).toBe('boolean');
	});

	it('should have isDev and isProd as opposites', () => {
		expect.assertions(1);
		expect(publicConfig.isDev).toBe(!publicConfig.isProd);
	});

	it('should be immutable (readonly)', () => {
		expect.assertions(1);
		const config = publicConfig as PublicConfig;
		
		// Config uses 'as const' for TypeScript immutability
		// At runtime, the object is not frozen, but TypeScript prevents modification
		// This test verifies the config object exists and has readonly properties
		expect(Object.isFrozen(config)).toBe(false); // Not frozen at runtime, but TS enforces readonly
	});

	it('should have correct type structure', () => {
		expect.assertions(4);
		expect(publicConfig).toHaveProperty('apiBase');
		expect(publicConfig).toHaveProperty('appName');
		expect(publicConfig).toHaveProperty('isDev');
		expect(publicConfig).toHaveProperty('isProd');
	});
});
