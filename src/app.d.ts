// See https://kit.svelte.dev/docs/types#app

import type { UserSession } from "$lib/session";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
      user: UserSession | null;
    }
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
