import Image from "next/image";
import {notFound} from "next/navigation";

import realisationsData from "@/data/realisations.json";
import lastRealisationData from "@/data/last-realisation.json";

import type {Realisation} from "@/types/realisations";

import ScrollTitle from "@/components/animations/scrolltitle";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Hero from "@/components/ui/hero";

const realisations = realisationsData as Realisation[];
const lastRealisation = lastRealisationData as Realisation;
const fallbackImage = "/page/realisations-hero.webp";

export async function generateMetadata({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const allProjects: Realisation[] = [lastRealisation, ...realisations];
    const project = allProjects.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
    if (!project) return {};

    const projectImage = project.image ?? fallbackImage;

    return {
        title: project.seo?.title ?? project.title,
        description: project.seo?.description ?? project.description,
        keywords: project.seo?.keywords ?? [],
        openGraph: {
            title: project.seo?.title ?? project.title,
            description: project.seo?.description ?? project.description,
            images: [projectImage],
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

export default async function RealisationDetail({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const allProjects: Realisation[] = [lastRealisation, ...realisations];
    const project = allProjects.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
    if (!project) return notFound();

    const projectImage = project.image ?? fallbackImage;
    const beforeImages = project.gallery?.before ?? [];
    const afterImages = project.gallery?.after ?? [];
    const hasBefore = beforeImages.length > 0;

    const aproachStyle = "absolute left-0 top-1 w-6 h-6 bg-surface border border-border-subtle rounded-full flex items-center justify-center text-xs font-medium";
    const metricStyle = "bg-surface rounded-xl p-8 border border-border-subtle shadow-soft h-full flex flex-col justify-center items-center text-center";
    const stackStyle = "px-5 py-2 text-sm font-medium rounded-full border border-gold/40 bg-gold/10 text-gold hover:bg-gold/20 transition";
    const siteStyle = "cta-button inline-block px-8 py-4";

    return (
        <main className="bg-background text-foreground">
            <Hero image={projectImage} title={project.title} subtitle={project.description} variant="realisations"/>

            <section className="w-[90%] xl:w-[70%] mx-auto py-24 space-y-24">
                {project.context && (<section className="space-y-6">
                    <ScrollTitle>
                        <h2 className="text-2xl font-semibold">
                            Contexte & Objectifs
                        </h2>
                    </ScrollTitle>

                    <ScrollReveal>
                        <p className="text-text-medium leading-relaxed">
                            {project.context}
                        </p>
                    </ScrollReveal>
                </section>)}
                {project.challenge && (<section className="space-y-6">
                    <ScrollTitle>
                        <h2 className="text-2xl font-semibold">
                            Problématique stratégique
                        </h2>
                    </ScrollTitle>

                    <ScrollReveal>
                        <p className="text-text-medium leading-relaxed">
                            {project.challenge}
                        </p>
                    </ScrollReveal>
                </section>)}
                {project.approach && (<section className="space-y-10">
                    <ScrollTitle>
                        <h2 className="text-2xl font-semibold">
                            Démarche
                        </h2>
                    </ScrollTitle>

                    <div className="relative">
                        <div className="absolute left-3 top-0 bottom-0 w-px bg-border-subtle"/>
                        <div className="space-y-12">
                            {project.approach.map((step, index) => (
                                <ScrollReveal key={index}>
                                    <div className="relative pl-12">
                                        <p className={aproachStyle}>{index + 1}</p>
                                        <p className="text-text-medium leading-relaxed">{step}</p>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>)}
                {project.metrics && project.metrics.length > 0 && (<section className="space-y-8">
                    <ScrollTitle>
                        <h2 className="text-2xl font-semibold">
                            Indicateurs clés
                        </h2>
                    </ScrollTitle>

                    <div className="grid md:grid-cols-3 gap-8 items-stretch">
                        {project.metrics.map((metric, index) => (
                            <ScrollReveal key={index}>
                                <div className={metricStyle}>
                                    <p className="text-3xl font-semibold text-gold">{metric.value}</p>
                                    <p className="text-sm text-text-medium mt-2 max-w-[200px]">{metric.label}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </section>)}
                {(beforeImages.length > 0 || afterImages.length > 0) && (<section className="space-y-12">
                    <ScrollTitle>
                        <h2 className="text-2xl font-semibold">
                            Galerie
                        </h2>
                    </ScrollTitle>

                    {hasBefore ? (
                        <>
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-text-medium">
                                    Avant
                                </h3>

                                <div className="grid gap-8 md:grid-cols-2">
                                    {beforeImages.map((img, index) => (
                                        <ScrollReveal key={index}>
                                            <div className="overflow-hidden rounded-xl">
                                                <Image
                                                    src={img}
                                                    alt={`Avant ${index + 1}`}
                                                    width={1200}
                                                    height={800}
                                                    className="rounded-xl transition-transform duration-700 hover:scale-[1.03]"
                                                />
                                            </div>
                                        </ScrollReveal>
                                    ))}
                                </div>
                            </div>
                            {afterImages.length > 0 && (<div className="space-y-6">
                                <h3 className="text-lg font-medium text-text-medium">
                                    Après
                                </h3>
                                <div className="grid gap-8 md:grid-cols-2">
                                    {afterImages.map((img, index) => (
                                        <ScrollReveal key={index}>
                                            <div className="overflow-hidden rounded-xl">
                                                <Image
                                                    src={img}
                                                    alt={`Après ${index + 1}`}
                                                    width={1200}
                                                    height={800}
                                                    className="rounded-xl transition-transform duration-700 hover:scale-[1.03]"
                                                />
                                            </div>
                                        </ScrollReveal>
                                    ))}
                                </div>
                            </div>)}
                        </>
                    ) : (<div className="grid gap-8 md:grid-cols-2">
                        {afterImages.map((img, index) => (
                            <ScrollReveal key={index}>
                                <div className="overflow-hidden rounded-xl">
                                    <Image
                                        src={img}
                                        alt={`Screenshot ${index + 1}`}
                                        width={1200}
                                        height={800}
                                        className="rounded-xl transition-transform duration-700 hover:scale-[1.03]"
                                    />
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>)}
                </section>)}
                {project.technologies && (<section className="space-y-6">
                    <ScrollTitle>
                        <h2 className="text-2xl font-semibold">
                            Technologies
                        </h2>
                    </ScrollTitle>

                    <ScrollReveal>
                        <div className="flex flex-wrap gap-3">
                            {project.technologies.map((tech, index) =>
                                <span key={index} className={stackStyle}>{tech}</span>
                            )}
                        </div>
                    </ScrollReveal>
                </section>)}
                {project.site && (<ScrollReveal>
                    <section>
                        <a href={project.site} target="_blank" className={siteStyle}>
                            Voir le site
                        </a>
                    </section>
                </ScrollReveal>)}
            </section>
        </main>
    );
}
