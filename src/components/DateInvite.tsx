"use client";
import { useState } from "react";
import { useAnimations } from "@/lib/animations";
import HeartsBackground from "./ui/HeartsBackground";
import ScreenInvite   from "./ui/ScreenInvite";
import ScreenDate     from "./ui/ScreenDate";
import ScreenActivity from "./ui/ScreenActivity";
import ScreenTime     from "./ui/ScreenTime";
import ScreenRoute    from "./ui/ScreenRoute";
import ScreenPacking  from "./ui/ScreenPacking";
import ScreenConfirm  from "./ui/ScreenConfirm";
import ScreenItinerary from "./ui/ScreenItinerary";

type Step = "invite" | "date" | "activity" | "time" | "route" | "itinerary" | "packing" | "confirm";

export default function DateInvite() {
  const [step, setStep]     = useState<Step>("invite");
  const [date, setDate]     = useState("");
  const [days, setDays]     = useState(2);
  const [acts, setActs]     = useState<string[]>([]);
  const [time, setTime]     = useState("");
  const [route, setRoute]   = useState("");
  const [itinerary, setItinerary] = useState<string[]>([]);
  const [packing, setPacking] = useState<string[]>([]);
  const { launchConfetti }  = useAnimations();
  const steps: Step[] = ["invite", "date", "activity", "time", "route", "itinerary", "packing", "confirm"];

  function goBack() {
    setStep((prev) => {
      const index = steps.indexOf(prev);
      return index > 0 ? steps[index - 1] : prev;
    });
  }

  function handleDate(selectedDate: string, duration: number) {
    setDate(selectedDate);
    setDays(duration);
    setStep("activity");
  }

  function handleTime(t: string) {
    setTime(t);
    setStep("route");
  }

  function handleRoute(r: string) {
    setRoute(r);
    setStep("itinerary");
  }

  function handleItinerary(items: string[]) {
    setItinerary(items);
    setStep("packing");
  }

  function handlePacking(items: string[]) {
    setPacking(items);
    setStep("confirm");
    setTimeout(() => launchConfetti(), 600);
  }

  return (
    <>
      <HeartsBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px]">
          {/* shimmer border card */}
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
            {step !== "invite" && (
              <button
                type="button"
                onClick={goBack}
                className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/90 px-2 py-1 text-sm font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50"
              >
                ← Буцах
              </button>
            )}
            {step === "invite"    && <ScreenInvite   onYes={() => setStep("date")} />}
            {step === "date"      && <ScreenDate     onNext={handleDate} />}
            {step === "activity"  && <ScreenActivity onNext={(a) => { setActs(a); setStep("time"); }} />}
            {step === "time"      && <ScreenTime     onNext={handleTime} />}
            {step === "route"     && <ScreenRoute    onNext={handleRoute} />}
            {step === "itinerary" && <ScreenItinerary days={days} onNext={handleItinerary} />}
            {step === "packing"   && <ScreenPacking  onNext={handlePacking} />}
            {step === "confirm"   && <ScreenConfirm  date={date} days={days} time={time} acts={acts} route={route} itinerary={itinerary} packing={packing} />}
          </div>
        </div>
      </div>
    </>
  );
}
