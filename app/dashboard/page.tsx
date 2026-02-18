'use client';

import { useState } from 'react';
import TextInput from '@/components/dashboard/TextInput';
import EventReview from '@/components/dashboard/EventReview';
import PublishSection from '@/components/dashboard/PublishSection';
import type { ExtractedEvent } from '@/lib/types';

type DashboardStep = 'input' | 'review' | 'publish';

export default function Dashboard() {
  const [step, setStep] = useState<DashboardStep>('input');
  const [events, setEvents] = useState<ExtractedEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  const handleExtract = async (text: string, timezone: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, timezone }),
      });

      const data = await response.json();

      if (data.success) {
        setEvents(data.events);
        // Pre-select all events
        setSelectedEvents(new Set(data.events.map((_: ExtractedEvent, i: number) => i)));
        setStep('review');
      } else {
        alert(`Extraction failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Extraction error:', error);
      alert('Failed to extract events');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = (index: number, updated: Partial<ExtractedEvent>) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], ...updated };
    setEvents(newEvents);
  };

  const handleToggleSelect = (index: number) => {
    const newSelected = new Set(selectedEvents);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedEvents(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedEvents.size === events.length) {
      setSelectedEvents(new Set());
    } else {
      setSelectedEvents(new Set(events.map((_, i) => i)));
    }
  };

  const handlePublish = async () => {
    const toPublish = Array.from(selectedEvents).map((i) => events[i]);

    if (toPublish.length === 0) {
      alert('Please select at least one event to publish');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: toPublish,
          calendar_id: 'primary',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('publish');
      } else {
        alert(`Publishing failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Publishing error:', error);
      alert('Failed to publish events');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('input');
    setEvents([]);
    setSelectedEvents(new Set());
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-black">The Shredder</h1>
          <p className="text-sm text-gray-600 mt-1">Convert messy school info into calendar events</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {step === 'input' && <TextInput onExtract={handleExtract} loading={loading} />}

        {step === 'review' && (
          <EventReview
            events={events}
            selectedEvents={selectedEvents}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onUpdateEvent={handleUpdateEvent}
            onPublish={handlePublish}
            onBack={handleReset}
            loading={loading}
          />
        )}

        {step === 'publish' && (
          <PublishSection onStartOver={handleReset} />
        )}
      </main>
    </div>
  );
}
