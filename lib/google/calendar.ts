/**
 * Google Calendar API integration
 */

import { google } from 'googleapis';
import { oauth2Client } from '@/lib/google/auth';
import type { GoogleTokens, GoogleCalendarEvent, ExtractedEvent, PublishResult } from '@/lib/types';

export async function insertCalendarEvent(
  tokens: GoogleTokens,
  event: GoogleCalendarEvent,
  calendarId: string = 'primary'
): Promise<string> {
  try {
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    return response.data.id || '';
  } catch (error) {
    throw new Error(`Failed to insert calendar event: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function convertExtractedEventToCalendarEvent(event: ExtractedEvent): GoogleCalendarEvent {
  const calendarEvent: GoogleCalendarEvent = {
    summary: event.title,
    description: event.description || '',
    location: event.location || undefined,
    start: { dateTime: '2024-01-01T00:00:00Z', timeZone: 'UTC' },
    end: { dateTime: '2024-01-01T01:00:00Z', timeZone: 'UTC' },
    extendedProperties: {
      private: {
        createdBy: 'the-shredder',
        course: event.course || undefined,
      },
    },
  };

  if (event.all_day) {
    if (event.start_datetime) {
      const date = new Date(event.start_datetime);
      const dateString = date.toISOString().split('T')[0];
      calendarEvent.start = { date: dateString };
      calendarEvent.end = { date: dateString };
    }
  } else {
    if (event.start_datetime) {
      calendarEvent.start = {
        dateTime: event.start_datetime,
        timeZone: 'UTC',
      };
    }
    if (event.end_datetime) {
      calendarEvent.end = {
        dateTime: event.end_datetime,
        timeZone: 'UTC',
      };
    } else if (event.start_datetime) {
      // Default to 1 hour duration if no end time
      const endTime = new Date(new Date(event.start_datetime).getTime() + 60 * 60 * 1000);
      calendarEvent.end = {
        dateTime: endTime.toISOString(),
        timeZone: 'UTC',
      };
    }
  }

  return calendarEvent;
}

export async function publishEventsToCalendar(
  tokens: GoogleTokens,
  events: ExtractedEvent[],
  calendarId: string = 'primary'
): Promise<PublishResult> {
  const result: PublishResult = {
    success: true,
    published_count: 0,
    failed_count: 0,
    events: [],
  };

  for (const event of events) {
    try {
      const calendarEvent = convertExtractedEventToCalendarEvent(event);
      const eventId = await insertCalendarEvent(tokens, calendarEvent, calendarId);

      result.published_count++;
      result.events.push({
        event_id: eventId,
        title: event.title,
        success: true,
      });
    } catch (error) {
      result.failed_count++;
      result.events.push({
        event_id: '',
        title: event.title,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return result;
}

export async function getCalendarEventById(
  tokens: GoogleTokens,
  eventId: string,
  calendarId: string = 'primary'
): Promise<any> {
  try {
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.events.get({
      calendarId,
      eventId,
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to get calendar event: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
