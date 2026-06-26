"use client";
import { supabase } from "./supabase";

// ── Types ──────────────────────────────────────────────────────────────────

export interface Photo {
  id: string;
  url: string;
  path: string;
}

export interface DayEntry {
  id?: string;
  note: string;
  photos: Photo[];
  mood: string;
}

export interface SavedTrip {
  id: string;
  savedAt: number;
  date: string;
  days: number;
  time: string;
  acts: string[];
  route: string;
  itinerary: string[];
  packing: string[];
  journalCount: number;
}

// ── Image resize ───────────────────────────────────────────────────────────

export async function resizeToBlob(file: File, maxPx = 900): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
          "image/jpeg", 0.8,
        );
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// ── Trips ──────────────────────────────────────────────────────────────────

function mapRow(row: Record<string, unknown>, count = 0): SavedTrip {
  return {
    id:           row.id as string,
    savedAt:      new Date(row.created_at as string).getTime(),
    date:         row.trip_date as string,
    days:         row.days as number,
    time:         row.start_time as string,
    acts:         row.acts as string[],
    route:        row.route as string,
    itinerary:    row.itinerary as string[],
    packing:      row.packing as string[],
    journalCount: count,
  };
}

export async function loadTrips(): Promise<SavedTrip[]> {
  const { data, error } = await supabase
    .from("trips")
    .select("*, journal_entries(count)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => {
    const cnt = (row.journal_entries as { count: number }[])?.[0]?.count ?? 0;
    return mapRow(row, cnt);
  });
}

export async function createTrip(
  data: Omit<SavedTrip, "id" | "savedAt" | "journalCount">,
): Promise<SavedTrip> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: row, error } = await supabase
    .from("trips")
    .insert({
      user_id:    user.id,
      trip_date:  data.date,
      days:       data.days,
      start_time: data.time,
      acts:       data.acts,
      route:      data.route,
      itinerary:  data.itinerary,
      packing:    data.packing,
    })
    .select()
    .single();
  if (error) throw error;
  return mapRow(row);
}

export async function deleteTrip(id: string): Promise<void> {
  const { error } = await supabase.from("trips").delete().eq("id", id);
  if (error) throw error;
}

// ── Journal entries ────────────────────────────────────────────────────────

export async function loadJournal(
  tripId: string,
  days: number,
): Promise<(DayEntry | null)[]> {
  const result: (DayEntry | null)[] = Array(days).fill(null);

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*, photos(*)")
    .eq("trip_id", tripId);
  if (error) throw error;

  for (const entry of data ?? []) {
    const i = entry.day_index as number;
    if (i >= days) continue;
    const photos: Photo[] = (entry.photos as { id: string; storage_path: string }[] ?? []).map(
      (p) => ({
        id:   p.id,
        path: p.storage_path,
        url:  supabase.storage.from("trip-photos").getPublicUrl(p.storage_path).data.publicUrl,
      }),
    );
    result[i] = { id: entry.id as string, note: entry.note as string, mood: entry.mood as string, photos };
  }
  return result;
}

export async function saveJournalEntry(
  tripId: string,
  dayIndex: number,
  entry: DayEntry,
): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("journal_entries")
    .upsert(
      {
        ...(entry.id ? { id: entry.id } : {}),
        trip_id:    tripId,
        user_id:    user.id,
        day_index:  dayIndex,
        note:       entry.note,
        mood:       entry.mood,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "trip_id,day_index" },
    )
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

// ── Photos ─────────────────────────────────────────────────────────────────

export async function uploadPhoto(
  file: File,
  tripId: string,
  dayIndex: number,
  entryId: string,
  userId: string,
): Promise<Photo> {
  const blob = await resizeToBlob(file);
  const path = `${userId}/${tripId}/${dayIndex}/${Date.now()}.jpg`;

  const { error: upErr } = await supabase.storage
    .from("trip-photos")
    .upload(path, blob, { contentType: "image/jpeg" });
  if (upErr) throw upErr;

  const { data: rec, error: dbErr } = await supabase
    .from("photos")
    .insert({ entry_id: entryId, user_id: userId, storage_path: path })
    .select("id")
    .single();
  if (dbErr) throw dbErr;

  return {
    id:   rec.id as string,
    path,
    url:  supabase.storage.from("trip-photos").getPublicUrl(path).data.publicUrl,
  };
}

export async function deletePhoto(photo: Photo): Promise<void> {
  await supabase.storage.from("trip-photos").remove([photo.path]);
  await supabase.from("photos").delete().eq("id", photo.id);
}
