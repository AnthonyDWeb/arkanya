import type { Metadata } from "next"
import type { ReactNode } from "react"
// arkanya-slot:navigation-import
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "{{site-name}}",
    template: `%s · {{site-name}}`,
  },
  description: "{{site-tagline}}",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="pt-16">
        {/* arkanya-slot:navigation-component */}
        {children}
      </body>
    </html>
  )
}
