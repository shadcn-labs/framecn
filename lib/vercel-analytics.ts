import "server-only";

/**
 * framecn's last-30-days traffic from the Vercel Web Analytics query API
 * (same source as shadcn-labs.com/sponsors). Production traffic only, over
 * 30 whole UTC days ending yesterday, compared with the 30 days before.
 */

const API = "https://api.vercel.com/v1/query/web-analytics/visits/aggregate";
const DAY_MS = 86_400_000;
const PERIOD_DAYS = 30;
/** Responses are cached by Next for an hour, like the sponsors page we mirror. */
const REVALIDATE_SECONDS = 3600;

interface Row {
  visitors: number;
  pageviews: number;
  [dimension: string]: unknown;
}

export interface TrafficDay {
  /** YYYY-MM-DD (UTC). */
  date: string;
  visitors: number;
  pageviews: number;
}

/** A ranked dimension row: an ISO 3166-1 alpha-2 code, or a referrer hostname. */
export interface TrafficRow {
  name: string;
  visitors: number;
  pageviews: number;
}

export interface Traffic {
  visitors: number;
  pageviews: number;
  /** Percent change vs the previous 30 days; null when there is no baseline. */
  visitorsChange: number | null;
  pageviewsChange: number | null;
  /** One entry per day of the period, zero-filled. */
  days: TrafficDay[];
  /** Highest-traffic countries first; `name` is the alpha-2 code. */
  countries: TrafficRow[];
  /** Highest-traffic referrer hostnames first. */
  referrers: TrafficRow[];
}

const isoDay = (time: number) => new Date(time).toISOString().slice(0, 10);

const query = async (
  by: string,
  period: { since: string; until: string }
): Promise<Row[]> => {
  const token = process.env.VERCEL_ANALYTICS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_ANALYTICS_TEAM_ID;
  if (!token || !projectId || !teamId) {
    throw new Error("Vercel analytics is not configured.");
  }
  const url = new URL(API);
  url.search = new URLSearchParams({
    by,
    filter: "environment eq 'production'",
    limit: "100",
    projectId,
    since: `${period.since}T00:00:00.000Z`,
    teamId,
    until: `${period.until}T23:59:59.999Z`,
  }).toString();
  const response = await fetch(url, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`Vercel analytics responded ${response.status}.`);
  }
  const body = (await response.json()) as { data?: unknown };
  if (!Array.isArray(body.data)) {
    throw new TypeError("Unexpected Vercel analytics response.");
  }
  return body.data.filter(
    (row): row is Row =>
      typeof row === "object" &&
      row !== null &&
      Number.isFinite((row as Row).visitors) &&
      Number.isFinite((row as Row).pageviews)
  );
};

const sum = (rows: Row[], key: "visitors" | "pageviews") =>
  rows.reduce((total, row) => total + row[key], 0);

/** Vercel folds everything past `limit` into this bucket; it is not a value. */
const OTHERS = "Others";
/** Enough to fill each panel without carrying noise. */
const TOP_ROWS = 10;

/** Top rows for one dimension, highest-traffic first, without the catch-all bucket. */
const ranked = (
  rows: Row[],
  dimension: string,
  label: (value: string) => string = (value) => value
): TrafficRow[] =>
  rows
    .filter(
      (row) =>
        typeof row[dimension] === "string" &&
        row[dimension] !== "" &&
        row[dimension] !== OTHERS
    )
    .map((row) => ({
      name: label(String(row[dimension])),
      pageviews: row.pageviews,
      visitors: row.visitors,
    }))
    .toSorted((a, b) => b.visitors - a.visitors)
    .slice(0, TOP_ROWS);

const change = (current: number, previous: number) =>
  previous > 0 ? Math.round(((current - previous) / previous) * 100) : null;

/** Daily rows keyed by date, with missing days filled with zero. */
const daily = (rows: Row[], since: number): TrafficDay[] => {
  const byDate = new Map(
    rows.flatMap((row) =>
      typeof row.timestamp === "string"
        ? [[row.timestamp.slice(0, 10), row] as const]
        : []
    )
  );
  return Array.from({ length: PERIOD_DAYS }, (_, index) => {
    const date = isoDay(since + index * DAY_MS);
    const row = byDate.get(date);
    return {
      date,
      pageviews: row?.pageviews ?? 0,
      visitors: row?.visitors ?? 0,
    };
  });
};

/** Null when analytics isn't configured or Vercel is unavailable. */
export const getTraffic = async (): Promise<Traffic | null> => {
  const now = Date.now();
  const current = {
    since: isoDay(now - PERIOD_DAYS * DAY_MS),
    until: isoDay(now - DAY_MS),
  };
  const previous = {
    since: isoDay(now - 2 * PERIOD_DAYS * DAY_MS),
    until: isoDay(now - (PERIOD_DAYS + 1) * DAY_MS),
  };
  try {
    const [totals, before, days, countries, referrers] = await Promise.all([
      query("environment", current),
      query("environment", previous),
      query("day", current),
      query("country", current),
      query("referrerHostname", current),
    ]);
    const visitors = sum(totals, "visitors");
    const pageviews = sum(totals, "pageviews");
    return {
      countries: ranked(countries, "country", (code) => code.toUpperCase()),
      days: daily(days, now - PERIOD_DAYS * DAY_MS),
      pageviews,
      pageviewsChange: change(pageviews, sum(before, "pageviews")),
      referrers: ranked(referrers, "referrerHostname"),
      visitors,
      visitorsChange: change(visitors, sum(before, "visitors")),
    };
  } catch {
    return null;
  }
};
