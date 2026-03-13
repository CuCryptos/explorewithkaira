'use client';

import { useState } from 'react';

const DESTINATION_PRESETS = [
  'tropical_beach',
  'european_cityscape',
  'luxury_hotel',
  'mountain_vista',
  'coastal_village',
  'nightlife',
  'desert_luxury',
  'tropical_jungle',
] as const;

export function GenerateDestinationImageForm() {
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
      const response = await fetch('/api/admin/destination-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, preset, sceneDescription }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Generation failed');
      setStatus('done');
      setMessage(`Generated destination image for ${body.slug}`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Generation failed');
    }
  }

  return (
    <div className="border border-mugon-border rounded-mugon-md p-6 bg-mugon-surface">
      <h2 className="font-mugon-heading text-mugon-lg text-mugon-text mb-2">Generate destination image</h2>
      <p className="text-mugon-sm text-mugon-muted mb-4">
        Gemini/Imagen pipeline for article and destination scenery. No people.
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
          {DESTINATION_PRESETS.map((value) => (
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
          {status === 'running' ? 'Generating...' : 'Generate destination image'}
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
