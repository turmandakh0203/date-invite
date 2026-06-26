"use client";
import { TIME_OPTIONS } from "@/lib/data";
import { useAnimations } from "@/lib/animations";
import Progress from "./Progress";

interface Props {
  onNext: (time: string) => void;
}

export default function ScreenTime({ onNext }: Props) {
  const { spawnSparkles } = useAnimations();

  function pick(time: string, e: React.MouseEvent) {
    spawnSparkles(e);
    setTimeout(() => onNext(time), 200);
  }

  return (
    <div className="screen-in-anim flex flex-col items-center w-full">
      <Progress total={8} current={4} />
      <span className="emoji-float-anim text-6xl mb-5" style={{ filter: "drop-shadow(0 4px 12px rgba(56,189,248,.3))" }}>
        🕐
      </span>
      <h2 className="text-xl font-extrabold mb-2 bg-gradient-to-r from-sky-700 to-cyan-500 bg-clip-text text-transparent">
        Аялал хэдэн цагт эхэлнэ?
      </h2>
      <p className="text-ink-s text-[15px] mb-6">Хамгийн тохиромжтой цагаа сонгоорой ⏰</p>

      <div className="grid grid-cols-2 gap-2.5 w-full max-w-[340px]">
        {TIME_OPTIONS.map((t) => (
          <button
            key={t.time}
            onClick={(e) => pick(t.time, e)}
            className="py-3.5 px-2 rounded-[16px] font-semibold text-[13.5px] text-center flex flex-col items-center gap-1.5
              border border-sky-200 bg-white text-ink
              hover:border-sky-300 hover:bg-sky-50 hover:-translate-y-0.5
              transition-all duration-200"
          >
            <span className="text-[26px]">{t.icon}</span>
            {t.time}
            <small className="text-[11px] text-ink-s">{t.sub}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
