"use client";

import { Calendar, Video, Clock, Add, CloseCircle } from "iconsax-react";
import { Badge } from "@/components/ui/badge";

export interface SlotInfo {
  id: string;
  startTime: string;
  endTime: string;
  type: "consulta" | "teleconsulta" | "checkup" | "bloqueio";
  isBlocked: boolean;
  blockReason: string | null;
  patientName: string | null;
  appointmentStatus: string | null;
}

interface DayDetailProps {
  date: string;
  dayLabel: string;
  slots: SlotInfo[];
  onBookSlot: (slotId: string) => void;
  onCancelAppointment: (slotId: string) => void;
}

function getTypeIcon(type: string, size: number = 14) {
  switch (type) {
    case "teleconsulta":
      return <Video size={size} color="currentColor" />;
    case "checkup":
      return <Clock size={size} color="currentColor" />;
    default:
      return <Calendar size={size} color="currentColor" />;
  }
}

function getTypeLabel(type: string): string {
  switch (type) {
    case "teleconsulta": return "Teleconsulta";
    case "checkup": return "Check-up";
    case "bloqueio": return "Bloqueio";
    default: return "Consulta";
  }
}

function getStatusBadge(status: string | null) {
  if (!status) return null;
  const config: Record<string, { bg: string; text: string; label: string }> = {
    agendado: { bg: "bg-blue-500/10", text: "text-blue-500", label: "Agendado" },
    confirmado: { bg: "bg-emerald-500/10", text: "text-emerald-500", label: "Confirmado" },
    realizado: { bg: "bg-muted", text: "text-muted-foreground", label: "Realizado" },
    cancelado: { bg: "bg-red-500/10", text: "text-red-500", label: "Cancelado" },
    remarcado: { bg: "bg-amber-500/10", text: "text-amber-500", label: "Remarcado" },
  };
  const c = config[status] || config.agendado;
  return (
    <Badge variant="outline" className={`${c.bg} ${c.text} border-transparent text-[10px] px-1.5 py-0`}>
      {c.label}
    </Badge>
  );
}

export function DayDetail({ date, dayLabel, slots, onBookSlot, onCancelAppointment }: DayDetailProps) {
  const bookedCount = slots.filter((s) => s.patientName && s.appointmentStatus !== "cancelado").length;
  const totalAvailable = slots.filter((s) => !s.isBlocked).length;
  const occupancy = totalAvailable > 0 ? Math.round((bookedCount / totalAvailable) * 100) : 0;

  return (
    <div>
      {/* Day header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight">{dayLabel}</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {bookedCount} agendados de {totalAvailable} disponíveis ({occupancy}% ocupado)
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium"
          style={{
            background: occupancy < 50
              ? "rgba(16,185,129,0.1)"
              : occupancy < 80
              ? "rgba(245,158,11,0.1)"
              : "rgba(239,68,68,0.1)",
            color: occupancy < 50
              ? "var(--success)"
              : occupancy < 80
              ? "var(--warning)"
              : "var(--danger)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: occupancy < 50
                ? "var(--success)"
                : occupancy < 80
                ? "var(--warning)"
                : "var(--danger)",
            }}
          />
          {occupancy < 50 ? "Disponível" : occupancy < 80 ? "Moderado" : "Lotado"}
        </div>
      </div>

      {/* Time slots */}
      <div className="flex flex-col gap-1">
        {slots.map((slot) => {
          const isBooked = !!slot.patientName && slot.appointmentStatus !== "cancelado";
          const isCancelled = slot.appointmentStatus === "cancelado";
          const isBlocked = slot.isBlocked;

          return (
            <div
              key={slot.id}
              className="group flex items-center gap-3 px-3 rounded-lg transition-colors duration-100"
              style={{
                minHeight: "44px",
                background: isBlocked
                  ? "var(--muted)"
                  : isBooked
                  ? "transparent"
                  : "transparent",
                borderLeft: isBlocked
                  ? "3px solid var(--muted-foreground)"
                  : isBooked
                  ? `3px solid ${isCancelled ? "var(--danger)" : "var(--primary)"}`
                  : "3px solid transparent",
                opacity: isCancelled ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isBlocked) e.currentTarget.style.background = "var(--muted)";
              }}
              onMouseLeave={(e) => {
                if (!isBlocked) e.currentTarget.style.background = isBlocked ? "var(--muted)" : "transparent";
              }}
            >
              {/* Time */}
              <span
                className="text-xs tabular-nums font-medium shrink-0"
                style={{ color: "var(--muted-foreground)", width: "80px" }}
              >
                {slot.startTime} – {slot.endTime}
              </span>

              {/* Content */}
              {isBlocked ? (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CloseCircle size={14} color="var(--muted-foreground)" />
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {slot.blockReason || "Bloqueado"}
                  </span>
                </div>
              ) : isBooked ? (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5" style={{ color: "var(--foreground)" }}>
                    {getTypeIcon(slot.type)}
                    <span className="text-sm font-medium truncate">
                      {slot.patientName}
                    </span>
                  </div>
                  <span className="text-[10px] shrink-0" style={{ color: "var(--muted-foreground)" }}>
                    {getTypeLabel(slot.type)}
                  </span>
                  {getStatusBadge(slot.appointmentStatus)}

                  {/* Cancel button on hover */}
                  {!isCancelled && slot.appointmentStatus !== "realizado" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancelAppointment(slot.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 ml-auto shrink-0 flex items-center justify-center w-6 h-6 rounded cursor-pointer transition-opacity"
                      style={{ color: "var(--danger)" }}
                      title="Cancelar consulta"
                    >
                      <CloseCircle size={14} color="currentColor" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onBookSlot(slot.id)}
                  className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-opacity"
                  style={{ color: "var(--primary)" }}
                >
                  <Add size={14} color="currentColor" />
                  Agendar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
