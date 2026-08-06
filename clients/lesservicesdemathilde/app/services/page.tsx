import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/home/ServiceCard";
import ContactCTA from "@/components/home/ContactCTA";
import services from "@/data/services.json";

export default function ServicesPage() {
  return (
    <div className="min-h-screen w-full text-[#444444] px-4 sm:px-6 py-16">
      {/* TITRE */}
      <div className="title-anim">
        <SectionTitle main>Nos prestations</SectionTitle>
      </div>

      {/* CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {services.map((service, index) => (
          <div
            key={service.slug}
            className="card-anim"
            style={{
              animationDelay: `${0.3 + index * 0.4}s`,
            }}
          >
            <ServiceCard
              slug={service.slug}
              title={service.title}
              image={service.image}
              items={service.details}
            />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        style={{
          animation: "cardAppear 0.6s ease-out forwards",
          animationDelay: `${0.3 + services.length * 0.4 + 0.4}s`,
          opacity: 0,
        }}
      >
        <ContactCTA />
      </div>
    </div>
  );
}
