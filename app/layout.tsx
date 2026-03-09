import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CateringCare – Näringsrik matleverans för äldreomsorgen",
  description:
    "Trygg, god och näringsrik matleverans till äldreboenden och hemtjänst. CateringCare levererar kvalitetsmåltider med omtanke.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body className="bg-white text-gray-800 antialiased">{children}</body>
    </html>
  );
}
