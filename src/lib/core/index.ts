/**
 * Core Layer Exports
 *
 * Central export point for core infrastructure.
 */

// API
export { createHttpClient, HttpError } from './api/http-client';
export type { HttpClient } from './api/http-client';

// Context
export { HTTP_CLIENT_KEY } from './context/keys';
