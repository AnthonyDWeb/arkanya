import Image from "next/image";

import ScrollTitle from "@/components/animations/scrolltitle";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ScrollCard from "@/components/animations/scrollcard";

import MotionButton from "@/components/animations/motionbutton";
import realisationsData from "@/data/realisations.json";

import type { Realisation } from "@/types/realisations";

import Card from "@/components/ui/card";
import Hero from "@/components/ui/hero";

const realisations = realisationsData as Realisation[];

const visibleProjects = realisations.filter((project) => project.visible && !project.draft);

const highlightedProject =
  visibleProjects.find((project) => project.highlight) ?? visibleProjects[0];

const otherProjects = visibleProjects.filter((project) => project.slug !== highlightedProject.slug);

const animationVariants = ["fade", "fade", "right", "left"] as const;

function getStableHash(value: string, seed = 0) {
  return (
    value
      .split("")
      .reduce(
        (hash, character) => Math.imul(hash ^ character.charCodeAt(0), 16777619),
        2166136261 ^ seed,
      ) >>> 0
  );
}

const shuffledProjects = [...otherProjects].sort(
  (firstProject, secondProject) =>
    getStableHash(firstProject.slug, 17) - getStableHash(secondProject.slug, 17),
);

const revealOrderBySlug = new Map(
  [...shuffledProjects]
    .sort(
      (firstProject, secondProject) =>
        getStableHash(firstProject.slug, 91) - getStableHash(secondProject.slug, 91),
    )
    .map((project, index) => [project.slug, index]),
);

const animationBySlug = new Map(
  [...shuffledProjects]
    .sort(
      (firstProject, secondProject) =>
        getStableHash(firstProject.slug, 53) - getStableHash(secondProject.slug, 53),
    )
    .map((project, index) => [project.slug, animationVariants[index % animationVariants.length]]),
);

function getProjectAnimation(slug: string) {
  return animationBySlug.get(slug) ?? "fade";
}

export default function Realisations() {
  const herotitle = "Des réalisations concrètes, pensées pour durer.";
  const herosubtitle =
    "Chaque projet est structuré autour d’objectifs clairs, d’une architecture maîtrisée et d’un impact mesurable.";

  const baselink =
    "relative overflow-hidden rounded-xl group block border-subtle shadow-soft-lg transition-all duration-300 ease-out";

  const hoverlink =
    "hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(232,183,92,0.25)] hover:border-[#E8B75C]/40";

  const linkStyle = `${baselink} ${hoverlink}`;

  const btnStyle = "cta-button px-8 py-3 w-fit mx-auto";

  const btnStyle2 = "cta-button px-10 py-3";

  const renderVisual = (project: Realisation, large?: boolean) => {
    const sizeClass = large ? "h-[240px] sm:h-[336px]" : "h-[240px]";

    if (project.display === "image" && project.image) {
      return (
        <Image
          src={project.image}
          alt={project.title}
          width={1200}
          height={800}
          className={`object-cover w-full ${sizeClass} transition-transform duration-700 group-hover:scale-105`}
        />
      );
    }

    if (project.display === "metrics") {
      return (
        <div
          className={`w-full ${sizeClass} rounded-xl border border-white/10 bg-deep flex flex-col justify-center items-center gap-4 p-6`}
        >
          <div className="flex flex-wrap justify-center gap-4">
            {project.metrics?.slice(0, 3).map((metric, index) => (
              <div
                key={index}
                className="px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-center min-w-[120px]"
              >
                <p className="text-xl font-semibold text-[#D4AF37]">{metric.value}</p>

                <p className="text-xs text-[#D4AF37] mt-1">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (project.display === "icon") {
      return (
        <div
          className={`w-full ${sizeClass} rounded-xl border border-white/10 bg-deep flex items-center justify-center`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
              <span className="text-4xl">⚙️</span>
            </div>

            <p className="text-sm text-[#D4AF37]">Accompagnement technique</p>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`w-full ${sizeClass} rounded-xl border border-white/10 bg-deep flex items-center justify-center p-8 text-center`}
      >
        <p className="text-[#D4AF37] leading-relaxed max-w-[80%]">
          {project.quote ?? project.description}
        </p>
      </div>
    );
  };

  return (
    <main className="bg-background text-foreground">
      <Hero
        image="/page/realisations-hero.webp"
        title={herotitle}
        subtitle={herosubtitle}
        variant="realisations"
      />

      {highlightedProject && (
        <section className="py-20">
          <div className="w-[90%] mx-auto">
            <ScrollTitle>
              <h2 className="text-3xl font-semibold mb-12">Étude de cas mise en avant</h2>
            </ScrollTitle>

            <div className="flex flex-wrap lg:flex-nowrap justify-around items-center gap-12 min-w-0">
              <ScrollReveal>
                <a
                  href={`/realisations/${highlightedProject.slug}`}
                  className={`${linkStyle} block w-full max-w-[630px]`}
                >
                  {renderVisual(highlightedProject, true)}
                </a>
              </ScrollReveal>

              <ScrollReveal>
                <div className="w-full max-w-[630px] min-w-0 flex flex-col">
                  <h3 className="text-2xl font-semibold mb-6 text-center">
                    {highlightedProject.title}
                  </h3>

                  <p className="text-text-medium leading-relaxed mb-6 max-w-[90%] text-center mx-auto">
                    {highlightedProject.description}
                  </p>

                  {highlightedProject.approach && (
                    <ul className="space-y-3 text-text-medium mb-6 max-w-[90%] mx-auto">
                      {highlightedProject.approach.slice(0, 4).map((step, index) => (
                        <li key={index}>• {step}</li>
                      ))}
                    </ul>
                  )}

                  <MotionButton
                    href={`/realisations/${highlightedProject.slug}`}
                    className={btnStyle}
                  >
                    Voir l’étude complète
                  </MotionButton>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="w-[90%] xl:w-[75%] mx-auto">
          <ScrollTitle>
            <h2 className="text-3xl font-semibold mb-12 text-center">Autres projets</h2>
          </ScrollTitle>

          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {shuffledProjects.map((project, index) => {
              const projectSlug = `/realisations/${project.slug}`;

              return (
                <ScrollCard
                  key={project.slug}
                  index={revealOrderBySlug.get(project.slug) ?? index}
                  variant={getProjectAnimation(project.slug)}
                >
                  <Card href={projectSlug}>
                    {renderVisual(project)}

                    <div className="flex flex-col flex-grow mt-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium border border-gold/20">
                          {project.service}
                        </span>

                        {project.serviceType && (
                          <span className="px-3 py-1 rounded-full bg-white/5 text-[#D4AF37] text-xs font-medium border border-white/10">
                            {project.serviceType}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold mb-3 transition-colors group-hover:text-white">
                        {project.title}
                      </h3>

                      <p className="text-text-medium text-sm leading-relaxed mb-6 flex-grow">
                        {project.description}
                      </p>

                      <span className="inline-block text-sm font-medium text-gold transition-colors group-hover:text-white group-hover:font-bold group-hover:underline">
                        Voir le projet →
                      </span>
                    </div>
                  </Card>
                </ScrollCard>
              );
            })}
          </div>
        </div>
      </section>

      <section className="premium-final-cta text-white text-center">
        <div className="w-[90%] xl:w-[60%] mx-auto">
          <ScrollTitle>
            <h2 className="text-3xl font-semibold mb-6">
              Et si le prochain projet était le vôtre ?
            </h2>
          </ScrollTitle>

          <ScrollReveal>
            <p className="text-white/80 mb-8">
              Discutons de vos objectifs et construisons une solution adaptée à votre structure.
            </p>
          </ScrollReveal>

          <MotionButton href="/contact" className={btnStyle2}>
            Planifier un échange
          </MotionButton>
        </div>
      </section>
    </main>
  );
}
