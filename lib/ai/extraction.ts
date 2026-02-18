/**
 * AI extraction module using OpenAI
 */

import { OpenAI } from 'openai';
import { ExtractionResultSchema } from '@/lib/schemas/validation';
import { sanitizeInput, truncateText } from '@/lib/utils/date';
import type { ExtractionResult, ExtractedEvent } from '@/lib/types';

// Lazy initialize OpenAI client to avoid build-time errors
let client: OpenAI | null = null;

function getOpenAIClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return client;
}

const SYSTEM_PROMPT = `You are an expert academic information extraction assistant. Your task is to extract structured event data from academic documents and announcements.

Rules:
1. Extract ALL deadlines, due dates, assignment dates, exam dates, and events mentioned
2. For each event, provide a title, description, course (if mentioned), and dates/times
3. Never invent dates. If uncertain about a date, set start_datetime to null
4. If only a due date is provided without a specific time, use 23:59 on that date
5. If only a date is provided without time, set all_day to true
6. For dates in the future, ensure they are properly formatted
7. Extract multiple events if multiple deadlines are mentioned
8. Set confidence level: high (explicit date/time), medium (inferred but reasonable), low (uncertain or ambiguous)
9. Always include a source_excerpt showing where the date came from
10. Keep descriptions concise but informative

Output ONLY valid JSON matching this schema:
{
  "events": [
    {
      "title": "Event title",
      "start_datetime": "ISO 8601 string or null",
      "end_datetime": "ISO 8601 string or null",
      "all_day": boolean,
      "description": "Brief description",
      "location": "Location or null",
      "course": "Course name or null",
      "priority": "low|medium|high",
      "confidence": "low|medium|high",
      "source_excerpt": "Direct quote showing where this came from"
    }
  ]
}`;

interface ExtractionPayload {
  text: string;
  timezone: string;
}

export async function extractEventsFromText(
  payload: ExtractionPayload
): Promise<ExtractionResult> {
  try {
    // Sanitize input to prevent prompt injection
    const sanitizedText = sanitizeInput(payload.text);
    const truncatedText = truncateText(sanitizedText, 8000);

    const userPrompt = `Extract all deadlines, due dates, and events from this academic content. Use the user's timezone (${payload.timezone}) for any date/time conversions. Here is the content:

${truncatedText}`;

    const response = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return {
        success: false,
        events: [],
        error: 'No response from OpenAI',
      };
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      return {
        success: false,
        events: [],
        error: 'Failed to parse OpenAI response as JSON',
      };
    }

    // Validate against schema
    try {
      const validated = ExtractionResultSchema.parse(parsed);
      return {
        success: true,
        events: validated.events,
        raw_text: sanitizedText,
      };
    } catch (validationError) {
      return {
        success: false,
        events: [],
        error: `Validation failed: ${validationError instanceof Error ? validationError.message : 'Unknown error'}`,
        raw_text: sanitizedText,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('AI extraction error:', error);

    return {
      success: false,
      events: [],
      error: `AI extraction failed: ${errorMessage}`,
    };
  }
}

export function setConfidenceBadgeColor(confidence: string): string {
  switch (confidence) {
    case 'high':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function priorityToEmoji(priority: string): string {
  switch (priority) {
    case 'high':
      return '🔴';
    case 'medium':
      return '🟡';
    case 'low':
      return '🟢';
    default:
      return '⚪';
  }
}
