import services from "@/data/services.json";
import { notFound } from "next/navigation";

import FadeIn from "@/components/animations/fadein";
import MotionButton from "@/components/animations/motionbutton";
import Card from "@/components/ui/card";
import Hero from "@/components/ui/hero";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;

  const service = services.find((s) => s.slug === slug);

  if (!service) return {};

  return {
    title: `${service.hero.title} | Arkanya`,
    description: service.hero.subtitle,
    openGraph: {
      title: service.hero.title,
      description: service.hero.subtitle,
      images: [service.hero.image],
    },
  };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return notFound();

  return (
    <main className="bg-background text-foreground">
      <Hero
        image={service.hero.image}
        title={service.hero.title}
        subtitle={service.hero.subtitle}
        variant="services"
      />

      <section className="py-24">
        <div className="w-[90%] xl:w-[60%] mx-auto text-center space-y-10">
          <FadeIn>
            <h2 className="text-3xl font-semibold">{service.intro.title}</h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-text-medium leading-relaxed">{service.intro.text}</p>
          </FadeIn>
        </div>
      </section>

      <section className="pb-32">
        <div className="w-[90%] xl:w-[80%] mx-auto">
          <div className="grid gap-10 [grid-template-columns:repeat(auto-fit,minmax(270px,1fr))] mx-auto">
            {service.sections.map((section, index) => (
              <FadeIn key={section.title} delay={index * 0.1}>
                <Card>
                  <h3 className="text-2xl font-semibold mb-4 text-center transition-colors group-hover:text-white group-active:text-white group-focus-visible:text-white">
                    {" "}
                    {section.title}{" "}
                  </h3>
                  <p className="text-text-medium mb-6 leading-relaxed"> {section.description} </p>
                  <ul className="space-y-2 text-text-medium text-sm">
                    {section.features.map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                  {section.price && (
                    <p className="text-gold font-medium mt-auto pt-6 transition-colors group-hover:text-white group-active:text-white group-focus-visible:text-white group-hover:font-bold group-active:font-bold group-focus-visible:font-bold">
                      {section.price}{" "}
                    </p>
                  )}
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-final-cta text-white text-center">
        <FadeIn>
          <h2 className="text-3xl font-semibold mb-6">{service.cta.title}</h2>
        </FadeIn>

        <MotionButton href="/contact" className="cta-button px-10 py-4">
          {service.cta.button}
        </MotionButton>
      </section>
    </main>
  );
}
