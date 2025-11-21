import type { Handle } from '@sveltejs/kit';
// TODO: Enable Paraglide middleware after i18n-integration spec is implemented
// import { paraglideMiddleware } from '$lib/paraglide/server';

// const handleParaglide: Handle = ({ event, resolve }) =>
// 	paraglideMiddleware(event.request, ({ request, locale }: { request: Request; locale: string }) => {
// 		event.request = request;

// 		return resolve(event, {
// 			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
// 		});
// 	});

// export const handle: Handle = handleParaglide;

// Temporary placeholder until Paraglide is configured
export const handle: Handle = ({ event, resolve }) => {
	return resolve(event);
};
