import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/lib/store";
import { TourBridge } from "@/components/showcase/TourBridge";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ServiceConnect — Learn from real people",
  description:
    "A skill marketplace prototype connecting instructors with learners through personalized sessions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full antialiased">
        <AppStateProvider>
          <TourBridge />
          {children}
        </AppStateProvider>
      </body>
    </html>
  );
}
