"use client";

import {
  BioimpedanceMeasurement,
  getVariation,
  getVelocity,
} from "@/lib/bioimpedance-data";
import { ArrowUp, ArrowDown, Minus } from "iconsax-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MetricCardsProps {
  measurements: BioimpedanceMeasurement[];
}

type ImprovementDirection = "lower" | "higher" | "neutral";

interface MetricConfig {
  label: string;
  unit: string;
  firstValue: (m: BioimpedanceMeasurement) => number;
  improvementDirection: ImprovementDirection;
}

function getVariationBadgeClassName(
  direction: "up" | "down" | "stable",
  improvement: ImprovementDirection
): string {
  if (direction === "stable") {
    return "bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/20";
  }
  if (improvement === "neutral") {
    return "bg-muted text-muted-foreground border-border";
  }
  const isImprovement =
    (improvement === "lower" && direction === "down") ||
    (improvement === "higher" && direction === "up");
  return isImprovement
    ? "bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/20"
    : "bg-[var(--danger)]/15 text-[var(--danger)] border-[var(--danger)]/20";
}

export function MetricCards({ measurements }: MetricCardsProps) {
  if (measurements.length < 2) return null;

  const first = measurements[0];
  const last = measurements[measurements.length - 1];
  const monthsSpan = 6;

  const metrics: MetricConfig[] = [
    {
      label: "Peso Total",
      unit: "kg",
      firstValue: (m) => m.weight,
      improvementDirection: "lower",
    },
    {
      label: "IMC",
      unit: "kg/m²",
      firstValue: (m) => m.bmi,
      improvementDirection: "lower",
    },
    {
      label: "% Gordura",
      unit: "%",
      firstValue: (m) => m.bodyFatPercent,
      improvementDirection: "lower",
    },
    {
      label: "Massa Magra",
      unit: "kg",
      firstValue: (m) => m.leanMass,
      improvementDirection: "higher",
    },
    {
      label: "Gordura Visceral",
      unit: "",
      firstValue: (m) => m.visceralFat,
      improvementDirection: "lower",
    },
    {
      label: "TMB",
      unit: "kcal",
      firstValue: (m) => m.bmr,
      improvementDirection: "higher",
    },
    {
      label: "Água Corporal",
      unit: "L",
      firstValue: (m) => m.bodyWater,
      improvementDirection: "neutral",
    },
    {
      label: "Proteína",
      unit: "kg",
      firstValue: (m) => m.protein,
      improvementDirection: "higher",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {metrics.map((metric) => {
        const firstVal = metric.firstValue(first);
        const lastVal = metric.firstValue(last);
        const variation = getVariation(firstVal, lastVal);
        const velocity = getVelocity(firstVal, lastVal, monthsSpan);
        const badgeClassName = getVariationBadgeClassName(
          variation.direction,
          metric.improvementDirection
        );

        const DirectionIcon =
          variation.direction === "up"
            ? ArrowUp
            : variation.direction === "down"
            ? ArrowDown
            : Minus;

        const velocityUnit =
          metric.label === "TMB"
            ? "kcal/mês"
            : metric.unit
            ? `${metric.unit}/mês`
            : "/mês";

        return (
          <Card key={metric.label} className="metric-card gap-2">
            <CardContent className="flex flex-col gap-2 py-1">
              {/* Label */}
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {metric.label}
              </span>

              {/* Value + unit */}
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold tabular-nums text-foreground leading-none">
                  {lastVal}
                </span>
                {metric.unit && (
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                )}
              </div>

              {/* Variation Badge */}
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={`h-auto py-0.5 gap-0.5 tabular-nums font-medium ${badgeClassName}`}
                >
                  <DirectionIcon size={10} color="currentColor" />
                  {variation.absolute > 0 ? "+" : ""}
                  {variation.absolute}
                  {metric.unit ? ` ${metric.unit}` : ""}
                </Badge>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {variation.relative > 0 ? "+" : ""}
                  {variation.relative}%
                </span>
              </div>

              {/* Velocity */}
              <span className="text-xs text-muted-foreground tabular-nums">
                {velocity > 0 ? "+" : ""}
                {velocity} {velocityUnit}
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
