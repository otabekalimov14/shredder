/**
 * Integration test examples for The Shredder
 * These demonstrate expected input/output for key scenarios
 */

/**
 * Test Case 1: Simple syllabus extraction
 */
export const testCase1_SimpleSyllabus = {
  input: {
    text: `CS 201 - Fall 2024 Syllabus

Course Information:
- Professor: Dr. Smith
- Office Hours: Monday 2-4 PM

Important Dates:
- Problem Set 1: Due September 15 at 11:59 PM
- Midterm Exam: October 20 (all day)
- Final Project: December 10 at 5:00 PM`,
    timezone: "America/New_York"
  },
  expectedOutput: {
    success: true,
    events: [
      {
        title: "Problem Set 1",
        start_datetime: "2024-09-15T23:59:00Z",
        end_datetime: null,
        all_day: false,
        description: "Problem Set 1",
        course: "CS 201",
        priority: "medium",
        confidence: "high"
      },
      {
        title: "Midterm Exam",
        start_datetime: "2024-10-20T00:00:00Z",
        end_datetime: "2024-10-20T23:59:59Z",
        all_day: true,
        description: "Midterm Exam",
        course: "CS 201",
        priority: "high",
        confidence: "high"
      },
      {
        title: "Final Project",
        start_datetime: "2024-12-10T17:00:00Z",
        end_datetime: null,
        all_day: false,
        description: "Final Project",
        course: "CS 201",
        priority: "high",
        confidence: "high"
      }
    ]
  }
};

/**
 * Test Case 2: D2L Announcement with multiple deadlines
 */
export const testCase2_D2LAnnouncement = {
  input: {
    text: `ANNOUNCEMENT: Assignment Deadlines

Week 1 Assignment:
- Writing Exercise 1: September 8
- Code Submission: September 9 by 5 PM

Week 2 Assignment:
- Reading Response: September 15 by noon
- Discussion Post: September 16 at 11:59 PM`,
    timezone: "America/Chicago"
  },
  expectedOutput: {
    success: true,
    eventCount: 4,
    eventsWithHighConfidence: 4
  }
};

/**
 * Test Case 3: Confidential/Low-confidence extraction
 */
export const testCase3_AmbiguousText = {
  input: {
    text: `Somewhere in the semester we might have an exam.
    There may be assignments due around mid-October.
    Check back for exact dates.`,
    timezone: "UTC"
  },
  expectedOutput: {
    success: true,
    events: [],
    note: "No high-confidence dates found"
  }
};

/**
 * Test Case 4: Text with course names and room numbers
 */
export const testCase4_DetailedEvent = {
  input: {
    text: `MATH 101 - Calculus I
    Midterm Exam: October 25, 2024
    Location: Science Building Room 301
    Time: 2:00 PM - 3:30 PM
    Duration: 90 minutes`,
    timezone: "America/Los_Angeles"
  },
  expectedOutput: {
    success: true,
    eventCount: 1,
    event: {
      title: "MATH 101 Midterm Exam",
      location: "Science Building Room 301",
      start_datetime: "2024-10-25T14:00:00Z",
      end_datetime: "2024-10-25T15:30:00Z",
      all_day: false,
      priority: "high",
      confidence: "high"
    }
  }
};

/**
 * Test Case 5: All-day event handling
 */
export const testCase5_AllDayEvent = {
  input: {
    text: `Fall Break: November 22-24, 2024
    Thanksgiving: November 28, 2024 (all day)
    Classes Resume: December 2, 2024`,
    timezone: "America/Denver"
  },
  expectedOutput: {
    success: true,
    events: [
      {
        title: "Fall Break",
        all_day: true,
        confidence: "high"
      },
      {
        title: "Thanksgiving",
        all_day: true,
        confidence: "high"
      }
    ]
  }
};

/**
 * API Endpoint Test Examples
 */

/**
 * POST /api/extract
 * Request:
 */
export const extractEndpointRequest = {
  method: "POST",
  url: "http://localhost:3000/api/extract",
  headers: {
    "Content-Type": "application/json"
  },
  body: {
    text: "Biology midterm on October 15 at 2 PM in the science lab",
    timezone: "America/New_York"
  }
};

/**
 * POST /api/extract
 * Expected Response:
 */
export const extractEndpointResponse = {
  success: true,
  events: [
    {
      id: "evt_1",
      title: "Biology midterm",
      start_datetime: "2024-10-15T18:00:00Z",
      end_datetime: null,
      all_day: false,
      description: "Biology midterm",
      location: "science lab",
      course: "Biology",
      priority: "high",
      confidence: "high",
      source_excerpt: "Biology midterm on October 15 at 2 PM in the science lab"
    }
  ]
};

/**
 * POST /api/publish
 * Request:
 */
export const publishEndpointRequest = {
  method: "POST",
  url: "http://localhost:3000/api/publish",
  headers: {
    "Content-Type": "application/json",
    "Cookie": "google_access_token=..."
  },
  body: {
    events: [
      {
        title: "Problem Set 1",
        start_datetime: "2024-09-15T23:59:00Z",
        all_day: false,
        description: "Problem Set 1",
        course: "CS 201",
        priority: "medium",
        confidence: "high",
        source_excerpt: "Due September 15 at 11:59 PM"
      }
    ],
    calendar_id: "primary"
  }
};

/**
 * POST /api/publish
 * Expected Response:
 */
export const publishEndpointResponse = {
  success: true,
  published_count: 1,
  failed_count: 0,
  events: [
    {
      event_id: "abc123def456...",
      title: "Problem Set 1",
      success: true
    }
  ]
};

/**
 * Running Tests Locally
 */
export const testingGuide = `
# Manual Testing Guide

## 1. Test Text Extraction
curl -X POST http://localhost:3000/api/extract \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Problem Set 1 due September 15 at 11:59 PM",
    "timezone": "America/New_York"
  }'

## 2. Test With Complex Syllabus
curl -X POST http://localhost:3000/api/extract \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "CS 201 Fall 2024\\nProblem Set 1: September 15 at 11:59 PM\\nMidterm: October 20 (all day)\\nFinal: December 10",
    "timezone": "America/Chicago"
  }'

## 3. Run Unit Tests
npm test

## 4. Run Tests in Watch Mode
npm test -- --watch

## 5. Test with Browser DevTools
1. Open http://localhost:3000/dashboard
2. Sign in with Google
3. Paste test syllabus
4. Check extracted events in browser console
5. Verify publish request in Network tab

## 6. Verify Google Calendar
1. After publishing, check your Google Calendar
2. Verify events appear with correct dates/times
3. Check event descriptions match source

## Expected Output Examples

### High Confidence Extraction
- "Due September 15 at 11:59 PM" → Sept 15, 23:59 UTC, confidence: high

### Medium Confidence Extraction
- "Something due late September" → confidence: medium (date ambiguous)

### Low Confidence Extraction
- "There may be an exam sometime" → confidence: low, start_datetime: null

### All-Day Event
- "October 20 (all day)" → all_day: true, no specific time

### Event with Location
- "Midterm in Science 301" → location: "Science 301"
`;
