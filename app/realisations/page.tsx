import Image from "next/image";

import ScrollTitle from "@/components/animations/scrolltitle";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ScrollCard from "@/components/animations/scrollcard";

import MotionButton from "@/components/animations/motionbutton";

import lastRealisationData from "@/data/last-realisation.json";
import realisationsData from "@/data/realisations.json";

import type {Realisation} from "@/types/realisations";
import Hero from "@/components/ui/hero";

const lastRealisation: Realisation = lastRealisationData;
const realisations: Realisation[] = realisationsData;

export default function Realisations() {

    const herotitle = "Des réalisations concrètes, pensées pour durer.";
    const herosubtitle = "Chaque projet est structuré autour d’objectifs clairs, d’une architecture maîtrisée et d’un impact mesurable.";

    const otherRealisations = realisations
        .filter((project) => project.slug !== lastRealisation.slug)
        .slice(0, 3);

    const hasOtherRealisations = otherRealisations.length > 0;

    return (
        <main className="bg-background text-foreground">

            <Hero
                image="/realisations-hero.avif"
                title={herotitle}
                subtitle={herosubtitle}
            />

            {/* ÉTUDE DE CAS RÉCENTE */}
            <section className="py-20">
                <div className="w-[90%] xl:w-[75%] mx-auto">

                    <ScrollTitle>
                        <h2 className="text-3xl font-semibold mb-12">
                            Étude de cas récente
                        </h2>
                    </ScrollTitle>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        <ScrollReveal>
                            <a
                                href={`/realisations/${lastRealisation.slug}`}
                                className="relative overflow-hidden rounded-2xl group block border-subtle shadow-soft-lg"
                            >
                                <Image
                                    src={`/realisations/${lastRealisation.slug}/after/homepage.png`}
                                    alt={lastRealisation.title}
                                    width={1600}
                                    height={1000}
                                    className="object-cover w-full h-[420px] transition-transform duration-700 group-hover:scale-105"
                                />
                            </a>
                        </ScrollReveal>

                        <ScrollReveal>
                            <div>

                                <h3 className="text-2xl font-semibold mb-6">
                                    {lastRealisation.title}
                                </h3>

                                <p className="text-text-medium leading-relaxed mb-6">
                                    {lastRealisation.description}
                                </p>

                                {lastRealisation.approach && (
                                    <ul className="space-y-3 text-text-medium mb-6">
                                        {lastRealisation.approach.slice(0, 4).map((step, index) => (
                                            <li key={index}>• {step}</li>
                                        ))}
                                    </ul>
                                )}

                                <MotionButton
                                    href={`/realisations/${lastRealisation.slug}`}
                                    className="px-8 py-3 bg-gold text-black rounded-md font-medium shadow-soft hover:shadow-soft-lg transition"
                                >
                                    Voir l’étude complète
                                </MotionButton>

                            </div>
                        </ScrollReveal>

                    </div>
                </div>
            </section>

            {/* AUTRES PROJETS */}
            {hasOtherRealisations && (
                <section className="py-20">
                    <div className="w-[90%] xl:w-[75%] mx-auto">

                        <ScrollTitle>
                            <h2 className="text-3xl font-semibold mb-12 text-center">
                                Autres projets
                            </h2>
                        </ScrollTitle>

                        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">

                            {otherRealisations.map((project, index) => (
                                <ScrollCard key={index}>
                                    <div
                                        className="flex flex-col h-full bg-surface rounded-2xl border-subtle shadow-soft hover:shadow-soft-lg transition duration-300 overflow-hidden">

                                        <a
                                            href={`/realisations/${project.slug}`}
                                            className="relative overflow-hidden group"
                                        >
                                            <Image
                                                src={"/realisations/fakeit.png"}
                                                alt={project.title}
                                                width={1200}
                                                height={800}
                                                className="object-cover w-full h-[240px] transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </a>

                                        <div className="p-6 flex flex-col flex-grow">

                                            <h3 className="text-lg font-semibold mb-3">
                                                {project.title}
                                            </h3>

                                            <p className="text-text-medium text-sm leading-relaxed mb-6 flex-grow">
                                                {project.description}
                                            </p>

                                            <a
                                                href={`/realisations/${project.slug}`}
                                                className="inline-block text-sm font-medium text-gold hover:underline"
                                            >
                                                Voir le projet →
                                            </a>

                                        </div>
                                    </div>
                                </ScrollCard>
                            ))}

                        </div>

                    </div>
                </section>
            )}

            {/* CTA FINAL */}
            <section className="py-20 bg-deep text-white text-center">
                <div className="w-[90%] xl:w-[60%] mx-auto">

                    <ScrollTitle>
                        <h2 className="text-3xl font-semibold mb-6">
                            Et si le prochain projet était le vôtre ?
                        </h2>
                    </ScrollTitle>

                    <ScrollReveal>
                        <p className="text-white/80 mb-8">
                            Discutons de vos objectifs et construisons
                            une solution adaptée à votre structure.
                        </p>
                    </ScrollReveal>

                    <MotionButton
                        href="/contact"
                        className="px-10 py-3 rounded-md bg-gold text-black font-medium shadow-soft hover:shadow-soft-lg transition"
                    >
                        Planifier un échange
                    </MotionButton>

                </div>
            </section>

        </main>
    );
}