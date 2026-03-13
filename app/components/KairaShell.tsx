import type { BrandConfig } from '@/types';
import { KairaHeader } from './KairaHeader';

interface KairaShellProps {
  brandConfig: BrandConfig;
  navCategories?: Array<{ label: string; href: string }>;
  children: React.ReactNode;
}

export function KairaShell({ brandConfig, navCategories, children }: KairaShellProps) {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-mugon-background text-mugon-text">
      <KairaHeader brandConfig={brandConfig} navCategories={navCategories} />
      <main>{children}</main>
      <footer className="border-t border-mugon-border bg-[linear-gradient(180deg,transparent,rgba(201,168,76,0.06))]">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-4 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-6">
          <div>
            <p className="font-mugon-heading text-2xl text-mugon-text">Explore With Kaira</p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-mugon-muted">
              Honest hotel reviews, destination stories, and itineraries written from lived experience,
              not press trips. Paid stays. Named properties. Opinions that are actually useful.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-mugon-muted">Browse</p>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <a href="/category/hotel-reviews" className="hover:text-mugon-primary">Hotel Reviews</a>
                <a href="/category/destinations" className="hover:text-mugon-primary">Destinations</a>
                <a href="/category/itineraries" className="hover:text-mugon-primary">Itineraries</a>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-mugon-muted">About</p>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <a href="/about" className="hover:text-mugon-primary">Read the philosophy</a>
                <span className="text-mugon-muted">No sponsors. No comped stays. No affiliate rankings.</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-mugon-border/70">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-4 text-xs uppercase tracking-[0.16em] text-mugon-muted lg:px-6">
            <span>&copy; {year} {brandConfig.siteName}</span>
            <span>Luxury travel with a sharper point of view</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
