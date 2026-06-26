import { createClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!url || !anon) {
  if (typeof window !== "undefined") {
    console.error("[Supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY тохируулагдаагүй байна.");
  }
}

export const supabase = createClient(
  url  || "https://placeholder.supabase.co",
  anon || "placeholder",
);
