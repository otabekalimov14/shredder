'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInputSchema } from '@/lib/schemas/validation';
import { getCurrentTimezone } from '@/lib/utils/date';
import { Zap, Upload, Sparkles } from 'lucide-react';
import type { TextInput as TextInputType } from '@/lib/schemas/validation';

interface TextInputProps {
  onExtract: (text: string, timezone: string) => Promise<void>;
  loading: boolean;
}

export default function TextInput({ onExtract, loading }: TextInputProps) {
  const [textMode, setTextMode] = useState<'paste' | 'upload'>('paste');
  const [uploadError, setUploadError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TextInputType>({
    resolver: zodResolver(TextInputSchema),
  });

  const onSubmit = async (data: TextInputType) => {
    await onExtract(data.text, getCurrentTimezone());
    reset();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];

    if (!file) return;

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError('File must be less than 10MB');
      return;
    }

    // Only parse text and image files on client; PDF/DOCX require server-side parsing
    if (file.type === 'text/plain' && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        await onExtract(text, getCurrentTimezone());
      };
      reader.readAsText(file);
    } else if (file.type === 'application/pdf' || file.type.includes('wordprocessingml')) {
      // For binary formats, we'd need OCR/parsing on server
      setUploadError('PDF and DOCX parsing coming in Phase 2. Use paste mode for now.');
    } else {
      setUploadError('Unsupported file type. Use TXT or images.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Paste Your Content</h2>
          <p className="text-gray-400 mt-1">Paste syllabus text or upload your file</p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 border-b border-purple-500/20">
        <button
          onClick={() => setTextMode('paste')}
          className={`px-4 py-3 font-medium border-b-2 transition-all ${
            textMode === 'paste'
              ? 'border-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text border-purple-400'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Paste Text
        </button>
        <button
          onClick={() => setTextMode('upload')}
          className={`px-4 py-3 font-medium border-b-2 transition-all ${
            textMode === 'upload'
              ? 'border-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text border-purple-400'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Upload File (Phase 2)
        </button>
      </div>

      {/* Paste Mode */}
      {textMode === 'paste' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-300 mb-3">
              Paste Your Syllabus or Assignment Info
            </label>
            <textarea
              id="text"
              {...register('text')}
              placeholder="Paste syllabus, assignment descriptions, or announcements here..."
              className="w-full h-64 p-4 border border-purple-500/20 bg-white/5 backdrop-blur rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-white placeholder-gray-500 transition-all"
            />
            {errors.text && <p className="text-red-400 text-sm mt-1">{errors.text.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Extracting Events...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Extract Events
              </>
            )}
          </button>
        </form>
      )}

      {/* Upload Mode */}
      {textMode === 'upload' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 text-center bg-white/5 hover:bg-white/10 transition-all">
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={loading}
              accept=".txt,.pdf,.docx,.png,.jpg,.jpeg"
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer block">
              <Upload className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <p className="text-gray-200 mb-2 font-medium">Drag and drop or click to upload</p>
              <p className="text-sm text-gray-400">PDF, DOCX, PNG, JPG, or TXT (max 10MB)</p>
            </label>
          </div>

          {uploadError && <p className="text-red-400 text-sm">{uploadError}</p>}

          <p className="text-sm text-gray-400">
            Note: PDF and DOCX parsing coming in Phase 2. For now, use paste mode or convert to TXT/image first.
          </p>
        </div>
      )}
    </div>
  );
}
