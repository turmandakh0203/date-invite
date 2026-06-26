import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "✈️ Аяллын төлөвлөгөө",
  description: "Танд зориулсан аяллын урилга",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body className={`${nunito.variable} font-nunito`}>{children}</body>
    </html>
  );
}
