"use client";
import { useState } from "react";
import Progress from "./Progress";
import CalendarPicker from "./CalendarPicker";

interface Props {
  onNext: (date: string, days: number) => void;
}

const MN_DAYS = ["Ням","Даваа","Мягмар","Лхагва","Пүрэв","Бямба","Ням"];

function fmtDate(d: Date) {
  return `${MN_DAYS[d.getDay()]} ${d.getMonth()+1}/${d.getDate()}`;
}

export default function ScreenDate({ onNext }: Props) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate]     = useState<Date | null>(null);

  function handleSelect(s: Date, e: Date) {
    setStartDate(s);
    setEndDate(e);
  }

  const days = startDate && endDate
    ? Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1
    : 0;

  return (
    <div className="screen-in-anim flex flex-col items-center w-full">
      <Progress total={8} current={2} />
      <span className="emoji-float-anim text-5xl mb-3" style={{ filter: "drop-shadow(0 4px 12px rgba(56,189,248,.3))" }}>
        📅
      </span>
      <h2 className="text-xl font-extrabold mb-1 bg-gradient-to-r from-sky-700 to-cyan-500 bg-clip-text text-transparent">
        Хэзээ хөдлөх вэ?
      </h2>
      <p className="text-ink-s text-[14px] mb-4 leading-relaxed">
        Эхлэх болон дуусах өдрөө сонгоорой.
      </p>

      <CalendarPicker onSelect={handleSelect} />

      <button
        disabled={!startDate || !endDate}
        onClick={() => startDate && endDate && onNext(fmtDate(startDate), days)}
        className={`w-full max-w-[300px] mt-5 py-3.5 rounded-[18px] border-none font-bold text-[16px]
          transition-all duration-200
          ${startDate && endDate
            ? "bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-[0_6px_20px_rgba(56,189,248,.28)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(56,189,248,.38)] cursor-pointer"
            : "bg-slate-200 text-ink-s cursor-default opacity-70"
          }`}
      >
        Үргэлжлүүлэх →
      </button>
    </div>
  );
}
