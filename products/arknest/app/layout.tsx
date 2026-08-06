import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AppShell } from "@arkanya/ui/layout";
import { ArkanyaAuthProvider } from "@arkanya/auth-client";
import "@arkanya/ui/styles.css";
import "@arkanya/auth-client/styles.css";
import "@arkanya/codes/styles.css";
import "./globals.css";

import Sidebar from "@/components/layout/Sidebar";
import MobileNavbar from "@/components/layout/MobileNavbar";
import NestedRouteBackLink from "@/components/layout/NestedRouteBackLink";
import AppHeader from "@/components/layout/AppHeader";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-arknest",
});

export const metadata: Metadata = {
  title: "ArkNest",
  description: "Gestion d'argent intelligente",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon-192.png", type: "image/png", sizes: "192x192" }],
    apple: [{ url: "/icon-192.png", type: "image/png", sizes: "192x192" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ArkanyaAuthProvider
          apiUrl={process.env.NEXT_PUBLIC_ARKANYA_API_URL ?? "https://api.arkanya.fr"}
          product="arknest"
        >
          <AppHeader />
          <AppShell className="arknest-shell flex min-h-0 flex-1">
            {/* SIDEBAR (desktop / tablet) */}
            <div className="hidden md:block">
              <Sidebar />
            </div>

            {/* CONTENU */}
            <main className="arknest-content">
              <NestedRouteBackLink />
              {children}
            </main>
          </AppShell>

          {/* MOBILE NAVBAR */}
          <MobileNavbar />
        </ArkanyaAuthProvider>
      </body>
    </html>
  );
}
