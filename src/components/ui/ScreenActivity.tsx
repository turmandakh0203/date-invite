"use client";
import { useState } from "react";
import { ACTIVITIES } from "@/lib/data";
import { useAnimations } from "@/lib/animations";
import Progress from "./Progress";

interface Props {
  onNext: (acts: string[]) => void;
}

export default function ScreenActivity({ onNext }: Props) {
  const [sel, setSel] = useState<string[]>([]);
  const { spawnSparkles } = useAnimations();

  function toggle(label: string, e: React.MouseEvent) {
    setSel((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
    spawnSparkles(e);
  }

  return (
    <div className="screen-in-anim flex flex-col items-center w-full">
      <Progress total={8} current={3} />
      <span className="emoji-float-anim text-6xl mb-5" style={{ filter: "drop-shadow(0 4px 12px rgba(56,189,248,.3))" }}>
        ✨
      </span>
      <h2 className="text-xl font-extrabold mb-2 bg-gradient-to-r from-sky-700 to-cyan-500 bg-clip-text text-transparent">
        Ямар аяллаар явмаар байна?
      </h2>
      <p className="text-ink-s text-[15px] mb-6">Нэг буюу хэд хэдийг сонгоорой 🌏</p>

      <div className="grid grid-cols-2 gap-2.5 w-full max-w-[340px]">
        {ACTIVITIES.map((a) => {
          const isSel = sel.includes(a.label);
          return (
            <button
              key={a.label}
              onClick={(e) => toggle(a.label, e)}
              className={`py-3.5 px-2 rounded-[16px] font-semibold text-[13.5px] text-center flex flex-col items-center gap-1.5
                transition-all duration-200 text-ink
                ${isSel
                  ? "border-2 border-sky-500 bg-sky-50 shadow-[0_4px_14px_rgba(56,189,248,.18)] scale-[1.04]"
                  : "border border-sky-200 bg-white hover:border-sky-300 hover:bg-sky-50 hover:-translate-y-0.5"
                }`}
            >
              <span className="text-[26px]">{a.icon}</span>
              {a.label}
              <small className="text-[11px] text-ink-s">{a.sub}</small>
            </button>
          );
        })}
      </div>

      <button
        disabled={sel.length === 0}
        onClick={() => sel.length > 0 && onNext(sel)}
        className={`w-full max-w-[300px] mt-5 py-3.5 rounded-[18px] border-none font-bold text-[16px]
          transition-all duration-200
          ${sel.length > 0
            ? "bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-[0_6px_20px_rgba(56,189,248,.28)] hover:-translate-y-0.5 cursor-pointer"
            : "bg-slate-200 text-ink-s cursor-default opacity-70"
          }`}
      >
        Үргэлжлүүлэх →
      </button>
    </div>
  );
}
