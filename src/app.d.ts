// See https://kit.svelte.dev/docs/types#app

import type { SuperValidated } from "sveltekit-superforms";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import("lucia").User | null;
			session: import("lucia").Session | null;
		}
		interface PageData {
			user: import("lucia").User | null;
			session: import("lucia").Session | null;
		}
		interface PageState {
			updatePost: {
				form: SuperValidated<Infer<updatePostSchema>>;
			};
		}
		// interface Platform {}
	}
}

export {};
