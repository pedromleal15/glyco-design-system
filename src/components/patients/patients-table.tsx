"use client";

import { useRouter } from "next/navigation";
import { Patient } from "@/lib/supabase-queries";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

type RiskLevel = "Baixo" | "Moderado" | "Alto";
type PatientStatus = "Ativo" | "Inativo" | "Precisa de retorno";

interface PatientsTableProps {
  patients: Patient[];
}

function getAdherenceColor(adherence: number): string {
  if (adherence >= 75) return "var(--success)";
  if (adherence >= 50) return "var(--warning)";
  return "var(--danger)";
}

function getRiskBadgeClassName(risk: RiskLevel): string {
  switch (risk) {
    case "Baixo":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "Moderado":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "Alto":
      return "bg-red-500/10 text-red-500 border-red-500/20";
  }
}

function getStatusClassName(status: PatientStatus): string {
  switch (status) {
    case "Ativo":
      return "text-sm whitespace-nowrap font-medium text-emerald-500";
    case "Inativo":
      return "text-sm whitespace-nowrap font-medium text-muted-foreground";
    case "Precisa de retorno":
      return "text-sm whitespace-nowrap font-medium text-red-500";
  }
}

const COLUMN_HEADERS = [
  "Paciente",
  "Idade",
  "Condição",
  "Risco",
  "Última Consulta",
  "Aderência",
  "Próx. Retorno",
  "Status",
];

export function PatientsTable({ patients }: PatientsTableProps) {
  const router = useRouter();

  if (patients.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
        Nenhum paciente encontrado
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          {COLUMN_HEADERS.map((col) => (
            <TableHead
              key={col}
              className="py-2.5 pr-4 first:pl-0 last:pr-0 uppercase tracking-wider text-[11px] font-medium text-muted-foreground"
            >
              {col}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow
            key={patient.id}
            className="border-border/50 hover:bg-muted/30 cursor-pointer"
            onClick={() => router.push(`/dashboard/pacientes/${patient.id}`)}
          >
            {/* Paciente */}
            <TableCell className="py-2.5 pr-4 pl-0">
              <div className="flex items-center gap-2.5">
                <div
                  className="shrink-0 flex items-center justify-center rounded-full bg-muted text-muted-foreground"
                  style={{
                    width: "28px",
                    height: "28px",
                    fontSize: "10px",
                    fontWeight: 500,
                  }}
                  aria-hidden="true"
                >
                  {patient.initials}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {patient.name}
                </span>
              </div>
            </TableCell>

            {/* Idade */}
            <TableCell className="py-2.5 pr-4">
              <span className="text-sm tabular-nums text-muted-foreground">
                {patient.age}
              </span>
            </TableCell>

            {/* Condição */}
            <TableCell className="py-2.5 pr-4">
              <span className="text-sm text-foreground">
                {patient.condition}
              </span>
            </TableCell>

            {/* Risco */}
            <TableCell className="py-2.5 pr-4">
              <Badge
                variant="outline"
                className={getRiskBadgeClassName(patient.risk)}
              >
                {patient.risk}
              </Badge>
            </TableCell>

            {/* Ultima Consulta */}
            <TableCell className="py-2.5 pr-4">
              <span className="text-sm text-muted-foreground">
                {patient.lastConsultation}
              </span>
            </TableCell>

            {/* Aderência */}
            <TableCell className="py-2.5 pr-4">
              <div className="flex items-center gap-2.5" style={{ minWidth: "100px" }}>
                <div
                  className="flex-1 rounded-full overflow-hidden"
                  style={{ height: "4px", background: "var(--muted)" }}
                  role="progressbar"
                  aria-valuenow={patient.adherence}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Aderência: ${patient.adherence}%`}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${patient.adherence}%`,
                      background: getAdherenceColor(patient.adherence),
                    }}
                  />
                </div>
                <span
                  className="text-sm tabular-nums shrink-0"
                  style={{
                    color: getAdherenceColor(patient.adherence),
                    minWidth: "32px",
                  }}
                >
                  {patient.adherence}%
                </span>
              </div>
            </TableCell>

            {/* Proximo Retorno */}
            <TableCell className="py-2.5 pr-4">
              <span className="text-sm text-muted-foreground">
                {patient.nextReturn}
              </span>
            </TableCell>

            {/* Status */}
            <TableCell className="py-2.5 pr-0">
              <span className={getStatusClassName(patient.status)}>
                {patient.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
