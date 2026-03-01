import Card from "@/components/ui/card";
import SlideIn from "@/components/animations/slidein";

export default function Solutions() {
    return (
        <main
            className="bg-[radial-gradient(circle_at_50%_10%,rgba(217,173,69,0.04),transparent_60%)] bg-white text-neutral-900">

            {/* HERO */}
            <section className="px-6 md:px-12 py-24 text-center max-w-5xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-semibold mb-6">
                    <span style={{color: "#d9ad45"}}>Nos Solutions</span>
                </h1>

                <p className="text-xl md:text-2xl font-light mb-10">
                    Pensées pour la performance et la durabilité.
                </p>

                <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                    Modernisation, développement sur mesure et accompagnement technique :
                    des solutions conçues pour structurer, optimiser et faire évoluer
                    vos outils digitaux dans le temps.
                </p>
            </section>


            {/* SOLUTIONS */}
            <section>
                <div className="w-[90%] xl:w-[85%] mx-auto space-y-12">


                    {/* 1 */}
                    <div className="grid md:grid-cols-2 items-center">
                        <SlideIn direction="left">
                            <Card
                                title="Modernisation & refonte"
                                description="Transformation complète de plateformes existantes vers des standards modernes, performants et évolutifs."
                                details={[
                                    "Audit technique et structurel",
                                    "Refonte UX / UI stratégique",
                                    "Optimisation performance & SEO",
                                    "Migration sécurisée",
                                ]}
                            />
                        </SlideIn>
                        <div/>
                    </div>


                    {/* 2 */}
                    <div className="grid md:grid-cols-2 items-center">
                        <div className="order-1 md:order-none"/>
                        <SlideIn direction="right">
                            <Card
                                title="Applications sur mesure"
                                description="Conception d’outils digitaux spécifiques à votre organisation et à vos enjeux."
                                details={[
                                    "Outils métiers personnalisés",
                                    "Automatisation de processus",
                                    "Interfaces adaptées aux équipes",
                                    "Architecture scalable",
                                ]}
                            />
                        </SlideIn>
                    </div>


                    {/* 3 */}
                    <div className="grid md:grid-cols-2 items-center">
                        <SlideIn direction="left">
                            <Card
                                title="Accompagnement technique"
                                description="Suivi structuré et continu pour garantir stabilité et évolution."
                                details={[
                                    "Maintenance proactive",
                                    "Support prioritaire",
                                    "Optimisations régulières",
                                    "Conseil stratégique",
                                ]}
                            />
                        </SlideIn>
                        <div/>
                    </div>

                </div>
            </section>


            {/* CTA */}
            <section className="px-6 md:px-12 py-32 text-center">
                <SlideIn direction="left">
                    <h2 className="text-3xl font-semibold mb-6">
                        Parlons de votre projet
                    </h2>
                </SlideIn>

                <SlideIn direction="right">
                    <a
                        href="/contact"
                        className="px-10 py-4 rounded-md text-white transition-colors duration-300 hover:opacity-90"
                        style={{backgroundColor: "#d9ad45"}}
                    >
                        Planifier un échange
                    </a>
                </SlideIn>
            </section>

        </main>
    );
}