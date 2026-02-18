/**
 * API route for extracting events from text
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIExtractionPayloadSchema } from '@/lib/schemas/validation';
import { extractEventsFromText } from '@/lib/ai/extraction';
import { getCurrentTimezone } from '@/lib/utils/date';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate payload
    const validation = AIExtractionPayloadSchema.safeParse({
      text: body.text,
      timezone: body.timezone || getCurrentTimezone(),
    });

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload', details: validation.error.issues },
        { status: 400 }
      );
    }

    // Extract events
    const result = await extractEventsFromText(validation.data);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Extraction failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      events: result.events,
    });
  } catch (error) {
    console.error('Extraction endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
