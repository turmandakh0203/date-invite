"use client";
import { useState } from "react";

interface Props {
  date: string;
  days: number;
  time: string;
  acts: string[];
  route: string;
  itinerary: string[];
  packing: string[];
  onSave: () => Promise<void>;
  onJournal?: () => void;
}

type SaveState = "idle" | "saving" | "saved" | "error";

export default function ScreenConfirm({ date, days, time, acts, route, itinerary, packing, onSave, onJournal }: Props) {
  const [saveState, setSaveState] = useState<SaveState>("idle");

  async function handleSave() {
    setSaveState("saving");
    try {
      await onSave();
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <div className="screen-in-anim flex flex-col items-center w-full">
      <div className="confetti-anim text-3xl mb-4">🎉🧳🌍✨✈️</div>

      <span className="inline-block px-4 py-1.5 rounded-full text-white font-bold text-xs tracking-wider mb-5
                       bg-gradient-to-br from-sky-500 to-cyan-500 shadow-[0_4px_12px_rgba(56,189,248,.3)]">
        АЯЛАЛ БАТАЛГААЖЛАА!
      </span>

      <h1 className="text-2xl font-extrabold mb-5 bg-gradient-to-r from-sky-700 to-cyan-500 bg-clip-text text-transparent">
        Манай аялал 🌍
      </h1>

      {/* Main summary */}
      <div className="w-full max-w-[320px] rounded-[20px] p-5 mb-4 text-left border border-sky-200"
           style={{ background: "linear-gradient(135deg,#EFF6FF,#F0F9FF)" }}>
        {[
          { icon: "📅", label: "Эхлэх өдөр",        value: date },
          { icon: "🧭", label: "Маршрут",             value: route },
          { icon: "📆", label: "Үргэлжлэх хугацаа",  value: `${days} өдөр` },
          { icon: "🕐", label: "Эхлэх цаг",          value: time },
          { icon: "🌟", label: "Аяллын төрөл",       value: acts.join(", ") },
        ].map((row, i, arr) => (
          <div key={row.label}
               className={`flex items-center gap-3 py-2 text-[14px] text-ink-m ${i < arr.length - 1 ? "border-b border-sky-100" : ""}`}>
            <span className="text-[18px] w-6 text-center">{row.icon}</span>
            {row.label}
            <strong className="ml-auto text-ink font-bold text-[13.5px] text-right max-w-[160px]">{row.value}</strong>
          </div>
        ))}
      </div>

      {/* Itinerary */}
      <div className="w-full max-w-[320px] rounded-[20px] p-5 mb-4 text-left border border-sky-200 bg-white shadow-sm">
        <div className="font-semibold text-ink mb-3">📍 Өдрийн хуваарь</div>
        <div className="space-y-2 text-[14px] text-ink-m">
          {itinerary.map((line, i) => (
            <div key={i} className="flex gap-2">
              <span className="w-5 text-center font-bold text-sky-500 shrink-0">{i + 1}.</span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Packing */}
      <div className="w-full max-w-[320px] rounded-[20px] p-5 mb-6 text-left border border-sky-200 bg-white shadow-sm">
        <div className="font-semibold text-ink mb-3">🎒 Авах зүйлс</div>
        <div className="flex flex-wrap gap-2">
          {packing.map((item) => (
            <span key={item} className="rounded-full bg-sky-100 px-3 py-1 text-[13px] text-sky-700 font-medium">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="w-full max-w-[320px] flex flex-col gap-3 pb-2">

        {/* Save button */}
        {saveState !== "saved" && (
          <button
            onClick={handleSave}
            disabled={saveState === "saving"}
            className={`w-full py-3.5 rounded-[18px] font-bold text-[15px] flex items-center justify-center gap-2
                        transition-all duration-200
                        ${saveState === "saving"
                          ? "bg-sky-300 text-white cursor-not-allowed"
                          : saveState === "error"
                          ? "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
                          : "bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-[0_6px_20px_rgba(56,189,248,.28)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(56,189,248,.38)] cursor-pointer"
                        }`}
          >
            {saveState === "saving" ? (
              <><span className="animate-pulse text-xl">💾</span> Хадгалж байна...</>
            ) : saveState === "error" ? (
              <><span className="text-xl">⚠️</span> Алдаа гарлаа — дахин оролдох</>
            ) : (
              <><span className="text-xl">💾</span> Аяллыг хадгалах</>
            )}
          </button>
        )}

        {/* Saved confirmation */}
        {saveState === "saved" && (
          <div className="w-full py-3.5 rounded-[18px] font-bold text-[15px]
                          bg-green-50 border border-green-200 text-green-700
                          flex items-center justify-center gap-2">
            <span className="text-xl">✅</span>
            Аялал амжилттай хадгалагдлаа
          </div>
        )}

        {/* Journal button — зөвхөн хадгалсны дараа харуулна */}
        {saveState === "saved" && onJournal && (
          <button
            onClick={onJournal}
            className="w-full py-3.5 rounded-[18px] font-bold text-[15px] text-white
                       bg-gradient-to-br from-sky-500 to-cyan-500
                       shadow-[0_6px_20px_rgba(56,189,248,.28)]
                       hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(56,189,248,.38)]
                       transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-xl">📖</span>
            Аяллын тэмдэглэл нэмэх
          </button>
        )}
      </div>
    </div>
  );
}
