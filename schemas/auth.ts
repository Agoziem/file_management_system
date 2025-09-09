import { z } from "zod";

// Role enum (adapt to your actual roles)
export const RoleEnum = z.enum([
  "super_admin",
  "admin",
  "business_user",
  "standard_user",
]);

// Activity enum
export const ActivityTypeEnum = z.enum([
  "create",
  "update",
  "delete",
]);

// ---------- User ----------
export const RegisterSchema = z.object({
  first_name: z.string().max(25),
  last_name: z.string().max(25),
  email: z.email().max(40),
  password: z.string().min(6),
})

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().max(40),
  password: z.string().min(6),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const EmailsSchema = z.object({
  addresses: z.array(z.email()),
});

export type EmailsSchemaType = z.infer<typeof EmailsSchema>;

export const SingleEmailSchema = z.object({
  email: z.email(),
});

export type SingleEmailSchemaType = z.infer<typeof SingleEmailSchema>;

export const TokenRequestSchema = z.object({
  email: z.string().email(),
});

export type TokenRequestSchemaType = z.infer<typeof TokenRequestSchema>;

export const PasswordResetConfirmSchema = z.object({
  new_password: z.string(),
  confirm_new_password: z.string(),
});


export const verifyTokenSchema = z.object({
  token: z.string().min(6, "Enter a valid Token"),
});

export type verifyTokenSchemaType = z.infer<typeof verifyTokenSchema>;

export type PasswordResetConfirmSchemaType = z.infer<typeof PasswordResetConfirmSchema>;

export const PasswordResetSchema = z.object({
  new_password: z.string(),
  confirm_new_password: z.string(),
  old_password: z.string(),
});

export type PasswordResetSchemaType = z.infer<typeof PasswordResetSchema>;

export const ChangeRoleSchema = z.object({
  user_id: z.uuid(),
  new_role: RoleEnum,
});

export type ChangeRoleSchemaType = z.infer<typeof ChangeRoleSchema>;

export const UpdateFcmTokenSchema = z.object({
  fcmtoken: z.string(),
});


// ---------- Two-Factor Confirmation ----------
export const TwoFactorConfirmationCreateSchema = z.object({
  email: z.email(),
});
export type TwoFactorConfirmationCreateSchemaType = z.infer<typeof TwoFactorConfirmationCreateSchema>;

export const verifyCodeSchema = z.object({
  code: z.string().min(6, "Enter a valid code"),
});

export type verifyCodeSchemaType = z.infer<typeof verifyCodeSchema>;


// ---------- Main Auth Notification ----------
export const MainAuthNotificationSchema = z.object({
  email: z.email(),
  token: z.string(),
  last_name: z.string(),
  first_name: z.string().nullable().optional(),
});

export type MainAuthNotificationSchemaType = z.infer<typeof MainAuthNotificationSchema>;