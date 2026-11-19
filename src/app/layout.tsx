import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["700", "800", "900"], variable: "--font-cairo" });
const tajawal = Tajawal({ subsets: ["arabic", "latin"], weight: ["400", "500", "700"], variable: "--font-tajawal" });

export const metadata: Metadata = {
  title: "طلابـي | Tolaby — سكنك الجامعي من غير سمسار",
  description: "منصة تربط الطلاب بأصحاب سكن موثّقين، مع حماية الحجز والدفع والدعم.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
