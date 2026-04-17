"use client";

import { BioimpedanceMeasurement } from "@/lib/bioimpedance-data";
import { ArrowRight } from "iconsax-react";

interface ClinicalTimelineProps {
  measurements: BioimpedanceMeasurement[];
}

function formatChange(current: number, prev: number): { kg: string; pct: string; down: boolean } {
  const diff = current - prev;
  const pct = ((diff / prev) * 100).toFixed(1);
  const down = diff < 0;
  return {
    kg: `${down ? "" : "+"}${diff.toFixed(1)}kg`,
    pct: `${down ? "" : "+"}${pct}%`,
    down,
  };
}

export function ClinicalTimeline({ measurements }: ClinicalTimelineProps) {
  // Use only the first 3 measurements (or all if fewer)
  const points = measurements.slice(0, 3);

  return (
    <div className="bg-card rounded-xl border border-border-subtle p-6">
      <h2 className="text-sm font-medium text-foreground mb-8">
        Histórico de Medições
      </h2>

      {/* Timeline row */}
      <div className="flex items-start">
        {points.map((measurement, idx) => {
          const isLast = idx === points.length - 1;
          const next = points[idx + 1];

          return (
            <div key={measurement.date} className="flex items-start flex-1 last:flex-none">
              {/* Point + connector */}
              <div className="flex flex-col items-center w-full">
                {/* Circle + date + weight row */}
                <div className="flex items-center w-full">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`relative flex items-center justify-center ${
                        isLast ? "timeline-pulse" : ""
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full border-2 z-10 ${
                          isLast
                            ? "bg-accent border-accent"
                            : "bg-background border-border"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Connector line with change badge */}
                  {!isLast && next && (
                    <div className="flex-1 flex flex-col items-center mx-3">
                      {/* Change badge */}
                      <div className="flex items-center gap-1 mb-1.5">
                        {(() => {
                          const change = formatChange(next.weight, measurement.weight);
                          return (
                            <>
                              <span
                                className={`text-xs font-semibold tabular-nums ${
                                  change.down ? "text-success" : "text-danger"
                                }`}
                              >
                                {change.kg}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({change.pct})
                              </span>
                            </>
                          );
                        })()}
                      </div>
                      {/* Gradient line */}
                      <div
                        className="h-px w-full"
                        style={{
                          background:
                            "linear-gradient(to right, var(--accent), var(--success))",
                        }}
                      />
                      {/* Arrow */}
                      <div className="mt-0.5">
                        <ArrowRight size={10} color="var(--success)" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Date label */}
                <div className="mt-2 flex flex-col items-start w-full pl-0">
                  <span className="text-xs font-medium text-foreground">
                    {measurement.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{measurement.date}</span>

                  {/* Key metrics at this point */}
                  <div className="mt-2 flex flex-col gap-0.5">
                    <span className="text-sm font-semibold tabular-nums text-foreground">
                      {measurement.weight} kg
                    </span>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>IMC {measurement.bmi}</span>
                      <span>Gord. {measurement.bodyFatPercent}%</span>
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>MM {measurement.leanMass} kg</span>
                    </div>
                  </div>

                  {/* Clinical note card */}
                  {measurement.clinicalNote && (
                    <div className="mt-3 bg-muted rounded-lg p-3 text-xs text-muted-foreground max-w-[200px] leading-relaxed">
                      {measurement.clinicalNote}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
