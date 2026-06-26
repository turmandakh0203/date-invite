"use client";
import { useRef } from "react";
import { useAnimations } from "@/lib/animations";

interface Props {
  onYes: (e: React.MouseEvent) => void;
}

export default function ScreenInvite({ onYes }: Props) {
  const { spawnSparkles, spawnRipple } = useAnimations();
  const yesRef = useRef<HTMLButtonElement>(null);

  function handleYes(e: React.MouseEvent) {
    spawnSparkles(e);
    if (yesRef.current) spawnRipple(yesRef.current, e);
    setTimeout(() => onYes(e), 180);
  }

  return (
    <div className="screen-in-anim flex flex-col items-center w-full">
      <span className="emoji-float-anim text-6xl mb-5 drop-shadow-lg" style={{ filter: "drop-shadow(0 4px 12px rgba(56,189,248,.3))" }}>
        🌍
      </span>
      <h1 className="text-2xl font-extrabold mb-2 leading-tight text-center bg-gradient-to-r from-sky-700 to-cyan-500 bg-clip-text text-transparent">
        Аяллын төлөвлөгөө гаргацгаая!
      </h1>
      <p className="text-ink-s text-[15px] mb-8 leading-relaxed max-w-[300px] text-center">
        Надтай хамт аялахдаа бэлэн үү?🧳
      </p>

      <button
        ref={yesRef}
        onClick={handleYes}
        className="relative overflow-hidden w-full max-w-[300px] py-4 rounded-[18px] border-none
                   bg-gradient-to-br from-sky-500 to-cyan-500 text-white font-bold text-[17px]
                   shadow-[0_6px_24px_rgba(56,189,248,.35)] transition-all duration-150
                   hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(56,189,248,.45)]
                   active:scale-[.97]"
      >
        <span className="relative z-10">Okay let's goooooo! 🧳</span>
        <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      </button>
    </div>
  );
}
