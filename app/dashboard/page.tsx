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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="border-b border-purple-500/20 sticky top-0 bg-slate-900/80 backdrop-blur-xl z-40">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">The Shredder</h1>
            <p className="text-sm text-gray-400 mt-1">Extract deadlines. Stay on top.</p>
          </div>
          {step !== 'input' && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Step {step === 'review' ? '2 of 3' : '3 of 3'}</span>
            </div>
          )}
        </div>
      </header>

      {/* Progress Indicator */}
      {step !== 'input' && (
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${step !== 'input' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
              1
            </div>
            <div className={`h-1 flex-1 rounded-full transition-all ${step === 'publish' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-700'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${step === 'review' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : step === 'publish' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
              2
            </div>
            <div className={`h-1 flex-1 rounded-full transition-all ${step === 'publish' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-700'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${step === 'publish' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
              3
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
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
