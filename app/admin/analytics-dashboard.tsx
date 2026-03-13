'use client';

import { useState, useEffect, useCallback } from 'react';
import { TimePeriodSelector, type Period } from './time-period-selector';
import { KairaAdminCard } from '../components/KairaAdminCard';
import type { GSCSnapshotData, GA4SnapshotData } from '@/types';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDefaultRange(): { start: string; end: string } {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 7);
  return { start: formatDate(start), end: formatDate(today) };
}

interface AnalyticsData {
  gsc: GSCSnapshotData | null;
  ga4: GA4SnapshotData | null;
  dateRange: { start: string; end: string };
}

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<Period>('7d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (start: string, end: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics/query?start=${start}&end=${end}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const range = getDefaultRange();
    fetchData(range.start, range.end);
  }, [fetchData]);

  function handlePeriodChange(newPeriod: Period, start: string, end: string) {
    setPeriod(newPeriod);
    if (newPeriod === 'custom' && (!start || !end)) return;
    fetchData(start, end);
  }

  const gsc = data?.gsc;
  const ga4 = data?.ga4;

  return (
    <div>
      <TimePeriodSelector activePeriod={period} onPeriodChange={handlePeriodChange} />

      {data?.dateRange && (
        <p className="text-mugon-sm text-mugon-muted mb-4">
          Showing data: {data.dateRange.start} — {data.dateRange.end}
          {period === 'today' || period === 'yesterday' ? (
            <span className="ml-2">(GSC data may be delayed 2-3 days)</span>
          ) : null}
        </p>
      )}

      {loading && (
        <p className="text-mugon-muted py-8">Loading analytics...</p>
      )}

      {error && (
        <p className="text-red-600 py-4">{error}</p>
      )}

      {!loading && !error && !gsc && !ga4 && (
        <p className="text-mugon-muted">No data available for this date range.</p>
      )}

      {!loading && gsc && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <KairaAdminCard label="Indexed Pages" value={gsc.indexedPages} />
            <KairaAdminCard label="Impressions" value={gsc.totalImpressions} />
            <KairaAdminCard label="Clicks" value={gsc.totalClicks} />
            <KairaAdminCard label="Avg Position" value={gsc.avgPosition} decimals={1} invertColor />
            <KairaAdminCard label="Crawl Errors" value={gsc.crawlErrors} alert={gsc.crawlErrors > 0} />
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="font-mugon-heading text-mugon-lg text-mugon-text mb-4">Top Queries</h2>
              <table className="w-full text-mugon-sm">
                <thead>
                  <tr className="text-mugon-muted text-left">
                    <th className="pb-2">Query</th>
                    <th className="pb-2 text-right">Imp</th>
                    <th className="pb-2 text-right">Clicks</th>
                    <th className="pb-2 text-right">Pos</th>
                  </tr>
                </thead>
                <tbody>
                  {gsc.queries.slice(0, 10).map((q) => (
                    <tr key={q.query} className="border-t border-mugon-border">
                      <td className="py-2 text-mugon-text">{q.query}</td>
                      <td className="py-2 text-right text-mugon-muted">{q.impressions}</td>
                      <td className="py-2 text-right text-mugon-muted">{q.clicks}</td>
                      <td className="py-2 text-right text-mugon-muted">{q.position.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h2 className="font-mugon-heading text-mugon-lg text-mugon-text mb-4">Top Pages</h2>
              <table className="w-full text-mugon-sm">
                <thead>
                  <tr className="text-mugon-muted text-left">
                    <th className="pb-2">Page</th>
                    <th className="pb-2 text-right">Imp</th>
                    <th className="pb-2 text-right">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {gsc.pages.slice(0, 10).map((p) => (
                    <tr key={p.page} className="border-t border-mugon-border">
                      <td className="py-2 text-mugon-text truncate max-w-[200px]">
                        {p.page.replace('https://explorewithkaira.com', '')}
                      </td>
                      <td className="py-2 text-right text-mugon-muted">{p.impressions}</td>
                      <td className="py-2 text-right text-mugon-muted">{p.clicks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!loading && ga4 && (
        <>
          <h2 className="font-mugon-heading text-mugon-lg text-mugon-text mb-4">Site Traffic</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <KairaAdminCard label="Sessions" value={ga4.sessions} />
            <KairaAdminCard label="Users" value={ga4.totalUsers} />
            <KairaAdminCard label="Pageviews" value={ga4.pageviews} />
            <KairaAdminCard
              label="Bounce Rate"
              value={Number((ga4.bounceRate * 100).toFixed(1))}
              decimals={1}
              invertColor
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="font-mugon-heading text-mugon-lg text-mugon-text mb-4">Top Pages (GA4)</h2>
              <table className="w-full text-mugon-sm">
                <thead>
                  <tr className="text-mugon-muted text-left">
                    <th className="pb-2">Page</th>
                    <th className="pb-2 text-right">Views</th>
                    <th className="pb-2 text-right">Users</th>
                  </tr>
                </thead>
                <tbody>
                  {ga4.topPages.slice(0, 10).map((p) => (
                    <tr key={p.path} className="border-t border-mugon-border">
                      <td className="py-2 text-mugon-text truncate max-w-[200px]">{p.path}</td>
                      <td className="py-2 text-right text-mugon-muted">{p.pageviews}</td>
                      <td className="py-2 text-right text-mugon-muted">{p.users}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h2 className="font-mugon-heading text-mugon-lg text-mugon-text mb-4">Traffic Sources</h2>
              <table className="w-full text-mugon-sm">
                <thead>
                  <tr className="text-mugon-muted text-left">
                    <th className="pb-2">Source / Medium</th>
                    <th className="pb-2 text-right">Sessions</th>
                    <th className="pb-2 text-right">Users</th>
                  </tr>
                </thead>
                <tbody>
                  {ga4.trafficSources.slice(0, 10).map((s) => (
                    <tr key={`${s.source}-${s.medium}`} className="border-t border-mugon-border">
                      <td className="py-2 text-mugon-text">{s.source} / {s.medium}</td>
                      <td className="py-2 text-right text-mugon-muted">{s.sessions}</td>
                      <td className="py-2 text-right text-mugon-muted">{s.users}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
