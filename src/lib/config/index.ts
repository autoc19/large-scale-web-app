/**
 * Configuration Layer Exports
 *
 * Central export point for configuration.
 */

// Public config (client-safe)
export { publicConfig } from './env.public';
export type { PublicConfig } from './env.public';

// Private config (server-only)
// Note: Only import this in server-side code!
export { privateConfig } from './env.private';
export type { PrivateConfig } from './env.private';
