"use client";

export interface DayEntry {
  note: string;
  photos: string[]; // base64 JPEG
  mood: string;     // emoji
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
  journal: (DayEntry | null)[];
}

const KEY = "travel_history";

export function loadTrips(): SavedTrip[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveTrip(
  data: Omit<SavedTrip, "id" | "savedAt" | "journal">,
): SavedTrip {
  const trip: SavedTrip = {
    ...data,
    id: Date.now().toString(),
    savedAt: Date.now(),
    journal: Array(data.days).fill(null),
  };
  const all = loadTrips();
  all.unshift(trip);
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // storage full — keep only latest 5 (drop photos from older ones)
    const trimmed = all.slice(0, 5).map((t, i) =>
      i > 0 ? { ...t, journal: t.journal.map(e => e ? { ...e, photos: [] } : null) } : t,
    );
    localStorage.setItem(KEY, JSON.stringify(trimmed));
  }
  return trip;
}

export function updateJournal(id: string, journal: (DayEntry | null)[]): void {
  if (typeof window === "undefined") return;
  const all = loadTrips();
  const idx = all.findIndex(t => t.id === id);
  if (idx === -1) return;
  all[idx].journal = journal;
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // storage full — strip photos from this entry and retry
    all[idx].journal = journal.map(e => e ? { ...e, photos: [] } : null);
    localStorage.setItem(KEY, JSON.stringify(all));
  }
}

export function deleteTrip(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(loadTrips().filter(t => t.id !== id)));
}

export async function resizeImage(file: File, maxPx = 800): Promise<string> {
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
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
