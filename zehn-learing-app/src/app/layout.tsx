import type { Metadata, Viewport } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers";
import { VoiceProvider } from "@/components/VoiceProvider";
import { NetworkReady } from "@/components/NetworkReady";

const baloo = Sora({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-baloo",
  display: "swap",
});

const nunito = Inter({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zehn — Train the mind, love the learning",
  description:
    "Voice-guided lessons, 20 picture brain games, AI tutor, world history and photo study plans for playgroup to class 12 — in 12 languages including Urdu, Pashto, Sindhi and Punjabi.",
  icons: { icon: "/images/logo.png", apple: "/images/logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#7c5cff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable}`}>
      <body>
        <AppProvider>
          <VoiceProvider>{children}</VoiceProvider>
        </AppProvider>
      </body>
    </html>
  );
}
