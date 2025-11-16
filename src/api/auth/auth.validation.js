import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(50, 'Password must be no more than 50 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name is required (min 3 chars)').max(50),
    email: z.string().email('Invalid email address'),
    password: passwordSchema,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const refreshTokenSchema = z
  .object({
    body: z
      .object({
        refreshToken: z.string().min(1, 'Refresh token is required'),
      })
      .or(
        // Allow empty body if refresh token is in cookie
        z.object({})
      ),
    cookies: z
      .object({
        refreshToken: z.string().min(1, 'Refresh token is required'),
      })
      .or(
        // Allow empty cookie if token is in body
        z.object({})
      ),
  })
  .refine((data) => data.body.refreshToken || data.cookies.refreshToken, {
    message: 'Refresh token must be provided in body or cookie',
    path: ['refreshToken'],
  });
