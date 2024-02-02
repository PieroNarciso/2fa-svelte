import { db } from '$lib/db';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import { fail, redirect } from '@sveltejs/kit';
import { session } from '$lib/session';
import type { Actions } from './$types';

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get('username')?.toString();
    const password = data.get('password')?.toString();
    if (!username || !password) {
      return fail(400, {
        success: false,
        message: 'Missing username or password',
        askOTP: false
      });
    }
    const result = await db
      .selectFrom('users')
      .selectAll()
      .where('username', '=', username)
      .limit(1)
      .execute();
    if (result.length === 0) {
      return fail(400, {
        success: false,
        message: 'Invalid username or password',
        askOTP: false
      });
    }
    const [user] = result;
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return fail(400, {
        success: false,
        message: 'Invalid username or password',
        askOTP: false
      });
    }

    if (user.twofa_enabled) {
      return {
        success: true,
        askOTP: true,
        username: user.username,
        identifier: user.id
      };
    } else {
      await session.saveSession(
        { username: user.username, id: user.id, otpActive: user.twofa_enabled },
        cookies
      );
    }

    return redirect(303, '/app');
  },
  validateOTP: async ({ request, cookies }) => {
    const formData = await request.formData();
    const username = formData.get('username')?.toString();
    const identifier = formData.get('identifier')?.toString();
    if (!username || !identifier) {
      return fail(400, {
        success: false
      });
    }

    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', parseInt(identifier))
      .where('username', '=', username)
      .limit(1)
      .executeTakeFirst();
    if (!user) {
      throw redirect(303, '/');
    }

    const code = formData.get('otp')?.toString();
    if (!code) {
      return fail(400, {
        success: false,
        message: 'Missing code'
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

    await session.saveSession(
      { username: user.username, id: user.id, otpActive: user.twofa_enabled },
      cookies
    );
    return redirect(303, '/app');
  }
};
