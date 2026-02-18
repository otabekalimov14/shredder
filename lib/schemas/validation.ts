/**
 * Zod schemas for validation throughout The Shredder
 */

import { z } from 'zod';

export const ExtractedEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  start_datetime: z.string().nullable().default(null),
  end_datetime: z.string().nullable().default(null),
  all_day: z.boolean().default(false),
  description: z.string().default(''),
  location: z.string().nullable().default(null),
  course: z.string().nullable().default(null),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  confidence: z.enum(['low', 'medium', 'high']).default('medium'),
  source_excerpt: z.string().min(1, 'Source excerpt is required'),
});

export const ExtractionResultSchema = z.object({
  events: z.array(ExtractedEventSchema),
  error: z.string().optional(),
});

export const AIExtractionPayloadSchema = z.object({
  text: z.string().min(1, 'Text cannot be empty'),
  timezone: z.string().default('UTC'),
});

export const ParserResultSchema = z.object({
  success: z.boolean(),
  text: z.string(),
  input_type: z.enum(['text', 'pdf', 'image', 'docx']),
  error: z.string().optional(),
});

export const GoogleTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_in: z.number(),
  token_type: z.string(),
  scope: z.string(),
});

export const PublishEventSchema = z.object({
  event_ids: z.array(z.string().min(1)),
  calendar_id: z.string().default('primary'),
});

export const PublishResultSchema = z.object({
  success: z.boolean(),
  published_count: z.number(),
  failed_count: z.number(),
  events: z.array(
    z.object({
      event_id: z.string(),
      title: z.string(),
      success: z.boolean(),
      error: z.string().optional(),
    })
  ),
});

// Form schemas
export const TextInputSchema = z.object({
  text: z.string().min(10, 'Please provide at least 10 characters'),
});

export const UploadFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File must be less than 10MB')
    .refine(
      (file) => ['application/pdf', 'image/png', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(
        file.type
      ),
      'File must be PDF, PNG, JPG, or DOCX'
    ),
});

export type ExtractedEvent = z.infer<typeof ExtractedEventSchema>;
export type ExtractionResult = z.infer<typeof ExtractionResultSchema>;
export type AIExtractionPayload = z.infer<typeof AIExtractionPayloadSchema>;
export type PublishEvent = z.infer<typeof PublishEventSchema>;
export type TextInput = z.infer<typeof TextInputSchema>;
