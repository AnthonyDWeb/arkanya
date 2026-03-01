import FadeIn from "@/components/animations/fadein";

export default function APropos() {
    return (
        <main className="bg-hero-radial text-neutral-900">

            <section className="w-[90%] xl:w-[70%] mx-auto py-24 space-y-28">

                {/* HERO */}
                <FadeIn>
                    <header className="space-y-6 text-center">
                        <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-[#d9ad45]">
                            À propos
                        </h1>

                        <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                            Une approche stratégique du développement digital.
                        </p>

                        <p className="text-neutral-700 max-w-3xl mx-auto leading-relaxed">
                            Nous concevons des architectures durables, performantes et évolutives.
                            Chaque projet est pensé comme un système structuré, aligné avec vos
                            enjeux métier et votre vision long terme.
                        </p>
                    </header>
                </FadeIn>


                {/* VISION */}
                <FadeIn>
                    <section className="space-y-8">
                        <h2 className="text-2xl font-semibold">Notre vision</h2>

                        <p className="text-neutral-700 leading-relaxed">
                            Trop de projets digitaux sont conçus pour répondre à un besoin immédiat
                            sans vision d’évolution. Cela génère dette technique, rigidité
                            et fragilité structurelle.
                        </p>

                        <p className="text-neutral-700 leading-relaxed">
                            Nous privilégions une approche méthodique et structurée :
                            comprendre en profondeur les objectifs, concevoir une architecture
                            cohérente et bâtir des fondations capables d’évoluer.
                        </p>

                        <p className="text-neutral-700 leading-relaxed">
                            Un projet digital n’est pas une livraison. C’est un système vivant.
                        </p>
                    </section>
                </FadeIn>


                {/* MÉTHODE */}
                <section className="space-y-10">
                    <FadeIn>
                        <h2 className="text-2xl font-semibold">Notre méthode</h2>
                    </FadeIn>

                    <div className="relative">
                        <div className="absolute left-3 top-0 bottom-0 w-px bg-neutral-200"/>

                        <div className="space-y-12">

                            {[
                                {
                                    title: "Analyse stratégique",
                                    text: "Compréhension approfondie de votre activité, de vos enjeux et de vos objectifs à court et long terme."
                                },
                                {
                                    title: "Architecture & structuration",
                                    text: "Conception d’une base technique solide, scalable et cohérente avec votre vision."
                                },
                                {
                                    title: "Développement maîtrisé",
                                    text: "Implémentation rigoureuse, code maintenable, performance optimisée et standards élevés."
                                },
                                {
                                    title: "Évolution continue",
                                    text: "Optimisations, ajustements et accompagnement pour garantir stabilité et croissance."
                                }
                            ].map((step, index) => (
                                <FadeIn key={index} delay={index * 0.1}>
                                    <div className="relative pl-12">
                                        <div
                                            className="absolute left-0 top-1 w-6 h-6 bg-white border border-neutral-300 rounded-full flex items-center justify-center text-xs font-medium">
                                            {index + 1}
                                        </div>

                                        <h3 className="font-semibold mb-2">
                                            {step.title}
                                        </h3>

                                        <p className="text-neutral-700 leading-relaxed">
                                            {step.text}
                                        </p>
                                    </div>
                                </FadeIn>
                            ))}

                        </div>
                    </div>
                </section>


                {/* STANDARDS TECHNIQUES */}
                <FadeIn>
                    <section className="space-y-8">
                        <h2 className="text-2xl font-semibold">Nos standards techniques</h2>

                        <div className="grid md:grid-cols-2 gap-10">

                            <div className="space-y-4">
                                <h3 className="font-semibold">Architecture évolutive</h3>
                                <p className="text-neutral-700 leading-relaxed">
                                    Conçue pour grandir avec votre activité, sans nécessiter
                                    de refonte complète à chaque évolution.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold">Performance maîtrisée</h3>
                                <p className="text-neutral-700 leading-relaxed">
                                    Optimisation des temps de chargement,
                                    des performances serveur et des Core Web Vitals.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold">Code maintenable</h3>
                                <p className="text-neutral-700 leading-relaxed">
                                    Structure claire, documentation cohérente
                                    et respect des bonnes pratiques.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold">Sécurité & fiabilité</h3>
                                <p className="text-neutral-700 leading-relaxed">
                                    Protection des données, gestion rigoureuse
                                    des accès et infrastructures fiables.
                                </p>
                            </div>

                        </div>
                    </section>
                </FadeIn>


                {/* ENGAGEMENT */}
                <FadeIn>
                    <section className="space-y-8">
                        <h2 className="text-2xl font-semibold">Notre engagement</h2>

                        <p className="text-neutral-700 leading-relaxed">
                            Nous ne livrons pas simplement un produit.
                            Nous construisons une base stratégique destinée à soutenir
                            votre croissance sur le long terme.
                        </p>

                        <p className="text-neutral-700 leading-relaxed">
                            Chaque décision technique est guidée par une vision globale :
                            cohérence, stabilité et performance durable.
                        </p>
                    </section>
                </FadeIn>


                {/* CTA */}
                <FadeIn>
                    <section className="pt-10 text-center">
                        <a
                            href="/contact"
                            className="inline-block px-10 py-4 rounded-md text-white transition-transform duration-300 hover:-translate-y-1"
                            style={{backgroundColor: "#d9ad45"}}
                        >
                            Discuter de votre projet
                        </a>
                    </section>
                </FadeIn>

            </section>

        </main>
    );
}