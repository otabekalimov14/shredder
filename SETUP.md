# The Shredder - Setup Guide

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Google Cloud Console project with OAuth 2.0 configured

## Step 1: Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create account
3. Go to API Keys section
4. Create new API key
5. Copy and save securely

## Step 2: Setup Google OAuth 2.0

### Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project (name: "The Shredder")
3. Enable APIs:
   - Google Calendar API
   - Google+ API (for user info)

### Create OAuth 2.0 Credentials

1. Go to "Credentials" in the sidebar
2. Create OAuth 2.0 Client ID (type: Web application)
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback` (development)
   - `https://yourdomain.com/api/auth/callback` (production)
4. Copy Client ID and Client Secret

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your credentials:

```env
OPENAI_API_KEY=sk-...your-key...
GOOGLE_CLIENT_ID=...your-client-id...
GOOGLE_CLIENT_SECRET=...your-client-secret...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
NODE_ENV=development
```

## Step 4: Install and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

## Testing the Application

### Test Flow

1. **Landing Page**: Visit http://localhost:3000
2. **Sign In**: Click "Sign in with Google"
3. **Extract Events**: Paste sample syllabus text
4. **Review**: Check extracted events
5. **Publish**: Add events to calendar

### Sample Test Input

Paste this into the text input to test extraction:

```
COMPUTER SCIENCE 201 - Fall 2024

Course Syllabus

Assignments:
- Problem Set 1: Due September 15 at 11:59 PM
- Problem Set 2: Due September 29 at 11:59 PM
- Midterm Exam: October 20, all day, location: Science Building Room 101
- Final Project: Due December 10 at 5:00 PM

Exams:
- Midterm: October 20
- Final Exam: December 18 from 2:00 PM to 4:00 PM

Office Hours:
- Monday 2:00 PM - 4:00 PM
- Wednesday 3:00 PM - 5:00 PM
```

### Expected Results

The system should extract:
- Problem Set 1 (Sep 15, 23:59)
- Problem Set 2 (Sep 29, 23:59)
- Midterm Exam (Oct 20, all-day)
- Final Project (Dec 10, 17:00)
- Final Exam (Dec 18, 14:00-16:00)

## Architecture

### Project Structure

```
/app
  /api
    /auth
      /callback/route.ts      # Google OAuth callback
      /url/route.ts           # Get auth URL
    /extract/route.ts         # AI extraction endpoint
    /parse/route.ts           # File parsing endpoint
    /publish/route.ts         # Calendar publishing endpoint
  /dashboard
    /page.tsx                 # Dashboard page
  /layout.tsx                 # Root layout
  page.tsx                    # Landing page

/components
  /dashboard
    TextInput.tsx             # Text input section
    EventReview.tsx           # Review/edit section
    PublishSection.tsx        # Success screen

/lib
  /ai
    extraction.ts             # OpenAI integration
  /google
    auth.ts                   # Google OAuth
    calendar.ts               # Calendar API
  /parser
    index.ts                  # File parsing (OCR, PDF, DOCX)
  /schemas
    validation.ts             # Zod schemas
  /types
    index.ts                  # TypeScript types
  /utils
    date.ts                   # Date utilities
```

### Data Flow

1. **User Input** → Landing page → Dashboard
2. **Text Extraction** → Parse text/file → Clean & normalize
3. **AI Processing** → Send to OpenAI → Get structured JSON
4. **Validation** → Zod schema validation → Display results
5. **Review** → User edits events → Selects to publish
6. **Publishing** → Google Calendar API → Add events

## Key Features

- ✅ Text input with paste and upload
- ✅ AI-powered deadline extraction
- ✅ Confidence scoring
- ✅ Inline event editing
- ✅ Batch publishing to Google Calendar
- ✅ Error handling and validation
- ✅ Responsive, minimal UI design

## Phase 2 Features (Coming Soon)

- PDF parsing with pdf-parse
- DOCX extraction with mammoth
- Image OCR with Tesseract.js
- Duplicate detection
- Conflict detection
- Calendar selection UI

## Troubleshooting

### "No authorization code provided"
- Ensure redirect URI matches in Google Console and `.env.local`
- Clear browser cookies and try again

### "Extraction failed"
- Check OPENAI_API_KEY is valid
- Verify text is at least 10 characters
- Check OpenAI account has API credits

### "File size exceeds 10MB"
- Reduce file size before uploading
- Phase 2 will support chunking

## Security Notes

- OpenAI key stored in environment variables only
- Never commit `.env.local` to git
- Google tokens stored in httpOnly cookies
- Input sanitization prevents prompt injection
- Rate limiting recommended for production

## Deployment

For production deployment:

1. Set environment variables in hosting platform
2. Update GOOGLE_REDIRECT_URI to production domain
3. Add production domain to Google OAuth authorized URIs
4. Run `npm run build` to verify build
5. Deploy to Vercel, AWS, or preferred platform

## Support

For issues or questions, check:
- OpenAI docs: https://platform.openai.com/docs
- Google Calendar API: https://developers.google.com/calendar
- Next.js docs: https://nextjs.org/docs
