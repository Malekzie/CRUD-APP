import { registerSchema } from '$lib/schema';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { db, users } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { lucia } from '$lib/server/auth';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(registerSchema)),
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(registerSchema));
		try {
			if (!form.valid) {
				return fail(400, {
					form
				});
			}
			
		} catch (e) {
			return error(500, 'Something went wrong with the forms' )
		}

		try {

			const userExists = db
			.select({ username: users.username })
			.from(users)
			.where(eq(users.username, form.data.username))
			.limit(1)
			.get();
			
			if (userExists) {
				return setError(form, 'username', 'Username already exists');
			}
		} catch (err) {
			return error(422, 'Something went wrong with the database.')
		}
			
		try {

			const userId = generateId(15);
			const hashedPassword = await new Argon2id().hash(form.data.password);
			
			const { insertedId } = db
			.insert(users)
			.values({ username: form.data.username, hashed_password: hashedPassword, id: userId })
			.returning({ insertedId: users.id })
			.get();
			
			const session = await lucia.createSession(insertedId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
			
		} catch (err) {
			return error(500, 'Something went inserting user into the database.')
		}
			redirect(302, '/login')
	}
};
