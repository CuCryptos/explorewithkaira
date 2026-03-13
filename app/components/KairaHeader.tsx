'use client';

import { useState } from 'react';
import type { BrandConfig } from '@/types';

interface KairaHeaderProps {
  brandConfig: BrandConfig;
  navCategories?: Array<{ label: string; href: string }>;
}

export function KairaHeader({ brandConfig, navCategories = [] }: KairaHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-mugon-border/80 bg-mugon-background/92 backdrop-blur-md">
      <div className="border-b border-mugon-border/60 bg-[radial-gradient(circle_at_top_left,rgba(201,168,76,0.18),transparent_36%),linear-gradient(180deg,rgba(255,250,244,0.92),rgba(255,250,244,0.78))]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-6 px-4 py-3 lg:px-6">
          <a href="/" className="min-w-0">
            <span className="block font-mugon-heading text-[clamp(1.6rem,3vw,2.4rem)] leading-none text-[#1d1610]">
              Explore With Kaira
            </span>
            <span className="mt-1 block text-[0.72rem] uppercase tracking-[0.28em] text-[#6c5a49]">
              Honest luxury travel stories
            </span>
          </a>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="/about"
              className="rounded-full border border-mugon-border bg-mugon-surface px-4 py-2 text-sm text-[#1d1610] transition-colors hover:border-mugon-primary hover:text-mugon-primary"
            >
              About Kaira
            </a>
            <a
              href="/category/hotel-reviews"
              className="rounded-full bg-[#1d1610] px-4 py-2 text-sm text-[#f7f1e8] transition-transform hover:-translate-y-0.5"
            >
              Start With Hotels
            </a>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-mugon-border bg-mugon-surface text-[#1d1610] md:hidden"
            onClick={() => setIsOpen((value) => !value)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span className="flex flex-col gap-1.5">
              <span className="h-0.5 w-5 bg-current" />
              <span className="h-0.5 w-5 bg-current" />
              <span className="h-0.5 w-5 bg-current" />
            </span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-4 lg:px-6">
        <nav aria-label="Section navigation" className="hidden md:block">
          <div className="flex items-center gap-2 overflow-x-auto py-3">
            {navCategories.map((cat) => (
              <a
                key={cat.href}
                href={cat.href}
                className="shrink-0 rounded-full border border-mugon-border bg-mugon-surface px-4 py-2 text-[0.78rem] uppercase tracking-[0.16em] text-[#6c5a49] transition-all hover:border-mugon-primary hover:text-[#1d1610]"
              >
                {cat.label}
              </a>
            ))}
          </div>
        </nav>

        {isOpen && (
          <nav aria-label="Mobile navigation" className="border-t border-mugon-border/70 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navCategories.map((cat) => (
                <a
                  key={cat.href}
                  href={cat.href}
                  className="rounded-2xl border border-mugon-border bg-mugon-surface px-4 py-3 text-sm uppercase tracking-[0.16em] text-[#6c5a49]"
                >
                  {cat.label}
                </a>
              ))}
              <a
                href="/about"
                className="mt-2 rounded-2xl border border-mugon-border bg-mugon-background px-4 py-3 text-sm text-[#1d1610]"
              >
                About Kaira
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
