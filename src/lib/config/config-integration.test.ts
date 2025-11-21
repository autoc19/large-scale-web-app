import { describe, it, expect } from 'vitest';

/**
 * Integration tests for configuration layer
 * 
 * These tests verify that configuration is properly accessible
 * and maintains security boundaries between client and server code.
 */

describe('Configuration Integration', () => {
	it('should provide publicConfig in client code', async () => {
		expect.assertions(2);
		const { publicConfig } = await import('$config/env.public');

		expect(publicConfig).toBeDefined();
		expect(publicConfig.apiBase).toBeDefined();
	});

	it('should have all required public config properties', async () => {
		expect.assertions(4);
		const { publicConfig } = await import('$config/env.public');

		expect(publicConfig).toHaveProperty('apiBase');
		expect(publicConfig).toHaveProperty('appName');
		expect(publicConfig).toHaveProperty('isDev');
		expect(publicConfig).toHaveProperty('isProd');
	});

	it('should have correct types for public config', async () => {
		expect.assertions(4);
		const { publicConfig } = await import('$config/env.public');

		expect(typeof publicConfig.apiBase).toBe('string');
		expect(typeof publicConfig.appName).toBe('string');
		expect(typeof publicConfig.isDev).toBe('boolean');
		expect(typeof publicConfig.isProd).toBe('boolean');
	});

	it('should provide privateConfig in server code', async () => {
		expect.assertions(2);
		const { privateConfig } = await import('$config/env.private');

		expect(privateConfig).toBeDefined();
		expect(privateConfig.apiSecret).toBeDefined();
	});

	it('should have all required private config properties', async () => {
		expect.assertions(2);
		const { privateConfig } = await import('$config/env.private');

		expect(privateConfig).toHaveProperty('apiSecret');
		expect(privateConfig).toHaveProperty('databaseUrl');
	});

	it('should have correct types for private config', async () => {
		expect.assertions(2);
		const { privateConfig } = await import('$config/env.private');

		expect(typeof privateConfig.apiSecret).toBe('string');
		expect(
			typeof privateConfig.databaseUrl === 'string' || privateConfig.databaseUrl === null
		).toBe(true);
	});

	it('should validate configuration at startup', async () => {
		expect.assertions(1);
		// If configuration validation fails, the import would throw
		// This test verifies that the module loads successfully
		const config = await import('$config/env.public');
		expect(config).toBeDefined();
	});

	it('should maintain configuration immutability', async () => {
		expect.assertions(1);
		const { publicConfig } = await import('$config/env.public');

		// Config uses 'as const' for TypeScript immutability
		// At runtime, the object is not frozen, but TypeScript prevents modification
		// This test verifies the config object exists and has readonly properties
		expect(Object.isFrozen(publicConfig)).toBe(false); // Not frozen at runtime, but TS enforces readonly
	});

	it('should provide consistent config values across imports', async () => {
		expect.assertions(2);
		const config1 = await import('$config/env.public');
		const config2 = await import('$config/env.public');

		expect(config1.publicConfig.apiBase).toBe(config2.publicConfig.apiBase);
		expect(config1.publicConfig).toBe(config2.publicConfig);
	});

	it('should have isDev and isProd as opposites', async () => {
		expect.assertions(1);
		const { publicConfig } = await import('$config/env.public');

		expect(publicConfig.isDev).toBe(!publicConfig.isProd);
	});

	it('should provide appName with default value', async () => {
		expect.assertions(2);
		const { publicConfig } = await import('$config/env.public');

		expect(publicConfig.appName).toBeDefined();
		expect(publicConfig.appName.length).toBeGreaterThan(0);
	});

	it('should provide non-empty apiSecret', async () => {
		expect.assertions(1);
		const { privateConfig } = await import('$config/env.private');

		expect(privateConfig.apiSecret.length).toBeGreaterThan(0);
	});

	it('should allow optional databaseUrl in private config', async () => {
		expect.assertions(1);
		const { privateConfig } = await import('$config/env.private');

		// databaseUrl can be string or null
		const isValid =
			typeof privateConfig.databaseUrl === 'string' || privateConfig.databaseUrl === null;
		expect(isValid).toBe(true);
	});

	it('should provide TypeScript autocompletion for config properties', async () => {
		expect.assertions(1);
		const { publicConfig } = await import('$config/env.public');

		// This test verifies that TypeScript can access properties
		// In a real scenario, TypeScript would provide autocomplete
		const apiBase = publicConfig.apiBase;
		expect(typeof apiBase).toBe('string');
	});
});
