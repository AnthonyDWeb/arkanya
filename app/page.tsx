import Container from "@/components/ui/container"

import HomeHero from "@/components/sections/HomeHero"
import HomeExpertise from "@/components/sections/HomeExpertise"
import HomeCTA from "@/components/sections/HomeCTA"

import ScrollReveal from "@/components/animations/ScrollReveal"
import ScrollTitle from "@/components/animations/scrolltitle"

export default function Home() {

    return (
        <main className="min-h-screen bg-background text-foreground">
            <HomeHero/>

            <section className="pb-24 bg-background -mt-10">
                <Container className="xl:w-[65%] text-center">
                    <ScrollTitle>
                        <h2 className="text-3xl md:text-4xl font-semibold mb-8">
                            Une approche claire et structurée.
                        </h2>
                    </ScrollTitle>

                    <ScrollReveal>
                        <p className="text-text-medium leading-relaxed max-w-2xl mx-auto">
                            Chaque projet est conçu comme un système structuré,
                            capable d’évoluer avec votre organisation.
                            Nous privilégions performance, cohérence
                            et vision stratégique.
                        </p>
                    </ScrollReveal>
                </Container>
            </section>

            <HomeExpertise/>

            <section className="py-24 bg-background">
                <Container className="xl:w-[60%] text-center">
                    <ScrollTitle>
                        <h2 className="text-3xl font-semibold mb-10">
                            Plus qu’un site, une base durable.
                        </h2>
                    </ScrollTitle>

                    <ScrollReveal>
                        <p className="text-text-medium leading-relaxed max-w-2xl mx-auto">
                            Nous ne livrons pas simplement une interface.
                            Nous concevons une architecture durable,
                            pensée pour accompagner votre développement.
                        </p>
                    </ScrollReveal>
                </Container>
            </section>

            <HomeCTA/>
        </main>
    )
}