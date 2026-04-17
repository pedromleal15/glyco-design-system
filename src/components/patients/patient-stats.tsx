"use client";

import { Patient } from "@/lib/supabase-queries";
import { Separator } from "@/components/ui/separator";

interface PatientStatsProps {
  patients: Patient[];
}

export function PatientStats({ patients }: PatientStatsProps) {
  const total = patients.length;

  const dm2Descompensado = patients.filter(
    (p) => p.condition === "Diabetes Tipo 2" && p.adherence < 50
  ).length;

  const baixaAderencia = patients.filter((p) => p.adherence < 50).length;

  const retornosPendentes = patients.filter(
    (p) => p.status === "Precisa de retorno"
  ).length;

  const stats = [
    {
      value: total,
      label: "Total de pacientes",
      alert: false,
    },
    {
      value: dm2Descompensado,
      label: "DM2 Descompensado",
      alert: dm2Descompensado > 0,
    },
    {
      value: baixaAderencia,
      label: "Baixa Aderência",
      alert: baixaAderencia > 0,
    },
    {
      value: retornosPendentes,
      label: "Retornos Pendentes",
      alert: retornosPendentes > 0,
    },
  ];

  return (
    <div className="flex items-center gap-6 pb-4 border-b border-border">
      {stats.map((stat, index) => (
        <div key={stat.label} className="flex items-center gap-6">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tabular-nums text-foreground">
              {stat.value}
            </span>
            <span
              className="text-sm"
              style={{
                color: stat.alert ? "var(--warning)" : "var(--muted-foreground)",
              }}
            >
              {stat.label}
            </span>
          </div>
          {index < stats.length - 1 && (
            <Separator orientation="vertical" className="h-8" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}
