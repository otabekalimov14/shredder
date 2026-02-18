'use client';

import { useState } from 'react';

export default function LandingPage() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/url');
      const data = await response.json();

      if (data.success && data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Failed to get auth URL:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-black mb-4">The Shredder</h1>
          <p className="text-xl text-gray-600 mb-8">
            Turn messy school info into clean calendar events.
          </p>
        </div>

        {/* Hero Text */}
        <div className="mb-12">
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            Paste syllabus sections, screenshots, or upload documents. The Shredder extracts all your deadlines,
            exams, and assignments automatically.
          </p>
          <p className="text-md text-gray-600">
            Review, edit, and publish everything to your Google Calendar in seconds.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="px-8 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Redirecting...' : 'Sign in with Google'}
        </button>

        {/* Features */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wide">Why The Shredder?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Fast Extraction</h3>
              <p className="text-sm text-gray-600">
                AI-powered parsing extracts dates, times, and course info instantly.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Review & Edit</h3>
              <p className="text-sm text-gray-600">
                Check confidence levels and manually adjust anything before publishing.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">One Click Publish</h3>
              <p className="text-sm text-gray-600">
                Push selected events to your Google Calendar automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
