import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services",
}

export default function ServicesPage() {
  return (
    <main className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h1
          className="text-4xl font-bold mb-12 text-center"
          style={{ color: "{{primary-color}}" }}
        >
          Services
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Conseil", desc: "Accompagnement stratégique pour vos projets." },
            { title: "Réalisation", desc: "Conception et développement sur mesure." },
            { title: "Suivi", desc: "Support et évolution dans la durée." },
          ].map((service) => (
            <div
              key={service.title}
              className="p-6 rounded-xl border border-gray-100 shadow-sm"
            >
              <h3
                className="font-semibold text-lg mb-2"
                style={{ color: "{{primary-color}}" }}
              >
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
