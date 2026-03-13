interface TimelineEntry {
  id: string;
  date: string;
  migrationDay: number;
  analysis: string;
  alertSent: boolean;
  alertReason?: string | null;
  severity: 'info' | 'notable' | 'urgent';
  metrics: {
    indexedPages: number;
    impressions: number;
    clicks: number;
    avgPosition: number;
  };
}

interface KairaKanshiTimelineProps {
  entries: TimelineEntry[];
}

function KairaKanshiEntry({
  date,
  migrationDay,
  analysis,
  alertSent,
  alertReason,
  severity,
  metrics,
}: TimelineEntry) {
  const severityBadge = {
    info: 'bg-blue-100 text-blue-800',
    notable: 'bg-yellow-100 text-yellow-800',
    urgent: 'bg-red-100 text-red-800',
  }[severity];

  return (
    <article className="border-b border-mugon-border py-6 last:border-b-0">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <time className="text-sm text-mugon-muted">{date}</time>
        <span className="text-sm text-mugon-muted">Day {migrationDay}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs ${severityBadge}`}>{severity}</span>
        {alertSent && (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800">
            Alert sent{alertReason ? `: ${alertReason}` : ''}
          </span>
        )}
      </div>
      <p className="mb-3 whitespace-pre-wrap text-base text-mugon-text">{analysis}</p>
      <div className="flex flex-wrap gap-6 text-sm text-mugon-muted">
        <span>Pages: {metrics.indexedPages}</span>
        <span>Imp: {metrics.impressions}</span>
        <span>Clicks: {metrics.clicks}</span>
        <span>Pos: {metrics.avgPosition.toFixed(1)}</span>
      </div>
    </article>
  );
}

export function KairaKanshiTimeline({ entries }: KairaKanshiTimelineProps) {
  if (entries.length === 0) {
    return <p className="py-8 text-center text-sm text-mugon-muted">No analyses yet.</p>;
  }

  return (
    <div>
      {entries.map((entry) => (
        <KairaKanshiEntry key={entry.id} {...entry} />
      ))}
    </div>
  );
}
