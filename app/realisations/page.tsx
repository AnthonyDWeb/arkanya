import Image from "next/image";

import FadeUp from "@/components/animations/fadeup";
import Reveal from "@/components/animations/reveal";
import StaggerContainer from "@/components/animations/staggercontainer";
import AnimatedCard from "@/components/animations/animatedcard";
import MotionButton from "@/components/animations/motionbutton";

import lastRealisationData from "@/data/last-realisation.json";
import realisationsData from "@/data/realisations.json";

import type {Realisation} from "@/types/realisations";

const lastRealisation: Realisation = lastRealisationData;
const realisations: Realisation[] = realisationsData;

export default function Realisations() {

    const hasOtherRealisations = realisations.length > 0;

    return (
        <main className="bg-background text-foreground">

            {/* HERO */}
            <section className="relative w-full min-h-[60vh] flex items-center overflow-hidden">

                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{backgroundImage: "url('/realisations-hero.avif')"}}
                />

                {/* Assombrissement global léger */}
                <div className="absolute inset-0 bg-black/40"/>

                <div className="relative z-10 w-[90%] xl:w-[75%] mx-auto text-left text-white">

                    <FadeUp>
                        <h1 className="text-4xl md:text-6xl font-semibold leading-tight max-w-2xl">
                            Des réalisations concrètes,
                            pensées pour durer.
                        </h1>
                    </FadeUp>

                    <FadeUp delay={0.1}>
                        <p className="text-xl mt-6 text-white/90 max-w-xl">
                            Chaque projet est structuré autour d’objectifs clairs,
                            d’une architecture maîtrisée et d’un impact mesurable.
                        </p>
                    </FadeUp>

                </div>
            </section>


            {/* ÉTUDE DE CAS */}
            <section className="py-20">
                <div className="w-[90%] xl:w-[75%] mx-auto">

                    <FadeUp>
                        <h2 className="text-3xl font-semibold mb-12">
                            Étude de cas récente
                        </h2>
                    </FadeUp>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        <Reveal>
                            <a
                                href={`/realisations/${lastRealisation.slug}`}
                                className="relative overflow-hidden rounded-2xl group block border-subtle shadow-soft-lg"
                            >
                                <Image
                                    src={lastRealisation.image}
                                    alt={lastRealisation.title}
                                    width={1600}
                                    height={1000}
                                    className="object-cover w-full h-[420px] transition-transform duration-700 group-hover:scale-105"
                                />
                            </a>
                        </Reveal>

                        <Reveal delay={0.2}>
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
                        </Reveal>

                    </div>
                </div>
            </section>


            {/* AUTRES PROJETS */}
            {hasOtherRealisations && (
                <section className="py-20">
                    <div className="w-[90%] xl:w-[75%] mx-auto">

                        <FadeUp>
                            <h2 className="text-3xl font-semibold mb-12 text-center">
                                Autres projets
                            </h2>
                        </FadeUp>

                        <StaggerContainer>
                            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">

                                {realisations.map((project, index) => (
                                    <AnimatedCard key={index}>
                                        <a
                                            href={`/realisations/${project.slug}`}
                                            className="group block bg-surface rounded-2xl border-subtle shadow-soft hover:shadow-soft-lg transition duration-300 overflow-hidden"
                                        >
                                            <div className="relative overflow-hidden">
                                                <Image
                                                    src={project.image}
                                                    alt={project.title}
                                                    width={1200}
                                                    height={800}
                                                    className="object-cover w-full h-[240px] transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>

                                            <div className="p-6">
                                                <h3 className="text-lg font-semibold mb-3">
                                                    {project.title}
                                                </h3>

                                                <p className="text-text-medium text-sm leading-relaxed">
                                                    {project.description}
                                                </p>
                                            </div>
                                        </a>
                                    </AnimatedCard>
                                ))}

                            </div>
                        </StaggerContainer>

                    </div>
                </section>
            )}


            {/* CTA FINAL */}
            <section className="py-20 bg-deep text-white text-center">
                <div className="w-[90%] xl:w-[60%] mx-auto">

                    <FadeUp>
                        <h2 className="text-3xl font-semibold mb-6">
                            Et si le prochain projet était le vôtre ?
                        </h2>
                    </FadeUp>

                    <FadeUp delay={0.1}>
                        <p className="text-white/80 mb-8">
                            Discutons de vos objectifs et construisons
                            une solution adaptée à votre structure.
                        </p>
                    </FadeUp>

                    <FadeUp delay={0.2}>
                        <MotionButton
                            href="/contact"
                            className="px-10 py-3 rounded-md bg-gold text-black font-medium shadow-soft hover:shadow-soft-lg transition"
                        >
                            Planifier un échange
                        </MotionButton>
                    </FadeUp>

                </div>
            </section>


        </main>
    );
}