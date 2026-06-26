"use client";
import { useState } from "react";
import { ROUTE_OPTIONS } from "@/lib/data";
import { useAnimations } from "@/lib/animations";
import Progress from "./Progress";

interface Props {
  onNext: (route: string) => void;
}

export default function ScreenRoute({ onNext }: Props) {
  const [sel, setSel] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const { spawnSparkles } = useAnimations();

  function toggle(label: string, e: React.MouseEvent) {
    setSel(prev =>
      prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label]
    );
    spawnSparkles(e);
  }

  const canNext = sel.length > 0 || custom.trim().length > 0;

  function handleNext() {
    const combined = [
      ...sel,
      ...(custom.trim() ? [custom.trim()] : []),
    ].join(", ");
    onNext(combined);
  }

  return (
    <div className="screen-in-anim flex flex-col items-center w-full">
      <Progress total={8} current={5} />
      <span className="emoji-float-anim text-6xl mb-5" style={{ filter: "drop-shadow(0 4px 12px rgba(56,189,248,.3))" }}>
        🗺️
      </span>
      <h2 className="text-xl font-extrabold mb-2 bg-gradient-to-r from-sky-700 to-cyan-500 bg-clip-text text-transparent">
        Ямар маршрутаар аялах вэ?
      </h2>
      <p className="text-ink-s text-[15px] mb-6">Нэг буюу хэд хэдийг сонгоорой, эсвэл өөрийн маршрутыг бичнэ үү.</p>

      <div className="grid gap-3 w-full max-w-[340px]">
        {ROUTE_OPTIONS.map((route) => {
          const isSel = sel.includes(route.label);
          return (
            <button
              key={route.label}
              onClick={(e) => toggle(route.label, e)}
              className={`w-full rounded-[18px] border p-4 text-left transition-all duration-200 ${
                isSel
                  ? "border-sky-500 bg-sky-50 shadow-[0_10px_24px_rgba(56,189,248,.14)]"
                  : "border-sky-200 bg-white hover:border-sky-300 hover:bg-sky-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{route.icon}</span>
                <div className="flex-1">
                  <div className={`font-bold ${isSel ? "text-sky-600" : "text-ink"}`}>{route.label}</div>
                  <div className="text-[13px] text-ink-s mt-1">{route.sub}</div>
                </div>
                {isSel && (
                  <span className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-white text-[13px] font-bold shrink-0">
                    ✓
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="w-full max-w-[340px] mt-5">
        <label className="block mb-2 text-sm font-semibold text-ink">Өөрийн маршрутыг нэмэх</label>
        <textarea
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Жишээ нь: 1-р өдөр хоттой танилцах, 2-р өдөр ууланд алхах..."
          className="w-full min-h-[96px] rounded-[16px] border border-sky-200 bg-white p-4 text-sm text-ink resize-none outline-none transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <button
        disabled={!canNext}
        onClick={handleNext}
        className={`w-full max-w-[300px] mt-5 py-3.5 rounded-[18px] border-none font-bold text-[16px] ${
          canNext
            ? "bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-[0_6px_20px_rgba(56,189,248,.28)] hover:-translate-y-0.5 cursor-pointer"
            : "bg-slate-200 text-ink-s cursor-default opacity-70"
        }`}
      >
        Дараагийн алхам →
      </button>
    </div>
  );
}
