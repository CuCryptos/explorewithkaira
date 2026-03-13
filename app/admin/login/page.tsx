'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function AdminLoginPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setStatus('error');
    } else {
      router.refresh();
      router.push('/admin');
    }
  }

  return (
    <div className="min-h-screen bg-mugon-background flex items-center justify-center">
      <div className="w-full max-w-sm p-8">
        <h1 className="font-mugon-heading text-mugon-2xl text-mugon-text mb-2">Admin</h1>
        <p className="text-mugon-muted text-mugon-sm mb-8">Sign in to your dashboard</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 rounded-mugon-md border border-mugon-border bg-mugon-surface text-mugon-text text-mugon-base focus:outline-none focus:border-mugon-primary"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full mt-3 px-4 py-3 rounded-mugon-md border border-mugon-border bg-mugon-surface text-mugon-text text-mugon-base focus:outline-none focus:border-mugon-primary"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full mt-4 px-4 py-3 rounded-mugon-md bg-mugon-primary text-white text-mugon-base font-medium disabled:opacity-50"
          >
            {status === 'loading' ? 'Signing in...' : 'Sign In'}
          </button>
          {status === 'error' && (
            <p className="mt-3 text-red-600 text-mugon-sm">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
