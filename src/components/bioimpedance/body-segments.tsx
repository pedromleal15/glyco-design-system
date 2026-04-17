"use client";

import { BioimpedanceMeasurement } from "@/lib/bioimpedance-data";

interface BodySegmentsProps {
  measurements: BioimpedanceMeasurement[];
}

function SegmentBar({
  label,
  firstValue,
  lastValue,
  unit,
  lowerIsBetter = true,
}: {
  label: string;
  firstValue: number;
  lastValue: number;
  unit: string;
  lowerIsBetter?: boolean;
}) {
  const change = lastValue - firstValue;
  const improved = lowerIsBetter ? change < 0 : change > 0;
  const changeColor = improved
    ? "text-[var(--success)]"
    : Math.abs(change) < 0.1
    ? "text-muted-foreground"
    : "text-[var(--danger)]";

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border-subtle last:border-0">
      <span className="text-sm text-muted-foreground w-28">{label}</span>
      <div className="flex items-center gap-4 flex-1 justify-end">
        <span className="text-xs text-muted-foreground tabular-nums">
          {firstValue.toFixed(1)}
          {unit}
        </span>
        <div className="w-16 flex justify-center">
          <svg width="24" height="12" viewBox="0 0 24 12" className={changeColor}>
            <path
              d="M0 6h20m0 0l-4-4m4 4l-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-sm font-medium tabular-nums w-16 text-right">
          {lastValue.toFixed(1)}
          {unit}
        </span>
        <span className={`text-xs tabular-nums w-14 text-right ${changeColor}`}>
          {change > 0 ? "+" : ""}
          {change.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

export function BodySegments({ measurements }: BodySegmentsProps) {
  const first = measurements[0];
  const last = measurements[measurements.length - 1];

  if (!first.segments || !last.segments) return null;

  const segments = [
    {
      region: "Braço Esq.",
      fat: { first: first.segments.leftArm.fatPercent, last: last.segments.leftArm.fatPercent },
      muscle: { first: first.segments.leftArm.muscleMass, last: last.segments.leftArm.muscleMass },
    },
    {
      region: "Braço Dir.",
      fat: { first: first.segments.rightArm.fatPercent, last: last.segments.rightArm.fatPercent },
      muscle: { first: first.segments.rightArm.muscleMass, last: last.segments.rightArm.muscleMass },
    },
    {
      region: "Tronco",
      fat: { first: first.segments.trunk.fatPercent, last: last.segments.trunk.fatPercent },
      muscle: { first: first.segments.trunk.muscleMass, last: last.segments.trunk.muscleMass },
    },
    {
      region: "Perna Esq.",
      fat: { first: first.segments.leftLeg.fatPercent, last: last.segments.leftLeg.fatPercent },
      muscle: { first: first.segments.leftLeg.muscleMass, last: last.segments.leftLeg.muscleMass },
    },
    {
      region: "Perna Dir.",
      fat: { first: first.segments.rightLeg.fatPercent, last: last.segments.rightLeg.fatPercent },
      muscle: { first: first.segments.rightLeg.muscleMass, last: last.segments.rightLeg.muscleMass },
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-border-subtle p-5">
      <h3 className="text-sm font-medium mb-4">Segmentação Corporal</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Fat % by segment */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-[var(--warning)]" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              % Gordura por Segmento
            </span>
          </div>
          {segments.map((seg) => (
            <SegmentBar
              key={`fat-${seg.region}`}
              label={seg.region}
              firstValue={seg.fat.first}
              lastValue={seg.fat.last}
              unit="%"
              lowerIsBetter={true}
            />
          ))}
        </div>

        {/* Muscle mass by segment */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Massa Muscular por Segmento
            </span>
          </div>
          {segments.map((seg) => (
            <SegmentBar
              key={`muscle-${seg.region}`}
              label={seg.region}
              firstValue={seg.muscle.first}
              lastValue={seg.muscle.last}
              unit="kg"
              lowerIsBetter={false}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center gap-4 text-xs text-muted-foreground">
        <span>Comparação: {first.label} → {last.label}</span>
        <span className="text-[var(--success)]">● Melhoria</span>
        <span className="text-[var(--danger)]">● Atenção</span>
      </div>
    </div>
  );
}
