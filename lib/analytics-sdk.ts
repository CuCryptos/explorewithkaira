import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  GA4PageRow,
  GA4SnapshotData,
  GA4TrafficSource,
  GSCSnapshotData,
  GSCPageRow,
  GSCQueryRow,
} from '@/types';

export interface SiteAnalyticsConfig {
  siteId: string;
  gscUrl: string;
  launchDate: string;
  launchDateLabel?: string;
  siteName: string;
  emailDomain?: string;
  adminUrl?: string;
  ga4PropertyId?: string;
}

export interface CollectResult {
  success: boolean;
  snapshotDate: string;
  daysSinceLaunch: number;
}

function getGoogleCredentials(): { client_email: string; private_key: string } {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    const json = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(json);
    return { client_email: serviceAccount.client_email, private_key: serviceAccount.private_key };
  }
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    return { client_email: serviceAccount.client_email, private_key: serviceAccount.private_key };
  }
  return {
    client_email: process.env.GOOGLE_CLIENT_EMAIL!,
    private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  };
}

export function buildSnapshotData(
  queryRows: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }>,
  pageRows: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }>,
  indexedPages: number,
  crawlErrors: number,
): Omit<GSCSnapshotData, 'dateRange'> {
  const queries: GSCQueryRow[] = queryRows.map((row) => ({
    query: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }));

  const pages: GSCPageRow[] = pageRows.map((row) => ({
    page: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }));

  const totalImpressions = queryRows.reduce((sum, row) => sum + row.impressions, 0);
  const totalClicks = queryRows.reduce((sum, row) => sum + row.clicks, 0);
  const avgPosition =
    queryRows.length > 0 && totalImpressions > 0
      ? queryRows.reduce((sum, row) => sum + row.position * row.impressions, 0) / totalImpressions
      : 0;

  return { indexedPages, totalImpressions, totalClicks, avgPosition, crawlErrors, queries, pages };
}

export async function fetchGSCData(
  siteUrl: string,
  startDate: string,
  endDate: string,
): Promise<GSCSnapshotData> {
  const credentials = getGoogleCredentials();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const [queryResponse, pageResponse, sitemapsResponse] = await Promise.all([
    searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 50,
      },
    }),
    searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: 500,
      },
    }),
    searchconsole.sitemaps.list({ siteUrl }),
  ]);

  const sitemaps = sitemapsResponse.data.sitemap ?? [];
  const indexedPages = sitemaps.reduce(
    (sum, sitemap) => sum + parseInt(String(sitemap.contents?.[0]?.indexed ?? '0'), 10),
    0,
  );

  const queryRows = (queryResponse.data.rows ?? []) as Array<{
    keys: string[];
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;

  const pageRows = (pageResponse.data.rows ?? []) as Array<{
    keys: string[];
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;

  const snapshot = buildSnapshotData(queryRows, pageRows, indexedPages, 0);
  return { ...snapshot, dateRange: { start: startDate, end: endDate } };
}

function num(value: string | undefined | null): number {
  return value ? parseFloat(value) : 0;
}

export async function fetchGA4Data(
  propertyId: string,
  startDate: string,
  endDate: string,
): Promise<GA4SnapshotData> {
  const credentials = getGoogleCredentials();
  const client = new BetaAnalyticsDataClient({ credentials });

  const [aggregateResponse, pagesResponse] = await Promise.all([
    client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
      dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
    }),
    client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'userEngagementDuration' },
      ],
      dimensions: [{ name: 'pagePath' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 20,
    }),
  ]);

  const aggregateRows = aggregateResponse[0].rows ?? [];

  let totalSessions = 0;
  let totalUsers = 0;
  let totalNewUsers = 0;
  let totalPageviews = 0;
  let weightedBounceRate = 0;
  let weightedDuration = 0;

  const sourceMap = new Map<string, { sessions: number; users: number }>();

  for (const row of aggregateRows) {
    const source = row.dimensionValues?.[0]?.value ?? '(direct)';
    const medium = row.dimensionValues?.[1]?.value ?? '(none)';
    const sessions = num(row.metricValues?.[0]?.value);
    const users = num(row.metricValues?.[1]?.value);
    const newUsers = num(row.metricValues?.[2]?.value);
    const pageviews = num(row.metricValues?.[3]?.value);
    const bounceRate = num(row.metricValues?.[4]?.value);
    const avgDuration = num(row.metricValues?.[5]?.value);

    totalSessions += sessions;
    totalUsers += users;
    totalNewUsers += newUsers;
    totalPageviews += pageviews;
    weightedBounceRate += bounceRate * sessions;
    weightedDuration += avgDuration * sessions;

    const key = `${source}|||${medium}`;
    const existing = sourceMap.get(key);
    if (existing) {
      existing.sessions += sessions;
      existing.users += users;
    } else {
      sourceMap.set(key, { sessions, users });
    }
  }

  const bounceRate = totalSessions > 0 ? weightedBounceRate / totalSessions : 0;
  const avgSessionDuration = totalSessions > 0 ? weightedDuration / totalSessions : 0;
  const returningUsers = totalUsers - totalNewUsers;

  const trafficSources: GA4TrafficSource[] = Array.from(sourceMap.entries())
    .sort((a, b) => b[1].sessions - a[1].sessions)
    .slice(0, 10)
    .map(([key, data]) => {
      const [source, medium] = key.split('|||');
      return { source, medium, sessions: data.sessions, users: data.users };
    });

  const pageRows = pagesResponse[0].rows ?? [];
  const topPages: GA4PageRow[] = pageRows.map((row) => {
    const pageviews = num(row.metricValues?.[0]?.value);
    const users = num(row.metricValues?.[1]?.value);
    const engagementDuration = num(row.metricValues?.[2]?.value);
    return {
      path: row.dimensionValues?.[0]?.value ?? '/',
      pageviews,
      users,
      avgEngagementTime: users > 0 ? engagementDuration / users : 0,
    };
  });

  return {
    sessions: totalSessions,
    totalUsers,
    newUsers: totalNewUsers,
    returningUsers,
    pageviews: totalPageviews,
    bounceRate,
    avgSessionDuration,
    topPages,
    trafficSources,
    dateRange: { start: startDate, end: endDate },
  };
}

function daysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export async function collectSnapshots(
  config: SiteAnalyticsConfig,
  supabase: SupabaseClient,
): Promise<CollectResult> {
  const launchDays = daysSince(config.launchDate);

  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 2);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 3);

  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  const [snapshotData, ga4Data] = await Promise.all([
    fetchGSCData(config.gscUrl, startStr, endStr),
    config.ga4PropertyId ? fetchGA4Data(config.ga4PropertyId, startStr, endStr) : Promise.resolve(null),
  ]);

  const { error: insertError } = await supabase.from('analytics_snapshots').insert({
    site_id: config.siteId,
    source: 'search-console',
    snapshot_date: endStr,
    data: snapshotData,
    pulled_at: new Date().toISOString(),
  });

  if (insertError) {
    throw new Error(`Failed to store snapshot: ${insertError.message}`);
  }

  if (ga4Data) {
    await supabase.from('analytics_snapshots').insert({
      site_id: config.siteId,
      source: 'ga4',
      snapshot_date: endStr,
      data: ga4Data,
      pulled_at: new Date().toISOString(),
    });
  }

  return {
    success: true,
    snapshotDate: endStr,
    daysSinceLaunch: launchDays,
  };
}
