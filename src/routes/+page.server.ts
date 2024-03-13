import { db } from '$lib/server/db';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { createPostSchema } from '$lib/zod-schema';
import { fail, redirect } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { posts } from '$lib/server/schemas';

export const load: PageServerLoad = async () => {
	const createPostForm = await superValidate(zod(createPostSchema));

	const posts = await db.query.posts.findMany({
		with: {
			user: {
				columns: {
					id: true,
					username: true
				}
			}
		}
	});

	return {
		posts,
		createPostForm
	};
};

export const actions: Actions = {
	createPost: async (event) => {
		if (!event.locals.user) redirect(302, '/login');
		const form = await superValidate(event, zod(createPostSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const postId = generateId(15);

		// Create a post in DB
		await db.insert(posts).values({ id: postId, ...form.data, userId: event.locals.user.id });

		return { form };
	}
};
