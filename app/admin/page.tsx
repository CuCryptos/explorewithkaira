import { createSupabaseServerClient } from '@/lib/supabase-server';
import { RunAnalysisButton } from './run-analysis-button';
import { AnalyticsDashboard } from './analytics-dashboard';
import { GenerateDestinationImageForm } from './generate-destination-image-form';
import { GenerateKairaImageForm } from './generate-kaira-image-form';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();
  const siteId = process.env.SITE_ID!;

  const { data: kanshiRows } = await supabase
    .from('kanshi_interactions')
    .select('output, created_at')
    .eq('site_id', siteId)
    .eq('role', 'analyst')
    .order('created_at', { ascending: false })
    .limit(1);

  const latestAnalysis = kanshiRows?.[0];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-mugon-heading text-mugon-3xl text-mugon-text">Dashboard</h1>
        <RunAnalysisButton />
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <GenerateDestinationImageForm />
        <GenerateKairaImageForm />
      </div>

      <AnalyticsDashboard />

      {latestAnalysis && (
        <div className="border border-mugon-border rounded-mugon-md p-6 mt-8 bg-mugon-surface">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-mugon-heading text-mugon-lg">Latest Kanshi Analysis</h2>
            <time className="text-mugon-sm text-mugon-muted">
              {new Date(latestAnalysis.created_at).toLocaleDateString()}
            </time>
          </div>
          <p className="text-mugon-base text-mugon-text whitespace-pre-wrap">
            {(latestAnalysis.output as Record<string, string>).analysis}
          </p>
        </div>
      )}
    </div>
  );
}
