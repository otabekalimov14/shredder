/**
 * Google OAuth and authentication module
 */

import { google } from 'googleapis';
import type { GoogleTokens } from '@/lib/types';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';

if (!clientId || !clientSecret) {
  console.warn('Google OAuth credentials not configured');
}

export const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

export function getAuthUrl(): string {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
}

export async function exchangeCodeForTokens(code: string): Promise<GoogleTokens> {
  try {
    const { tokens } = await oauth2Client.getToken(code);

    return {
      access_token: tokens.access_token || '',
      refresh_token: tokens.refresh_token || undefined,
      expires_in: tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600,
      token_type: tokens.token_type || 'Bearer',
      scope: tokens.scope || '',
    };
  } catch (error) {
    throw new Error(`Failed to exchange code for tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function setCredentials(tokens: GoogleTokens): void {
  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : undefined,
  });
}

export async function getCalendarList(tokens: GoogleTokens): Promise<Array<{ id: string; summary: string }>> {
  try {
    setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.calendarList.list();

    return (
      response.data.items?.map((item) => ({
        id: item.id || 'primary',
        summary: item.summary || 'Calendar',
      })) || []
    );
  } catch (error) {
    throw new Error(`Failed to fetch calendars: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<GoogleTokens> {
  try {
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();

    return {
      access_token: credentials.access_token || '',
      refresh_token: credentials.refresh_token || refreshToken,
      expires_in: credentials.expiry_date ? Math.floor((credentials.expiry_date - Date.now()) / 1000) : 3600,
      token_type: credentials.token_type || 'Bearer',
      scope: credentials.scope || '',
    };
  } catch (error) {
    throw new Error(`Failed to refresh access token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
