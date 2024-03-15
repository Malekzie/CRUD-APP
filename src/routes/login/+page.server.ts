import { loginSchema } from "$lib/zod-schema";
import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { lucia } from "$lib/server/auth";
import { users } from "$lib/server/schemas";
import { db } from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) redirect(302, "/");
	return {
		form: await superValidate(zod(loginSchema)),
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(loginSchema));
		const username = form.data.username;
		const password = form.data.password;
		try {
			if (!form.valid) {
				return fail(400, {
					form,
				});
			}
		} catch (err) {
			return error(500, "Something went wrong with the forms");
		}

		try {
			const existingUser = await db
				.select()
				.from(users)
				.where(eq(users.username, username))
				.limit(1)
				.get();

			if (!existingUser) {
				return setError(form, "", "Invalid username or password");
			}

			const validPassword = await new Argon2id().verify(existingUser.hashed_password, password);
			if (!validPassword) {
				return setError(form, "", "Invalid username or password");
			}

			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes,
			});
		} catch (err) {
			return error(422, "Something went wrong with the setting user into database");
		}

		redirect(302, "/");
	},
};
