import Image from "next/image";
import {notFound} from "next/navigation";

import realisationsData from "@/data/realisations.json";
import lastRealisationData from "@/data/last-realisation.json";

import type {Realisation} from "@/types/realisations";
import FadeIn from "@/components/animations/fadein";

/* ========================= */
/*      TYPAGE PROPRE       */
/* ========================= */

const realisations: Realisation[] = realisationsData;
const lastRealisation: Realisation = lastRealisationData;

/* ========================= */
/*       SEO DYNAMIQUE      */

/* ========================= */

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>;
}) {
    const {slug} = await params;

    const allProjects: Realisation[] = [
        lastRealisation,
        ...realisations,
    ];

    const project = allProjects.find(
        (p) => p.slug.toLowerCase() === slug.toLowerCase()
    );

    if (!project) return {};

    return {
        title: project.seo?.title ?? project.title,
        description: project.seo?.description ?? project.description,
        keywords: project.seo?.keywords ?? [],
        openGraph: {
            title: project.seo?.title ?? project.title,
            description: project.seo?.description ?? project.description,
            images: [project.image],
        },
        alternates: {
            canonical: `https://tonsite.fr/realisations/${project.slug}`,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

/* ========================= */
/*          PAGE            */
/* ========================= */

export default async function RealisationDetail({
                                                    params,
                                                }: {
    params: Promise<{ slug: string }>;
}) {
    const {slug} = await params;

    const allProjects: Realisation[] = [
        lastRealisation,
        ...realisations,
    ];

    const project = allProjects.find(
        (p) => p.slug.toLowerCase() === slug.toLowerCase()
    );

    if (!project) return notFound();

    return (
        <main className="bg-hero-radial text-neutral-900">
            <section className="w-[90%] xl:w-[70%] mx-auto py-24 space-y-24">

                {/* HEADER */}
                <FadeIn>
                    <header className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-[#d9ad45]">
                            {project.title}
                        </h1>

                        <p className="text-lg text-neutral-700 leading-relaxed max-w-3xl">
                            {project.description}
                        </p>
                    </header>
                </FadeIn>

                {/* IMAGE PRINCIPALE */}
                <FadeIn>
                    <div className="relative overflow-hidden rounded-2xl">
                        <Image
                            src={project.image}
                            alt={project.title}
                            width={1600}
                            height={1000}
                            className="object-cover w-full h-[500px] transition-transform duration-[2000ms] hover:scale-[1.02]"
                        />
                    </div>
                </FadeIn>

                {/* CONTEXTE */}
                {project.context && (
                    <FadeIn>
                        <section className="space-y-6">
                            <h2 className="text-2xl font-semibold">Contexte</h2>
                            <p className="text-neutral-700 leading-relaxed">
                                {project.context}
                            </p>
                        </section>
                    </FadeIn>
                )}

                {/* ENJEU */}
                {project.challenge && (
                    <FadeIn>
                        <section className="space-y-6">
                            <h2 className="text-2xl font-semibold">Enjeu</h2>
                            <p className="text-neutral-700 leading-relaxed">
                                {project.challenge}
                            </p>
                        </section>
                    </FadeIn>
                )}

                {/* DÉMARCHE */}
                {project.approach && (
                    <section className="space-y-10">
                        <FadeIn>
                            <h2 className="text-2xl font-semibold">Démarche</h2>
                        </FadeIn>

                        <div className="relative">
                            <div className="absolute left-3 top-0 bottom-0 w-px bg-neutral-200"/>

                            <div className="space-y-12">
                                {project.approach.map((step, index) => (
                                    <FadeIn key={index} delay={index * 0.1}>
                                        <div className="relative pl-12">
                                            <div
                                                className="absolute left-0 top-1 w-6 h-6 bg-white border border-neutral-300 rounded-full flex items-center justify-center text-xs font-medium">
                                                {index + 1}
                                            </div>

                                            <p className="text-neutral-700 leading-relaxed">
                                                {step}
                                            </p>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* AVANT / APRÈS */}
                {project.type === "refonte" &&
                    project.beforeImage &&
                    project.afterImage && (
                        <FadeIn>
                            <section className="space-y-8">
                                <h2 className="text-2xl font-semibold">Évolution</h2>

                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <p className="text-sm uppercase tracking-wide text-neutral-500">
                                            Avant
                                        </p>
                                        <Image
                                            src={project.beforeImage}
                                            alt="Avant"
                                            width={1200}
                                            height={800}
                                            className="rounded-xl border border-neutral-200"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-sm uppercase tracking-wide text-neutral-500">
                                            Après
                                        </p>
                                        <Image
                                            src={project.afterImage}
                                            alt="Après"
                                            width={1200}
                                            height={800}
                                            className="rounded-xl border border-neutral-200"
                                        />
                                    </div>
                                </div>
                            </section>
                        </FadeIn>
                    )}

                {/* RÉSULTATS */}
                {project.results && (
                    <FadeIn>
                        <section className="space-y-6">
                            <h2 className="text-2xl font-semibold">Résultats</h2>
                            <p className="text-neutral-700 leading-relaxed">
                                {project.results}
                            </p>
                        </section>
                    </FadeIn>
                )}

                {/* GALERIE */}
                {project.gallery && project.gallery.length > 0 && (
                    <section className="space-y-8">
                        <FadeIn>
                            <h2 className="text-2xl font-semibold">Galerie</h2>
                        </FadeIn>

                        <div className="grid gap-8 md:grid-cols-2">
                            {project.gallery.map((img, index) => (
                                <FadeIn key={index} delay={index * 0.1}>
                                    <div className="overflow-hidden rounded-xl">
                                        <Image
                                            src={img}
                                            alt={`Screenshot ${index + 1}`}
                                            width={1200}
                                            height={800}
                                            className="rounded-xl transition-transform duration-700 hover:scale-[1.03]"
                                        />
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </section>
                )}

                {/* TECHNOLOGIES */}
                {project.technologies && (
                    <FadeIn>
                        <section className="space-y-6">
                            <h2 className="text-2xl font-semibold">Technologies</h2>

                            <div className="flex flex-wrap gap-3">
                                {project.technologies.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 text-sm rounded-full bg-neutral-100"
                                    >
                    {tech}
                  </span>
                                ))}
                            </div>
                        </section>
                    </FadeIn>
                )}

                {/* TÉMOIGNAGE */}
                {project.testimonial && (
                    <FadeIn>
                        <section className="bg-neutral-50 p-12 rounded-2xl space-y-6">
                            <p className="text-xl italic text-neutral-800 leading-relaxed">
                                “{project.testimonial.content}”
                            </p>

                            <p className="text-sm text-neutral-600">
                                {project.testimonial.author} —{" "}
                                {project.testimonial.role},{" "}
                                {project.testimonial.company}
                            </p>
                        </section>
                    </FadeIn>
                )}

                {/* CTA */}
                {project.site && (
                    <FadeIn>
                        <section>
                            <a
                                href={project.site}
                                target="_blank"
                                className="inline-block px-8 py-4 rounded-md text-white transition-transform duration-300 hover:-translate-y-1"
                                style={{backgroundColor: "#d9ad45"}}
                            >
                                Voir le site
                            </a>
                        </section>
                    </FadeIn>
                )}

            </section>
        </main>
    );
}