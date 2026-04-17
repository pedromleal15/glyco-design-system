"use client";

import { ClinicalGoal } from "@/lib/bioimpedance-data";
import { TickCircle, Warning2, CloseCircle } from "iconsax-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GoalsSummaryProps {
  goals: ClinicalGoal[];
}

const statusConfig = {
  achieved: {
    borderColor: "border-l-success",
    iconColor: "text-success",
    badgeClassName: "bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/20",
    Icon: TickCircle,
    glowClass: "goal-achieved",
  },
  warning: {
    borderColor: "border-l-warning",
    iconColor: "text-warning",
    badgeClassName: "bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/20",
    Icon: Warning2,
    glowClass: "goal-warning",
  },
  danger: {
    borderColor: "border-l-danger",
    iconColor: "text-danger",
    badgeClassName: "bg-[var(--danger)]/15 text-[var(--danger)] border-[var(--danger)]/20",
    Icon: CloseCircle,
    glowClass: "goal-danger",
  },
} as const;

export function GoalsSummary({ goals }: GoalsSummaryProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {goals.map((goal) => {
        const config = statusConfig[goal.status];
        const { Icon } = config;

        return (
          <Card
            key={goal.id}
            className={`border-l-2 ${config.borderColor} ${config.glowClass} gap-2`}
          >
            <CardContent className="flex flex-col gap-2 py-1">
              {/* Metric label */}
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {goal.metric}
              </span>

              {/* Current value */}
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-semibold tabular-nums text-foreground">
                  {goal.currentValue}
                </span>
                {goal.unit && (
                  <span className="text-sm text-muted-foreground">{goal.unit}</span>
                )}
              </div>

              {/* Target with status icon via Badge */}
              <Badge
                variant="outline"
                className={`w-fit h-auto py-0.5 gap-1 ${config.badgeClassName}`}
              >
                <Icon size={12} color="currentColor" variant="Bold" />
                <span>Meta: {goal.target}</span>
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
