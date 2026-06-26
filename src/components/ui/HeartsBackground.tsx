"use client";
import { useEffect, useRef } from "react";
import { BG_EMOJIS } from "@/lib/data";

export default function HeartsBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = ref.current;
    if (!bg) return;
    for (let i = 0; i < 18; i++) {
      const h = document.createElement("div");
      h.className = "heart-float";
      h.textContent = BG_EMOJIS[Math.floor(Math.random() * BG_EMOJIS.length)];
      const dur   = 8 + Math.random() * 10;
      const delay = Math.random() * 12;
      h.style.cssText = `
        left: ${Math.random() * 100}%;
        bottom: ${-5 + Math.random() * 10}%;
        font-size: ${14 + Math.random() * 14}px;
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
      `;
      bg.appendChild(h);
    }
  }, []);

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />
  );
}
