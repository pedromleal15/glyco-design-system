"use client";

import { PatientProfile } from "@/lib/bioimpedance-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PatientHeaderProps {
  patient: PatientProfile;
}

const statusConfig = {
  optimal: {
    label: "Ótimo",
    className: "bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/20",
  },
  attention: {
    label: "Atenção",
    className: "bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/20",
  },
  alert: {
    label: "Alerta",
    className: "bg-[var(--danger)]/15 text-[var(--danger)] border-[var(--danger)]/20",
  },
} as const;

const sexLabel = { M: "Masculino", F: "Feminino" } as const;

export function PatientHeader({ patient }: PatientHeaderProps) {
  const status = statusConfig[patient.clinicalStatus];

  return (
    <Card>
      <CardContent className="py-1">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Avatar + patient identity */}
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-full bg-[var(--accent-muted)] flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-[var(--accent)]">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold leading-tight">{patient.name}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {patient.age} anos · {patient.height}cm · {sexLabel[patient.sex]}
              </p>
            </div>
          </div>

          {/* Center: Therapy protocol badge */}
          <Badge variant="secondary" className="text-xs font-medium px-3 py-1 h-auto rounded-full whitespace-nowrap">
            {patient.therapyProtocol}
          </Badge>

          {/* Right: Dates + clinical status badge + doctor */}
          <div className="flex items-center gap-5 shrink-0">
            <div className="flex flex-col gap-0.5 text-right">
              <span className="text-xs text-muted-foreground">
                Última avaliação:{" "}
                <span className="text-foreground font-medium">{patient.lastEvaluation}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                Próxima:{" "}
                <span className="text-foreground font-medium">{patient.nextRecommended}</span>
              </span>
            </div>

            {/* Clinical status badge */}
            <Badge
              variant="outline"
              className={status.className}
            >
              {status.label}
            </Badge>

            <Separator orientation="vertical" className="h-8" />

            {/* Doctor */}
            <div className="flex flex-col gap-0.5 text-right">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Médico responsável
              </span>
              <span className="text-sm font-medium">{patient.doctor}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
