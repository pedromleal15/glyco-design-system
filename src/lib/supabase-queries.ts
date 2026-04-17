import { supabase } from "./supabase";

export type Condition =
  | "Diabetes Tipo 2"
  | "Hipotireoidismo"
  | "Obesidade"
  | "Hipogonadismo"
  | "Esteatose Hepática";

export type RiskLevel = "alto" | "moderado" | "baixo";
export type PatientStatus = "Ativo" | "Inativo" | "Precisa de retorno";

export interface PatientRow {
  id: string;
  name: string;
  birth_date: string;
  condition: Condition;
  risk_level: RiskLevel;
  last_visit: string | null;
  next_visit: string | null;
  adherence_score: number;
  status: PatientStatus;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  name: string;
  initials: string;
  age: number;
  condition: Condition;
  risk: "Baixo" | "Moderado" | "Alto";
  lastConsultation: string;
  adherence: number;
  nextReturn: string;
  status: PatientStatus;
}

function getAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((w) => w.length > 2)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function capitalizeRisk(risk: RiskLevel): "Baixo" | "Moderado" | "Alto" {
  const map: Record<RiskLevel, "Baixo" | "Moderado" | "Alto"> = {
    baixo: "Baixo",
    moderado: "Moderado",
    alto: "Alto",
  };
  return map[risk];
}

function toPatient(row: PatientRow): Patient {
  return {
    id: row.id,
    name: row.name,
    initials: getInitials(row.name),
    age: getAge(row.birth_date),
    condition: row.condition,
    risk: capitalizeRisk(row.risk_level),
    lastConsultation: formatDate(row.last_visit),
    adherence: row.adherence_score,
    nextReturn: formatDate(row.next_visit),
    status: row.status,
  };
}

export async function fetchPatients(): Promise<Patient[]> {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching patients:", error);
    return [];
  }

  return (data as PatientRow[]).map(toPatient);
}

export interface CreatePatientInput {
  name: string;
  birth_date: string;
  condition: Condition;
  risk_level: RiskLevel;
  adherence_score: number;
  status: PatientStatus;
  last_visit?: string;
  next_visit?: string;
}

export async function createPatient(input: CreatePatientInput): Promise<Patient | null> {
  const { data, error } = await supabase
    .from("patients")
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error("Error creating patient:", error);
    return null;
  }

  return toPatient(data as PatientRow);
}

export async function deletePatient(id: string): Promise<boolean> {
  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) {
    console.error("Error deleting patient:", error);
    return false;
  }
  return true;
}
