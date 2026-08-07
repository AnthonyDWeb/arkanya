import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Geist, Geist_Mono, Unbounded } from "next/font/google"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-unbounded",
})

export const metadata: Metadata = {
  title: { default: "Arkanya", template: "%s — Arkanya" },
  description: "Usine logicielle pilotée par IA",
}

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="fr"
      className={`${geist.variable} ${geistMono.variable} ${unbounded.variable}`}
    >
      <body className="bg-base text-zinc-100 antialiased">
        {/*
          THESIS: Operate a digital foundry — intent in, production-ready software out; refuse generic SaaS card dashboards.
          OWN-WORLD: Cool technical luminance stack; Arc cyan as system energy; gold only as logo recall; Unbounded display + Geist + mono metrics; solid modules, light-as-state.
          STORY: Operator configures → Worker executes → timing and status prove control; READY/DEPLOYED stabilize without celebration.
          FIRST VIEWPORT: Deep workspace, architectural title, Worker energy indicator, primary GENERATE path, continuous surfaces not card grids.
          FORM: Digital Foundry / industrial digital futurism (brief-pinned); accent Arc + gold recall; seed key n/a (pinned).
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
        */}
        {children}
      </body>
    </html>
  )
}
