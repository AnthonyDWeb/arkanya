import FadeIn from "@/components/animations/fadein";
import MotionButton from "@/components/animations/motionbutton";
import Card from "@/components/ui/card";
import Hero from "@/components/ui/hero";

import solutions from "@/data/solutions.json";

export default function Solutions() {

    const herotitle = "Des solutions digitales structurées pour bâtir durablement.";
    const herosubtitle = "Création, modernisation et développement de solutions web fiables et évolutives pour les entreprises.";

    const buttonStyle = "cta-button px-10 py-4";
    return (
        <main className="bg-background text-foreground">
            <Hero image="/page/solutions-hero.webp" title={herotitle} subtitle={herosubtitle} variant="solutions"/>

            <section className="py-24">
                <div className="w-[90%] xl:w-[60%] mx-auto text-center">
                    <FadeIn>
                        <h2 className="text-3xl font-semibold mb-6">
                            Des solutions pensées pour soutenir votre activité
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="text-text-medium leading-relaxed">
                            Chaque projet est conçu comme un système digital structuré,
                            capable d’évoluer avec votre organisation et vos objectifs.
                        </p>
                    </FadeIn>
                </div>
            </section>

            <section className="pb-32">
                <div className="w-[90%] xl:w-[80%] mx-auto">
                    <div className="grid gap-10 [grid-template-columns:repeat(auto-fit,minmax(270px,1fr))] mx-auto">
                        {solutions.map((solution, index) => (
                            <FadeIn key={solution.title} delay={index * 0.05}>
                                <Card href={solution.slug}>
                                    <h3 className="text-xl font-semibold mb-4 text-center transition-colors group-hover:text-white group-active:text-white group-focus-visible:text-white">{solution.title}</h3>
                                    <p className="text-text-medium mb-4">{solution.tagline}</p>
                                    <p className="text-text-medium leading-relaxed mb-6">{solution.description}</p>
                                    <p className="text-sm text-gold font-medium mt-auto transition-colors group-hover:text-white group-active:text-white group-focus-visible:text-white group-hover:font-bold group-active:font-bold group-focus-visible:font-bold group-hover:underline group-active:underline group-focus-visible:underline">
                                        {solution.price} →
                                    </p>
                                </Card>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            <section className="premium-final-cta text-white text-center">
                <div className="w-[90%] xl:w-[60%] mx-auto">
                    <FadeIn>
                        <h2 className="text-3xl font-semibold mb-6">
                            Discutons de votre projet
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="text-white/80 mb-10">
                            Un échange permet d’identifier rapidement
                            la solution adaptée à votre organisation.
                        </p>
                    </FadeIn>

                    <MotionButton href="/contact" className={buttonStyle}>
                        Planifier un échange
                    </MotionButton>
                </div>
            </section>
        </main>
    )
}
