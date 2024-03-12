import { loginSchema, registerSchema } from '$lib/schema';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
    return  {
        registerForm: await superValidate(zod(registerSchema)),
        loginForm: await superValidate(zod(registerSchema))
    }
};

export const actions: Actions = {
    register: async (event) => {
        const form = await superValidate(event, zod(registerSchema));

        if (!form.valid) {
            return fail(400, {
                form
            })
        }

        return { form };
    },
    login: async (event) => {
        const form = await superValidate(event, zod(loginSchema));

        if (!form.valid) {
            return fail(400, {
                form
            })
        }

        return { form };
    },
}