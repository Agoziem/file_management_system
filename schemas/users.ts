import { z } from 'zod';
import { imageSchema } from './custom-validation';

// ---------- User ----------
export const UserCreateSchema = z.object({
  first_name: z.string().max(25),
  last_name: z.string().max(25),
  email: z.email().max(40),
  password: z.string().min(6),
});

export type UserCreateType = z.infer<typeof UserCreateSchema>;

export const UserUpdateSchema = z.object({
  first_name: z.string(),
  last_name: z.string().nullable().optional(),
  email: z.email().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  avatar: imageSchema,
  bio: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  profile_completed: z.boolean().nullable().optional(),
});

export type UserUpdateType = z.infer<typeof UserUpdateSchema>;