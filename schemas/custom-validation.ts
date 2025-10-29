import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export const optionalEmailSchema = z
  .union([z.email(), z.literal(""), z.undefined()])
  .optional();

export const optionalUrlSchema = z.union([
  z.url({ message: "Invalid URL." }),
  z.literal(""),
  z.undefined(),
]);

// Custom validation function
export const imageSchema = z
  .union([
    z
      .instanceof(File)
      .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
        message: "Only .jpg, .jpeg, and .png files are allowed",
      })
      .refine((file) => file.size <= MAX_IMAGE_SIZE, {
          message: "File size must not exceed 5 MB",
        }),
      z.string(),
    ])
    .optional();

// Resuable optional number schema
export const optionalNumberSchema = z
  .string()
  .optional()
  .refine((value) => !value || !isNaN(parseFloat(value)), {
    message: "Value must be a valid number.",
  })
  .transform((val) => parseFloat(val!)); // Convert string to number

export const NumberSchema = z
  .string()
  .refine((value) => !isNaN(parseFloat(value)), {
    message: "Value must be a valid number.",
  })
  .transform((val) => parseFloat(val)); // Convert string to number

// Reusable optional phone number schema
export const optionalPhoneSchema = z
  .string()
  .optional()
  .refine((value) => !value || /^\d{11}$/.test(value), {
    message: "Invalid phone number.",
  });

export const PhoneSchema = z
  .string()
  .refine((value) => /^\d{11}$/.test(value), {
    message: "Invalid phone number.",
  });

// Reusable optional date schema
export const optionalDateSchema = z
  .string()
  .optional()
  .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: "Invalid date.",
  });

export const DateSchema = z
  .string()
  .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: "Invalid date.",
  });

// Reusable optional time schema
export const optionalTimeSchema = z
  .string()
  .optional()
  .refine((value) => !value || /^\d{2}:\d{2}(:\d{2})?$/.test(value), {
    message: "Invalid time.",
  });

export const TimeSchema = z
  .string()
  .refine((value) => !value || /^\d{2}:\d{2}(:\d{2})?Z?$/.test(value), {
    message: "Invalid time.",
  });

// Reusable optional amount schema
export const optionalAmountSchema = z
  .string()
  .optional()
  .refine((value) => !value || !isNaN(parseFloat(value)), {
    message: "Amount must be a valid number.",
  })
  .transform((val) => (val ? parseFloat(val) : undefined))
  .refine((val) => val === undefined || val >= 0.01, {
    message: "Amount must be greater than 0.",
  });

export const AmountSchema = z
  .string()
  .refine((value) => !isNaN(parseFloat(value)), {
    message: "Amount must be a valid number.",
  })
  .transform((val) => parseFloat(val)) // Convert string to number
  .refine((val) => val === undefined || val >= 0.01, {
    message: "Amount must be greater than 0.",
  });
