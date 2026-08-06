import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@arkanya/ui/styles.css";
import "@arkanya/brand/styles.css";
import "./globals.css";
import Header from "@/components/navigation/Header";
import Footer from "../components/footer";

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
    default: "Arkanya | Développement web et solutions sur mesure pour entreprises",
    template: "%s | Arkanya",
  },
  description:
    "Arkanya accompagne les entreprises dans la conception, la modernisation et le développement de sites web et d’applications sur mesure.",
  keywords: [
    "développement web",
    "création site internet",
    "refonte site web",
    "application web sur mesure",
    "développeur web indépendant",
    "solutions web pour entreprises",
  ],
  authors: [{ name: "Anthony Delforge" }],
  creator: "Arkanya",
  metadataBase: new URL("https://arkanya.fr"),
  openGraph: {
    title: "Arkanya | Développement web et solutions sur mesure",
    description: "Conception, modernisation et développement de solutions web pour entreprises.",
    url: "https://arkanya.fr",
    siteName: "Arkanya",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />

        <main className="flex-1">{children}</main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
