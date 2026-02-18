'use client';

interface PublishSectionProps {
  onStartOver: () => void;
}

export default function PublishSection({ onStartOver }: PublishSectionProps) {
  return (
    <div className="space-y-8">
      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-md p-8 text-center">
        <div className="mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-black mb-2">Events Published!</h2>
        <p className="text-gray-600 mb-6">
          Your selected events have been successfully added to your Google Calendar.
        </p>

        {/* Next Steps */}
        <div className="bg-white rounded-md border border-green-200 p-4 text-left max-w-md mx-auto mb-6">
          <h3 className="font-semibold text-black mb-3">What's next?</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Check your Google Calendar for the new events</li>
            <li>✓ Edit or move events if needed</li>
            <li>✓ Share your calendar or get notifications</li>
          </ul>
        </div>

        {/* Action Button */}
        <button
          onClick={onStartOver}
          className="px-8 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-900 transition-colors"
        >
          Process Another File
        </button>
      </div>
    </div>
  );
}
