"use client";
import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const on  = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2
                    bg-amber-500 text-white text-[13px] font-semibold py-2 px-4
                    animate-[screenIn_.3s_ease_both]">
      <span>📡</span>
      Интернэт холболт алга — зөвхөн хадгалсан өгөгдөл харагдана
    </div>
  );
}
