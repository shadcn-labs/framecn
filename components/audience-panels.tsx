import { FrameContent } from "@/components/ui/frame";
import type { TrafficRow } from "@/lib/vercel-analytics";

const compact = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  notation: "compact",
});

const exact = new Intl.NumberFormat("en-US");

/** One metric inside a shared outer Frame. */
export const StatPanel = ({
  label,
  value,
  change,
}: {
  label: string;
  /** Null when analytics is unavailable. */
  value: number | null;
  change: number | null;
}) => (
  <FrameContent className="min-w-0 p-5">
    <dt className="text-muted-foreground text-sm">{label}</dt>
    <dd
      className="mt-1 font-mono text-2xl tabular-nums"
      title={value === null ? undefined : exact.format(value)}
    >
      {value === null ? "Unavailable" : compact.format(value)}
    </dd>
    {change !== null && (
      <dd className="text-muted-foreground mt-1 text-xs">
        {change > 0 ? "+" : ""}
        {change}% vs prior 30 days
      </dd>
    )}
  </FrameContent>
);

/** A ranked list inside a shared outer Frame. */
const defaultLabel = (row: TrafficRow) => row.name;

export const RankPanel = ({
  title,
  rows,
  empty,
  label = defaultLabel,
}: {
  title: string;
  rows: TrafficRow[];
  empty: string;
  label?: (row: TrafficRow) => string;
}) => {
  const peak = Math.max(1, ...rows.map((row) => row.visitors));
  return (
    <FrameContent className="min-w-0 p-5">
      <h3 className="text-muted-foreground text-sm">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          {empty}
        </p>
      ) : (
        <ul className="mt-3 space-y-1">
          {rows.map((row) => (
            <li
              key={row.name}
              className="relative flex items-center justify-between gap-4 rounded-sm px-2 py-1 text-sm"
            >
              <span
                aria-hidden
                className="bg-brand/15 absolute inset-y-0 left-0 rounded-sm"
                style={{ width: `${(row.visitors / peak) * 100}%` }}
              />
              <span className="relative min-w-0 truncate">{label(row)}</span>
              <span
                className="text-muted-foreground relative shrink-0 font-mono text-xs tabular-nums"
                title={`${exact.format(row.visitors)} visitors`}
              >
                {compact.format(row.visitors)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </FrameContent>
  );
};
