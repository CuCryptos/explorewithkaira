import type { Metadata } from 'next';
import { brandConfig, baseUrl, navCategories } from '@/lib/brand';
import { KairaShell } from '../components/KairaShell';

export const metadata: Metadata = {
  title: `About | ${brandConfig.siteName}`,
  description: 'The story behind Explore With Kaira — luxury travel stories from someone who has actually been there.',
  openGraph: {
    title: `About | ${brandConfig.siteName}`,
    description: 'The story behind Explore With Kaira — luxury travel stories from someone who has actually been there.',
    url: `${baseUrl}/about`,
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <KairaShell brandConfig={brandConfig} navCategories={navCategories}>
      <article className="mx-auto max-w-[960px] px-4 py-10 lg:px-6 lg:py-14">
        <div className="mb-8 rounded-[34px] border border-mugon-border/80 bg-[radial-gradient(circle_at_top_left,rgba(201,168,76,0.14),transparent_32%),linear-gradient(180deg,rgba(255,250,244,0.95),rgba(247,241,232,0.86))] p-8 shadow-[0_20px_60px_rgba(22,16,10,0.06)]">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-mugon-muted">About Kaira</p>
          <h1 className="mt-3 font-mugon-heading text-[clamp(2.4rem,6vw,4.8rem)] leading-[0.95] text-mugon-text">
            Luxury travel, minus the PR voice.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-mugon-muted">
            Explore With Kaira exists because too much travel writing has become weightless:
            beautiful, expensive, and useless when you are actually trying to decide where to go or what is worth the money.
          </p>
        </div>

        <div className="prose-mugon kaira-prose">
          <p>
            I started Explore With Kaira because I was tired of reading hotel reviews
            that read like press releases and destination guides written by people
            who stayed for 48 hours on a comped trip.
          </p>

          <p>
            This is what I actually think. No sponsors, no affiliate rankings dressed
            up as editorial, no &ldquo;gifted stays&rdquo; that buy five stars.
            When I say a hotel is worth the money, I paid for the room. When I say
            skip it, I have the receipt to prove I tried.
          </p>

          <h2 className="font-mugon-heading text-mugon-2xl leading-mugon-heading mt-mugon-lg mb-4">
            What You&rsquo;ll Find Here
          </h2>

          <p>
            <strong>Honest hotel reviews</strong> &mdash; properties named, prices noted,
            the things the website photos carefully crop out.
          </p>
          <p>
            <strong>Destination guides</strong> &mdash; the hidden corners that make
            a place worth returning to, not just the top-ten list rewritten for the
            hundredth time.
          </p>
          <p>
            <strong>Weekend itineraries</strong> &mdash; three-day plans built from
            actual trips, with the timing that actually works.
          </p>
          <p>
            <strong>The Take</strong> &mdash; opinions on the travel industry, luxury
            culture, and the things no one else will say out loud.
          </p>

          <h2 className="font-mugon-heading text-mugon-2xl leading-mugon-heading mt-mugon-lg mb-4">
            The Philosophy
          </h2>

          <p>
            Luxury isn&rsquo;t a price point. It&rsquo;s the moment a place makes you
            feel something you didn&rsquo;t expect &mdash; a temple bell at dawn, the
            weight of a hand-thrown ceramic cup, the silence of a desert that hasn&rsquo;t
            been turned into a photo op yet.
          </p>

          <p>
            I write about those moments. Sometimes they happen at a $1,200-a-night
            resort. Sometimes they happen at a $40 guesthouse with better light.
          </p>

          <p>
            If you want the truth about where your money is worth spending,
            you&rsquo;re in the right place.
          </p>
        </div>
      </article>
    </KairaShell>
  );
}
