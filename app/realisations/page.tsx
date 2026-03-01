import Image from "next/image";

import FadeUp from "@/components/animations/fadeup";
import Reveal from "@/components/animations/reveal";
import StaggerContainer from "@/components/animations/staggercontainer";
import AnimatedCard from "@/components/animations/animatedcard";

import lastRealisationData from "@/data/last-realisation.json";
import realisationsData from "@/data/realisations.json";

import type {Realisation} from "@/types/realisations";

const lastRealisation: Realisation = lastRealisationData;
const realisations: Realisation[] = realisationsData;

export default function Realisations() {

    const hasOtherRealisations = realisations.length > 0;

    return (
        <main className="bg-hero-radial text-neutral-900">

            {/* HERO */}
            <section className="px-6 md:px-12 py-24 text-center max-w-5xl mx-auto">

                <FadeUp>
                    <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-[#d9ad45]">
                        Réalisations
                    </h1>
                </FadeUp>

                <FadeUp delay={0.1}>
                    <p className="text-xl md:text-2xl font-light mb-8">
                        Des projets concrets, pensés pour durer.
                    </p>
                </FadeUp>

                <FadeUp delay={0.2}>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                        Chaque collaboration est structurée autour d’objectifs clairs,
                        d’une architecture maîtrisée et d’une vision long terme.
                    </p>
                </FadeUp>

            </section>


            {/* DERNIÈRE RÉALISATION */}
            <section className="w-[90%] xl:w-[85%] mx-auto mb-32">

                <FadeUp>
                    <h2 className="text-2xl font-semibold mb-10">
                        Dernière réalisation
                    </h2>
                </FadeUp>

                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    <Reveal>
                        <a
                            href={`/realisations/${lastRealisation.slug}`}
                            className="relative overflow-hidden rounded-2xl group block"
                        >
                            <Image
                                src={lastRealisation.image}
                                alt={lastRealisation.title}
                                width={1600}
                                height={1000}
                                className="object-cover w-full h-[400px] transition-transform duration-700 group-hover:scale-105"
                            />
                            <div
                                className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-700"/>
                        </a>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <div>
                            <h3 className="text-3xl font-semibold mb-6">
                                {lastRealisation.title}
                            </h3>

                            <p className="text-neutral-600 leading-relaxed mb-6">
                                {lastRealisation.description}
                            </p>

                            {/* Remplacement de details par approach */}
                            {lastRealisation.approach && (
                                <ul className="space-y-3 text-neutral-700 mb-6">
                                    {lastRealisation.approach.slice(0, 3).map((step, index) => (
                                        <li key={index}>• {step}</li>
                                    ))}
                                </ul>
                            )}

                            {lastRealisation.site && (
                                <a
                                    href={lastRealisation.site}
                                    target="_blank"
                                    className="text-sm font-medium text-[#d9ad45] hover:underline"
                                >
                                    Voir le projet →
                                </a>
                            )}
                        </div>
                    </Reveal>

                </div>
            </section>


            {/* AUTRES RÉALISATIONS */}
            {hasOtherRealisations && (
                <section className="w-[90%] xl:w-[85%] mx-auto pb-32">

                    <FadeUp>
                        <h2 className="text-2xl font-semibold mb-12">
                            Autres réalisations
                        </h2>
                    </FadeUp>

                    <StaggerContainer>
                        <div className="grid gap-16 md:grid-cols-2 xl:grid-cols-3">

                            {realisations.map((project, index) => (
                                <AnimatedCard key={index}>
                                    <div className="group">

                                        <a href={`/realisations/${project.slug}`}>
                                            <div className="relative overflow-hidden rounded-xl mb-6">
                                                <Image
                                                    src={project.image}
                                                    alt={project.title}
                                                    width={1200}
                                                    height={800}
                                                    className="object-cover w-full h-[280px] transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                        </a>

                                        <h3 className="text-xl font-semibold mb-3">
                                            {project.title}
                                        </h3>

                                        <p className="text-neutral-600 leading-relaxed mb-4">
                                            {project.description}
                                        </p>

                                        {project.site && (
                                            <a
                                                href={project.site}
                                                target="_blank"
                                                className="text-sm font-medium text-[#d9ad45] hover:underline"
                                            >
                                                Voir le projet →
                                            </a>
                                        )}

                                    </div>
                                </AnimatedCard>
                            ))}

                        </div>
                    </StaggerContainer>

                </section>
            )}

            {/* CTA */}
            <section className="px-6 md:px-12 py-24 text-center bg-neutral-50">

                <FadeUp>
                    <h2 className="text-3xl font-semibold mb-6">
                        Prêt à concrétiser votre projet ?
                    </h2>
                </FadeUp>

                <FadeUp delay={0.1}>
                    <a
                        href="/contact"
                        className="px-10 py-4 rounded-md text-white transition duration-300 hover:opacity-90"
                        style={{backgroundColor: "#d9ad45"}}
                    >
                        Discutons-en
                    </a>
                </FadeUp>

            </section>

        </main>
    );
}