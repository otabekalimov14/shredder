# The Shredder

Transform messy academic information into clean, actionable calendar events. The Shredder extracts deadlines, exam dates, and assignments from syllabus documents and announcements using AI, then publishes them directly to your Google Calendar.

## Overview

### What It Does

- **Accepts**: Text pastes, PDF syllabus documents, screenshots, DOCX files
- **Extracts**: AI-powered deadline detection with confidence scoring
- **Validates**: Schema validation and missing field detection
- **Reviews**: Inline editing before publishing
- **Publishes**: One-click batch upload to Google Calendar

### Why It Matters

Students waste time manually transcribing deadlines from multiple document formats. The Shredder automates this tedious process while giving you full control to review and edit before publishing.

## Features

✅ **Text Extraction** - Paste syllabus sections or announcements
✅ **AI Parsing** - OpenAI GPT-4 for intelligent date/time extraction
✅ **Confidence Scoring** - Know which extractions are reliable vs. uncertain
✅ **Inline Editing** - Fix any issues before publishing
✅ **Batch Publishing** - Add multiple events to Google Calendar at once
✅ **Minimal UI** - Clean, distraction-free interface
✅ **Type-Safe** - Full TypeScript codebase with Zod validation
✅ **Secure** - API keys stored server-side, no client exposure

## Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **TypeScript** - Type-safe React components
- **TailwindCSS** - Minimal, responsive styling
- **React Hook Form** - Efficient form handling
- **Zod** - Runtime schema validation

### Backend
- **Next.js API Routes** - Serverless functions
- **OpenAI API** - GPT-4 for event extraction
- **Google Calendar API** - Event publishing
- **Google OAuth 2.0** - Secure authentication

### Parsing
- **pdf-parse** - PDF text extraction (Phase 2)
- **mammoth** - DOCX text extraction (Phase 2)
- **Tesseract.js** - Image OCR (Phase 2)

### Testing & Quality
- **Jest** - Unit testing framework
- **ESLint** - Code quality
- **TypeScript** - Type checking

## Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API key
- Google Cloud project with OAuth 2.0 configured

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
# OPENAI_API_KEY=...
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Run development server
npm run dev

# Open in browser
open http://localhost:3000
```

See [SETUP.md](./SETUP.md) for detailed configuration instructions.

## Usage

### Landing Page

Click **Sign in with Google** to authenticate.

### Dashboard - Step 1: Input

Paste text or upload a file:

```
CS 201 - Fall 2024 Syllabus

Key Dates:
- Problem Set 1: Due September 15 at 11:59 PM
- Problem Set 2: Due September 29 at 11:59 PM
- Midterm Exam: October 20 (all day)
- Final Project: Due December 10 at 5:00 PM
```

### Dashboard - Step 2: Review

Review extracted events in a table:
- See confidence scores (high/medium/low)
- Check for missing required fields
- Edit any incorrect extractions
- Select which events to publish

### Dashboard - Step 3: Publish

Click **Publish Selected** to add all selected events to your Google Calendar.

## Project Structure

```
/app
  /api
    /auth
      /callback/route.ts    # Google OAuth callback
      /url/route.ts         # Get auth URL
    /extract/route.ts       # AI extraction endpoint
    /parse/route.ts         # File parsing endpoint
    /publish/route.ts       # Calendar publishing endpoint
  /dashboard
    /page.tsx               # Dashboard page
  page.tsx                  # Landing page

/components
  /dashboard
    TextInput.tsx           # Input section
    EventReview.tsx         # Review section
    PublishSection.tsx      # Success section

/lib
  /ai
    extraction.ts           # OpenAI integration
  /google
    auth.ts                 # Google OAuth
    calendar.ts             # Calendar API
  /parser
    index.ts                # File parsing
  /schemas
    validation.ts           # Zod schemas
  /types
    index.ts                # TypeScript types
  /utils
    date.ts                 # Date utilities

/__tests__                  # Unit tests
```

## API Endpoints

### POST `/api/extract`

Extract events from text.

```bash
curl -X POST http://localhost:3000/api/extract \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Problem Set 1 due September 15 at 11:59 PM",
    "timezone": "America/New_York"
  }'
```

**Response:**
```json
{
  "success": true,
  "events": [
    {
      "title": "Problem Set 1",
      "start_datetime": "2024-09-15T23:59:00Z",
      "end_datetime": null,
      "all_day": false,
      "description": "Problem Set 1",
      "location": null,
      "course": null,
      "priority": "medium",
      "confidence": "high",
      "source_excerpt": "Problem Set 1 due September 15 at 11:59 PM"
    }
  ]
}
```

### POST `/api/publish`

Publish events to Google Calendar.

```bash
curl -X POST http://localhost:3000/api/publish \
  -H "Content-Type: application/json" \
  -d '{
    "events": [...],
    "calendar_id": "primary"
  }'
```

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- date.test.ts

# Watch mode
npm test -- --watch
```

Test coverage:
- Date/time utilities
- Schema validation
- Timezone handling
- Input sanitization

## Security

- **OpenAI Key**: Stored in environment variables, never exposed to client
- **Google Tokens**: Stored in httpOnly cookies
- **Input Validation**: Zod schemas + sanitization
- **File Uploads**: MIME type validation, 10MB size limit
- **HTTPS**: Enforced in production

## Development

### Code Structure

- All code is **TypeScript** (type-safe)
- React components use **functional hooks**
- Validation with **Zod** schemas
- API routes are **serverless functions**
- Styling with **TailwindCSS**

### Building

```bash
npm run build    # Production build
npm start        # Run production server
```

## Roadmap

**Phase 1** ✅ MVP
- Text paste input
- AI extraction
- Review & publish

**Phase 2** 🚧 File Support
- PDF parsing
- DOCX extraction
- Image OCR
- File upload UI

**Phase 3** 🎯 Smart Features
- Duplicate detection
- Conflict detection
- Workload analysis

## Troubleshooting

### "Extraction failed"
- Ensure text is at least 10 characters
- Check OPENAI_API_KEY is valid
- Verify OpenAI account has credits

### "Not authenticated"
- Complete Google OAuth sign-in
- Check GOOGLE_CLIENT_ID and SECRET
- Clear browser cookies and retry

### Build errors
- Clear cache: `rm -rf node_modules && npm install --legacy-peer-deps`
- Check Node.js: `node --version` (need 18+)

## Documentation

- **Setup**: [SETUP.md](./SETUP.md) - Detailed configuration guide
- **Env**: [.env.example](./.env.example) - Environment variables template

## Support

- **OpenAI API Docs**: https://platform.openai.com/docs
- **Google Calendar API**: https://developers.google.com/calendar
- **Next.js**: https://nextjs.org/docs

## License

MIT

---

**The Shredder** - Turn messy school info into clean calendar events. ✂️📅
