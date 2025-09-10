import { z } from 'zod';

// File Type Enum (matching backend)
export const FileTypeEnum = z.enum([
  'image',
  'document', 
  'video',
  'audio',
  'other'
]);

// Base File Schema
export const FileBaseSchema = z.object({
  file_name: z.string().min(1, "File name is required"),
  file_type: FileTypeEnum,
});

// File Create Schema
export const FileCreateSchema = FileBaseSchema.extend({
  file_size: z.number().int().positive("File size must be positive"),
  file_url: z.string().url("Invalid file URL"),
});

// File Update Schema
export const FileUpdateSchema = z.object({
  file_name: z.string().min(1, "File name is required").optional(),
});

// Storage Base Schema
export const StorageBaseSchema = z.object({
  total_space: z.number().int().positive("Total space must be positive"),
  used_space: z.number().int().min(0, "Used space cannot be negative").default(0),
});

// Storage Create Schema
export const StorageCreateSchema = StorageBaseSchema.extend({
  user_id: z.string().uuid("Invalid user ID"),
});

// Storage Update Schema
export const StorageUpdateSchema = z.object({
  total_space: z.number().int().positive("Total space must be positive").optional(),
  used_space: z.number().int().min(0, "Used space cannot be negative").optional(),
});

// Export inferred types for the schemas
export type FileBaseType = z.infer<typeof FileBaseSchema>;
export type FileCreateType = z.infer<typeof FileCreateSchema>;
export type FileUpdateType = z.infer<typeof FileUpdateSchema>;
export type StorageBaseType = z.infer<typeof StorageBaseSchema>;
export type StorageCreateType = z.infer<typeof StorageCreateSchema>;
export type StorageUpdateType = z.infer<typeof StorageUpdateSchema>;
export type FileType = z.infer<typeof FileTypeEnum>;