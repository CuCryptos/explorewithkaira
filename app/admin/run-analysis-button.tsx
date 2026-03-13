'use client';

import { useState } from 'react';

export function RunAnalysisButton() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');

  async function handleClick() {
    setStatus('running');
    try {
      const res = await fetch('/api/cron/analytics', { method: 'POST' });
      if (!res.ok) throw new Error('Failed');
      setStatus('done');
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      setStatus('error');
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === 'running'}
      className="px-4 py-2 rounded-mugon-md bg-mugon-secondary text-white text-mugon-sm disabled:opacity-50"
    >
      {status === 'running' ? 'Running...' : status === 'done' ? 'Done!' : status === 'error' ? 'Failed — retry?' : 'Run Analysis Now'}
    </button>
  );
}
