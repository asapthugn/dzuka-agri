import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dzuka Agri — AI-Powered Farm Intelligence",
  description:
    "6 specialized AI agents collaborate to analyze your crops, location, weather, pests, and market — delivering one trusted action plan for your farm.",
  openGraph: {
    title: "Dzuka Agri — AI-Powered Farm Intelligence",
    description:
      "Multi-agent AI platform helping farmers make smarter decisions through collaborative intelligence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
