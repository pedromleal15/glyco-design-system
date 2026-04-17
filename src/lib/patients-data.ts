export type Condition =
  | "Diabetes Tipo 2"
  | "Hipotireoidismo"
  | "Obesidade"
  | "Hipogonadismo"
  | "Esteatose Hepática";

export type RiskLevel = "Baixo" | "Moderado" | "Alto";

export type PatientStatus = "Ativo" | "Inativo" | "Precisa de retorno";

export interface Patient {
  id: string;
  name: string;
  initials: string;
  age: number;
  condition: Condition;
  risk: RiskLevel;
  lastConsultation: string;
  adherence: number;
  nextReturn: string;
  status: PatientStatus;
}

export const patients: Patient[] = [
  {
    id: "p-001",
    name: "Carlos Eduardo Ferreira",
    initials: "CF",
    age: 54,
    condition: "Diabetes Tipo 2",
    risk: "Alto",
    lastConsultation: "03 de mar. de 2026",
    adherence: 42,
    nextReturn: "17 de mar. de 2026",
    status: "Precisa de retorno",
  },
  {
    id: "p-002",
    name: "Ana Paula Rodrigues",
    initials: "AR",
    age: 41,
    condition: "Hipotireoidismo",
    risk: "Baixo",
    lastConsultation: "28 de fev. de 2026",
    adherence: 88,
    nextReturn: "28 de mai. de 2026",
    status: "Ativo",
  },
  {
    id: "p-003",
    name: "Roberto Nascimento",
    initials: "RN",
    age: 62,
    condition: "Diabetes Tipo 2",
    risk: "Alto",
    lastConsultation: "10 de jan. de 2026",
    adherence: 28,
    nextReturn: "10 de abr. de 2026",
    status: "Precisa de retorno",
  },
  {
    id: "p-004",
    name: "Fernanda Lima Costa",
    initials: "FL",
    age: 38,
    condition: "Obesidade",
    risk: "Moderado",
    lastConsultation: "14 de fev. de 2026",
    adherence: 63,
    nextReturn: "14 de mai. de 2026",
    status: "Ativo",
  },
  {
    id: "p-005",
    name: "Marcelo Augusto Silva",
    initials: "MS",
    age: 47,
    condition: "Hipogonadismo",
    risk: "Moderado",
    lastConsultation: "20 de fev. de 2026",
    adherence: 75,
    nextReturn: "20 de mai. de 2026",
    status: "Ativo",
  },
  {
    id: "p-006",
    name: "Juliana Pereira Santos",
    initials: "JP",
    age: 33,
    condition: "Hipotireoidismo",
    risk: "Baixo",
    lastConsultation: "05 de mar. de 2026",
    adherence: 95,
    nextReturn: "05 de jun. de 2026",
    status: "Ativo",
  },
  {
    id: "p-007",
    name: "Paulo Henrique Alves",
    initials: "PA",
    age: 58,
    condition: "Esteatose Hepática",
    risk: "Alto",
    lastConsultation: "15 de nov. de 2025",
    adherence: 35,
    nextReturn: "18 de mar. de 2026",
    status: "Precisa de retorno",
  },
  {
    id: "p-008",
    name: "Beatriz Oliveira Melo",
    initials: "BM",
    age: 29,
    condition: "Obesidade",
    risk: "Baixo",
    lastConsultation: "01 de mar. de 2026",
    adherence: 81,
    nextReturn: "01 de jun. de 2026",
    status: "Ativo",
  },
  {
    id: "p-009",
    name: "Ricardo Souza Pinto",
    initials: "RP",
    age: 51,
    condition: "Diabetes Tipo 2",
    risk: "Moderado",
    lastConsultation: "22 de fev. de 2026",
    adherence: 58,
    nextReturn: "22 de mai. de 2026",
    status: "Ativo",
  },
  {
    id: "p-010",
    name: "Camila Andrade Vieira",
    initials: "CV",
    age: 44,
    condition: "Esteatose Hepática",
    risk: "Moderado",
    lastConsultation: "08 de dez. de 2025",
    adherence: 48,
    nextReturn: "08 de mar. de 2026",
    status: "Inativo",
  },
  {
    id: "p-011",
    name: "Thiago Barbosa Leal",
    initials: "TL",
    age: 36,
    condition: "Hipogonadismo",
    risk: "Baixo",
    lastConsultation: "11 de mar. de 2026",
    adherence: 90,
    nextReturn: "11 de jun. de 2026",
    status: "Ativo",
  },
  {
    id: "p-012",
    name: "Vanessa Moura Carvalho",
    initials: "VC",
    age: 49,
    condition: "Hipotireoidismo",
    risk: "Moderado",
    lastConsultation: "17 de out. de 2025",
    adherence: 31,
    nextReturn: "17 de jan. de 2026",
    status: "Inativo",
  },
  {
    id: "p-013",
    name: "Diego Martins Fonseca",
    initials: "DF",
    age: 55,
    condition: "Diabetes Tipo 2",
    risk: "Alto",
    lastConsultation: "25 de jan. de 2026",
    adherence: 44,
    nextReturn: "25 de abr. de 2026",
    status: "Precisa de retorno",
  },
  {
    id: "p-014",
    name: "Larissa Torres Mendes",
    initials: "LM",
    age: 31,
    condition: "Obesidade",
    risk: "Baixo",
    lastConsultation: "07 de mar. de 2026",
    adherence: 77,
    nextReturn: "07 de jun. de 2026",
    status: "Ativo",
  },
];
