"use client";
import { useEffect, useRef, useState } from "react";
import {
  SavedTrip, DayEntry, Photo,
  loadJournal, saveJournalEntry, uploadPhoto, deletePhoto,
} from "@/lib/api";

const MOODS  = ["🤩", "😊", "😎", "😌", "🥲", "😴", "😤", "🤔"];
const MAX_PH = 6;

interface Props {
  trip: SavedTrip;
  userId: string;
  onBack: () => void;
}

export default function ScreenJournal({ trip, userId, onBack }: Props) {
  const [journal, setJournal]         = useState<(DayEntry | null)[]>(Array(trip.days).fill(null));
  const [loadingJ, setLoadingJ]       = useState(true);
  const [activeDay, setActiveDay]     = useState(0);
  const [saveStatus, setSaveStatus]   = useState<"idle" | "saving" | "saved">("idle");
  const [uploading, setUploading]     = useState(false);
  const [showPacking, setShowPacking] = useState(false);
  const fileRef   = useRef<HTMLInputElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadJournal(trip.id, trip.days)
      .then(setJournal)
      .finally(() => setLoadingJ(false));
  }, [trip.id, trip.days]);

  function getEntry(i: number): DayEntry {
    return journal[i] ?? { note: "", photos: [], mood: "" };
  }

  function patchEntry(i: number, changes: Partial<DayEntry>) {
    setJournal(prev => {
      const next = [...prev];
      next[i] = { ...getEntry(i), ...changes };
      return next;
    });
    if (!("photos" in changes)) {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setSaveStatus("saving");
      saveTimer.current = setTimeout(async () => {
        try {
          const current = { ...getEntry(i), ...changes };
          const entryId = await saveJournalEntry(trip.id, i, current);
          setJournal(prev => {
            const next = [...prev];
            if (next[i]) next[i] = { ...next[i]!, id: entryId };
            return next;
          });
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        } catch { setSaveStatus("idle"); }
      }, 900);
    }
  }

  async function handleFiles(files: FileList) {
    const entry = getEntry(activeDay);
    if (entry.photos.length >= MAX_PH) return;
    setUploading(true);
    try {
      const entryId = entry.id ?? await saveJournalEntry(trip.id, activeDay, entry);
      if (!entry.id) {
        setJournal(prev => {
          const next = [...prev];
          next[activeDay] = { ...getEntry(activeDay), id: entryId };
          return next;
        });
      }
      const remaining = MAX_PH - entry.photos.length;
      for (const file of Array.from(files).slice(0, remaining)) {
        const photo = await uploadPhoto(file, trip.id, activeDay, entryId, userId);
        setJournal(prev => {
          const next = [...prev];
          const e = next[activeDay] ?? { id: entryId, note: "", photos: [], mood: "" };
          next[activeDay] = { ...e, photos: [...e.photos, photo] };
          return next;
        });
      }
    } catch (e) { console.error("Photo upload failed", e); }
    finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDeletePhoto(photo: Photo) {
    try {
      await deletePhoto(photo);
      setJournal(prev => {
        const next = [...prev];
        const e = next[activeDay];
        if (e) next[activeDay] = { ...e, photos: e.photos.filter(p => p.id !== photo.id) };
        return next;
      });
    } catch { /* ignore */ }
  }

  const dayEntry = getEntry(activeDay);
  const itinLine = trip.itinerary[activeDay] || "";

  return (
    <div className="screen-in-anim flex flex-col w-full">
      {/* Trip summary */}
      <div className="rounded-[16px] p-4 mb-4 border border-sky-200"
           style={{ background: "linear-gradient(135deg,#EFF6FF,#F0F9FF)" }}>
        <div className="font-bold text-ink text-[15px]">✈️ {trip.route}</div>
        <div className="text-ink-s text-[12px] mt-0.5">
          📅 {trip.date} · {trip.days} өдөр · 🕐 {trip.time}
        </div>
      </div>

      {loadingJ ? (
        <div className="flex items-center justify-center py-8 gap-2 text-ink-s text-[14px]">
          <span className="animate-pulse text-2xl">📝</span> Тэмдэглэл ачаалж байна...
        </div>
      ) : (
        <>
          {/* Day tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
            {Array.from({ length: trip.days }, (_, i) => {
              const e = getEntry(i);
              return (
                <button key={i} onClick={() => setActiveDay(i)}
                  className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-bold transition-all duration-200
                    ${activeDay === i
                      ? "bg-sky-500 text-white shadow-[0_2px_8px_rgba(14,165,233,.3)]"
                      : "bg-sky-50 text-sky-600 border border-sky-200 hover:bg-sky-100"}`}
                >
                  {i + 1}-р өдөр
                  {e.mood && <span className="text-base leading-none">{e.mood}</span>}
                  {!e.mood && (e.note.trim() || e.photos.length > 0) && (
                    <span className={`w-1.5 h-1.5 rounded-full ${activeDay === i ? "bg-white" : "bg-sky-400"}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active day */}
          <div className="flex flex-col gap-4 w-full">

            {/* ── Өдрийн төлөвлөгөө ── */}
            <div className="rounded-[16px] border border-sky-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-sky-500">
                <span className="text-white text-base">📋</span>
                <span className="text-[12px] font-bold text-white uppercase tracking-widest">
                  {activeDay + 1}-р өдрийн төлөвлөгөө
                </span>
              </div>
              <div className="px-4 py-3 bg-sky-50">
                {itinLine ? (
                  <p className="text-[14px] text-ink leading-relaxed">{itinLine}</p>
                ) : (
                  <p className="text-[13px] text-ink-s italic">Аяллын хуваарь бичигдээгүй байна</p>
                )}
              </div>
            </div>

            {/* ── Mood ── */}
            <div>
              <div className="text-[11px] font-bold text-ink-s uppercase tracking-widest mb-2">
                Өдрийн мэдрэмж
              </div>
              <div className="flex gap-2 flex-wrap">
                {MOODS.map(m => (
                  <button key={m}
                    onClick={() => patchEntry(activeDay, { mood: dayEntry.mood === m ? "" : m })}
                    className={`w-10 h-10 rounded-full text-xl flex items-center justify-center transition-all duration-150
                      ${dayEntry.mood === m
                        ? "bg-sky-100 ring-2 ring-sky-400 scale-110 shadow-sm"
                        : "bg-slate-50 hover:bg-sky-50 hover:scale-105"}`}
                  >{m}</button>
                ))}
              </div>
            </div>

            {/* ── Тэмдэглэл ── */}
            <div>
              <div className="text-[11px] font-bold text-ink-s uppercase tracking-widest mb-2">
                Тэмдэглэл
              </div>
              <textarea
                value={dayEntry.note}
                onChange={(e) => patchEntry(activeDay, { note: e.target.value })}
                placeholder={`${activeDay + 1}-р өдрийн дурсамж, сонирхолтой зүйлсээ бич...`}
                rows={4}
                className="w-full rounded-[16px] border border-sky-200 bg-white p-4 text-sm text-ink
                           resize-none outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100
                           transition-all duration-200"
              />
            </div>

            {/* ── Зургууд ── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] font-bold text-ink-s uppercase tracking-widest">Зургууд</div>
                <span className="text-[11px] text-ink-s">{dayEntry.photos.length}/{MAX_PH}</span>
              </div>
              {dayEntry.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {dayEntry.photos.map((photo) => (
                    <div key={photo.id}
                         className="relative aspect-square rounded-[12px] overflow-hidden group bg-sky-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => handleDeletePhoto(photo)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/55 text-white
                                   flex items-center justify-center text-[11px] font-bold
                                   opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/75">✕</button>
                    </div>
                  ))}
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                     onChange={(e) => e.target.files && handleFiles(e.target.files)} />
              <button
                disabled={dayEntry.photos.length >= MAX_PH || uploading}
                onClick={() => fileRef.current?.click()}
                className={`w-full py-3 rounded-[16px] border-2 border-dashed font-semibold text-[14px]
                            flex items-center justify-center gap-2 transition-all duration-200
                            ${dayEntry.photos.length >= MAX_PH
                              ? "border-slate-200 text-slate-300 cursor-not-allowed"
                              : "border-sky-200 text-sky-600 hover:border-sky-400 hover:bg-sky-50 cursor-pointer"}`}
              >
                {uploading ? <><span className="animate-pulse text-xl">⏳</span> Upload хийж байна...</>
                : dayEntry.photos.length >= MAX_PH ? <><span className="text-xl">📷</span> Дүүрсэн байна</>
                : <><span className="text-xl">📷</span> Зураг нэмэх</>}
              </button>
            </div>

            {/* ── Авах зүйлс (collapsible) ── */}
            {trip.packing.length > 0 && (
              <div className="rounded-[16px] border border-sky-200 overflow-hidden">
                <button
                  onClick={() => setShowPacking(v => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-sky-50 transition-colors"
                >
                  <div className="flex items-center gap-2 font-bold text-[14px] text-ink">
                    <span>🎒</span>
                    Авах зүйлс
                    <span className="ml-1 text-[12px] font-normal text-ink-s">
                      ({trip.packing.length} зүйл)
                    </span>
                  </div>
                  <span className="text-ink-s text-[13px]">{showPacking ? "▲" : "▼"}</span>
                </button>
                {showPacking && (
                  <div className="px-4 pb-4 pt-2 bg-sky-50 border-t border-sky-100 flex flex-wrap gap-2">
                    {trip.packing.map(item => (
                      <span key={item}
                            className="rounded-full bg-white border border-sky-200 px-3 py-1 text-[13px] text-sky-700 font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auto-save indicator */}
          <div className="mt-4 text-center text-[12px] h-5">
            {saveStatus === "saving" && <span className="text-ink-s">Хадгалж байна...</span>}
            {saveStatus === "saved"  && <span className="text-green-500 font-medium">✓ Хадгалагдлаа</span>}
          </div>
        </>
      )}
    </div>
  );
}
