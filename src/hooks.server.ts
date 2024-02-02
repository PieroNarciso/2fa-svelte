import { session } from '$lib/session';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const user = await session.getSession(event.cookies);
  event.locals.user = user;
  if (
    (event.url.pathname.startsWith('/register') || event.url.pathname == '/') &&
    event.locals.user
  ) {
    return new Response(null, {
      status: 302,
      headers: {
        location: '/app'
      }
    });
  }
  return resolve(event);
};
