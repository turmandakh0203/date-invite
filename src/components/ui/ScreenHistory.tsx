"use client";
import { useEffect, useState } from "react";
import { loadTrips, deleteTrip, SavedTrip } from "@/lib/storage";

interface Props {
  onOpen: (trip: SavedTrip) => void;
  onBack: () => void;
}

function fmtSaved(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

function journalProgress(trip: SavedTrip) {
  const filled = trip.journal.filter(Boolean).length;
  return { filled, total: trip.days };
}

export default function ScreenHistory({ onOpen, onBack }: Props) {
  const [trips, setTrips] = useState<SavedTrip[]>([]);

  useEffect(() => { setTrips(loadTrips()); }, []);

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Энэ аяллыг устгах уу?")) return;
    deleteTrip(id);
    setTrips(loadTrips());
  }

  return (
    <div className="screen-in-anim flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-3xl">📖</span>
        <h2 className="text-xl font-extrabold bg-gradient-to-r from-sky-700 to-cyan-500 bg-clip-text text-transparent">
          Аяллын түүх
        </h2>
      </div>

      {trips.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center py-10 text-center">
          <span className="text-6xl mb-4">🧳</span>
          <p className="font-bold text-ink text-[15px]">Аялал хадгалагдаагүй байна</p>
          <p className="text-ink-s text-[13px] mt-1 max-w-[240px]">
            Аялал төлөвлөж дуусаад автоматаар энд хадгалагдана.
          </p>
        </div>
      ) : (
        <div className="space-y-3 w-full max-h-[420px] overflow-y-auto pr-1">
          {trips.map((trip) => {
            const moods = trip.journal
              .filter(Boolean)
              .map(j => j!.mood)
              .filter(Boolean);
            const { filled, total } = journalProgress(trip);

            return (
              <button
                key={trip.id}
                onClick={() => onOpen(trip)}
                className="w-full text-left rounded-[18px] border border-sky-200 bg-white p-4
                           hover:border-sky-400 hover:shadow-[0_4px_16px_rgba(14,165,233,.1)]
                           transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">✈️</span>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-ink text-[15px] truncate">{trip.route}</div>
                    <div className="text-ink-s text-[12px] mt-0.5">
                      {trip.date} · {trip.days} өдөр · {trip.time}
                    </div>

                    {/* Mood strip */}
                    {moods.length > 0 && (
                      <div className="flex gap-0.5 mt-1.5">
                        {moods.slice(0, 7).map((m, i) => (
                          <span key={i} className="text-[16px]">{m}</span>
                        ))}
                      </div>
                    )}

                    {/* Journal progress */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex-1 h-1.5 rounded-full bg-sky-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full transition-all"
                          style={{ width: `${(filled / total) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-ink-s font-medium shrink-0">
                        {filled}/{total} өдөр
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[11px] text-ink-s">{fmtSaved(trip.savedAt)}</span>
                    <button
                      onClick={(e) => handleDelete(trip.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-[11px] text-red-400
                                 hover:text-red-600 px-2 py-0.5 rounded-full hover:bg-red-50
                                 transition-all duration-200"
                    >
                      Устгах
                    </button>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={onBack}
        className="w-full mt-6 py-3.5 rounded-[18px] font-bold text-[15px] text-white cursor-pointer
                   bg-gradient-to-br from-sky-500 to-cyan-500
                   shadow-[0_6px_20px_rgba(56,189,248,.28)]
                   hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(56,189,248,.38)]
                   transition-all duration-200"
      >
        ✈️ Шинэ аялал төлөвлөх
      </button>
    </div>
  );
}
