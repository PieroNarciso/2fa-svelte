import { db } from '$lib/db';
import speakeasy from 'speakeasy';
import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(303, '/');
  }
  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('id', '=', locals.user.id)
    .limit(1)
    .executeTakeFirst();

  if (user?.twofa_enabled) {
    throw redirect(303, '/app');
  }

  const secret = speakeasy.generateSecret({
    name: 'SvelteKit 2FA'
  });

  await db
    .updateTable('users')
    .set({
      twofa_secret: secret.ascii
    })
    .where('id', '=', locals.user.id)
    .executeTakeFirst();

  return { url: secret.otpauth_url, secret: secret.ascii };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/');
    }

    const data = await request.formData();
    const code = data.get('code')?.toString();
    if (!code) {
      return fail(400, {
        success: false,
        message: 'Missing code'
      });
    }
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', locals.user.id)
      .limit(1)
      .executeTakeFirst();
    if (!user) {
      return fail(400, {
        message: 'You are not logged in'
      });
    }

    const valid = speakeasy.totp.verify({
      secret: user.twofa_secret!,
      encoding: 'ascii',
      token: code
    });
    if (!valid) {
      return fail(400, {
        success: false,
        message: 'Invalid code'
      });
    }

    await db
      .updateTable('users')
      .set({ twofa_enabled: true })
      .where('id', '=', locals.user.id)
      .executeTakeFirst();
    return redirect(303, '/app');
  }
};
