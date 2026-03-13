'use client';

import { useState } from 'react';

export type Period = 'today' | 'yesterday' | '7d' | '30d' | 'custom';

interface TimePeriodSelectorProps {
  activePeriod: Period;
  onPeriodChange: (period: Period, start: string, end: string) => void;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDateRange(period: Exclude<Period, 'custom'>): { start: string; end: string } {
  const today = new Date();
  const todayStr = formatDate(today);

  switch (period) {
    case 'today':
      return { start: todayStr, end: todayStr };
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { start: formatDate(yesterday), end: formatDate(yesterday) };
    }
    case '7d': {
      const start = new Date(today);
      start.setDate(start.getDate() - 7);
      return { start: formatDate(start), end: todayStr };
    }
    case '30d': {
      const start = new Date(today);
      start.setDate(start.getDate() - 30);
      return { start: formatDate(start), end: todayStr };
    }
  }
}

const PILLS: { label: string; value: Period }[] = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: 'Custom', value: 'custom' },
];

export function TimePeriodSelector({ activePeriod, onPeriodChange }: TimePeriodSelectorProps) {
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  function handlePillClick(period: Period) {
    if (period === 'custom') {
      onPeriodChange('custom', customStart, customEnd);
      return;
    }
    const range = getDateRange(period);
    onPeriodChange(period, range.start, range.end);
  }

  function handleCustomApply() {
    if (customStart && customEnd) {
      onPeriodChange('custom', customStart, customEnd);
    }
  }

  return (
    <div className="mb-6">
      <div className="flex gap-2 flex-wrap">
        {PILLS.map((pill) => (
          <button
            key={pill.value}
            onClick={() => handlePillClick(pill.value)}
            className={`px-3 py-1.5 rounded-mugon-md text-mugon-sm transition-colors ${
              activePeriod === pill.value
                ? 'bg-mugon-secondary text-white'
                : 'bg-mugon-surface border border-mugon-border text-mugon-text hover:bg-mugon-border'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>
      {activePeriod === 'custom' && (
        <div className="flex gap-3 items-center mt-3">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="px-3 py-1.5 rounded-mugon-md border border-mugon-border bg-mugon-surface text-mugon-text text-mugon-sm"
          />
          <span className="text-mugon-muted text-mugon-sm">to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="px-3 py-1.5 rounded-mugon-md border border-mugon-border bg-mugon-surface text-mugon-text text-mugon-sm"
          />
          <button
            onClick={handleCustomApply}
            disabled={!customStart || !customEnd}
            className="px-3 py-1.5 rounded-mugon-md bg-mugon-secondary text-white text-mugon-sm disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
