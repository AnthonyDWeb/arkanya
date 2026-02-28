import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Header from "@/components/navigation/Header";

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
        default: "Arkanya | Studio digital – Solutions web sur mesure pour PME",
        template: "%s | Arkanya",
    },
    description:
        "Arkanya est un studio digital spécialisé dans la conception, la modernisation et l’évolution de solutions web et applications sur mesure pour PME ambitieuses.",
    keywords: [
        "studio digital",
        "développement web",
        "refonte site web",
        "application sur mesure",
        "PME",
        "création site internet",
    ],
    authors: [{name: "Anthony Delforge"}],
    creator: "Arkanya",
    metadataBase: new URL("https://arkanya.fr"),
    openGraph: {
        title: "Arkanya | Studio digital – Solutions web sur mesure",
        description:
            "Studio digital spécialisé dans les solutions web sur mesure pour PME.",
        url: "https://arkanya.fr",
        siteName: "Arkanya",
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
        <html lang="fr">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* HEADER GLOBAL */}
        <header>
            <Header/>
        </header>

        {/* CONTENU DES PAGES */}
        <main>
            {children}
        </main>

        {/* FOOTER GLOBAL */}
        <footer></footer>

        </body>
        </html>
    );
}
