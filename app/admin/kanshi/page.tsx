import { createSupabaseServerClient } from '@/lib/supabase-server';
import { KairaKanshiTimeline } from '@/app/components/KairaKanshiTimeline';

export const dynamic = 'force-dynamic';

const LAUNCH_DATE = '2026-03-08';

export default async function KanshiTimelinePage() {
  const supabase = await createSupabaseServerClient();
  const siteId = process.env.SITE_ID!;

  const { data: interactions } = await supabase
    .from('kanshi_interactions')
    .select('id, output, input, created_at, cost')
    .eq('site_id', siteId)
    .eq('role', 'analyst')
    .order('created_at', { ascending: false });

  const entries = (interactions ?? []).map((row) => {
    const output = row.output as Record<string, unknown>;
    const created = new Date(row.created_at);
    const launch = new Date(LAUNCH_DATE);
    const launchDay = Math.floor((created.getTime() - launch.getTime()) / (1000 * 60 * 60 * 24));

    const keyMetrics = (output.keyMetrics as Record<string, number>) || {};

    return {
      id: row.id,
      date: created.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      migrationDay: Math.max(0, launchDay),
      analysis: (output.analysis as string) || '',
      alertSent: (output.alert as boolean) || false,
      alertReason: (output.alertReason as string) || null,
      severity: (output.severity as 'info' | 'notable' | 'urgent') || 'info',
      metrics: {
        indexedPages: keyMetrics.indexedPages || 0,
        impressions: keyMetrics.impressions || 0,
        clicks: keyMetrics.clicks || 0,
        avgPosition: keyMetrics.avgPosition || 0,
      },
    };
  });

  return (
    <div>
      <h1 className="font-mugon-heading text-mugon-3xl text-mugon-text mb-2">Kanshi Timeline</h1>
      <p className="text-mugon-sm text-mugon-muted mb-8">Intelligence journal — every analysis since launch</p>
      <KairaKanshiTimeline entries={entries} />
    </div>
  );
}
