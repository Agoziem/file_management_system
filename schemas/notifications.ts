import { z } from "zod";
import { imageSchema, optionalUrlSchema } from "./custom-validation";

// UUID validation schema
const uuidSchema = z.string().uuid("Invalid UUID format");

// Notification Base Schema
const notificationBaseSchema = z.object({
  sender_id: uuidSchema.nullable().optional(),
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  message: z.string().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
  link: optionalUrlSchema,
  image: imageSchema
});

// Notification Create Schema
export const notificationCreateSchema = notificationBaseSchema.extend({
  user_ids: z.array(uuidSchema).min(1, "At least one user ID is required"),
});

// Type inference
export type NotificationCreateFormData = z.infer<typeof notificationCreateSchema>;
export type NotificationBaseFormData = z.infer<typeof notificationBaseSchema>;
