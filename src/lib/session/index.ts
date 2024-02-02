import crypto from 'crypto';
import { client } from '$lib/db/redis';
import type { Cookies } from '@sveltejs/kit';

export type UserSession = {
  id: number;
  username: string;
  otpActive?: boolean;
};

export class SessionManager<T> {
  private sessionKey = 'session';

  async saveSession(value: T, cookies: Cookies): Promise<[boolean, string]> {
    const sessionData = JSON.stringify(value);
    const key = crypto.randomBytes(16).toString('hex');
    const result = await client.set(key, sessionData);
    if (result) {
      cookies.set(this.sessionKey, key, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        maxAge: 60 * 60 * 24 * 7
      });
      return [true, key];
    }
    return [false, key];
  }

  async getSession(cookies: Cookies): Promise<T | null> {
    const key = cookies.get(this.sessionKey);
    if (!key) {
      return null;
    }
    const sessionData = await client.get(key);
    if (sessionData) {
      return JSON.parse(sessionData) as T;
    }
    return null;
  }

  async clearSession(cookies: Cookies): Promise<boolean> {
    const key = cookies.get(this.sessionKey);
    if (!key) {
      return true;
    }
    await client.del(key);
    cookies.delete(this.sessionKey, { path: '/' });
    return true;
  }
}

export const session = new SessionManager<UserSession>();
