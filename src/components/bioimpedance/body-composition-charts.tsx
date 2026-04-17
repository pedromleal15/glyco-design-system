"use client";

import { BioimpedanceMeasurement } from "@/lib/bioimpedance-data";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from "recharts";

interface BodyCompositionChartsProps {
  measurements: BioimpedanceMeasurement[];
}

const tooltipStyle = {
  contentStyle: {
    background: "#0f0f12",
    border: "1px solid #27272a",
    borderRadius: "8px",
    fontSize: "12px",
    color: "#fafafa",
  },
  labelStyle: { color: "#71717a", marginBottom: "4px" },
  itemStyle: { color: "#fafafa" },
};

const gridProps = {
  strokeDasharray: "3 3" as const,
  stroke: "#1e1e22",
};

const axisProps = {
  tick: { fill: "#71717a", fontSize: 11 },
  axisLine: { stroke: "#1e1e22" },
  tickLine: false as const,
};

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-xl border border-border-subtle p-4">
      <h3 className="text-sm font-medium text-foreground mb-3">{title}</h3>
      {children}
    </div>
  );
}

export function BodyCompositionCharts({ measurements }: BodyCompositionChartsProps) {
  const data = measurements.map((m) => ({
    label: m.label,
    leanMass: m.leanMass,
    fatMass: m.fatMass,
    bmi: m.bmi,
    visceralFat: m.visceralFat,
  }));

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* a) Weight Composition - Stacked Area */}
      <ChartCard title="Composição do Peso">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="leanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fatGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis unit=" kg" {...axisProps} />
            <Tooltip
              {...tooltipStyle}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any) => [
                `${value} kg`,
                name === "leanMass" ? "Massa Magra" : "Massa Gorda",
              ]}
            />
            <Area
              type="monotone"
              dataKey="leanMass"
              stackId="1"
              stroke="#3b82f6"
              strokeWidth={1.5}
              fill="url(#leanGradient)"
              name="leanMass"
            />
            <Area
              type="monotone"
              dataKey="fatMass"
              stackId="1"
              stroke="#f59e0b"
              strokeWidth={1.5}
              fill="url(#fatGradient)"
              name="fatMass"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* b) BMI Evolution - Line + Reference areas */}
      <ChartCard title="Evolução do IMC">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis domain={[17, 31]} {...axisProps} />
            <Tooltip
              {...tooltipStyle}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${value} kg/m\u00b2`, "IMC"]}
            />
            <ReferenceArea
              y1={18.5}
              y2={24.9}
              fill="#10b981"
              fillOpacity={0.05}
              strokeOpacity={0}
            />
            <ReferenceLine
              y={25}
              stroke="#ef4444"
              strokeDasharray="4 3"
              strokeWidth={1}
              label={{
                value: "Meta",
                position: "insideTopRight",
                fill: "#ef4444",
                fontSize: 10,
              }}
            />
            <Line
              type="monotone"
              dataKey="bmi"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#3b82f6" }}
              name="IMC"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* c) Lean Mass vs Fat Mass - Grouped Bar */}
      <ChartCard title="Massa Magra vs Massa Gorda">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis unit=" kg" {...axisProps} />
            <Tooltip
              {...tooltipStyle}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any) => [
                `${value} kg`,
                name === "leanMass" ? "Massa Magra" : "Massa Gorda",
              ]}
            />
            <Bar
              dataKey="leanMass"
              fill="#3b82f6"
              fillOpacity={0.85}
              radius={[4, 4, 0, 0]}
              name="leanMass"
              maxBarSize={40}
            />
            <Bar
              dataKey="fatMass"
              fill="#f59e0b"
              fillOpacity={0.85}
              radius={[4, 4, 0, 0]}
              name="fatMass"
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* d) Visceral Fat Trend - Compact sparkline-style */}
      <ChartCard title="Gordura Visceral">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="visceralGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis domain={[0.85, 1.0]} {...axisProps} />
            <Tooltip
              {...tooltipStyle}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${value}`, "Gordura Visceral"]}
            />
            <ReferenceLine
              y={0.9}
              stroke="#ef4444"
              strokeDasharray="4 3"
              strokeWidth={1}
              label={{
                value: "Meta 0.90",
                position: "insideTopRight",
                fill: "#ef4444",
                fontSize: 10,
              }}
            />
            <Area
              type="monotone"
              dataKey="visceralFat"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#visceralGradient)"
              dot={{ fill: "#3b82f6", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#3b82f6" }}
              name="visceralFat"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
