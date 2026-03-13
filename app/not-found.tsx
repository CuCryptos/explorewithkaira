import { brandConfig } from '@/lib/brand';
import { KairaShell } from './components/KairaShell';

export default function NotFound() {
  return (
    <KairaShell brandConfig={brandConfig}>
      <div className="mx-auto max-w-[900px] px-4 py-20 text-center lg:px-6">
        <div className="rounded-[34px] border border-mugon-border/80 bg-[linear-gradient(180deg,rgba(255,250,244,0.94),rgba(247,241,232,0.82))] px-6 py-14 shadow-[0_24px_70px_rgba(22,16,10,0.08)]">
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-mugon-muted">404</p>
          <h1 className="mt-3 font-mugon-heading text-[clamp(2.5rem,6vw,4.8rem)] leading-[0.96] text-mugon-text">
            This page slipped out of the itinerary.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-mugon-muted">
            The story you were looking for is not here, or it moved somewhere quieter.
          </p>
          <a href="/" className="mt-8 inline-flex rounded-full bg-mugon-text px-5 py-3 text-sm text-mugon-background">
            Back to {brandConfig.siteName}
          </a>
        </div>
      </div>
    </KairaShell>
  );
}
