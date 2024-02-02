import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { session } from "$lib/session";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(303, '/');
  }
  return {
    twofa_enabled: !!locals.user.otpActive
  }; 
}


export const actions: Actions = {
  logout: async ({ locals, cookies }) => {
    if (!locals.user) {
      throw redirect(303, '/');
    }
    locals.user = null;
    await session.clearSession(cookies)
    throw redirect(303, '/'); 
  }
}
