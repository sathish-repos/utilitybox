import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').optional(),
    name: z.string().min(3, 'Name must be at least 3 characters').optional(),
  }),
});