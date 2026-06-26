"use client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useAnimations } from "@/lib/animations";
import { createTrip, SavedTrip } from "@/lib/api";
import HeartsBackground  from "./ui/HeartsBackground";
import ScreenAuth        from "./ui/ScreenAuth";
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
  // ── Auth state ──────────────────────────────────────────────────────────
  const [user, setUser]         = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── App state ───────────────────────────────────────────────────────────
  const [step, setStep]           = useState<Step>("invite");
  const [date, setDate]           = useState("");
  const [days, setDays]           = useState(2);
  const [acts, setActs]           = useState<string[]>([]);
  const [time, setTime]           = useState("");
  const [route, setRoute]         = useState("");
  const [itinerary, setItinerary] = useState<string[]>([]);
  const [packing, setPacking]     = useState<string[]>([]);
  const [savedTrip, setSavedTrip] = useState<SavedTrip | null>(null);
  const [journalTrip, setJournalTrip] = useState<SavedTrip | null>(null);
  const { launchConfetti } = useAnimations();

  // ── Navigation ──────────────────────────────────────────────────────────
  function goBack() {
    if (step === "journal") { setStep("history"); return; }
    if (step === "history") { setStep("invite");  return; }
    setStep(prev => {
      const i = PLAN_STEPS.indexOf(prev);
      return i > 0 ? PLAN_STEPS[i - 1] : prev;
    });
  }

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleDate(d: string, n: number) { setDate(d); setDays(n); setStep("activity"); }

  function handlePacking(items: string[]) {
    setPacking(items);
    setStep("confirm");
    setTimeout(() => launchConfetti(), 600);
  }

  async function handleSaveTrip(items: string[]): Promise<void> {
    const trip = await createTrip({ date, days, time, acts, route, itinerary, packing: items });
    setSavedTrip(trip);
  }

  function openJournal(trip: SavedTrip) {
    setJournalTrip(trip);
    setStep("journal");
  }

  const showBack = step !== "invite";

  // ── Loading ─────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <>
        <HeartsBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <span className="text-4xl animate-pulse">✈️</span>
        </div>
      </>
    );
  }

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
                           text-sm font-semibold text-sky-700 shadow-sm hover:bg-sky-50 transition"
              >
                ← Буцах
              </button>
            )}

            {/* History + Logout buttons on invite screen */}
            {step === "invite" && user && (
              <div className="absolute right-4 top-4 flex items-center gap-2">
                <button
                  onClick={() => setStep("history")}
                  className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-white/90
                             px-2.5 py-1.5 text-sm font-semibold text-sky-700 shadow-sm hover:bg-sky-50 transition"
                >
                  📖 Түүх
                </button>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white/90
                             px-2.5 py-1.5 text-sm font-semibold text-slate-500 shadow-sm hover:bg-slate-50 transition"
                  title="Гарах"
                >
                  ↩
                </button>
              </div>
            )}

            {/* ── Screens ── */}
            {!user ? (
              <ScreenAuth onAuth={() => {}} />
            ) : (
              <>
                {step === "invite"    && <ScreenInvite    onYes={() => setStep("date")} />}
                {step === "date"      && <ScreenDate      onNext={handleDate} />}
                {step === "activity"  && <ScreenActivity  onNext={(a) => { setActs(a); setStep("time"); }} />}
                {step === "time"      && <ScreenTime      onNext={(t) => { setTime(t); setStep("route"); }} />}
                {step === "route"     && <ScreenRoute     onNext={(r) => { setRoute(r); setStep("itinerary"); }} />}
                {step === "itinerary" && <ScreenItinerary days={days} onNext={(it) => { setItinerary(it); setStep("packing"); }} />}
                {step === "packing"   && <ScreenPacking   onNext={handlePacking} />}
                {step === "confirm"   && (
                  <ScreenConfirm
                    date={date} days={days} time={time}
                    acts={acts} route={route}
                    itinerary={itinerary} packing={packing}
                    onSave={() => handleSaveTrip(packing)}
                    onJournal={() => savedTrip && openJournal(savedTrip)}
                  />
                )}
                {step === "history" && (
                  <ScreenHistory onOpen={openJournal} onBack={() => setStep("invite")} />
                )}
                {step === "journal" && journalTrip && (
                  <ScreenJournal trip={journalTrip} userId={user.id} onBack={() => setStep("history")} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
