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
}

export default function ScreenConfirm({ date, days, time, acts, route, itinerary, packing }: Props) {
  const [toast, setToast] = useState<{ msg: string; icon: string } | null>(null);

  const shareText =
    `✈️ Аяллын төлөвлөгөө\n\n` +
    `📅 ${date} (${days} өдөр)\n` +
    `🕐 ${time}\n` +
    `🧭 ${route}\n` +
    `🌟 ${acts.join(", ")}\n\n` +
    `📍 Өдрийн хуваарь:\n${itinerary.map((l, i) => `${i + 1}. ${l}`).join("\n")}\n\n` +
    `🎒 Авах зүйлс:\n${packing.map(p => `• ${p}`).join("\n")}\n\n` +
    `✨ Сайхан аялал! 🌍`;

  function showToast(msg: string, icon: string, ms = 4000) {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), ms);
  }

  function copyToClipboard() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return Promise.resolve();
    return navigator.clipboard.writeText(shareText);
  }

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener");
  }

  function shareTelegram() {
    window.open(
      `https://t.me/share/url?url=&text=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener",
    );
  }

  function shareInstagram() {
    copyToClipboard().then(() => {
      showToast("Текст хуулагдлаа — Instagram DM-д буулгаж илгээгээрэй!", "📋");
      setTimeout(() => {
        window.open("https://www.instagram.com/direct/inbox/", "_blank", "noopener");
      }, 400);
    });
  }

  function handleCopy() {
    copyToClipboard().then(() => showToast("Хуулагдлаа! Дурын чатанд буулгаж илгээгээрэй.", "✅"));
  }

  function shareNative() {
    if (typeof navigator === "undefined") return;
    if (navigator.share) {
      navigator.share({ title: "✈️ Аяллын төлөвлөгөө", text: shareText }).catch(() => {});
    } else {
      handleCopy();
    }
  }

  return (
    <div className="screen-in-anim flex flex-col items-center w-full">
      <div className="confetti-anim text-3xl mb-4">🎉🧳🌍✨✈️</div>

      <span
        className="inline-block px-4 py-1.5 rounded-full text-white font-bold text-xs tracking-wider mb-5
                   bg-gradient-to-br from-sky-500 to-cyan-500
                   shadow-[0_4px_12px_rgba(56,189,248,.3)]"
      >
        АЯЛАЛ БАТАЛГААЖЛАА!
      </span>

      <h1 className="text-2xl font-extrabold mb-5 bg-gradient-to-r from-sky-700 to-cyan-500 bg-clip-text text-transparent">
        Манай аялал 🌍
      </h1>

      {/* Main summary */}
      <div
        className="w-full max-w-[320px] rounded-[20px] p-5 mb-4 text-left border border-sky-200"
        style={{ background: "linear-gradient(135deg,#EFF6FF,#F0F9FF)" }}
      >
        {[
          { icon: "📅", label: "Эхлэх өдөр",       value: date },
          { icon: "🧭", label: "Маршрут",            value: route },
          { icon: "📆", label: "Үргэлжлэх хугацаа", value: `${days} өдөр` },
          { icon: "🕐", label: "Эхлэх цаг",         value: time },
          { icon: "🌟", label: "Аяллын төрөл",      value: acts.join(", ") },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            className={`flex items-center gap-3 py-2 text-[14px] text-ink-m
              ${i < arr.length - 1 ? "border-b border-sky-100" : ""}`}
          >
            <span className="text-[18px] w-6 text-center">{row.icon}</span>
            {row.label}
            <strong className="ml-auto text-ink font-bold text-[13.5px] text-right max-w-[160px]">
              {row.value}
            </strong>
          </div>
        ))}
      </div>

      {/* Itinerary */}
      <div className="w-full max-w-[320px] rounded-[20px] p-5 mb-4 text-left border border-sky-200 bg-white shadow-sm">
        <div className="font-semibold text-ink mb-3">📍 Өдрийн хуваарь</div>
        <div className="space-y-2 text-[14px] text-ink-m">
          {itinerary.map((line, index) => (
            <div key={index} className="flex gap-2">
              <span className="w-5 text-center font-bold text-sky-500 shrink-0">{index + 1}.</span>
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

      {/* ── Share section ── */}
      <div className="w-full max-w-[320px] pb-2">
        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-sky-100" />
          <span className="text-[11px] font-bold text-ink-s uppercase tracking-widest">Найздаа илгээх</span>
          <div className="flex-1 h-px bg-sky-100" />
        </div>

        {/* 3 main messenger buttons */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <button
            onClick={shareWhatsApp}
            style={{
              background: "#25D366",
              boxShadow: "0 4px 16px rgba(37,211,102,.32)",
            }}
            className="flex flex-col items-center gap-1.5 py-4 rounded-[18px]
                       text-white font-bold text-[11.5px]
                       hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(37,211,102,.45)]
                       active:scale-95 transition-all duration-200"
          >
            <svg className="w-7 h-7 mb-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </button>

          <button
            onClick={shareTelegram}
            style={{
              background: "#2AABEE",
              boxShadow: "0 4px 16px rgba(42,171,238,.32)",
            }}
            className="flex flex-col items-center gap-1.5 py-4 rounded-[18px]
                       text-white font-bold text-[11.5px]
                       hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(42,171,238,.45)]
                       active:scale-95 transition-all duration-200"
          >
            <svg className="w-7 h-7 mb-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Telegram
          </button>

          <button
            onClick={shareInstagram}
            style={{
              background: "linear-gradient(135deg,#f58529 0%,#dd2a7b 50%,#8134af 100%)",
              boxShadow: "0 4px 16px rgba(221,42,123,.32)",
            }}
            className="flex flex-col items-center gap-1.5 py-4 rounded-[18px]
                       text-white font-bold text-[11.5px]
                       hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(221,42,123,.45)]
                       active:scale-95 transition-all duration-200"
          >
            <svg className="w-7 h-7 mb-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
            Instagram
          </button>
        </div>

        {/* Copy + Native row */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-3 rounded-[16px]
                       bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-[13px]
                       hover:bg-slate-100 active:scale-95 transition-all duration-200"
          >
            <span className="text-base">📋</span>
            Хуулах
          </button>

          <button
            onClick={shareNative}
            className="flex items-center justify-center gap-2 py-3 rounded-[16px]
                       bg-sky-50 border border-sky-200 text-sky-600 font-semibold text-[13px]
                       hover:bg-sky-100 active:scale-95 transition-all duration-200"
          >
            <span className="text-base">🔗</span>
            Бусад апп
          </button>
        </div>

        {/* Toast notification */}
        {toast && (
          <div className="mt-4 flex items-start gap-2.5 rounded-[16px] border border-sky-200
                          bg-gradient-to-r from-sky-50 to-cyan-50
                          px-4 py-3 text-[13px] text-sky-700 font-medium
                          animate-[screenIn_.3s_ease_both]">
            <span className="text-base shrink-0">{toast.icon}</span>
            <span className="leading-snug">{toast.msg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
