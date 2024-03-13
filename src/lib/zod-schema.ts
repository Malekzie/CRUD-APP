import { z } from 'zod';

export const registerSchema = z
	.object({
		username: z.string().min(3).max(20),
		password: z.string().min(8).max(255),
		confirmPassword: z.string().min(6).max(255)
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword', 'password']
	});

export const loginSchema = z.object({
	username: z.string().min(3).max(20),
	password: z.string()
});

export const createPostSchema = z.object({
	title: z
		.string()
		.min(3, 'Title must be at least 3 characters')
		.max(128, 'Title must be at most 128 characters'),
	content: z
		.string()
		.min(3, 'Content must be at least 3 characters')
		.max(512, 'Content must be at most 512 characters'),
});
