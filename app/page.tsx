'use client';

import { useState } from 'react';
import { Calendar, Zap, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Shredder</span>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-sm text-purple-200">AI-Powered Academic Planning</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent leading-tight">
              Never Miss<br />a Deadline Again
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Paste your syllabus. Watch The Shredder extract every deadline, exam, and assignment. One click pushes it all to Google Calendar.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  Sign in with Google
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Features Grid */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: 'Lightning Fast',
                  desc: 'AI extracts all deadlines in seconds',
                },
                {
                  icon: CheckCircle,
                  title: 'Easy Review',
                  desc: 'Edit anything before publishing',
                },
                {
                  icon: Calendar,
                  title: 'Auto-Sync',
                  desc: 'One click to Google Calendar',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:border-purple-400/50 hover:bg-white/10 transition-all duration-300 group"
                >
                  <feature.icon className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="mt-16 text-center">
              <p className="text-gray-400 mb-4">Join students saving hours on calendar management</p>
              <div className="flex items-center justify-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-slate-900"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">50+ students using</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
