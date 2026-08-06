import ServiceCard from "./ServiceCard";
import Link from "next/link";
import services from "@/data/services.json";

export default function ServicesSection() {
  return (
    <section id="services" className="pt-12 pb-2 md:pt-14 md:pb-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="
                        backdrop-blur-md rounded-3xl
                        shadow-sm hover:shadow-md transition-all
                        p-6 sm:p-8 md:p-10
                    "
          style={{
            backgroundColor: "#F9F9F9",
            border: "1px solid #EDEDED",
          }}
        >
          <h2
            className="text-3xl font-bold text-center mb-8 md:mb-10"
            style={{
              background: "linear-gradient(135deg, #809877, #C8B76A, #E8B79C)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Prestations proposées
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {services.map((service) => (
              <ServiceCard
                key={service.slug}
                slug={service.slug}
                title={service.title}
                image={service.image}
                items={service.details}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/services"
              className="
                                inline-block px-6 py-3 rounded-md
                                bg-[#809877] text-white font-medium
                                hover:bg-[#6c8064] transition
                            "
            >
              Voir toutes les prestations
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
