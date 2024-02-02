import { config } from '$lib/config';
import { db } from '$lib/db';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const username = data.get('username')?.toString();
    const password = data.get('password')?.toString();
    if (!username || !password) {
      return fail(400, {
        success: false,
        message: 'Missing username or password'
      });
    }
    const confirmPassword = data.get('confirmPassword');
    if (password !== confirmPassword) {
      return fail(400, { success: false, message: 'Passwords do not match' });
    }
    const hashedPassword = await bcrypt.hash(password, config.saltRounds);
    await db
      .insertInto('users')
      .values({ username, password: hashedPassword })
      .execute();
    redirect(303, '/');
  }
};
