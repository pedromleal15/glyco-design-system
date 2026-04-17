"use client";

import { useState, useMemo, useCallback } from "react";
import { Add } from "iconsax-react";
import { Button } from "@/components/ui/button";
import {
  generateMonthSlots,
  generateMonthAppointments,
  getDaySchedule,
  type DaySchedule,
  type Appointment,
} from "@/lib/scheduling-data";
import { MonthCalendar, type DayInfo } from "@/components/scheduling/month-calendar";
import { DayDetail, type SlotInfo } from "@/components/scheduling/day-detail";
import { BookAppointmentDialog } from "@/components/scheduling/book-appointment-dialog";

const PATIENTS_FOR_BOOKING = [
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

function formatDayLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" });
  const day = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day}`;
}

export default function AgendaPage() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3); // 0-indexed, 3 = April
  const [selectedDate, setSelectedDate] = useState<string>("2026-04-03");
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [bookingSlotId, setBookingSlotId] = useState<string>("");
  const [bookingSlotTime, setBookingSlotTime] = useState("");

  // Generate month data
  const monthSchedule = useMemo(
    () => generateMonthSlots(year, month + 1), // API expects 1-based month
    [year, month]
  );

  const monthAppointments = useMemo(
    () => generateMonthAppointments(year, month + 1),
    [year, month]
  );

  // Convert to DayInfo for calendar
  const calendarDays: DayInfo[] = useMemo(
    () =>
      monthSchedule.map((ds) => ({
        date: ds.date,
        dayOfMonth: parseInt(ds.date.split("-")[2]),
        isCurrentMonth: true,
        isToday: ds.date === "2026-04-03",
        isWeekend: false,
        occupancyPercent: ds.occupancyPercent,
        totalSlots: ds.totalSlots - ds.blockedSlots,
        bookedSlots: ds.bookedSlots,
        blockedSlots: ds.blockedSlots,
      })),
    [monthSchedule]
  );

  // Selected day detail
  const selectedDaySchedule = useMemo(() => {
    if (!selectedDate) return null;
    return getDaySchedule(selectedDate);
  }, [selectedDate]);

  // Convert slots for DayDetail
  const daySlots: SlotInfo[] = useMemo(() => {
    if (!selectedDaySchedule) return [];
    return selectedDaySchedule.slots.map((slot) => {
      const appt = slot.appointmentId
        ? monthAppointments.find((a) => a.id === slot.appointmentId) || null
        : null;

      return {
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        type: slot.type as SlotInfo["type"],
        isBlocked: slot.isBlocked,
        blockReason: slot.blockReason,
        patientName: appt?.patientName ?? null,
        appointmentStatus: appt?.status ?? null,
      };
    });
  }, [selectedDaySchedule, monthAppointments]);

  // Month stats
  const stats = useMemo(() => {
    const total = monthAppointments.length;
    const realizados = monthAppointments.filter((a) => a.status === "realizado").length;
    const cancelados = monthAppointments.filter((a) => a.status === "cancelado").length;
    const agendados = monthAppointments.filter(
      (a) => a.status === "agendado" || a.status === "confirmado"
    ).length;
    return { total, realizados, cancelados, agendados };
  }, [monthAppointments]);

  const handlePrevMonth = useCallback(() => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
    setSelectedDate("");
  }, [month]);

  const handleNextMonth = useCallback(() => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDate("");
  }, [month]);

  const handleBookSlot = (slotId: string) => {
    const slot = selectedDaySchedule?.slots.find((s) => s.id === slotId);
    if (!slot) return;
    setBookingSlotId(slotId);
    setBookingSlotTime(`${slot.startTime} – ${slot.endTime}`);
    setBookDialogOpen(true);
  };

  const handleBookConfirm = (patientId: string, type: "consulta" | "teleconsulta" | "checkup", notes: string) => {
    // In a real app this would call Supabase
    console.log("Booking:", { slotId: bookingSlotId, patientId, type, notes });
    setBookDialogOpen(false);
  };

  const handleCancelAppointment = (slotId: string) => {
    // In a real app this would call Supabase
    console.log("Cancelling appointment for slot:", slotId);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Agenda</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Gerencie consultas e disponibilidade
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2 h-8 text-xs"
          onClick={() => {
            if (selectedDate) {
              // Open booking for first available slot
              const freeSlot = selectedDaySchedule?.slots.find(
                (s) => !s.isBlocked && !s.appointmentId
              );
              if (freeSlot) {
                handleBookSlot(freeSlot.id);
              }
            }
          }}
        >
          <Add size={14} color="currentColor" />
          Nova Consulta
        </Button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-6 border-b border-border pb-4">
        {[
          { label: "Total do Mês", value: stats.total },
          { label: "Agendados", value: stats.agendados, color: "var(--primary)" },
          { label: "Realizados", value: stats.realizados, color: "var(--success)" },
          { label: "Cancelados", value: stats.cancelados, color: "var(--danger)" },
        ].map((stat, i) => (
          <div key={stat.label} className="flex items-center gap-6">
            {i > 0 && <div className="h-8 w-px" style={{ background: "var(--border)" }} />}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tracking-tight tabular-nums">
                {stat.value}
              </span>
              <span
                className="text-sm"
                style={{ color: stat.color || "var(--muted-foreground)" }}
              >
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main content: Calendar + Day detail */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Calendar */}
        <MonthCalendar
          year={year}
          month={month}
          days={calendarDays}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        {/* Day detail panel */}
        <div
          className="rounded-lg p-4"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          {selectedDate && selectedDaySchedule ? (
            <DayDetail
              date={selectedDate}
              dayLabel={formatDayLabel(selectedDate)}
              slots={daySlots}
              onBookSlot={handleBookSlot}
              onCancelAppointment={handleCancelAppointment}
            />
          ) : selectedDate ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-sm" style={{ color: "var(--muted-foreground)" }}>
              <p>Fim de semana</p>
              <p className="text-xs mt-1">Sem horários disponíveis</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full py-12 text-sm" style={{ color: "var(--muted-foreground)" }}>
              Selecione um dia no calendário
            </div>
          )}
        </div>
      </div>

      {/* Booking dialog */}
      <BookAppointmentDialog
        open={bookDialogOpen}
        onOpenChange={setBookDialogOpen}
        slotDate={selectedDate || ""}
        slotTime={bookingSlotTime}
        patients={PATIENTS_FOR_BOOKING}
        onBook={handleBookConfirm}
      />
    </div>
  );
}
