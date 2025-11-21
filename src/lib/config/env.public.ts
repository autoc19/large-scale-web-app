/**
 * Public Configuration
 *
 * Type-safe wrapper for client-safe environment variables.
 * These values are exposed to the browser.
 *
 * @module config/env.public
 */

import { PUBLIC_API_BASE, PUBLIC_APP_NAME } from '$env/static/public';

/**
 * Public configuration interface
 */
export interface PublicConfig {
	readonly apiBase: string;
	readonly appName: string;
	readonly isDev: boolean;
	readonly isProd: boolean;
}

// Validate required environment variables
if (!PUBLIC_API_BASE) {
	throw new Error('FATAL: PUBLIC_API_BASE environment variable is required');
}

/**
 * Public configuration object
 *
 * @example
 * ```typescript
 * import { publicConfig } from '$config/env.public';
 *
 * const url = `${publicConfig.apiBase}/todos`;
 * ```
 */
export const publicConfig: PublicConfig = {
	apiBase: PUBLIC_API_BASE,
	appName: PUBLIC_APP_NAME || 'Large Scale Web App',
	isDev: import.meta.env.DEV,
	isProd: import.meta.env.PROD
} as const;
