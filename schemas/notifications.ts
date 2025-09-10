import { z } from 'zod';

// -----------------------------
// 🔹 Base Notification Schemas
// -----------------------------

export const NotificationBaseSchema = z.object({
  sender_id: z.string().uuid("Invalid sender ID").nullable().optional(),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  link: z.string().url("Invalid link URL").nullable().optional(),
  image: z.string().url("Invalid image URL").nullable().optional(),
});

// -----------------------------
// 🔹 Input Schemas (Create & Update)
// -----------------------------

export const NotificationCreateSchema = NotificationBaseSchema.extend({
  user_ids: z.array(z.string().uuid("Invalid user ID")).default([]),
});

export const NotificationUpdateSchema = z.object({
  id: z.string().uuid("Invalid notification ID"),
  sender_id: z.string().uuid("Invalid sender ID").nullable().optional(),
  title: z.string().min(1, "Title is required").optional(),
  message: z.string().min(1, "Message is required").optional(),
  link: z.string().url("Invalid link URL").nullable().optional(),
  image: z.string().url("Invalid image URL").nullable().optional(),
  user_ids: z.array(z.string().uuid("Invalid user ID")).default([]),
});

export const NotificationReadUpdateSchema = z.object({
  notification_id: z.string().uuid("Invalid notification ID"),
  user_id: z.string().uuid("Invalid user ID"),
  is_read: z.boolean(),
});

export const RemoveUpdateSchema = z.object({
  notification_id: z.string().uuid("Invalid notification ID"),
  user_id: z.string().uuid("Invalid user ID"),
});

// Export inferred types for the schemas
export type NotificationBaseType = z.infer<typeof NotificationBaseSchema>;
export type NotificationCreateType = z.infer<typeof NotificationCreateSchema>;
export type NotificationUpdateType = z.infer<typeof NotificationUpdateSchema>;
export type NotificationReadUpdateType = z.infer<typeof NotificationReadUpdateSchema>;
export type RemoveUpdateType = z.infer<typeof RemoveUpdateSchema>;