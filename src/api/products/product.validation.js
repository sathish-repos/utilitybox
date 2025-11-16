import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Product name is required'),
    description: z.string().optional(),
    price: z.number().positive('Price must be a positive number'),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    category: z.string().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().min(0).optional(),
    category: z.string().optional(),
  }),
});
