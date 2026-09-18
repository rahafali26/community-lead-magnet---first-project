import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "تحليل وقت المحتوى والبزنس",
  description:
    "اكتشف وين يروح وقتك بين صناعة المحتوى والبزنس، وخذ أقرب فرصة لتقليل العمل اليدوي — تحليل مجاني يستغرق 3 دقائق.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-page text-ink">
        {children}
      </body>
    </html>
  );
}
