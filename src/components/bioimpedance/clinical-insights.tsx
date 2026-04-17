"use client";

import { PatientProfile } from "@/lib/bioimpedance-data";
import { Calendar, Video, DocumentDownload, Edit2 } from "iconsax-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ClinicalInsightsProps {
  patient: PatientProfile;
}

type InsightType = "success" | "warning";

interface Insight {
  type: InsightType;
  text: string;
}

interface ClinicalAction {
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  variant: "primary" | "secondary";
}

const insights: Insight[] = [
  {
    type: "success",
    text: "Perda de 14,4kg em 6 meses = 2,4kg/mês (taxa saudável)",
  },
  {
    type: "success",
    text: "IMC atingiu faixa normal (23,7). Meta clínica alcançada.",
  },
  {
    type: "success",
    text: "Gordura visceral \u2193 0.07 = redução de risco cardiovascular",
  },
  {
    type: "success",
    text: "TMB +97 kcal = melhora da taxa metabólica basal",
  },
  {
    type: "warning",
    text: "Massa magra diminuiu 8,6kg \u2014 verificar adesão a exercício resistido",
  },
  {
    type: "warning",
    text: "Proteína corporal \u2193 2,1kg \u2014 considerar suplementação proteica",
  },
];

const actions: ClinicalAction[] = [
  {
    label: "Agendar próxima bioimpedância",
    Icon: Calendar,
    variant: "primary",
  },
  {
    label: "Agendar teleconsulta de follow-up",
    Icon: Video,
    variant: "secondary",
  },
  {
    label: "Gerar relatório PDF para paciente",
    Icon: DocumentDownload,
    variant: "secondary",
  },
  {
    label: "Adicionar anotação clínica",
    Icon: Edit2,
    variant: "secondary",
  },
];

const insightDotColor: Record<InsightType, string> = {
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
};

export function ClinicalInsights({ patient: _patient }: ClinicalInsightsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left: Clinical Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights Clínicos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div
                  className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${insightDotColor[insight.type]}`}
                />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.text}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Right: Clinical Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Clínicas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {actions.map((action, idx) => {
              const { Icon } = action;
              const isPrimary = action.variant === "primary";
              return (
                <Button
                  key={idx}
                  type="button"
                  variant={isPrimary ? "default" : "outline"}
                  size="lg"
                  className="w-full justify-start gap-3 text-sm font-medium"
                >
                  <Icon size={16} color="currentColor" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
