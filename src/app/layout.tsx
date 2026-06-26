import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

const BASE_URL = "https://date-invite-roan-chi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "✈️ Аяллын төлөвлөгөө",
    template: "%s | Аяллын төлөвлөгөө",
  },
  description:
    "Найзтайгаа хамт аялалаа зохион байгуул. Огноо сонгох, маршрут тохируулах, цүнх бэлдэх — бүгдийг нэг дороос.",
  keywords: [
    "аялал", "аяллын төлөвлөгөө", "travel planner", "Mongolia travel",
    "маршрут", "хамтарсан аялал", "date invite",
  ],
  authors: [{ name: "turmandakh0203", url: "https://github.com/turmandakh0203" }],
  creator: "turmandakh0203",
  robots: { index: true, follow: true },

  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Аяллын төлөвлөгөө",
    title: "✈️ Аяллын төлөвлөгөө",
    description:
      "Найзтайгаа хамт аялалаа зохион байгуул. Огноо сонгох, маршрут тохируулах, цүнх бэлдэх бүгдийг нэг дороос.",
    locale: "mn_MN",
    alternateLocale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "✈️ Аяллын төлөвлөгөө — Travel Planner",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "✈️ Аяллын төлөвлөгөө",
    description: "Найзтайгаа хамт аялалаа зохион байгуул 🌍",
    images: ["/opengraph-image"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0EA5E9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body className={`${nunito.variable} font-nunito`}>{children}</body>
    </html>
  );
}
