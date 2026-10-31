"use client";

import { EChartsLineChart } from "@/components/evilcharts/charts/echarts-line-chart";
import type { ChartConfig } from "@/components/evilcharts/charts/echarts-line-chart";
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

/** The 30-day trend, one line per metric. */
export const TrafficChart = ({ traffic }: { traffic: Traffic }) => (
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
    <EChartsLineChart.YAxis tickFormatter={(value) => compact.format(value)} />
    <EChartsLineChart.Legend isClickable align="right" />
    <EChartsLineChart.Tooltip cursor />
    <EChartsLineChart.Line dataKey="visitors" isClickable>
      <EChartsLineChart.ActiveDot variant="colored-border" />
    </EChartsLineChart.Line>
    <EChartsLineChart.Line dataKey="pageviews" isClickable>
      <EChartsLineChart.ActiveDot variant="colored-border" />
    </EChartsLineChart.Line>
  </EChartsLineChart>
);
