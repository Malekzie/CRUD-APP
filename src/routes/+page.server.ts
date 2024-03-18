import { db } from "$lib/server/db";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad, Actions } from "./$types";
import { setError, superValidate } from "sveltekit-superforms";
import { createPostSchema, deletePostSchema } from "$lib/zod-schema";
import { fail, redirect } from "@sveltejs/kit";
import { generateId } from "lucia";
import { posts } from "$lib/server/schemas";
import { eq } from "drizzle-orm";
import { getPostById } from "$lib/server/helpers";

export const load: PageServerLoad = async () => {
	const createPostForm = await superValidate(zod(createPostSchema));
	const deletePostForm = await superValidate(zod(deletePostSchema));

	const posts = await db.query.posts.findMany({
		orderBy: (posts, { desc }) => [desc(posts.createdAt)],
		with: {
			user: {
				columns: {
					username: true,
				},
			},
		},
	});

	return {
		posts,
		createPostForm,
		deletePostForm,
	};
};

export const actions: Actions = {
	createPost: async (event) => {
		if (!event.locals.user) redirect(302, "/login");
		const form = await superValidate(event, zod(createPostSchema));

		if (!form.valid) {
			return fail(400, { form });
		}
		const postId = generateId(15);

		// Create a post in DB
		await db.insert(posts).values({ id: postId, ...form.data, userId: event.locals.user.id });

		return { form };
	},
	deletePost: async (event) => {
		if (!event.locals.user) redirect(302, "/login");
		const form = await superValidate(event.url, zod(deletePostSchema));

		if (!form.valid) {
			return setError(form, "", "Error deleting Post");
		}

		if (!getPostById(form.data.id, event.locals.user.id)) {
			return setError(form, "", "Post not found");
		}

		await db.delete(posts).where(eq(posts.id, form.data.id));

		return {
			form,
		};
	},
};
