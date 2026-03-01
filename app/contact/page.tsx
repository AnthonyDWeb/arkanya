import FadeIn from "@/components/animations/fadein";

export default function Contact() {
    return (
        <main className="bg-hero-radial text-neutral-900">
            <section className="w-[90%] xl:w-[70%] mx-auto py-24 space-y-20">

                {/* HERO */}
                <FadeIn>
                    <header className="space-y-6 text-center">
                        <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-[#d9ad45]">
                            Contact
                        </h1>

                        <p className="text-xl text-neutral-600">
                            Discutons de votre projet.
                        </p>

                        <p className="text-neutral-700 max-w-3xl mx-auto leading-relaxed">
                            Chaque collaboration débute par une compréhension claire
                            de vos enjeux, de votre vision et de vos objectifs.
                        </p>
                    </header>
                </FadeIn>

                {/* CONTENT */}
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* LEFT SIDE */}
                    <FadeIn>
                        <div className="space-y-8">
                            <h2 className="text-2xl font-semibold">
                                Une approche structurée
                            </h2>

                            <p className="text-neutral-700 leading-relaxed">
                                Nous analysons chaque demande avec rigueur afin de proposer
                                une solution cohérente, durable et alignée avec votre stratégie.
                            </p>

                            <div className="space-y-6">

                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Échange sans engagement
                                    </h3>
                                    <p className="text-neutral-600">
                                        Un premier entretien pour comprendre vos besoins et
                                        évaluer les meilleures options.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Confidentialité assurée
                                    </h3>
                                    <p className="text-neutral-600">
                                        Vos informations et vos idées sont traitées
                                        avec discrétion et professionnalisme.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Réponse rapide
                                    </h3>
                                    <p className="text-neutral-600">
                                        Nous revenons vers vous sous 24 à 48h ouvrées.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </FadeIn>


                    {/* FORM */}
                    <FadeIn delay={0.1}>
                        <form className="space-y-6">

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-neutral-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9ad45] transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full border border-neutral-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9ad45] transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Objet
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-neutral-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9ad45] transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Message
                                </label>
                                <textarea
                                    rows={6}
                                    className="w-full border border-neutral-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d9ad45] transition"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full px-8 py-4 rounded-md text-white transition-transform duration-300 hover:-translate-y-1"
                                style={{backgroundColor: "#d9ad45"}}
                            >
                                Envoyer la demande
                            </button>

                        </form>
                    </FadeIn>

                </div>

            </section>
        </main>
    );
}