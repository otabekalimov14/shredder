/**
 * Parser module for extracting text from various file types
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { ParserResult, InputType } from '@/lib/types';
import { normalizeWhitespace, sanitizeInput } from '@/lib/utils/date';

const TEMP_DIR = path.join(process.cwd(), '.tmp-uploads');

async function ensureTempDir(): Promise<void> {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create temp directory:', error);
  }
}

async function saveFile(buffer: Buffer, filename: string): Promise<string> {
  await ensureTempDir();
  const filepath = path.join(TEMP_DIR, filename);
  await fs.writeFile(filepath, buffer);
  return filepath;
}

async function deleteFile(filepath: string): Promise<void> {
  try {
    await fs.unlink(filepath);
  } catch (error) {
    console.warn(`Failed to delete temp file: ${filepath}`, error);
  }
}

async function extractPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function extractDOCX(buffer: Buffer): Promise<string> {
  try {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error(`DOCX parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function extractImageOCR(buffer: Buffer): Promise<string> {
  try {
    // Lazy load Tesseract to avoid build-time issues
    const Tesseract = require('tesseract.js');
    const filepath = await saveFile(buffer, `ocr-${Date.now()}.png`);

    try {
      const result = await Tesseract.recognize(filepath, 'eng', {
        logger: (m: any) => console.log('Tesseract progress:', m),
      });

      return result.data.text;
    } finally {
      await deleteFile(filepath);
    }
  } catch (error) {
    throw new Error(`OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function parseText(text: string): Promise<ParserResult> {
  try {
    const sanitized = sanitizeInput(text);
    const normalized = normalizeWhitespace(sanitized);

    return {
      success: true,
      text: normalized,
      input_type: 'text',
    };
  } catch (error) {
    return {
      success: false,
      text: '',
      input_type: 'text',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function parsePDF(buffer: Buffer): Promise<ParserResult> {
  try {
    const text = await extractPDF(buffer);
    const sanitized = sanitizeInput(text);
    const normalized = normalizeWhitespace(sanitized);

    return {
      success: true,
      text: normalized,
      input_type: 'pdf',
    };
  } catch (error) {
    return {
      success: false,
      text: '',
      input_type: 'pdf',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function parseDOCX(buffer: Buffer): Promise<ParserResult> {
  try {
    const text = await extractDOCX(buffer);
    const sanitized = sanitizeInput(text);
    const normalized = normalizeWhitespace(sanitized);

    return {
      success: true,
      text: normalized,
      input_type: 'docx',
    };
  } catch (error) {
    return {
      success: false,
      text: '',
      input_type: 'docx',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function parseImage(buffer: Buffer): Promise<ParserResult> {
  try {
    const text = await extractImageOCR(buffer);
    const sanitized = sanitizeInput(text);
    const normalized = normalizeWhitespace(sanitized);

    return {
      success: true,
      text: normalized,
      input_type: 'image',
    };
  } catch (error) {
    return {
      success: false,
      text: '',
      input_type: 'image',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function parseInput(buffer: Buffer, inputType: InputType): Promise<ParserResult> {
  switch (inputType) {
    case 'pdf':
      return parsePDF(buffer);
    case 'docx':
      return parseDOCX(buffer);
    case 'image':
      return parseImage(buffer);
    case 'text':
      return parseText(buffer.toString('utf-8'));
    default:
      return {
        success: false,
        text: '',
        input_type: inputType,
        error: 'Unsupported input type',
      };
  }
}

export async function cleanupTempFiles(): Promise<void> {
  try {
    const files = await fs.readdir(TEMP_DIR);
    for (const file of files) {
      await deleteFile(path.join(TEMP_DIR, file));
    }
  } catch (error) {
    console.warn('Cleanup of temp files failed:', error);
  }
}
