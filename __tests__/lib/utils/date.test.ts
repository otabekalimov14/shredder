/**
 * Tests for date utility functions
 */

import {
  parseISO8601,
  toISO8601,
  validateISO8601,
  sanitizeInput,
  truncateText,
  normalizeWhitespace,
  getCurrentTimezone,
} from '@/lib/utils/date';

describe('Date Utilities', () => {
  describe('parseISO8601', () => {
    it('should parse valid ISO date string', () => {
      const date = parseISO8601('2024-09-15T23:59:00Z');
      expect(date?.getFullYear()).toBe(2024);
      expect(date?.getMonth()).toBe(8); // September (0-indexed)
      expect(date?.getDate()).toBe(15);
    });

    it('should return null for null input', () => {
      const date = parseISO8601(null);
      expect(date).toBeNull();
    });

    it('should return null for invalid date string', () => {
      const date = parseISO8601('not-a-date');
      expect(date).toBeNull();
    });
  });

  describe('toISO8601', () => {
    it('should convert date to ISO string', () => {
      const date = new Date('2024-09-15T23:59:00Z');
      const iso = toISO8601(date);
      expect(iso).toContain('2024-09-15');
    });
  });

  describe('validateISO8601', () => {
    it('should validate correct ISO date', () => {
      const valid = validateISO8601('2024-09-15T23:59:00Z');
      expect(valid).toBe(true);
    });

    it('should invalidate incorrect format', () => {
      const valid = validateISO8601('09/15/2024');
      expect(valid).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove control characters', () => {
      const input = 'Hello\x00World\x08Test';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('HelloWorldTest');
    });

    it('should trim whitespace', () => {
      const input = '  Hello World  ';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('Hello World');
    });
  });

  describe('truncateText', () => {
    it('should truncate text beyond maxLength', () => {
      const text = 'a'.repeat(100);
      const truncated = truncateText(text, 50);
      expect(truncated).toHaveLength(53); // 50 + "..."
      expect(truncated.endsWith('...')).toBe(true);
    });

    it('should not truncate short text', () => {
      const text = 'short text';
      const truncated = truncateText(text, 50);
      expect(truncated).toBe('short text');
    });
  });

  describe('normalizeWhitespace', () => {
    it('should normalize line breaks and spaces', () => {
      const text = 'Hello\r\n  World\n\nTest';
      const normalized = normalizeWhitespace(text);
      expect(normalized).toBe('Hello World\n\nTest');
    });

    it('should remove leading/trailing whitespace', () => {
      const text = '  \n  Hello World  \n  ';
      const normalized = normalizeWhitespace(text);
      expect(normalized).toBe('Hello World');
    });
  });

  describe('getCurrentTimezone', () => {
    it('should return a valid timezone string', () => {
      const tz = getCurrentTimezone();
      expect(typeof tz).toBe('string');
      expect(tz.length).toBeGreaterThan(0);
    });
  });
});
