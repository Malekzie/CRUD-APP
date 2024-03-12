import { z } from 'zod'

export const registerSchema = z.object({
     username: z.string().min(3).max(20),
     password: z.string().min(8).max(255),
     confirmPassword: z.string().min(6).max(255),
}).refine((data) => data.password === data.confirmPassword, {
     message: 'Passwords do not match',
     path: ['confirmPassword', 'password'],
});

export const loginSchema = z.object({
     username: z.string().min(3).max(20),
     password: z.string(),
})