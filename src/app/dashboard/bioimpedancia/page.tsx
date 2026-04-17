"use client";

import { patientData } from "@/lib/bioimpedance-data";
import { PatientHeader } from "@/components/bioimpedance/patient-header";
import { GoalsSummary } from "@/components/bioimpedance/goals-summary";
import { ClinicalTimeline } from "@/components/bioimpedance/clinical-timeline";
import { BodyCompositionCharts } from "@/components/bioimpedance/body-composition-charts";
import { MetricCards } from "@/components/bioimpedance/metric-cards";
import { BodySegments } from "@/components/bioimpedance/body-segments";
import { ClinicalInsights } from "@/components/bioimpedance/clinical-insights";

export default function BioimpedanciaPage() {
  const patient = patientData;

  return (
    <div className="space-y-6 pb-12">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Bioimpedância</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Composição corporal e evolução clínica
        </p>
      </div>

      {/* Patient header */}
      <PatientHeader patient={patient} />

      {/* Goals */}
      <GoalsSummary goals={patient.goals} />

      {/* Metric Cards */}
      <MetricCards measurements={patient.measurements} />

      {/* Timeline */}
      <ClinicalTimeline measurements={patient.measurements} />

      {/* Charts */}
      <BodyCompositionCharts measurements={patient.measurements} />

      {/* Body segments */}
      <BodySegments measurements={patient.measurements} />

      {/* Insights + Actions */}
      <ClinicalInsights patient={patient} />
    </div>
  );
}
