/**
 * Utility functions for date/time handling and validation
 */

export function parseISO8601(dateString: string | null): Date | null {
  if (!dateString) return null;
  try {
    return new Date(dateString);
  } catch {
    return null;
  }
}

export function toISO8601(date: Date): string {
  return date.toISOString();
}

export function addTime(dateString: string, hour: number, minute: number = 0): string {
  const date = new Date(dateString);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function toDateOnly(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getEndOfDay(dateString: string, timezone: string = 'UTC'): string {
  const date = new Date(dateString);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
}

export function validateISO8601(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    return date.toISOString() === dateString || !isNaN(date.getTime());
  } catch {
    return false;
  }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    .normalize('NFKC');
}

export function truncateText(text: string, maxLength: number = 500): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function extractSourceExcerpt(text: string, startIndex: number, contextLength: number = 100): string {
  const start = Math.max(0, startIndex - contextLength);
  const end = Math.min(text.length, startIndex + contextLength);
  let excerpt = text.substring(start, end).trim();

  // Remove line breaks for cleaner display
  excerpt = excerpt.replace(/\n+/g, ' ');

  return truncateText(excerpt, 150);
}

export function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function getCurrentTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

export function convertToUserTimezone(utcDate: Date, timezone: string = 'UTC'): Date {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(utcDate);
    const values: Record<string, string> = {};

    parts.forEach(({ type, value }) => {
      values[type] = value;
    });

    return new Date(
      `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`
    );
  } catch {
    return utcDate;
  }
}
