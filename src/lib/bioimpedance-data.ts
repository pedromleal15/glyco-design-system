export interface BioimpedanceMeasurement {
  date: string;
  label: string;
  weight: number;
  bmi: number;
  bodyFatPercent: number;
  leanMass: number;
  fatMass: number;
  visceralFat: number;
  bmr: number;
  bodyWater: number;
  protein: number;
  leanMassRatio: number;
  clinicalNote?: string;
  segments?: BodySegments;
}

export interface BodySegments {
  leftArm: { fatPercent: number; muscleMass: number };
  rightArm: { fatPercent: number; muscleMass: number };
  trunk: { fatPercent: number; muscleMass: number };
  leftLeg: { fatPercent: number; muscleMass: number };
  rightLeg: { fatPercent: number; muscleMass: number };
}

export interface ClinicalGoal {
  id: string;
  label: string;
  metric: string;
  target: string;
  operator: "<" | ">" | "<=" | ">=" | "=";
  targetValue: number;
  currentValue: number;
  unit: string;
  status: "achieved" | "warning" | "danger";
}

export interface PatientProfile {
  name: string;
  age: number;
  height: number;
  sex: "M" | "F";
  doctor: string;
  lastEvaluation: string;
  nextRecommended: string;
  clinicalStatus: "optimal" | "attention" | "alert";
  therapyProtocol: string;
  measurements: BioimpedanceMeasurement[];
  goals: ClinicalGoal[];
}

export const patientData: PatientProfile = {
  name: "Pedro de Melo Leal",
  age: 31,
  height: 170,
  sex: "M",
  doctor: "Dra. Carolina Mendes",
  lastEvaluation: "05 fev 2026",
  nextRecommended: "07 mar 2026",
  clinicalStatus: "attention",
  therapyProtocol: "GLP-1 Agonista (Liraglutide 1.8mg)",
  measurements: [
    {
      date: "15 ago 2025",
      label: "Ago 2025",
      weight: 83.0,
      bmi: 28.7,
      bodyFatPercent: 30.8,
      leanMass: 57.7,
      fatMass: 25.3,
      visceralFat: 0.96,
      bmr: 1544,
      bodyWater: 42.2,
      protein: 11.8,
      leanMassRatio: 69.6,
      clinicalNote: "Início do protocolo Liraglutide 0.6mg",
      segments: {
        leftArm: { fatPercent: 28.5, muscleMass: 2.9 },
        rightArm: { fatPercent: 27.8, muscleMass: 3.1 },
        trunk: { fatPercent: 33.2, muscleMass: 23.4 },
        leftLeg: { fatPercent: 29.1, muscleMass: 8.6 },
        rightLeg: { fatPercent: 28.7, muscleMass: 8.8 },
      },
    },
    {
      date: "12 nov 2025",
      label: "Nov 2025",
      weight: 71.7,
      bmi: 24.8,
      bodyFatPercent: 28.6,
      leanMass: 51.1,
      fatMass: 20.6,
      visceralFat: 0.91,
      bmr: 1613,
      bodyWater: 39.8,
      protein: 10.9,
      leanMassRatio: 71.3,
      clinicalNote: "Titulação para Liraglutide 1.8mg + exercício resistido 3x/sem",
      segments: {
        leftArm: { fatPercent: 26.2, muscleMass: 2.7 },
        rightArm: { fatPercent: 25.5, muscleMass: 2.8 },
        trunk: { fatPercent: 31.0, muscleMass: 21.8 },
        leftLeg: { fatPercent: 27.3, muscleMass: 7.9 },
        rightLeg: { fatPercent: 26.9, muscleMass: 8.1 },
      },
    },
    {
      date: "05 fev 2026",
      label: "Fev 2026",
      weight: 68.6,
      bmi: 23.7,
      bodyFatPercent: 28.6,
      leanMass: 49.1,
      fatMass: 19.5,
      visceralFat: 0.89,
      bmr: 1641,
      bodyWater: 37.5,
      protein: 9.7,
      leanMassRatio: 71.5,
      clinicalNote: "Manutenção Liraglutide 1.8mg. Investigar perda de massa magra.",
      segments: {
        leftArm: { fatPercent: 25.8, muscleMass: 2.5 },
        rightArm: { fatPercent: 25.1, muscleMass: 2.6 },
        trunk: { fatPercent: 30.8, muscleMass: 20.9 },
        leftLeg: { fatPercent: 27.0, muscleMass: 7.5 },
        rightLeg: { fatPercent: 26.5, muscleMass: 7.7 },
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
      currentValue: 23.7,
      unit: "kg/m²",
      status: "achieved",
    },
    {
      id: "visceral",
      label: "Gordura Visceral",
      metric: "Gordura Visceral",
      target: "< 0.90",
      operator: "<",
      targetValue: 0.9,
      currentValue: 0.89,
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
      currentValue: 49.1,
      unit: "kg",
      status: "danger",
    },
    {
      id: "body-fat",
      label: "% Gordura",
      metric: "Gordura Corporal",
      target: "< 25%",
      operator: "<",
      targetValue: 25,
      currentValue: 28.6,
      unit: "%",
      status: "warning",
    },
  ],
};

export function getVariation(
  first: number,
  last: number
): { absolute: number; relative: number; direction: "up" | "down" | "stable" } {
  const absolute = last - first;
  const relative = first !== 0 ? (absolute / first) * 100 : 0;
  const direction = absolute > 0.1 ? "up" : absolute < -0.1 ? "down" : "stable";
  return {
    absolute: Math.round(absolute * 10) / 10,
    relative: Math.round(relative * 10) / 10,
    direction,
  };
}

export function getVelocity(first: number, last: number, months: number): number {
  return Math.round(((last - first) / months) * 10) / 10;
}
