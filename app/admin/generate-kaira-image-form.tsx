'use client';

import { useState } from 'react';

const KAIRA_PRESETS = [
  'mykonos_pool',
  'paris_night',
  'paris_cafe',
  'bali_sunset',
  'dubai_skyline',
  'tulum_beach',
  'amalfi_coast',
  'gym_fitness',
  'high_fashion',
  'hotel_luxury',
  'hotel_review_editorial',
  'itinerary_arrival',
  'hidden_gems_stroll',
  'restaurant',
  'winter',
] as const;

export function GenerateKairaImageForm() {
  const [slug, setSlug] = useState('');
  const [preset, setPreset] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('running');
    setMessage('');

    try {
      const response = await fetch('/api/admin/kaira-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, preset, sceneDescription }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Generation failed');
      setStatus('done');
      setMessage(`Generated Kaira image for ${body.slug}`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Generation failed');
    }
  }

  return (
    <div className="border border-mugon-border rounded-mugon-md p-6 bg-mugon-surface">
      <h2 className="font-mugon-heading text-mugon-lg text-mugon-text mb-2">Generate Kaira image</h2>
      <p className="text-mugon-sm text-mugon-muted mb-4">
        Replicate LoRA pipeline for Kaira portrait and editorial imagery only.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          placeholder="post-slug"
          required
          className="w-full px-4 py-3 rounded-mugon-md border border-mugon-border bg-mugon-background text-mugon-text text-mugon-base focus:outline-none focus:border-mugon-primary"
        />
        <select
          value={preset}
          onChange={(event) => setPreset(event.target.value)}
          className="w-full px-4 py-3 rounded-mugon-md border border-mugon-border bg-mugon-background text-mugon-text text-mugon-base focus:outline-none focus:border-mugon-primary"
        >
          <option value="">Auto-detect / custom only</option>
          {KAIRA_PRESETS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <textarea
          value={sceneDescription}
          onChange={(event) => setSceneDescription(event.target.value)}
          placeholder="Optional custom scene description. Leave blank to infer from the post."
          rows={4}
          className="w-full px-4 py-3 rounded-mugon-md border border-mugon-border bg-mugon-background text-mugon-text text-mugon-base focus:outline-none focus:border-mugon-primary"
        />
        <button
          type="submit"
          disabled={status === 'running'}
          className="px-4 py-2 rounded-mugon-md bg-mugon-primary text-mugon-background text-mugon-sm disabled:opacity-50"
        >
          {status === 'running' ? 'Generating...' : 'Generate Kaira image'}
        </button>
      </form>
      {message && (
        <p className={`mt-3 text-mugon-sm ${status === 'error' ? 'text-red-600' : 'text-mugon-muted'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
