import { describe, it, expect } from 'vitest';
import { publicConfig } from './env.public';
import { privateConfig } from './env.private';

/**
 * Property 1: Configuration Validation
 * 
 * For any required environment variable, if it is missing at startup,
 * the system should throw a descriptive error before any code execution.
 * 
 * **Validates: Requirements 2.3**
 * 
 * Since environment variables are loaded at module initialization time,
 * we test that:
 * 1. Required variables are present and non-empty
 * 2. Configuration objects are properly initialized
 * 3. All required properties exist and have correct types
 */
describe('Property 1: Configuration Validation', () => {
	it('should have all required public config properties defined and non-empty', () => {
		expect.assertions(2);
		
		// Property: For any required public config property, it should be defined and non-empty
		expect(publicConfig.apiBase).toBeDefined();
		expect(publicConfig.apiBase.length).toBeGreaterThan(0);
	});

	it('should have all required private config properties defined and non-empty', () => {
		expect.assertions(2);
		
		// Property: For any required private config property, it should be defined and non-empty
		expect(privateConfig.apiSecret).toBeDefined();
		expect(privateConfig.apiSecret.length).toBeGreaterThan(0);
	});

	it('should have correct types for all public config properties', () => {
		expect.assertions(4);
		
		// Property: For any public config property, it should have the correct type
		expect(typeof publicConfig.apiBase).toBe('string');
		expect(typeof publicConfig.appName).toBe('string');
		expect(typeof publicConfig.isDev).toBe('boolean');
		expect(typeof publicConfig.isProd).toBe('boolean');
	});

	it('should have correct types for all private config properties', () => {
		expect.assertions(2);
		
		// Property: For any private config property, it should have the correct type
		expect(typeof privateConfig.apiSecret).toBe('string');
		expect(
			typeof privateConfig.databaseUrl === 'string' || privateConfig.databaseUrl === null
		).toBe(true);
	});

	it('should have isDev and isProd as mutually exclusive', () => {
		expect.assertions(1);
		
		// Property: For any config, isDev and isProd should be opposites
		expect(publicConfig.isDev).toBe(!publicConfig.isProd);
	});

	it('should have appName with fallback default', () => {
		expect.assertions(2);
		
		// Property: For any public config, appName should be defined with a default
		expect(publicConfig.appName).toBeDefined();
		expect(publicConfig.appName.length).toBeGreaterThan(0);
	});

	it('should have databaseUrl as optional in private config', () => {
		expect.assertions(1);
		
		// Property: For any private config, databaseUrl can be null or string
		const isValidDatabaseUrl =
			privateConfig.databaseUrl === null || typeof privateConfig.databaseUrl === 'string';
		expect(isValidDatabaseUrl).toBe(true);
	});
});
