// ─── Types ────────────────────────────────────────────────────────────────────

export type AppointmentType = "consulta" | "teleconsulta" | "checkup";
export type SlotType = AppointmentType | "bloqueio";
export type AppointmentStatus =
  | "agendado"
  | "confirmado"
  | "realizado"
  | "cancelado"
  | "remarcado";

export interface TimeSlot {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: SlotType;
  isBlocked: boolean;
  blockReason: string | null;
  appointmentId: string | null;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  slotId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: AppointmentType;
  status: AppointmentStatus;
  cancelReason: string | null;
  notes: string | null;
  createdAt: string; // ISO datetime
}

export interface DaySchedule {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
  occupancyPercent: number;
  totalSlots: number;
  bookedSlots: number;
  blockedSlots: number;
}

// ─── Deterministic Seeding ────────────────────────────────────────────────────

/**
 * Produces a deterministic pseudo-random integer in [0, max) from a seed string.
 * Uses a simple djb2-style hash so data is stable across renders.
 */
function hashSeed(seed: string): number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h) ^ seed.charCodeAt(i);
    h = h >>> 0; // keep 32-bit unsigned
  }
  return h;
}

function seededRandom(seed: string, index: number): number {
  const h = hashSeed(`${seed}::${index}`);
  return h / 0xffffffff;
}

function seededInt(seed: string, index: number, min: number, max: number): number {
  return min + Math.floor(seededRandom(seed, index) * (max - min));
}

function seededPick<T>(seed: string, index: number, arr: readonly T[]): T {
  return arr[seededInt(seed, index, 0, arr.length)];
}

// ─── Reference Data ───────────────────────────────────────────────────────────

const PATIENT_POOL: Array<{ id: string; name: string }> = [
  { id: "p-001", name: "Pedro de Melo Leal" },
  { id: "p-002", name: "Ana Carolina Ferreira" },
  { id: "p-003", name: "Beatriz Nascimento" },
  { id: "p-004", name: "Marcos Vinícius Gomes" },
  { id: "p-005", name: "Maria Silva Santos" },
  { id: "p-006", name: "Roberto Almeida Souza" },
  { id: "p-007", name: "Carlos Eduardo Lima" },
  { id: "p-008", name: "João Pedro Oliveira" },
  { id: "p-009", name: "Fernanda Lima Costa" },
  { id: "p-010", name: "Marcelo Augusto Silva" },
  { id: "p-011", name: "Juliana Pereira Santos" },
  { id: "p-012", name: "Paulo Henrique Alves" },
  { id: "p-013", name: "Ricardo Souza Pinto" },
  { id: "p-014", name: "Camila Torres Rocha" },
  { id: "p-015", name: "Lucas Mendes Barbosa" },
];

const APPOINTMENT_TYPES: readonly AppointmentType[] = [
  "consulta",
  "consulta",
  "consulta", // weighted towards consulta
  "teleconsulta",
  "checkup",
];

const CANCEL_REASONS: readonly string[] = [
  "Paciente não compareceu",
  "Solicitação do paciente",
  "Emergência médica",
  "Conflito de agenda",
];

const BLOCK_REASONS: readonly string[] = [
  "Almoço",
  "Reunião",
  "Procedimento",
  "Reunião de equipe",
];

const NOTES_POOL: readonly (string | null)[] = [
  null,
  null,
  null, // most appointments have no notes
  "Trazer exames anteriores",
  "Jejum de 12h necessário",
  "Acompanhante autorizado",
  "Retorno de resultado",
  null,
];

// ─── Time Slot Generation ─────────────────────────────────────────────────────

/** Returns all 30-min slot start times from 08:00 to 16:30 (18 slots total). */
function buildSlotTimes(): Array<{ startTime: string; endTime: string }> {
  const slots: Array<{ startTime: string; endTime: string }> = [];
  for (let hour = 8; hour < 17; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 16 && minute === 30) break; // last slot ends at 17:00
      const start = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      const endMinute = minute + 30;
      const endHour = endMinute === 60 ? hour + 1 : hour;
      const end = `${String(endHour).padStart(2, "0")}:${String(endMinute % 60).padStart(2, "0")}`;
      slots.push({ startTime: start, endTime: end });
    }
  }
  return slots;
}

const SLOT_TIMES = buildSlotTimes(); // 18 entries

/** Returns true if the given YYYY-MM-DD falls on a weekday. */
function isWeekday(dateStr: string): boolean {
  const d = new Date(`${dateStr}T12:00:00`);
  const dow = d.getDay();
  return dow !== 0 && dow !== 6;
}

/** Returns YYYY-MM-DD for all days in a given year/month. */
function daysInMonth(year: number, month: number): string[] {
  const days: string[] = [];
  const total = new Date(year, month, 0).getDate(); // month is 1-based
  for (let d = 1; d <= total; d++) {
    days.push(
      `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    );
  }
  return days;
}

// ─── Core Generator ───────────────────────────────────────────────────────────

interface GeneratedDay {
  daySchedule: DaySchedule;
  appointments: Appointment[];
}

const TODAY_STR = "2026-04-03"; // reference date

function generateDay(dateStr: string): GeneratedDay {
  const isPast = dateStr < TODAY_STR;
  const isToday = dateStr === TODAY_STR;
  const slots: TimeSlot[] = [];
  const appointments: Appointment[] = [];

  SLOT_TIMES.forEach(({ startTime, endTime }, slotIdx) => {
    const slotId = `slot-${dateStr}-${startTime.replace(":", "")}`;

    // Lunch block: always block 12:00 and 12:30
    if (startTime === "12:00" || startTime === "12:30") {
      slots.push({
        id: slotId,
        date: dateStr,
        startTime,
        endTime,
        type: "bloqueio",
        isBlocked: true,
        blockReason: "Almoço",
        appointmentId: null,
      });
      return;
    }

    // Random extra blocks (~8% of remaining slots), seeded on dateStr+slotIdx
    const blockChance = seededRandom(dateStr, slotIdx * 17 + 1);
    if (blockChance < 0.08) {
      const reason = seededPick(
        dateStr,
        slotIdx * 17 + 2,
        BLOCK_REASONS.filter((r) => r !== "Almoço")
      );
      slots.push({
        id: slotId,
        date: dateStr,
        startTime,
        endTime,
        type: "bloqueio",
        isBlocked: true,
        blockReason: reason,
        appointmentId: null,
      });
      return;
    }

    // ~60% occupancy for available slots
    const bookChance = seededRandom(dateStr, slotIdx * 17 + 3);
    if (bookChance >= 0.60) {
      // Free slot
      slots.push({
        id: slotId,
        date: dateStr,
        startTime,
        endTime,
        type: "consulta",
        isBlocked: false,
        blockReason: null,
        appointmentId: null,
      });
      return;
    }

    // Book this slot
    const patient = seededPick(dateStr, slotIdx * 17 + 4, PATIENT_POOL);
    const apptType = seededPick(dateStr, slotIdx * 17 + 5, APPOINTMENT_TYPES);
    const apptId = `appt-${dateStr}-${startTime.replace(":", "")}`;

    // Determine status
    let status: AppointmentStatus;
    if (isPast) {
      const statusChance = seededRandom(dateStr, slotIdx * 17 + 6);
      if (statusChance < 0.72) {
        status = "realizado";
      } else if (statusChance < 0.88) {
        status = "cancelado";
      } else {
        status = "remarcado";
      }
    } else if (isToday) {
      const statusChance = seededRandom(dateStr, slotIdx * 17 + 6);
      status = statusChance < 0.5 ? "confirmado" : "agendado";
    } else {
      const statusChance = seededRandom(dateStr, slotIdx * 17 + 6);
      status = statusChance < 0.55 ? "confirmado" : "agendado";
    }

    const cancelReason =
      status === "cancelado"
        ? seededPick(dateStr, slotIdx * 17 + 7, CANCEL_REASONS)
        : null;

    const notes = seededPick(dateStr, slotIdx * 17 + 8, NOTES_POOL);

    const createdDaysAgo = seededInt(dateStr, slotIdx * 17 + 9, 1, 30);
    const createdDate = new Date(`${dateStr}T09:00:00`);
    createdDate.setDate(createdDate.getDate() - createdDaysAgo);

    appointments.push({
      id: apptId,
      patientId: patient.id,
      patientName: patient.name,
      slotId,
      date: dateStr,
      startTime,
      endTime,
      type: apptType,
      status,
      cancelReason,
      notes: notes ?? null,
      createdAt: createdDate.toISOString(),
    });

    slots.push({
      id: slotId,
      date: dateStr,
      startTime,
      endTime,
      type: apptType,
      isBlocked: false,
      blockReason: null,
      appointmentId: apptId,
    });
  });

  const totalSlots = slots.length;
  const blockedSlots = slots.filter((s) => s.isBlocked).length;
  const bookedSlots = slots.filter(
    (s) => !s.isBlocked && s.appointmentId !== null
  ).length;
  const availableSlots = totalSlots - blockedSlots;
  const occupancyPercent =
    availableSlots > 0
      ? Math.round((bookedSlots / availableSlots) * 100)
      : 0;

  return {
    daySchedule: {
      date: dateStr,
      slots,
      occupancyPercent,
      totalSlots,
      bookedSlots,
      blockedSlots,
    },
    appointments,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generates a full month of DaySchedule entries (weekdays only).
 * month is 1-based (1 = January, 4 = April).
 */
export function generateMonthSlots(year: number, month: number): DaySchedule[] {
  return daysInMonth(year, month)
    .filter(isWeekday)
    .map((dateStr) => generateDay(dateStr).daySchedule);
}

/**
 * Returns all Appointment records for a given month/year.
 * Useful for populating appointment lists or statistics panels.
 */
export function generateMonthAppointments(
  year: number,
  month: number
): Appointment[] {
  return daysInMonth(year, month)
    .filter(isWeekday)
    .flatMap((dateStr) => generateDay(dateStr).appointments);
}

/**
 * Returns a single DaySchedule for the given YYYY-MM-DD date string.
 * Returns null if the date falls on a weekend.
 */
export function getDaySchedule(dateStr: string): DaySchedule | null {
  if (!isWeekday(dateStr)) return null;
  return generateDay(dateStr).daySchedule;
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Returns a Tailwind-compatible hex colour based on occupancy percentage:
 *   < 50%  → green  (#10b981)
 *   50-80% → amber  (#f59e0b)
 *   > 80%  → red    (#ef4444)
 */
export function getOccupancyColor(percent: number): string {
  if (percent > 80) return "#ef4444";
  if (percent >= 50) return "#f59e0b";
  return "#10b981";
}

/**
 * Returns a human-readable label for the occupancy level:
 *   < 50%  → 'Disponível'
 *   50-80% → 'Moderado'
 *   > 80%  → 'Lotado'
 */
export function getOccupancyLabel(percent: number): string {
  if (percent > 80) return "Lotado";
  if (percent >= 50) return "Moderado";
  return "Disponível";
}

/**
 * Formats a "HH:mm" time string for display.
 * Currently returns the string as-is; extend here for locale formatting.
 */
export function formatTime(time: string): string {
  return time;
}

/**
 * Returns an array of 7 Date objects representing the Monday-to-Sunday week
 * that contains the given date.
 */
export function getWeekDays(date: Date): Date[] {
  const copy = new Date(date);
  // Adjust to Monday: getDay() returns 0=Sun, 1=Mon, ..., 6=Sat
  const day = copy.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diffToMonday);
  copy.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(copy);
    d.setDate(copy.getDate() + i);
    return d;
  });
}

// ─── Pre-computed April 2026 data (default export) ───────────────────────────

export const april2026Schedule: DaySchedule[] = generateMonthSlots(2026, 4);
export const april2026Appointments: Appointment[] = generateMonthAppointments(
  2026,
  4
);
