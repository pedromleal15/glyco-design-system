"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Video, Clock } from "iconsax-react";

interface PatientOption {
  id: string;
  name: string;
}

interface BookAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotDate: string;
  slotTime: string;
  patients: PatientOption[];
  onBook: (patientId: string, type: "consulta" | "teleconsulta" | "checkup", notes: string) => void;
}

const TYPES = [
  { value: "consulta" as const, label: "Consulta", icon: Calendar },
  { value: "teleconsulta" as const, label: "Teleconsulta", icon: Video },
  { value: "checkup" as const, label: "Check-up", icon: Clock },
];

export function BookAppointmentDialog({
  open,
  onOpenChange,
  slotDate,
  slotTime,
  patients,
  onBook,
}: BookAppointmentDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [type, setType] = useState<"consulta" | "teleconsulta" | "checkup">("consulta");
  const [notes, setNotes] = useState("");

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    onBook(selectedPatient, type, notes);
    setSearch("");
    setSelectedPatient("");
    setType("consulta");
    setNotes("");
  };

  const formatDateLabel = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<span />} />
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Agendar Consulta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Date/time display */}
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm"
            style={{ background: "var(--muted)" }}
          >
            <Calendar size={16} color="var(--primary)" />
            <span className="font-medium capitalize">{formatDateLabel(slotDate)}</span>
            <span style={{ color: "var(--muted-foreground)" }}>·</span>
            <span className="tabular-nums" style={{ color: "var(--muted-foreground)" }}>{slotTime}</span>
          </div>

          {/* Patient search */}
          <div className="space-y-2">
            <Label>Paciente</Label>
            <Input
              placeholder="Buscar paciente..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedPatient("");
              }}
            />
            {search && !selectedPatient && (
              <div
                className="max-h-[160px] overflow-y-auto rounded-lg border border-border"
                style={{ background: "var(--popover)" }}
              >
                {filteredPatients.length === 0 ? (
                  <div className="px-3 py-4 text-xs text-center" style={{ color: "var(--muted-foreground)" }}>
                    Nenhum paciente encontrado
                  </div>
                ) : (
                  filteredPatients.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPatient(p.id);
                        setSearch(p.name);
                      }}
                      className="w-full text-left px-3 py-2 text-sm cursor-pointer transition-colors"
                      style={{ color: "var(--foreground)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--muted)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      {p.name}
                    </button>
                  ))
                )}
              </div>
            )}
            {selectedPatient && (
              <div className="text-xs" style={{ color: "var(--success)" }}>
                Paciente selecionado
              </div>
            )}
          </div>

          {/* Appointment type */}
          <div className="space-y-2">
            <Label>Tipo de Consulta</Label>
            <div className="flex gap-2">
              {TYPES.map((t) => {
                const Icon = t.icon;
                const isActive = type === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium flex-1 justify-center cursor-pointer transition-colors"
                    style={{
                      background: isActive ? "var(--primary)" : "var(--muted)",
                      color: isActive ? "var(--primary-foreground)" : "var(--muted-foreground)",
                      border: isActive ? "1px solid var(--primary)" : "1px solid var(--border)",
                    }}
                  >
                    <Icon size={14} color="currentColor" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Observações (opcional)</Label>
            <Input
              placeholder="Notas para a consulta..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-6">
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={!selectedPatient}>
              Agendar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
