'use client';

import { CheckCircle, ArrowRight, Calendar } from 'lucide-react';

interface PublishSectionProps {
  onStartOver: () => void;
}

export default function PublishSection({ onStartOver }: PublishSectionProps) {
  return (
    <div className="space-y-8">
      {/* Success Message */}
      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-12 text-center backdrop-blur">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>
        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">Events Published!</h2>
        <p className="text-gray-300 mb-8 text-lg">
          Your selected events have been successfully added to your Google Calendar.
        </p>

        {/* Next Steps */}
        <div className="bg-white/10 backdrop-blur rounded-xl border border-white/20 p-6 text-left max-w-md mx-auto mb-8">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-400" />
            What's next?
          </h3>
          <ul className="text-sm text-gray-300 space-y-3">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              Check your Google Calendar for the new events
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              Edit or move events if needed
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              Share your calendar or get notifications
            </li>
          </ul>
        </div>

        {/* Action Button */}
        <button
          onClick={onStartOver}
          className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
        >
          Process Another File
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
