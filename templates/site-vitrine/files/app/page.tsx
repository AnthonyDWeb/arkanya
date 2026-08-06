import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Accueil",
}

export default function HomePage() {
  return (
    <main>
      <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-white">
        <h1
          className="text-6xl font-bold tracking-tight mb-6"
          style={{ color: "{{primary-color}}" }}
        >
          {{site-name}}
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mb-10">{{site-tagline}}</p>
        <Link
          href="/a-propos"
          className="px-6 py-3 rounded-lg text-white text-sm font-medium transition-opacity duration-150 ease-out hover:opacity-80"
          style={{ backgroundColor: "{{secondary-color}}" }}
        >
          En savoir plus
        </Link>
      </section>
    </main>
  )
}
