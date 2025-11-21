/**
 * Private Configuration
 *
 * Type-safe wrapper for server-only environment variables.
 * These values are NEVER exposed to the browser.
 *
 * @module config/env.private
 */

import { API_SECRET_KEY, DATABASE_URL } from '$env/static/private';

/**
 * Private configuration interface
 */
export interface PrivateConfig {
	readonly apiSecret: string;
	readonly databaseUrl: string | null;
}

// Validate required environment variables
if (!API_SECRET_KEY) {
	throw new Error('FATAL: API_SECRET_KEY environment variable is required');
}

/**
 * Private configuration object
 *
 * ⚠️ WARNING: This should ONLY be imported in server-side code
 * (e.g., +page.server.ts, +server.ts, hooks.server.ts)
 *
 * @example
 * ```typescript
 * // In +page.server.ts
 * import { privateConfig } from '$config/env.private';
 *
 * const secret = privateConfig.apiSecret;
 * ```
 */
export const privateConfig: PrivateConfig = {
	apiSecret: API_SECRET_KEY,
	databaseUrl: DATABASE_URL || null
} as const;
