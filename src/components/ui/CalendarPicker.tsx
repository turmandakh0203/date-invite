"use client";
import { useState } from "react";

const MN_MONTHS = [
  "1-р сар","2-р сар","3-р сар","4-р сар","5-р сар","6-р сар",
  "7-р сар","8-р сар","9-р сар","10-р сар","11-р сар","12-р сар",
];
const WEEK_DAYS = ["Да","Мя","Лх","Пү","Ба","Бя","Ня"];

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstWeekday(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7; }

interface Props {
  onSelect: (start: Date, end: Date) => void;
}

export default function CalendarPicker({ onSelect }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewY, setViewY] = useState(today.getFullYear());
  const [viewM, setViewM] = useState(today.getMonth());
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd]     = useState<Date | null>(null);
  const [hover, setHover] = useState<Date | null>(null);

  function prevMonth() {
    if (viewM === 0) { setViewM(11); setViewY(y => y - 1); }
    else setViewM(m => m - 1);
  }
  function nextMonth() {
    if (viewM === 11) { setViewM(0); setViewY(y => y + 1); }
    else setViewM(m => m + 1);
  }

  function clickDay(day: number) {
    const d = new Date(viewY, viewM, day);
    if (d < today) return;
    if (!start || end) {
      setStart(d); setEnd(null);
    } else if (d < start) {
      setStart(d); setEnd(null);
    } else {
      setEnd(d);
      onSelect(start, d);
    }
  }

  const sameDay = !!(start && end && start.getTime() === end.getTime());
  const activeEnd = sameDay
    ? null
    : end ?? (start && hover && hover >= start ? hover : null);

  const cells: (number | null)[] = [
    ...Array(firstWeekday(viewY, viewM)).fill(null),
    ...Array.from({ length: daysInMonth(viewY, viewM) }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function cellInfo(day: number) {
    const d   = new Date(viewY, viewM, day);
    const past = d < today;
    const isS  = !!start && d.getTime() === start.getTime();
    const isE  = !!end   && d.getTime() === end.getTime();
    const isH  = !end && !!hover && d.getTime() === hover.getTime();
    const inR  = !!start && !!activeEnd && d > start && d < activeEnd;
    return { past, isS, isE, isH, inR };
  }

  const tripDays = start && end
    ? Math.round((end.getTime() - start.getTime()) / 86400000) + 1
    : 0;

  return (
    <div className="w-full max-w-[316px] select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={prevMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sky-600 font-bold text-xl hover:bg-sky-50 transition"
        >‹</button>
        <span className="text-[15px] font-bold text-ink">
          {viewY} оны {MN_MONTHS[viewM]}
        </span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sky-600 font-bold text-xl hover:bg-sky-50 transition"
        >›</button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7">
        {WEEK_DAYS.map(d => (
          <div key={d} className="h-8 flex items-center justify-center text-[11px] font-bold text-ink-s">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="h-9" />;
          const { past, isS, isE, isH, inR } = cellInfo(day);

          return (
            <div key={i} className="relative h-9 flex items-center justify-center">
              {isS && !!activeEnd && (
                <span className="absolute inset-y-1.5 left-1/2 right-0 bg-sky-100 pointer-events-none" />
              )}
              {(isE || isH) && !sameDay && (
                <span className="absolute inset-y-1.5 left-0 right-1/2 bg-sky-100 pointer-events-none" />
              )}
              {inR && (
                <span className="absolute inset-y-1.5 inset-x-0 bg-sky-100 pointer-events-none" />
              )}
              <button
                disabled={past}
                onClick={() => clickDay(day)}
                onMouseEnter={() => {
                  if (start && !end) {
                    const d = new Date(viewY, viewM, day);
                    setHover(d >= start ? d : null);
                  }
                }}
                onMouseLeave={() => setHover(null)}
                className={[
                  "relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold transition-all duration-100",
                  past ? "text-slate-300 cursor-not-allowed" : "cursor-pointer",
                  (isS || isE) ? "bg-sky-500 text-white shadow-[0_2px_8px_rgba(14,165,233,.4)]" : "",
                  isH ? "bg-sky-300 text-white" : "",
                  inR && !isS && !isE ? "text-sky-700" : "",
                  !past && !isS && !isE && !isH ? "hover:bg-sky-100 text-ink" : "",
                ].filter(Boolean).join(" ")}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>

      {/* Selection status */}
      <div className="mt-3 h-8 flex items-center justify-center">
        {start && end ? (
          <span className="bg-sky-50 border border-sky-200 rounded-full px-4 py-1 text-sm font-bold text-sky-600">
            {start.getMonth()+1}/{start.getDate()} — {end.getMonth()+1}/{end.getDate()} · {tripDays} өдөр
          </span>
        ) : start ? (
          <span className="text-[13px] text-ink-s">Дуусах өдрөө сонгоорой</span>
        ) : (
          <span className="text-[13px] text-ink-s">Эхлэх өдрөө сонгоорой</span>
        )}
      </div>
    </div>
  );
}
