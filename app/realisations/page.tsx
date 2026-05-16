import Image from "next/image";

import ScrollTitle from "@/components/animations/scrolltitle";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ScrollCard from "@/components/animations/scrollcard";

import MotionButton from "@/components/animations/motionbutton";
import realisationsData from "@/data/realisations.json";

import type {Realisation} from "@/types/realisations";
import Hero from "@/components/ui/hero";

const realisations: Realisation[] = realisationsData;
const realisationslength = realisations.length;
const last: Realisation = realisations[realisationslength - 1];

export default function Realisations() {
    const herotitle = "Des réalisations concrètes, pensées pour durer.";
    const herosubtitle = "Chaque projet est structuré autour d’objectifs clairs, d’une architecture maîtrisée et d’un impact mesurable.";

    const baselink = "relative overflow-hidden rounded-xl group block border-subtle shadow-soft-lg transition-all duration-300 ease-out w-full max-w-[630px]"
    const hoverlink = "hover:scale-[1.035] hover:shadow-[0_0_35px_rgba(232,183,92,0.35)] hover:border-[#E8B75C]/40";
    const linkStyle = `${baselink} ${hoverlink}`;

    const baselink2 = "flex flex-col h-full bg-surface rounded-2xl border-subtle shadow-soft transition-all duration-300 ease-out overflow-hidden"
    const hoverlink2 = "hover:scale-[1.035] hover:shadow-[0_0_35px_rgba(232,183,92,0.35)] hover:border-[#E8B75C]/40";
    const linkStyle2 = `${baselink2} ${hoverlink2}`;

    const imgStyle = "object-cover h-[240px] sm:h-[336px] w-full transition-transform duration-700 group-hover:scale-105";
    const btnStyle = "px-8 py-3 bg-gold text-black rounded-md font-medium shadow-soft hover:shadow-soft-lg transition w-fit mx-auto";
    const btnStyle2 = "px-10 py-3 rounded-md bg-gold text-black font-medium shadow-soft hover:shadow-soft-lg transition";
    return (
        <main className="bg-background text-foreground">
            <Hero image="/page/realisations-hero.webp" title={herotitle} subtitle={herosubtitle}/>

            <section className="py-20">
                <div className="w-[90%] mx-auto">
                    <ScrollTitle>
                        <h2 className="text-3xl font-semibold mb-12">Étude de cas récente</h2>
                    </ScrollTitle>

                    <div className="flex flex-wrap lg:flex-nowrap justify-around items-center gap-12 min-w-0">
                        <ScrollReveal>
                            <a href={`/realisations/${last.slug}`} className={linkStyle}>
                                <Image src={last.image} alt={last.title} width={1200} height={800} className={imgStyle}/>
                            </a>
                        </ScrollReveal>

                        <ScrollReveal>
                            <div className="w-full max-w-[630px] min-w-0 flex flex-col">
                                <h3 className="text-2xl font-semibold mb-6 text-center">{last.title}</h3>
                                <p className="text-text-medium leading-relaxed mb-6 max-w-[90%] text-center mx-auto">{last.description}</p>

                                {last.approach && (
                                    <ul className="space-y-3 text-text-medium mb-6 max-w-[90%] mx-auto">
                                        {last.approach.slice(0, 4).map((step, index) => <li key={index}>• {step}</li>)}
                                    </ul>
                                )}

                                <MotionButton href={`/realisations/${last.slug}`} className={btnStyle}>
                                    Voir l’étude complète
                                </MotionButton>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="w-[90%] xl:w-[75%] mx-auto">
                    <ScrollTitle>
                        <h2 className="text-3xl font-semibold mb-12 text-center">
                            Autres projets
                        </h2>
                    </ScrollTitle>

                    <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
                        {realisations.map((project, index) => {
                            const notlast = project.slug !== last.slug;
                            const projectSlug = `/realisations/${project.slug}`;
                            const linkStyle = "relative overflow-hidden group block";
                            const pt = project.title;
                            const checkImg = project.image.includes(".webp");
                            const pimg = checkImg
                                ? project.image
                                : "/realisations/fakeit.webp";
                            const imgClass = "object-cover w-full h-[240px] transition-transform duration-500 group-hover:scale-105";

                            return notlast && (
                                <ScrollCard key={index}>
                                    <div className={`${linkStyle2} min-w-0`}>
                                        <a href={projectSlug} className={linkStyle}>
                                            <Image src={pimg} alt={pt} width={1200} height={800} className={imgClass}/>
                                        </a>

                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-lg font-semibold mb-3">{project.title}</h3>
                                            <p className="text-text-medium text-sm leading-relaxed mb-6 flex-grow">{project.description}</p>
                                            <a href={`/realisations/${project.slug}`}
                                               className="inline-block text-sm font-medium text-gold hover:underline">
                                                Voir le projet →
                                            </a>
                                        </div>
                                    </div>
                                </ScrollCard>
                            )
                        })}
                    </div>
                </div>
            </section>

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

                    <MotionButton href="/contact" className={btnStyle2}>
                        Planifier un échange
                    </MotionButton>
                </div>
            </section>
        </main>
    );
}
