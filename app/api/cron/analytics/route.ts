import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { ga4PropertyId, gscSiteUrl } from '@/lib/brand';
import { collectSnapshots, type SiteAnalyticsConfig } from '@/lib/analytics-sdk';

const config: SiteAnalyticsConfig = {
  siteId: process.env.SITE_ID!,
  gscUrl: gscSiteUrl,
  launchDate: '2026-03-08',
  launchDateLabel: 'Launch day',
  siteName: 'ExplorewithKaira',
  ga4PropertyId,
};

async function verifyAuth(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) return true;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!config.siteId) return NextResponse.json({ error: 'SITE_ID not configured' }, { status: 500 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const result = await collectSnapshots(config, supabase);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
