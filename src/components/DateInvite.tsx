"use client";
import { useEffect, useState } from "react";
import { useAnimations } from "@/lib/animations";
import { saveTrip, loadTrips, SavedTrip } from "@/lib/storage";
import HeartsBackground  from "./ui/HeartsBackground";
import ScreenInvite      from "./ui/ScreenInvite";
import ScreenDate        from "./ui/ScreenDate";
import ScreenActivity    from "./ui/ScreenActivity";
import ScreenTime        from "./ui/ScreenTime";
import ScreenRoute       from "./ui/ScreenRoute";
import ScreenPacking     from "./ui/ScreenPacking";
import ScreenConfirm     from "./ui/ScreenConfirm";
import ScreenItinerary   from "./ui/ScreenItinerary";
import ScreenHistory     from "./ui/ScreenHistory";
import ScreenJournal     from "./ui/ScreenJournal";

type Step =
  | "invite" | "date" | "activity" | "time"
  | "route"  | "itinerary" | "packing" | "confirm"
  | "history" | "journal";

const PLAN_STEPS: Step[] = [
  "invite", "date", "activity", "time",
  "route", "itinerary", "packing", "confirm",
];

export default function DateInvite() {
  const [step, setStep]             = useState<Step>("invite");
  const [date, setDate]             = useState("");
  const [days, setDays]             = useState(2);
  const [acts, setActs]             = useState<string[]>([]);
  const [time, setTime]             = useState("");
  const [route, setRoute]           = useState("");
  const [itinerary, setItinerary]   = useState<string[]>([]);
  const [packing, setPacking]       = useState<string[]>([]);
  const [savedTrip, setSavedTrip]   = useState<SavedTrip | null>(null);
  const [journalTrip, setJournalTrip] = useState<SavedTrip | null>(null);
  const [tripCount, setTripCount]   = useState(0);
  const { launchConfetti } = useAnimations();

  useEffect(() => { setTripCount(loadTrips().length); }, []);

  function goBack() {
    if (step === "journal") { setStep("history"); return; }
    if (step === "history") { setStep("invite");  return; }
    setStep(prev => {
      const i = PLAN_STEPS.indexOf(prev);
      return i > 0 ? PLAN_STEPS[i - 1] : prev;
    });
  }

  function handleDate(selectedDate: string, duration: number) {
    setDate(selectedDate);
    setDays(duration);
    setStep("activity");
  }

  function handlePacking(items: string[]) {
    setPacking(items);
    const trip = saveTrip({ date, days, time, acts, route, itinerary, packing: items });
    setSavedTrip(trip);
    setTripCount(c => c + 1);
    setStep("confirm");
    setTimeout(() => launchConfetti(), 600);
  }

  function openJournal(trip: SavedTrip) {
    setJournalTrip(trip);
    setStep("journal");
  }

  const showBack = step !== "invite";

  return (
    <>
      <HeartsBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px]">
          <div
            className="card-shimmer relative"
            style={{
              background: "rgba(255,255,255,.94)",
              backdropFilter: "blur(18px)",
              border: "1.5px solid rgba(56,189,248,.2)",
              borderRadius: 28,
              padding: "2.5rem 2rem 2rem",
              minHeight: 520,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 48px rgba(14,165,233,.14), 0 2px 12px rgba(14,165,233,.08)",
            }}
          >
            {/* Back button */}
            {showBack && (
              <button
                type="button"
                onClick={goBack}
                className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full
                           border border-sky-200 bg-white/90 px-2.5 py-1.5
                           text-sm font-semibold text-sky-700 shadow-sm
                           hover:bg-sky-50 transition"
              >
                ← Буцах
              </button>
            )}

            {/* History button — shown only on invite screen when trips exist */}
            {step === "invite" && tripCount > 0 && (
              <button
                type="button"
                onClick={() => setStep("history")}
                className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full
                           border border-sky-200 bg-white/90 px-2.5 py-1.5
                           text-sm font-semibold text-sky-700 shadow-sm
                           hover:bg-sky-50 transition"
              >
                📖 Түүх
              </button>
            )}

            {/* ── Screens ── */}
            {step === "invite"    && <ScreenInvite    onYes={() => setStep("date")} />}
            {step === "date"      && <ScreenDate      onNext={handleDate} />}
            {step === "activity"  && <ScreenActivity  onNext={(a) => { setActs(a); setStep("time"); }} />}
            {step === "time"      && <ScreenTime      onNext={(t) => { setTime(t); setStep("route"); }} />}
            {step === "route"     && <ScreenRoute     onNext={(r) => { setRoute(r); setStep("itinerary"); }} />}
            {step === "itinerary" && <ScreenItinerary days={days} onNext={(items) => { setItinerary(items); setStep("packing"); }} />}
            {step === "packing"   && <ScreenPacking   onNext={handlePacking} />}
            {step === "confirm"   && (
              <ScreenConfirm
                date={date} days={days} time={time}
                acts={acts} route={route}
                itinerary={itinerary} packing={packing}
                onJournal={() => savedTrip && openJournal(savedTrip)}
              />
            )}
            {step === "history" && (
              <ScreenHistory
                onOpen={openJournal}
                onBack={() => setStep("invite")}
              />
            )}
            {step === "journal" && journalTrip && (
              <ScreenJournal
                trip={journalTrip}
                onBack={() => setStep("history")}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
