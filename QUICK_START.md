# Quick Setup: Google OAuth Configuration

## The Error
The app is working but needs your Google OAuth credentials configured.

## Step 1: Get Your Google Client ID and Secret

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable APIs:
   - Go to **APIs & Services** → **Library**
   - Search for and enable **Google Calendar API**
   - Search for and enable **Google+ API**

4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client ID**
   - Choose **Web application**
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback`
   - Click **Create**
   - Copy your **Client ID** and **Client Secret**

## Step 2: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Click your profile → **API keys**
3. Create new secret key
4. Copy the key (you can only see it once)

## Step 3: Create .env.local

In the project root `/Users/otabekalimov/shredder/`, create a file called `.env.local`:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-api-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id-from-google.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Environment
NODE_ENV=development
```

**Replace the values with your actual credentials.**

## Step 4: Start the App

```bash
cd /Users/otabekalimov/shredder
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test It

1. Click "Sign in with Google"
2. You should be redirected to Google login (not an error)
3. After login, you'll be on the dashboard
4. Paste this test text:

```
CS 201 - Fall 2024

Assignment Schedule:
- Problem Set 1: Due September 15 at 11:59 PM
- Midterm Exam: October 20, all day
- Final Project: December 10 at 5:00 PM
```

5. Click "Extract Events"
6. Review the results
7. Click "Publish Selected" to add to calendar

## Troubleshooting

**"Missing required parameter: client_id"**
- Make sure `.env.local` exists in `/Users/otabekalimov/shredder/`
- Check that `GOOGLE_CLIENT_ID` is filled in (not empty)
- Restart `npm run dev` after creating `.env.local`

**"Invalid redirect_uri"**
- Ensure redirect URI in Google Console matches exactly: `http://localhost:3000/api/auth/callback`
- No typos, no trailing slashes

**"Extraction failed"**
- Check your `OPENAI_API_KEY` is valid
- Verify your OpenAI account has API credits
- Text must be at least 10 characters

## File Locations

- Environment template: `/Users/otabekalimov/shredder/.env.example`
- Your config (create): `/Users/otabekalimov/shredder/.env.local`
- Setup docs: `/Users/otabekalimov/shredder/SETUP.md`
- Full README: `/Users/otabekalimov/shredder/README.md`

Once you've created `.env.local` and restarted the dev server, the error should be gone! 🚀
