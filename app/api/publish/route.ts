/**
 * API route for publishing events to Google Calendar
 */

import { NextRequest, NextResponse } from 'next/server';
import { PublishEventSchema } from '@/lib/schemas/validation';
import { publishEventsToCalendar } from '@/lib/google/calendar';
import type { GoogleTokens, ExtractedEvent } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Get tokens from cookies
    const accessToken = request.cookies.get('google_access_token')?.value;
    const refreshToken = request.cookies.get('google_refresh_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate payload
    const validation = PublishEventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload', details: validation.error.issues },
        { status: 400 }
      );
    }

    // For now, we'll mock the events. In a real app, fetch from database
    const events: ExtractedEvent[] = body.events || [];

    const tokens: GoogleTokens = {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 3600,
      token_type: 'Bearer',
      scope: 'calendar',
    };

    // Publish to calendar
    const result = await publishEventsToCalendar(tokens, events, validation.data.calendar_id);

    return NextResponse.json({
      success: result.success,
      published_count: result.published_count,
      failed_count: result.failed_count,
      events: result.events,
    });
  } catch (error) {
    console.error('Publish endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
