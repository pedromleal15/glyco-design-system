"use client";

import React, { useState } from "react";
import {
  createPatient,
  type Condition,
  type RiskLevel,
  type PatientStatus,
} from "@/lib/supabase-queries";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface NewPatientDialogProps {
  children: React.ReactNode;
  onCreated: () => void;
}

const CONDITIONS: Condition[] = [
  "Diabetes Tipo 2",
  "Hipotireoidismo",
  "Obesidade",
  "Hipogonadismo",
  "Esteatose Hepática",
];

const RISK_LEVELS: RiskLevel[] = ["baixo", "moderado", "alto"];

const STATUSES: PatientStatus[] = ["Ativo", "Precisa de retorno", "Inativo"];

export function NewPatientDialog({ children, onCreated }: NewPatientDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [condition, setCondition] = useState<Condition>("Diabetes Tipo 2");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("moderado");
  const [adherence, setAdherence] = useState<number>(80);
  const [status, setStatus] = useState<PatientStatus>("Ativo");
  const [lastVisit, setLastVisit] = useState("");
  const [nextVisit, setNextVisit] = useState("");

  function resetForm() {
    setName("");
    setBirthDate("");
    setCondition("Diabetes Tipo 2");
    setRiskLevel("moderado");
    setAdherence(80);
    setStatus("Ativo");
    setLastVisit("");
    setNextVisit("");
  }

  function handleOpenChange(next: boolean) {
    if (loading) return;
    setOpen(next);
    if (!next) resetForm();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const result = await createPatient({
      name: name.trim(),
      birth_date: birthDate,
      condition,
      risk_level: riskLevel,
      adherence_score: adherence,
      status,
      ...(lastVisit ? { last_visit: lastVisit } : {}),
      ...(nextVisit ? { next_visit: nextVisit } : {}),
    });

    setLoading(false);

    if (result) {
      setOpen(false);
      resetForm();
      onCreated();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children as React.ReactElement}>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Paciente</DialogTitle>
          <DialogDescription>
            Preencha os dados para cadastrar um novo paciente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">

            {/* Nome completo */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="patient-name">Nome completo</Label>
              <Input
                id="patient-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Data de nascimento */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="patient-birth-date">Data de nascimento</Label>
              <Input
                id="patient-birth-date"
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Condição */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="patient-condition">Condição</Label>
              <Select
                value={condition}
                onValueChange={(val) => setCondition(val as Condition)}
                disabled={loading}
              >
                <SelectTrigger id="patient-condition" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nível de Risco */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="patient-risk-level">Nível de Risco</Label>
              <Select
                value={riskLevel}
                onValueChange={(val) => setRiskLevel(val as RiskLevel)}
                disabled={loading}
              >
                <SelectTrigger id="patient-risk-level" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RISK_LEVELS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Aderência (%) */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="patient-adherence">Aderência (%)</Label>
              <Input
                id="patient-adherence"
                type="number"
                required
                min={0}
                max={100}
                value={adherence}
                onChange={(e) => setAdherence(Number(e.target.value))}
                disabled={loading}
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="patient-status">Status</Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as PatientStatus)}
                disabled={loading}
              >
                <SelectTrigger id="patient-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Última consulta */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="patient-last-visit">Última consulta</Label>
              <Input
                id="patient-last-visit"
                type="date"
                value={lastVisit}
                onChange={(e) => setLastVisit(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Próximo retorno */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="patient-next-visit">Próximo retorno</Label>
              <Input
                id="patient-next-visit"
                type="date"
                value={nextVisit}
                onChange={(e) => setNextVisit(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose
              render={
                <Button type="button" variant="outline" disabled={loading} />
              }
            >
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
