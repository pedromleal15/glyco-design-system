"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { UserAdd } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { fetchPatients, type Patient } from "@/lib/supabase-queries";
import { PatientStats } from "@/components/patients/patient-stats";
import { PatientFilters } from "@/components/patients/patient-filters";
import { PatientsTable } from "@/components/patients/patients-table";
import { NewPatientDialog } from "@/components/patients/new-patient-dialog";

const conditionMap: Record<string, string> = {
  DM2: "Diabetes Tipo 2",
  Hipotireoidismo: "Hipotireoidismo",
  Obesidade: "Obesidade",
  Hipogonadismo: "Hipogonadismo",
  Esteatose: "Esteatose Hepática",
};

export default function PacientesPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState("Todos");
  const [adherenceFilter, setAdherenceFilter] = useState("Todos");

  const loadPatients = useCallback(async () => {
    setLoading(true);
    const data = await fetchPatients();
    setPatients(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      if (
        searchQuery.trim() !== "" &&
        !patient.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (conditionFilter !== "Todos") {
        const mapped = conditionMap[conditionFilter];
        if (mapped && patient.condition !== mapped) {
          return false;
        }
      }

      if (adherenceFilter === "Aderente" && patient.adherence < 75) {
        return false;
      }
      if (adherenceFilter === "Baixa aderência" && patient.adherence >= 50) {
        return false;
      }
      if (adherenceFilter === "Inativo" && patient.status !== "Inativo") {
        return false;
      }

      return true;
    });
  }, [patients, searchQuery, conditionFilter, adherenceFilter]);

  return (
    <div className="space-y-5 pb-12">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Pacientes
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--muted-foreground)" }}
          >
            Gerencie e acompanhe o progresso dos seus pacientes
          </p>
        </div>
        <NewPatientDialog onCreated={loadPatients}>
          <Button size="sm" className="gap-2 h-8 text-xs">
            <UserAdd size={14} color="currentColor" />
            Novo Paciente
          </Button>
        </NewPatientDialog>
      </div>

      {/* Stats bar */}
      <PatientStats patients={patients} />

      {/* Filters */}
      <PatientFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        conditionFilter={conditionFilter}
        setConditionFilter={setConditionFilter}
        adherenceFilter={adherenceFilter}
        setAdherenceFilter={setAdherenceFilter}
      />

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div
            className="h-5 w-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
          />
          <span className="ml-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Carregando pacientes...
          </span>
        </div>
      ) : (
        <PatientsTable patients={filteredPatients} />
      )}
    </div>
  );
}
