/**
 * API route for Google auth URL
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/google/auth';

export async function GET(request: NextRequest) {
  try {
    const authUrl = getAuthUrl();
    return NextResponse.json({
      success: true,
      authUrl,
    });
  } catch (error) {
    console.error('Auth URL error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get auth URL',
      },
      { status: 500 }
    );
  }
}
