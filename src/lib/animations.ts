"use client";
import { useCallback } from "react";
import { SPARKLE_EMOJIS, CONFETTI_EMOJIS } from "./data";

export function useAnimations() {
  // Sparkle burst on click
  const spawnSparkles = useCallback((e: React.MouseEvent) => {
    const cx = e.clientX;
    const cy = e.clientY;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const s = document.createElement("div");
        s.className = "sparkle-pop";
        s.textContent = SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)];
        s.style.cssText = `
          left: ${cx + (Math.random() - 0.5) * 80}px;
          top:  ${cy + (Math.random() - 0.5) * 60}px;
          font-size: 18px;
        `;
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 800);
      }, i * 60);
    }
  }, []);

  // Ripple inside button
  const spawnRipple = useCallback((el: HTMLElement, e: React.MouseEvent) => {
    const r = document.createElement("div");
    r.className = "ripple-el";
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top:  ${e.clientY - rect.top  - size / 2}px;
    `;
    el.appendChild(r);
    setTimeout(() => r.remove(), 700);
  }, []);

  // Confetti rain
  const launchConfetti = useCallback(() => {
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const c = document.createElement("div");
        c.style.cssText = `
          position: fixed;
          top: -30px;
          left: ${Math.random() * 100}vw;
          font-size: ${18 + Math.random() * 16}px;
          z-index: 999;
          pointer-events: none;
          animation: floatUp ${2.5 + Math.random() * 2}s ease forwards;
          opacity: 0;
        `;
        c.textContent = CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)];
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 4500);
      }, i * 80);
    }
  }, []);

  return { spawnSparkles, spawnRipple, launchConfetti };
}
