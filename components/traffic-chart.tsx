"use client";

import {
  EChartsLineChart,
  type ChartConfig,
} from "@/components/evilcharts/charts/echarts-line-chart";
import type { Traffic } from "@/lib/vercel-analytics";

const compact = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  notation: "compact",
});
const day = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const config = {
  pageviews: {
    colors: { dark: ["#f06292"], light: ["#f06292"] },
    label: "Pageviews",
  },
  visitors: {
    colors: { dark: ["#f5f4ef"], light: ["#111111"] },
    label: "Visitors",
  },
} satisfies ChartConfig;

export const TrafficChart = ({ traffic }: { traffic: Traffic }) => (
  <div className="min-w-0 space-y-6">
    <dl className="grid grid-cols-2 gap-4">
      {(
        [
          ["Visitors", traffic.visitors, traffic.visitorsChange],
          ["Pageviews", traffic.pageviews, traffic.pageviewsChange],
        ] as const
      ).map(([label, value, change]) => (
        <div key={label}>
          <dt className="text-muted-foreground text-sm">{label}</dt>
          <dd
            className="mt-1 font-mono text-2xl tabular-nums"
            title={value.toLocaleString("en-US")}
          >
            {compact.format(value)}
          </dd>
          {change !== null && (
            <dd className="text-muted-foreground mt-1 text-xs">
              {change > 0 ? "+" : ""}
              {change}% vs prior 30 days
            </dd>
          )}
        </div>
      ))}
    </dl>
    <EChartsLineChart
      data={traffic.days.map(({ date, ...values }) => ({
        ...values,
        date: day.format(new Date(`${date}T00:00:00.000Z`)),
      }))}
      config={config}
      xDataKey="date"
      className="h-64 w-full"
      curveType="monotone"
      enableHoverHighlight
    >
      <EChartsLineChart.XAxis dataKey="date" />
      <EChartsLineChart.YAxis
        tickFormatter={(value) => compact.format(value)}
      />
      <EChartsLineChart.Legend isClickable align="right" />
      <EChartsLineChart.Tooltip cursor />
      <EChartsLineChart.Line dataKey="visitors" isClickable>
        <EChartsLineChart.ActiveDot variant="colored-border" />
      </EChartsLineChart.Line>
      <EChartsLineChart.Line dataKey="pageviews" isClickable>
        <EChartsLineChart.ActiveDot variant="colored-border" />
      </EChartsLineChart.Line>
    </EChartsLineChart>
  </div>
);
