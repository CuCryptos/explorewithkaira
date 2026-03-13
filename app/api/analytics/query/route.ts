import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { ga4PropertyId, gscSiteUrl } from '@/lib/brand';
import { fetchGA4Data, fetchGSCData } from '@/lib/analytics-sdk';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  if (!start || !end) {
    return NextResponse.json({ error: 'start and end query params required' }, { status: 400 });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(start) || !dateRegex.test(end)) {
    return NextResponse.json({ error: 'Dates must be YYYY-MM-DD format' }, { status: 400 });
  }

  try {
    let ga4Error: string | null = null;
    const [gsc, ga4] = await Promise.all([
      fetchGSCData(gscSiteUrl, start, end).catch(() => null),
      ga4PropertyId
        ? fetchGA4Data(ga4PropertyId, start, end).catch((e) => {
            ga4Error = e instanceof Error ? e.message : String(e);
            console.error('GA4 fetch error:', ga4Error);
            return null;
          })
        : Promise.resolve(null),
    ]);

    const response: Record<string, unknown> = { gsc, ga4, dateRange: { start, end } };
    if (ga4Error) response.ga4Error = ga4Error;
    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
