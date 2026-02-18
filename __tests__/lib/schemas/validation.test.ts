/**
 * Tests for schema validation
 */

import { ExtractedEventSchema, AIExtractionPayloadSchema, TextInputSchema } from '@/lib/schemas/validation';

describe('Schema Validation', () => {
  describe('ExtractedEventSchema', () => {
    it('should validate complete event', () => {
      const event = {
        title: 'Midterm Exam',
        start_datetime: '2024-10-20T14:00:00Z',
        end_datetime: '2024-10-20T16:00:00Z',
        all_day: false,
        description: 'Science Building Room 101',
        location: 'Science Building',
        course: 'CS 201',
        priority: 'high' as const,
        confidence: 'high' as const,
        source_excerpt: 'Midterm: October 20',
      };

      const result = ExtractedEventSchema.safeParse(event);
      expect(result.success).toBe(true);
    });

    it('should fail if title is missing', () => {
      const event = {
        title: '',
        start_datetime: '2024-10-20T14:00:00Z',
        end_datetime: '2024-10-20T16:00:00Z',
        all_day: false,
        description: 'Test',
        location: null,
        course: null,
        priority: 'high' as const,
        confidence: 'high' as const,
        source_excerpt: 'Test',
      };

      const result = ExtractedEventSchema.safeParse(event);
      expect(result.success).toBe(false);
    });

    it('should allow null dates', () => {
      const event = {
        title: 'Event',
        start_datetime: null,
        end_datetime: null,
        all_day: true,
        description: 'Test',
        location: null,
        course: null,
        priority: 'low' as const,
        confidence: 'low' as const,
        source_excerpt: 'Test',
      };

      const result = ExtractedEventSchema.safeParse(event);
      expect(result.success).toBe(true);
    });
  });

  describe('AIExtractionPayloadSchema', () => {
    it('should validate extraction payload', () => {
      const payload = {
        text: 'Homework due September 15',
        timezone: 'America/New_York',
      };

      const result = AIExtractionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should fail if text is too short', () => {
      const payload = {
        text: 'short',
        timezone: 'UTC',
      };

      const result = AIExtractionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should use default timezone if not provided', () => {
      const payload = {
        text: 'Homework due September 15',
      };

      const result = AIExtractionPayloadSchema.safeParse(payload);
      if (result.success) {
        expect(result.data.timezone).toBe('UTC');
      }
    });
  });

  describe('TextInputSchema', () => {
    it('should validate text input', () => {
      const input = {
        text: 'Assignment due September 15 at 11:59 PM',
      };

      const result = TextInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should require minimum 10 characters', () => {
      const input = {
        text: 'short',
      };

      const result = TextInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});
