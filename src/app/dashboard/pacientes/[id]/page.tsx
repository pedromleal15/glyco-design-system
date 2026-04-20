"use client";

export const runtime = "edge";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft2 } from "iconsax-react";
import { supabase } from "@/lib/supabase";
import { patientData, type PatientProfile } from "@/lib/bioimpedance-data";
import { PatientHeader } from "@/components/bioimpedance/patient-header";
import { GoalsSummary } from "@/components/bioimpedance/goals-summary";
import { ClinicalTimeline } from "@/components/bioimpedance/clinical-timeline";
import { BodyCompositionCharts } from "@/components/bioimpedance/body-composition-charts";
import { MetricCards } from "@/components/bioimpedance/metric-cards";
import { BodySegments } from "@/components/bioimpedance/body-segments";
import { ClinicalInsights } from "@/components/bioimpedance/clinical-insights";

interface PatientRow {
  id: string;
  name: string;
  birth_date: string;
  condition: string;
  risk_level: string;
  last_visit: string | null;
  next_visit: string | null;
  adherence_score: number;
  status: string;
}

function getAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function buildPatientProfile(row: PatientRow): PatientProfile {
  // For "Pedro de Melo Leal" specifically, use the real bioimpedance data
  if (row.name === "Pedro de Melo Leal") {
    return {
      ...patientData,
      name: row.name,
      age: getAge(row.birth_date),
    };
  }

  // For other patients, generate placeholder bioimpedance data
  // based on their condition and adherence
  const adherence = row.adherence_score;
  const age = getAge(row.birth_date);
  const baseWeight = 70 + Math.random() * 20;
  const weightLoss = adherence > 70 ? 8 : adherence > 50 ? 4 : 1;

  return {
    name: row.name,
    age,
    height: 165 + Math.floor(Math.random() * 20),
    sex: "M",
    doctor: "Dra. Carolina Mendes",
    lastEvaluation: row.last_visit
      ? new Date(row.last_visit).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—",
    nextRecommended: row.next_visit
      ? new Date(row.next_visit).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—",
    clinicalStatus: adherence >= 75 ? "optimal" : adherence >= 50 ? "attention" : "alert",
    therapyProtocol: row.condition === "Diabetes Tipo 2"
      ? "GLP-1 Agonista (Liraglutide 1.8mg)"
      : row.condition === "Obesidade"
      ? "Protocolo Metabólico + Exercício"
      : row.condition === "Hipotireoidismo"
      ? "Levotiroxina 75mcg"
      : row.condition === "Hipogonadismo"
      ? "Reposição Hormonal"
      : "Acompanhamento Clínico",
    measurements: [
      {
        date: "15 ago 2025",
        label: "Ago 2025",
        weight: Math.round(baseWeight * 10) / 10,
        bmi: Math.round((baseWeight / (1.7 * 1.7)) * 10) / 10,
        bodyFatPercent: Math.round((25 + Math.random() * 10) * 10) / 10,
        leanMass: Math.round((baseWeight * 0.7) * 10) / 10,
        fatMass: Math.round((baseWeight * 0.3) * 10) / 10,
        visceralFat: Math.round((0.85 + Math.random() * 0.15) * 100) / 100,
        bmr: Math.round(1400 + Math.random() * 300),
        bodyWater: Math.round((baseWeight * 0.55) * 10) / 10,
        protein: Math.round((baseWeight * 0.15) * 10) / 10,
        leanMassRatio: 70,
        clinicalNote: "Avaliação inicial",
        segments: {
          leftArm: { fatPercent: 27, muscleMass: 2.8 },
          rightArm: { fatPercent: 26.5, muscleMass: 3.0 },
          trunk: { fatPercent: 32, muscleMass: 22 },
          leftLeg: { fatPercent: 28, muscleMass: 8.2 },
          rightLeg: { fatPercent: 27.5, muscleMass: 8.5 },
        },
      },
      {
        date: "12 nov 2025",
        label: "Nov 2025",
        weight: Math.round((baseWeight - weightLoss / 2) * 10) / 10,
        bmi: Math.round(((baseWeight - weightLoss / 2) / (1.7 * 1.7)) * 10) / 10,
        bodyFatPercent: Math.round((24 + Math.random() * 8) * 10) / 10,
        leanMass: Math.round(((baseWeight - weightLoss / 2) * 0.72) * 10) / 10,
        fatMass: Math.round(((baseWeight - weightLoss / 2) * 0.28) * 10) / 10,
        visceralFat: Math.round((0.82 + Math.random() * 0.12) * 100) / 100,
        bmr: Math.round(1450 + Math.random() * 300),
        bodyWater: Math.round(((baseWeight - weightLoss / 2) * 0.55) * 10) / 10,
        protein: Math.round(((baseWeight - weightLoss / 2) * 0.14) * 10) / 10,
        leanMassRatio: 71.5,
        clinicalNote: "Ajuste terapêutico",
        segments: {
          leftArm: { fatPercent: 25.5, muscleMass: 2.7 },
          rightArm: { fatPercent: 25, muscleMass: 2.9 },
          trunk: { fatPercent: 30.5, muscleMass: 21.5 },
          leftLeg: { fatPercent: 26.5, muscleMass: 8.0 },
          rightLeg: { fatPercent: 26, muscleMass: 8.3 },
        },
      },
      {
        date: "05 fev 2026",
        label: "Fev 2026",
        weight: Math.round((baseWeight - weightLoss) * 10) / 10,
        bmi: Math.round(((baseWeight - weightLoss) / (1.7 * 1.7)) * 10) / 10,
        bodyFatPercent: Math.round((22 + Math.random() * 8) * 10) / 10,
        leanMass: Math.round(((baseWeight - weightLoss) * 0.73) * 10) / 10,
        fatMass: Math.round(((baseWeight - weightLoss) * 0.27) * 10) / 10,
        visceralFat: Math.round((0.78 + Math.random() * 0.12) * 100) / 100,
        bmr: Math.round(1500 + Math.random() * 300),
        bodyWater: Math.round(((baseWeight - weightLoss) * 0.55) * 10) / 10,
        protein: Math.round(((baseWeight - weightLoss) * 0.13) * 10) / 10,
        leanMassRatio: 72.5,
        clinicalNote: "Reavaliação de composição corporal",
        segments: {
          leftArm: { fatPercent: 24, muscleMass: 2.6 },
          rightArm: { fatPercent: 23.5, muscleMass: 2.8 },
          trunk: { fatPercent: 29, muscleMass: 21 },
          leftLeg: { fatPercent: 25, muscleMass: 7.8 },
          rightLeg: { fatPercent: 24.5, muscleMass: 8.1 },
        },
      },
    ],
    goals: [
      {
        id: "bmi",
        label: "IMC",
        metric: "IMC",
        target: "< 25",
        operator: "<",
        targetValue: 25,
        currentValue: Math.round(((baseWeight - weightLoss) / (1.7 * 1.7)) * 10) / 10,
        unit: "kg/m²",
        status: ((baseWeight - weightLoss) / (1.7 * 1.7)) < 25 ? "achieved" : "warning",
      },
      {
        id: "visceral",
        label: "Gordura Visceral",
        metric: "Gordura Visceral",
        target: "< 0.90",
        operator: "<",
        targetValue: 0.9,
        currentValue: 0.87,
        unit: "",
        status: "achieved",
      },
      {
        id: "lean-mass",
        label: "Massa Magra",
        metric: "Preservar MM",
        target: "> 50kg",
        operator: ">",
        targetValue: 50,
        currentValue: Math.round(((baseWeight - weightLoss) * 0.73) * 10) / 10,
        unit: "kg",
        status: ((baseWeight - weightLoss) * 0.73) > 50 ? "achieved" : "warning",
      },
      {
        id: "body-fat",
        label: "% Gordura",
        metric: "Gordura Corporal",
        target: "< 25%",
        operator: "<",
        targetValue: 25,
        currentValue: 26,
        unit: "%",
        status: "warning",
      },
    ],
  };
}

export default function PatientBioimpedancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error loading patient:", error);
        setLoading(false);
        return;
      }

      setPatient(buildPatientProfile(data as PatientRow));
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="h-5 w-5 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
        />
        <span className="ml-3 text-sm text-muted-foreground">
          Carregando dados do paciente...
        </span>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-sm text-muted-foreground">Paciente não encontrado</p>
        <button
          onClick={() => router.push("/dashboard/pacientes")}
          className="text-sm text-accent hover:underline cursor-pointer"
        >
          Voltar para pacientes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Back button + Page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/dashboard/pacientes")}
          className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-colors duration-150"
          style={{ color: "var(--muted-foreground)", background: "transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--muted)";
            e.currentTarget.style.color = "var(--foreground)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--muted-foreground)";
          }}
          aria-label="Voltar para pacientes"
        >
          <ArrowLeft2 size={18} color="currentColor" />
        </button>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Bioimpedância</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Composição corporal e evolução clínica
          </p>
        </div>
      </div>

      <PatientHeader patient={patient} />
      <GoalsSummary goals={patient.goals} />
      <MetricCards measurements={patient.measurements} />
      <ClinicalTimeline measurements={patient.measurements} />
      <BodyCompositionCharts measurements={patient.measurements} />
      <BodySegments measurements={patient.measurements} />
      <ClinicalInsights patient={patient} />
    </div>
  );
}
