"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  onAuth: () => void;
}

type Mode = "login" | "register";

export default function ScreenAuth({ onAuth }: Props) {
  const [mode, setMode]         = useState<Mode>("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [needsConfirm, setNeedsConfirm] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuth();
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          onAuth(); // email confirmation унтраалттай
        } else {
          setNeedsConfirm(true); // email confirmation асаалттай
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Алдаа гарлаа";
      if (msg.includes("Invalid login credentials"))  setError("Имэйл эсвэл нууц үг буруу байна.");
      else if (msg.includes("Email not confirmed"))   setError("Имэйлээ баталгаажуулна уу. Шуудан хайрцагаа шалгаарай.");
      else if (msg.includes("User already registered")) setError("Энэ имэйл бүртгэлтэй байна. Нэвтрэх хэсгийг ашиглана уу.");
      else if (msg.includes("Password should be"))    setError("Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.");
      else if (msg.includes("rate limit"))            setError("Хэт олон удаа оролдлоо. Хэсэг хүлээгээд дахин оролдоорой.");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: typeof window !== "undefined" ? window.location.origin : "" },
    });
    if (error) setError(error.message);
  }

  // ── Email confirmation pending ──────────────────────────────────────────
  if (needsConfirm) {
    return (
      <div className="screen-in-anim flex flex-col items-center w-full text-center">
        <span className="text-6xl mb-4">📬</span>
        <h2 className="text-xl font-extrabold mb-2 bg-gradient-to-r from-sky-700 to-cyan-500 bg-clip-text text-transparent">
          Имэйлээ шалгаарай
        </h2>
        <p className="text-ink-s text-[14px] leading-relaxed max-w-[280px] mb-6">
          <span className="font-bold text-ink">{email}</span> хаяг руу баталгаажуулах холбоос явуулсан.
          Имэйл дэх холбоос дээр дарсны дараа нэвтэрч болно.
        </p>
        <div className="w-full max-w-[300px] rounded-[16px] bg-amber-50 border border-amber-200 px-4 py-3 text-[13px] text-amber-700 mb-6">
          💡 Хурдан туршихыг хүсвэл: Supabase → Authentication → Providers → Email →
          <span className="font-bold"> "Confirm email" OFF</span> болгоно уу.
        </div>
        <button
          onClick={() => { setNeedsConfirm(false); setMode("login"); }}
          className="w-full max-w-[300px] py-3.5 rounded-[18px] font-bold text-[15px] text-white
                     bg-gradient-to-br from-sky-500 to-cyan-500
                     shadow-[0_6px_20px_rgba(56,189,248,.28)] hover:-translate-y-0.5 transition-all duration-200"
        >
          Нэвтрэх хуудас руу буцах
        </button>
      </div>
    );
  }

  return (
    <div className="screen-in-anim flex flex-col items-center w-full">
      {/* Logo */}
      <span className="emoji-float-anim text-5xl mb-3" style={{ filter: "drop-shadow(0 4px 12px rgba(56,189,248,.3))" }}>
        ✈️
      </span>
      <h1 className="text-xl font-extrabold mb-1 bg-gradient-to-r from-sky-700 to-cyan-500 bg-clip-text text-transparent">
        Аяллын төлөвлөгөө
      </h1>
      <p className="text-ink-s text-[13px] mb-6">Аккаунтдаа нэвтэрч аяллаа хадгал</p>

      {/* Mode tabs */}
      <div className="flex w-full max-w-[320px] rounded-[14px] bg-sky-50 border border-sky-200 p-1 mb-6">
        {(["login", "register"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(null); }}
            className={`flex-1 py-2 rounded-[10px] text-[13px] font-bold transition-all duration-200
              ${mode === m
                ? "bg-white text-sky-700 shadow-sm"
                : "text-ink-s hover:text-sky-600"
              }`}
          >
            {m === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={submit} className="w-full max-w-[320px] flex flex-col gap-3">
        <div>
          <label className="block text-[12px] font-bold text-ink-s mb-1.5 uppercase tracking-wide">
            Имэйл
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            required
            className="w-full rounded-[14px] border border-sky-200 bg-white px-4 py-3 text-sm text-ink
                       outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-[12px] font-bold text-ink-s mb-1.5 uppercase tracking-wide">
            Нууц үг
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full rounded-[14px] border border-sky-200 bg-white px-4 py-3 pr-12 text-sm text-ink
                         outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-s hover:text-ink transition-colors text-[18px]"
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-[12px] bg-red-50 border border-red-200 px-4 py-2.5 text-[13px] text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-[18px] font-bold text-[15px] text-white mt-1
                      transition-all duration-200
                      ${loading
                        ? "bg-sky-300 cursor-not-allowed"
                        : "bg-gradient-to-br from-sky-500 to-cyan-500 shadow-[0_6px_20px_rgba(56,189,248,.28)] hover:-translate-y-0.5 cursor-pointer"
                      }`}
        >
          {loading ? "Уншиж байна..." : mode === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full max-w-[320px] my-4">
        <div className="flex-1 h-px bg-sky-100" />
        <span className="text-[11px] text-ink-s font-medium">эсвэл</span>
        <div className="flex-1 h-px bg-sky-100" />
      </div>

      {/* Google */}
      <button
        onClick={signInWithGoogle}
        className="w-full max-w-[320px] py-3 rounded-[16px] border border-sky-200 bg-white
                   text-ink font-semibold text-[14px] flex items-center justify-center gap-2
                   hover:bg-sky-50 transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google-ээр нэвтрэх
      </button>

      {mode === "register" && (
        <p className="text-[11px] text-ink-s mt-4 text-center max-w-[280px] leading-relaxed">
          Бүртгүүлсний дараа имэйл хаягт баталгаажуулах мэдэгдэл ирнэ.
        </p>
      )}
    </div>
  );
}
