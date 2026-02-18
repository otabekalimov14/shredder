'use client';

import { useState } from 'react';
import { setConfidenceBadgeColor, priorityToEmoji } from '@/lib/ai/extraction';
import type { ExtractedEvent } from '@/lib/types';

interface EventReviewProps {
  events: ExtractedEvent[];
  selectedEvents: Set<number>;
  onToggleSelect: (index: number) => void;
  onSelectAll: () => void;
  onUpdateEvent: (index: number, updated: Partial<ExtractedEvent>) => void;
  onPublish: () => Promise<void>;
  onBack: () => void;
  loading: boolean;
}

export default function EventReview({
  events,
  selectedEvents,
  onToggleSelect,
  onSelectAll,
  onUpdateEvent,
  onPublish,
  onBack,
  loading,
}: EventReviewProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const getMissingFields = (event: ExtractedEvent): string[] => {
    const missing = [];
    if (!event.title) missing.push('Title');
    if (!event.start_datetime && !event.all_day) missing.push('Start Date');
    if (event.confidence === 'low') missing.push('Low Confidence');
    return missing;
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-semibold text-black mb-2">Step 2: Review</h2>
        <p className="text-gray-600">
          {events.length} event{events.length !== 1 ? 's' : ''} extracted. Edit as needed and select which to
          publish.
        </p>
      </div>

      {/* Select All */}
      <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
        <input
          type="checkbox"
          id="select-all"
          checked={selectedEvents.size === events.length && events.length > 0}
          onChange={onSelectAll}
          className="w-4 h-4"
        />
        <label htmlFor="select-all" className="text-sm font-medium text-black cursor-pointer">
          Select All ({selectedEvents.size}/{events.length})
        </label>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-black w-8">#</th>
              <th className="text-left py-3 px-4 font-semibold text-black">Event</th>
              <th className="text-left py-3 px-4 font-semibold text-black">Date/Time</th>
              <th className="text-left py-3 px-4 font-semibold text-black">Course</th>
              <th className="text-left py-3 px-4 font-semibold text-black">Confidence</th>
              <th className="text-left py-3 px-4 font-semibold text-black">Status</th>
              <th className="text-center py-3 px-4 font-semibold text-black w-8"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => {
              const missing = getMissingFields(event);
              const isEditing = editingIndex === index;

              return (
                <tr key={index} className={`border-b border-gray-200 ${selectedEvents.has(index) ? 'bg-blue-50' : ''}`}>
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedEvents.has(index)}
                      onChange={() => onToggleSelect(index)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="py-3 px-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={event.title}
                        onChange={(e) => onUpdateEvent(index, { title: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <div>
                        <p className="font-medium text-black">{event.title}</p>
                        <p className="text-gray-600 text-xs">{event.description?.substring(0, 50)}</p>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {event.all_day ? (
                      <span>All Day</span>
                    ) : event.start_datetime ? (
                      <span>{new Date(event.start_datetime).toLocaleDateString()}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs">{event.course || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${setConfidenceBadgeColor(event.confidence)}`}>
                      {event.confidence}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {missing.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {missing.map((field) => (
                          <span key={field} className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                            {field}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-green-600 text-xs font-medium">✓ Complete</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setEditingIndex(isEditing ? null : index)}
                      className="text-gray-600 hover:text-black text-xs"
                    >
                      {isEditing ? 'Done' : 'Edit'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-8 border-t border-gray-200">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-3 bg-white border border-gray-300 text-black rounded-md font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>
        <button
          onClick={onPublish}
          disabled={loading || selectedEvents.size === 0}
          className="flex-1 px-6 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Publishing...' : `Publish Selected (${selectedEvents.size})`}
        </button>
      </div>
    </div>
  );
}
