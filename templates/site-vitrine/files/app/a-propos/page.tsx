import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "À propos",
}

export default function AboutPage() {
  return (
    <main className="py-24 px-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-4xl font-bold mb-8"
          style={{ color: "{{primary-color}}" }}
        >
          À propos
        </h1>
        <p className="text-gray-600 leading-relaxed text-lg">
          Découvrez notre histoire, nos valeurs et ce qui nous anime au quotidien.
          Nous mettons notre expertise au service de vos projets.
        </p>
      </div>
    </main>
  )
}
