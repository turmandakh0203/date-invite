"use client";
import { useState } from "react";
import { PACKING_ITEMS } from "@/lib/data";
import { useAnimations } from "@/lib/animations";
import Progress from "./Progress";

interface Props {
  onNext: (items: string[]) => void;
}

export default function ScreenPacking({ onNext }: Props) {
  const [checked, setChecked] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const { spawnSparkles } = useAnimations();

  function toggle(item: string, e: React.MouseEvent) {
    setChecked((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
    spawnSparkles(e);
  }

  function addCustomItem() {
    const value = custom.trim();
    if (!value || checked.includes(value)) return;
    setChecked((prev) => [...prev, value]);
    setCustom("");
  }

  return (
    <div className="screen-in-anim flex flex-col items-center w-full">
      <Progress total={8} current={7} />
      <span className="emoji-float-anim text-6xl mb-5" style={{ filter: "drop-shadow(0 4px 12px rgba(56,189,248,.3))" }}>
        🎒
      </span>
      <h2 className="text-xl font-extrabold mb-2 bg-gradient-to-r from-sky-700 to-cyan-500 bg-clip-text text-transparent">
        Аяллын цүнх бэлдэцгээе
      </h2>
      <p className="text-ink-s text-[15px] mb-6">Аяллынхаа чухал зүйлсийг тэмдэглэн бэлэн болгоорой.</p>

      <div className="grid gap-2 w-full max-w-[340px]">
        {PACKING_ITEMS.map((item) => {
          const isChecked = checked.includes(item);
          return (
            <button
              key={item}
              onClick={(e) => toggle(item, e)}
              className={`w-full rounded-[16px] border p-4 text-left flex items-center gap-3 transition-all duration-200 ${
                isChecked
                  ? "border-sky-500 bg-sky-50 shadow-[0_10px_24px_rgba(56,189,248,.14)]"
                  : "border-sky-200 bg-white hover:border-sky-300 hover:bg-sky-50"
              }`}
            >
              <span className={`text-xl ${isChecked ? "text-sky-600" : "text-ink"}`}>{isChecked ? "✔️" : "▫️"}</span>
              <span className="font-semibold text-ink">{item}</span>
            </button>
          );
        })}
      </div>

      <div className="w-full max-w-[340px] mt-4 flex flex-col gap-3">
        <label className="block text-sm font-semibold text-ink">Өөр зүйл нэмэх</label>
        <div className="flex gap-2">
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Жишээ нь: аяллын гар утас, нарны тос"
            className="flex-1 rounded-[16px] border border-sky-200 bg-white px-4 py-3 text-sm text-ink outline-none transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
          <button
            type="button"
            onClick={addCustomItem}
            className="rounded-[16px] bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-sky-600"
          >
            Нэмэх
          </button>
        </div>
      </div>

      <button
        disabled={checked.length === 0}
        onClick={() => checked.length > 0 && onNext(checked)}
        className={`w-full max-w-[300px] mt-5 py-3.5 rounded-[18px] border-none font-bold text-[16px] ${
          checked.length > 0
            ? "bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-[0_6px_20px_rgba(56,189,248,.28)] hover:-translate-y-0.5 cursor-pointer"
            : "bg-slate-200 text-ink-s cursor-default opacity-70"
        }`}
      >
        Цүнх бэлдэж дуусаа! →
      </button>
    </div>
  );
}
