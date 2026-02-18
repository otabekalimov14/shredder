/**
 * Core type definitions for The Shredder
 */

export type EventPriority = 'low' | 'medium' | 'high';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type InputType = 'text' | 'pdf' | 'image' | 'docx';

export interface ExtractedEvent {
  id?: string;
  title: string;
  start_datetime: string | null;
  end_datetime: string | null;
  all_day: boolean;
  description: string;
  location: string | null;
  course: string | null;
  priority: EventPriority;
  confidence: ConfidenceLevel;
  source_excerpt: string;
}

export interface ExtractionResult {
  success: boolean;
  events: ExtractedEvent[];
  error?: string;
  raw_text?: string;
}

export interface ParserResult {
  success: boolean;
  text: string;
  input_type: InputType;
  error?: string;
}

export interface GoogleCalendarEvent {
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  extendedProperties?: {
    private?: {
      createdBy: string;
      course?: string;
    };
  };
}

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface PublishResult {
  success: boolean;
  published_count: number;
  failed_count: number;
  events: Array<{
    event_id: string;
    title: string;
    success: boolean;
    error?: string;
  }>;
}

export interface AIExtractionPayload {
  text: string;
  timezone: string;
}

export interface FileInput {
  file: File;
  type: InputType;
}
