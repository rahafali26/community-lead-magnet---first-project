import type { Metadata } from "next";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["700", "800"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Content & Business Time Audit",
  description:
    "A free 3-minute audit that shows content creators and business owners where their time goes, and their top opportunities to reduce manual work.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-background text-text-primary">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
