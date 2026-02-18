/**
 * API route for parsing uploaded files
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseInput } from '@/lib/parser';
import type { InputType } from '@/lib/types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES: Record<InputType, string[]> = {
  pdf: ['application/pdf'],
  image: ['image/png', 'image/jpeg'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  text: ['text/plain'],
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const inputType = formData.get('type') as InputType | null;

    if (!file || !inputType) {
      return NextResponse.json(
        { success: false, error: 'File and type are required' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 413 }
      );
    }

    // Validate file type
    if (!(inputType in ALLOWED_TYPES) || !ALLOWED_TYPES[inputType].includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 415 }
      );
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Parse based on type
    const result = await parseInput(buffer, inputType);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      text: result.text,
      input_type: result.input_type,
    });
  } catch (error) {
    console.error('Parse endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
