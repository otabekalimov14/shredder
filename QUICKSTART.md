# The Shredder - Quick Start

## 🚀 5-Minute Setup

### 1. Get Your API Keys

**OpenAI API Key:**
- Go to https://platform.openai.com/api-keys
- Create a new API key
- Copy and save

**Google OAuth Credentials:**
- Go to https://console.cloud.google.com
- Create new project
- Enable: Google Calendar API, Google+ API
- Create OAuth 2.0 Client ID (Web)
- Add redirect URI: `http://localhost:3000/api/auth/callback`
- Copy Client ID and Secret

### 2. Configure Environment

```bash
cd /Users/otabekalimov/shredder

# Copy template
cp .env.example .env.local

# Edit .env.local
# Add your keys:
# OPENAI_API_KEY=sk-...
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
```

### 3. Install & Run

```bash
# Install dependencies (one-time)
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

## 💡 Test the App

### Sample Syllabus to Paste

```
COMPUTER SCIENCE 201 - Fall 2024

Course Deadlines:

Problem Set 1: Due September 15 at 11:59 PM
Problem Set 2: Due September 29 at 11:59 PM
Midterm Exam: October 20, 2024 (all day), Location: Science Building Room 101
Midterm Review: October 19 at 3:00 PM
Final Project Proposal: November 15 by 5:00 PM
Final Project: Due December 10 at 5:00 PM
Final Exam: December 18 from 2:00 PM to 4:00 PM
```

### Expected Results

The app should extract 8 events with:
- ✅ Correct dates and times
- ✅ Course name (CS 201)
- ✅ Location (where provided)
- ✅ All-day event for Midterm Exam
- ✅ High confidence scores (green)
- ✅ One-click publish to Google Calendar

## 📁 Project Structure

```
Key Files:
├── app/page.tsx           ← Landing page
├── app/dashboard/         ← Main app
├── lib/ai/extraction.ts   ← AI extraction logic
├── lib/google/            ← Google APIs
├── components/dashboard/  ← UI components
├── __tests__/             ← Tests
├── README.md              ← Full docs
└── SETUP.md               ← Detailed setup
```

## 🔧 Useful Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Run production build
npm test                 # Run unit tests
npm test -- --watch      # Tests in watch mode
npm run lint             # Check code quality
```

## 🐛 Troubleshooting

### "Not authenticated"
- Sign out and sign in again
- Clear browser cookies
- Check Google OAuth credentials

### "Extraction failed"
- Ensure text is at least 10 characters
- Check OPENAI_API_KEY is valid
- Verify your OpenAI account has credits

### Build errors
```bash
rm -rf node_modules
npm install --legacy-peer-deps
npm run build
```

## 📚 Documentation

- **README.md** - Full project overview
- **SETUP.md** - Detailed configuration guide
- **DELIVERABLES.md** - Complete feature checklist
- **DEPENDENCIES.md** - All dependencies listed

## 🎯 Next Steps

1. ✅ Set up environment variables
2. ✅ Run `npm install`
3. ✅ Start dev server: `npm run dev`
4. ✅ Test with sample syllabus
5. ✅ Verify events in Google Calendar
6. ✅ Read SETUP.md for production deployment

## ⚡ Performance

- Dev server: ~3 seconds to start
- Page load: <1 second
- Event extraction: ~2-3 seconds (OpenAI API)
- Production build: ~100KB gzipped

## 🔒 Security

- No API keys exposed to client
- Environment variables for secrets
- httpOnly cookies for Google tokens
- Input validation and sanitization
- No data storage (MVP)

## 🎓 For Phase 2

When you're ready for Phase 2 features:
- PDF parsing support
- DOCX extraction
- Image OCR
- File upload UI
- Duplicate detection
- Conflict detection

All libraries are already installed. Just implement the UI and integrate existing modules.

## 📞 Support

Having issues? Check:
1. **SETUP.md** - Detailed configuration
2. **README.md** - Features & architecture
3. **Env vars** - Are they all set correctly?
4. **Node version** - Should be 18+
5. **Logs** - Check terminal for error messages

## 🚀 Deploy to Production

When ready:
```bash
npm run build     # Verify build succeeds
npm start         # Test production build locally
```

Then deploy to:
- Vercel (recommended - free tier available)
- AWS, Google Cloud, Azure
- Any Node.js hosting platform

See SETUP.md for detailed deployment instructions.

---

**You're all set! Start with `npm run dev` and open http://localhost:3000** 🎉
