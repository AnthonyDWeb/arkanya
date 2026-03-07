import Image from "next/image";
import {notFound} from "next/navigation";

import realisationsData from "@/data/realisations.json";
import lastRealisationData from "@/data/last-realisation.json";

import type {Realisation} from "@/types/realisations";

import ScrollTitle from "@/components/animations/scrolltitle";
import ScrollReveal from "@/components/animations/ScrollReveal";

const realisations: Realisation[] = realisationsData;
const lastRealisation: Realisation = lastRealisationData;

/* ========================= */
/*       SEO DYNAMIQUE       */

/* ========================= */

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>;
}) {
    const {slug} = await params;

    const allProjects: Realisation[] = [lastRealisation, ...realisations];

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
            canonical: `https://www.arkanya.fr/realisations/${project.slug}`,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

/* ========================= */
/*           PAGE            */
/* ========================= */

export default async function RealisationDetail({
                                                    params,
                                                }: {
    params: Promise<{ slug: string }>;
}) {

    const {slug} = await params;

    const allProjects: Realisation[] = [lastRealisation, ...realisations];

    const project = allProjects.find(
        (p) => p.slug.toLowerCase() === slug.toLowerCase()
    );

    if (!project) return notFound();

    return (
        <main className="bg-hero-radial text-neutral-900">

            <section className="w-[90%] xl:w-[70%] mx-auto py-24 space-y-24">

                {/* HEADER */}
                <header className="space-y-6">

                    <ScrollTitle>
                        <h1 className="text-4xl md:text-5xl font-semibold text-[#d9ad45]">
                            {project.title}
                        </h1>
                    </ScrollTitle>

                    <ScrollReveal>
                        <p className="text-lg text-neutral-700 leading-relaxed max-w-3xl">
                            {project.description}
                        </p>
                    </ScrollReveal>

                </header>

                {/* IMAGE PRINCIPALE */}
                <ScrollReveal>
                    <div className="relative overflow-hidden rounded-2xl">
                        <Image
                            src={"/realisations/fakeit.png"}
                            alt={project.title}
                            width={1600}
                            height={1000}
                            className="object-cover w-full h-[500px] transition-transform duration-[2000ms] hover:scale-[1.02]"
                        />
                    </div>
                </ScrollReveal>

                {/* CONTEXTE */}
                {project.context && (
                    <section className="space-y-6">

                        <ScrollTitle>
                            <h2 className="text-2xl font-semibold">
                                Contexte & Objectifs
                            </h2>
                        </ScrollTitle>

                        <ScrollReveal>
                            <p className="text-neutral-700 leading-relaxed">
                                {project.context}
                            </p>
                        </ScrollReveal>

                    </section>
                )}

                {/* PROBLÉMATIQUE */}
                {project.challenge && (
                    <section className="space-y-6">

                        <ScrollTitle>
                            <h2 className="text-2xl font-semibold">
                                Problématique stratégique
                            </h2>
                        </ScrollTitle>

                        <ScrollReveal>
                            <p className="text-neutral-700 leading-relaxed">
                                {project.challenge}
                            </p>
                        </ScrollReveal>

                    </section>
                )}

                {/* DÉMARCHE */}
                {project.approach && (
                    <section className="space-y-10">

                        <ScrollTitle>
                            <h2 className="text-2xl font-semibold">
                                Démarche
                            </h2>
                        </ScrollTitle>

                        <div className="relative">
                            <div className="absolute left-3 top-0 bottom-0 w-px bg-neutral-200"/>

                            <div className="space-y-12">

                                {project.approach.map((step, index) => (
                                    <ScrollReveal key={index}>
                                        <div className="relative pl-12">

                                            <div
                                                className="absolute left-0 top-1 w-6 h-6 bg-white border border-neutral-300 rounded-full flex items-center justify-center text-xs font-medium">
                                                {index + 1}
                                            </div>

                                            <p className="text-neutral-700 leading-relaxed">
                                                {step}
                                            </p>

                                        </div>
                                    </ScrollReveal>
                                ))}

                            </div>
                        </div>

                    </section>
                )}

                {/* MÉTRIQUES */}
                {project.metrics && project.metrics.length > 0 && (
                    <section className="space-y-8">

                        <ScrollTitle>
                            <h2 className="text-2xl font-semibold">
                                Indicateurs clés
                            </h2>
                        </ScrollTitle>

                        <div className="grid md:grid-cols-3 gap-8 items-stretch">

                            {project.metrics.map((metric, index) => (
                                <ScrollReveal key={index}>

                                    <div
                                        className="bg-white rounded-xl p-8 border border-neutral-200 shadow-sm h-full flex flex-col justify-center items-center text-center">

                                        <p className="text-3xl font-semibold text-[#d9ad45]">
                                            {metric.value}
                                        </p>

                                        <p className="text-sm text-neutral-600 mt-2 max-w-[200px]">
                                            {metric.label}
                                        </p>

                                    </div>

                                </ScrollReveal>
                            ))}

                        </div>

                    </section>
                )}

                {/* GALERIE */}
                {project.gallery && project.gallery.length > 0 && (
                    <section className="space-y-8">

                        <ScrollTitle>
                            <h2 className="text-2xl font-semibold">
                                Galerie
                            </h2>
                        </ScrollTitle>

                        <div className="grid gap-8 md:grid-cols-2">

                            {project.gallery.map((img, index) => (
                                <ScrollReveal key={index}>
                                    <div className="overflow-hidden rounded-xl">

                                        <Image
                                            src={"/realisations/fakeit.png"}
                                            alt={`Screenshot ${index + 1}`}
                                            width={1200}
                                            height={800}
                                            className="rounded-xl transition-transform duration-700 hover:scale-[1.03]"
                                        />

                                    </div>
                                </ScrollReveal>
                            ))}

                        </div>

                    </section>
                )}

                {/* TECHNOLOGIES */}
                {project.technologies && (
                    <section className="space-y-6">

                        <ScrollTitle>
                            <h2 className="text-2xl font-semibold">
                                Technologies
                            </h2>
                        </ScrollTitle>

                        <ScrollReveal>
                            <div className="flex flex-wrap gap-3">

                                {project.technologies.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-5 py-2 text-sm font-medium rounded-full
                    border border-[#d9ad45]/40
                    bg-[#d9ad45]/10
                    text-[#b8892d]
                    hover:bg-[#d9ad45]/20
                    transition"
                                    >
                    {tech}
                  </span>
                                ))}

                            </div>
                        </ScrollReveal>

                    </section>
                )}

                {/* CTA */}
                {project.site && (
                    <ScrollReveal>
                        <section>

                            <a
                                href={project.site}
                                target="_blank"
                                className="inline-block px-8 py-4 rounded-md text-white transition-transform duration-300 hover:-translate-y-1 shadow-md hover:shadow-lg"
                                style={{backgroundColor: "#d9ad45"}}
                            >
                                Voir le site
                            </a>

                        </section>
                    </ScrollReveal>
                )}

            </section>

        </main>
    );
}