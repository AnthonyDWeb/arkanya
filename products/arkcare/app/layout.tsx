import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { AppShell } from "@/components/layout";
import { PwaRegister } from "@/components/pwa";
import { ArkanyaAuthProvider } from "@arkanya/auth-client";
import "@arkanya/ui/styles.css";
import "@arkanya/auth-client/styles.css";
import "@arkanya/codes/styles.css";
import "@/styles/globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-arkcare",
});

export const metadata: Metadata = {
  title: "ArkCare",
  description: "Suivi simple de traitements medicaux",
  applicationName: "ArkCare",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ArkCare",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ArkanyaAuthProvider
          apiUrl={process.env.NEXT_PUBLIC_ARKANYA_API_URL ?? "https://api.arkanya.fr"}
          product="arkcare"
        >
          <PwaRegister />
          <AppShell>{children}</AppShell>
        </ArkanyaAuthProvider>
      </body>
    </html>
  );
}
