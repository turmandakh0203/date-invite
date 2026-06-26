"use client";
import { useEffect, useState } from "react";
import { useAnimations } from "@/lib/animations";
import Progress from "./Progress";

interface Props {
  days: number;
  onNext: (items: string[]) => void;
}

export default function ScreenItinerary({ days, onNext }: Props) {
  const [entries, setEntries] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);
  const { spawnSparkles } = useAnimations();

  useEffect(() => {
    setEntries(Array.from({ length: days }, () => ""));
  }, [days]);

  function updateEntry(index: number, value: string) {
    setEntries((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setTouched(true);
  }

  function handleNext() {
    onNext(entries.map((entry, index) => entry || `Өдөр ${index + 1}: Тайлбар бичнэ үү`));
  }

  const hasEntry = entries.some((entry) => entry.trim().length > 0);

  return (
    <div className="screen-in-anim flex flex-col items-center w-full">
      <Progress total={8} current={6} />
      <span className="emoji-float-anim text-6xl mb-5" style={{ filter: "drop-shadow(0 4px 12px rgba(56,189,248,.3))" }}>
        📝
      </span>
      <h2 className="text-xl font-extrabold mb-2 bg-gradient-to-r from-sky-700 to-cyan-500 bg-clip-text text-transparent">
        Өдөр тус бүрийн төлөвлөгөөгөө бич
      </h2>
      <p className="text-ink-s text-[15px] mb-6 text-center leading-relaxed max-w-[320px]">
        Өдөр бүр хаашаа явах, юу хийхээ тодорхой бичиж төлөвлөгөөгөө гүйцээнэ үү.
      </p>

      <div className="space-y-3 w-full max-w-[360px]">
        {entries.map((value, index) => (
          <label key={index} className="block">
            <div className="mb-2 text-sm font-semibold text-ink">{index + 1}‑р өдөр</div>
            <textarea
              value={value}
              onChange={(e) => updateEntry(index, e.target.value)}
              placeholder={`${index + 1}-р өдөр: хаашаа явах, юу хийхээ бичнэ үү...`}
              className="w-full min-h-[88px] rounded-[16px] border border-sky-200 bg-white p-4 text-sm text-ink resize-none outline-none transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>
        ))}
      </div>

      <button
        disabled={!hasEntry && !touched}
        onClick={handleNext}
        className={`w-full max-w-[300px] mt-5 py-3.5 rounded-[18px] border-none font-bold text-[16px] ${
          hasEntry || touched
            ? "bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-[0_6px_20px_rgba(56,189,248,.28)] hover:-translate-y-0.5 cursor-pointer"
            : "bg-slate-200 text-ink-s cursor-default opacity-70"
        }`}
      >
        Аяллын хуваарийг баталгаажуулах →
      </button>
    </div>
  );
}
