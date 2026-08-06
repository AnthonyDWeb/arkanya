import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@arkanya/ui/styles.css";
import "./globals.css";
import StarBackground from "@/components/effects/StarBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Anthony Delforge | Développeur Web",
    template: "%s | Anthony Delforge",
  },
  description:
    "Développement d'applications web modernes, performantes et évolutives pour entreprises ambitieuses.",
  metadataBase: new URL("https://anthony-delforge.fr"),
  openGraph: {
    title: "Anthony Delforge | Développeur Web",
    description: "Développement d'applications web modernes et solutions digitales sur mesure.",
    url: "https://anthony-delforge.fr",
    siteName: "Anthony Delforge",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StarBackground />
        <main>{children}</main>
        <footer />
      </body>
    </html>
  );
}
