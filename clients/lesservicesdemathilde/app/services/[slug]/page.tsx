import services from "@/data/services.json";
import { notFound } from "next/navigation";
import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import Link from "next/link";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const service = services.find((s) => s.slug === slug);

  if (!service) return notFound();

  return (
    <div className="min-h-screen px-4 sm:px-6 py-16 text-[#444444]">
      <SectionTitle main>{service.title}</SectionTitle>

      <div className="max-w-6xl mx-auto mt-10">
        <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-10">
          <Image src={service.image} alt={service.title} fill className="object-cover" />
        </div>

        <p className="text-lg text-center mb-12 text-[#555] max-w-3xl mx-auto">
          {service.description}
        </p>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
          {/* DETAILS */}
          <div className="lg:col-span-3 bg-white border border-[#EDEDED] rounded-2xl p-8 shadow-sm flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-6 text-[#809877]">Détails de la prestation</h2>

            <ul className="space-y-4 text-[#555] flex-grow">
              {service.details.map((item, index) => (
                <li key={index}>✔ {item}</li>
              ))}
            </ul>
          </div>

          {/* TARIFS */}
          <div className="bg-[#F9F9F9] border border-[#EDEDED] rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-4 text-[#809877]">Tarifs</h2>

            <div className="flex flex-col gap-4 flex-grow">
              {/* PRIX PRINCIPAL */}
              {service.pricing.base && (
                <div className="bg-white border border-[#EDEDED] rounded-lg p-4 text-center">
                  {service.pricing.reduced ? (
                    <>
                      <div className="text-sm text-[#666]">Après crédit d’impôt</div>

                      <div className="text-3xl font-bold text-[#809877]">
                        {service.pricing.reduced}
                      </div>

                      <div className="text-xs text-[#999] mt-1">
                        au lieu de {service.pricing.base}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm text-[#666]">Tarif horaire</div>

                      <div className="text-2xl font-bold text-[#809877]">
                        {service.pricing.base}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* VARIANTES */}
              {service.pricing.variants && (
                <div className="space-y-3">
                  {service.pricing.variants.map((v, i) => (
                    <div key={i} className="bg-white border border-[#EDEDED] rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-[#444]">{v.label}</span>
                        <span className="font-bold text-[#809877]">{v.price}</span>
                      </div>

                      {v.description && (
                        <ul className="text-xs text-[#555] space-y-1">
                          {v.description.map((d, j) => (
                            <li key={j}>• {d}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* OPTIONS */}
              {service.pricing.options && (
                <div className="bg-white border border-[#EDEDED] rounded-lg p-4">
                  <div className="text-sm font-semibold mb-2 text-[#444]">Options</div>

                  <ul className="text-xs text-[#555] space-y-1">
                    {service.pricing.options.map((opt, i) => (
                      <li key={i}>• {opt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link
            href={`/contact?service=${service.slug}`}
            className="
            px-6 py-3 rounded-md text-center
            bg-[#809877] text-white
            transition-all duration-200

            hover:bg-[#6c8064]
            hover:shadow-md
            hover:scale-[1.02]
        "
          >
            Demander ce service
          </Link>

          <Link
            href="/tarifs"
            className="
            px-6 py-3 rounded-md text-center
            border border-[#809877] text-[#809877]

            transition-all duration-200

            hover:bg-[#809877]/10
            hover:border-[#6c8064]
            hover:text-[#6c8064]
        "
          >
            Voir les tarifs
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/services"
            className="
            px-6 py-3 rounded-md inline-block
            border border-[#EDEDED] text-[#444]

            transition-all duration-200

            hover:border-[#809877]
            hover:text-[#809877]
            hover:bg-[#F9F9F9]
        "
          >
            Retour aux services
          </Link>
        </div>
      </div>
    </div>
  );
}
