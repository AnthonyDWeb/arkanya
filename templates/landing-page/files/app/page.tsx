import type { Metadata } from "next"
// arkanya-slot:contact-form-import

export const metadata: Metadata = {
  title: "{{site-name}}",
  description: "{{site-tagline}}",
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* @arkanya-section begin:hero */}
      <section
        id="hero"
        className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-white"
      >
        <h1 className="text-6xl font-bold tracking-tight mb-6" style={{ color: "{{primary-color}}" }}>
          {{site-name}}
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mb-10">{{site-tagline}}</p>
        {/* @arkanya-hero-cta begin */}
        <a
          href="#a-propos"
          className="px-6 py-3 rounded-lg text-white text-sm font-medium transition-opacity duration-150 ease-out hover:opacity-80"
          style={{ backgroundColor: "{{secondary-color}}" }}
        >
          En savoir plus
        </a>
        {/* @arkanya-hero-cta end */}
      </section>
      {/* @arkanya-section end:hero */}

      {/* @arkanya-section begin:about */}
      <section
        id="a-propos"
        className="py-24 px-6 bg-gray-50"
      >
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl font-bold mb-6"
            style={{ color: "{{primary-color}}" }}
          >
            À propos
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Découvrez notre histoire, nos valeurs et ce qui nous anime au quotidien.
            Nous mettons notre expertise au service de vos projets.
          </p>
        </div>
      </section>
      {/* @arkanya-section end:about */}

      {/* @arkanya-section begin:services */}
      <section
        id="services"
        className="py-24 px-6 bg-white"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold mb-12 text-center"
            style={{ color: "{{primary-color}}" }}
          >
            Services
          </h2>
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
                <h3 className="font-semibold text-lg mb-2" style={{ color: "{{primary-color}}" }}>
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* @arkanya-section end:services */}

      {/* @arkanya-section begin:contact */}
      <section
        id="contact"
        className="py-24 px-6 bg-gray-50"
      >
        <div className="max-w-xl mx-auto">
          <h2
            className="text-3xl font-bold mb-4 text-center"
            style={{ color: "{{primary-color}}" }}
          >
            Contact
          </h2>
          <p className="text-gray-500 text-center mb-10">
            Prenez contact avec nous. Nous vous répondrons dans les meilleurs délais.
          </p>
          {/* arkanya-slot:contact-form-component */}
        </div>
      </section>
      {/* @arkanya-section end:contact */}
    </main>
  )
}
