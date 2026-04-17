"use client";

import { useMemo } from "react";

export interface DayInfo {
  date: string; // YYYY-MM-DD
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  occupancyPercent: number;
  totalSlots: number;
  bookedSlots: number;
  blockedSlots: number;
}

interface MonthCalendarProps {
  year: number;
  month: number; // 0-indexed
  days: DayInfo[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function getOccupancyColor(percent: number): string {
  if (percent <= 0) return "transparent";
  if (percent < 50) return "var(--success)";
  if (percent < 80) return "var(--warning)";
  return "var(--danger)";
}

function getOccupancyDotClass(percent: number): string {
  if (percent <= 0) return "";
  if (percent < 50) return "bg-emerald-500";
  if (percent < 80) return "bg-amber-500";
  return "bg-red-500";
}

export function MonthCalendar({
  year,
  month,
  days,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: MonthCalendarProps) {
  // Build 6-week grid
  const grid = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    // Monday = 0 in our grid
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: DayInfo[] = [];

    // Previous month padding
    for (let i = startDow - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const pm = month === 0 ? 11 : month - 1;
      const py = month === 0 ? year - 1 : year;
      cells.push({
        date: `${py}-${String(pm + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        dayOfMonth: d,
        isCurrentMonth: false,
        isToday: false,
        isWeekend: false,
        occupancyPercent: 0,
        totalSlots: 0,
        bookedSlots: 0,
        blockedSlots: 0,
      });
    }

    // Current month
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dow = new Date(year, month, d).getDay();
      const dayData = days.find((dd) => dd.date === dateStr);

      cells.push({
        date: dateStr,
        dayOfMonth: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        isWeekend: dow === 0 || dow === 6,
        occupancyPercent: dayData?.occupancyPercent ?? 0,
        totalSlots: dayData?.totalSlots ?? 0,
        bookedSlots: dayData?.bookedSlots ?? 0,
        blockedSlots: dayData?.blockedSlots ?? 0,
      });
    }

    // Next month padding to fill 6 rows
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nm = month === 11 ? 0 : month + 1;
      const ny = month === 11 ? year + 1 : year;
      cells.push({
        date: `${ny}-${String(nm + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        dayOfMonth: d,
        isCurrentMonth: false,
        isToday: false,
        isWeekend: false,
        occupancyPercent: 0,
        totalSlots: 0,
        bookedSlots: 0,
        blockedSlots: 0,
      });
    }

    return cells;
  }, [year, month, days]);

  return (
    <div>
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold tracking-tight">
          {MONTH_NAMES[month]} {year}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevMonth}
            className="flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--muted)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button
            onClick={onNextMonth}
            className="flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--muted)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] uppercase tracking-wider font-medium py-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 border border-border rounded-lg overflow-hidden">
        {grid.map((day, i) => {
          const isSelected = day.date === selectedDate;
          const hasSlots = day.totalSlots > 0;

          return (
            <button
              key={day.date + i}
              onClick={() => day.isCurrentMonth && onSelectDate(day.date)}
              disabled={!day.isCurrentMonth}
              className="relative flex flex-col items-center py-2 min-h-[72px] border-b border-r border-border cursor-pointer transition-colors duration-100"
              style={{
                background: isSelected
                  ? "var(--primary)"
                  : day.isToday
                  ? "var(--muted)"
                  : "transparent",
                opacity: day.isCurrentMonth ? 1 : 0.3,
              }}
              onMouseEnter={(e) => {
                if (!isSelected && day.isCurrentMonth) {
                  e.currentTarget.style.background = "var(--muted)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected && day.isCurrentMonth) {
                  e.currentTarget.style.background = day.isToday ? "var(--muted)" : "transparent";
                }
              }}
            >
              <span
                className="text-sm font-medium tabular-nums"
                style={{
                  color: isSelected
                    ? "var(--primary-foreground)"
                    : day.isWeekend
                    ? "var(--muted-foreground)"
                    : "var(--foreground)",
                }}
              >
                {day.dayOfMonth}
              </span>

              {/* Occupancy indicator */}
              {hasSlots && day.isCurrentMonth && (
                <div className="flex flex-col items-center gap-1 mt-1">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${getOccupancyDotClass(day.occupancyPercent)}`}
                  />
                  <span
                    className="text-[10px] tabular-nums font-medium"
                    style={{ color: isSelected ? "var(--primary-foreground)" : getOccupancyColor(day.occupancyPercent) }}
                  >
                    {day.bookedSlots}/{day.totalSlots}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>&lt;50% Disponível</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span>50-80% Moderado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>&gt;80% Lotado</span>
        </div>
      </div>
    </div>
  );
}
