import FadeIn from "@/components/animations/fadein";
import MotionButton from "@/components/animations/motionbutton";

export default function Contact() {
    return (
        <main className="bg-background text-foreground">

            {/* HERO */}
            <section className="relative w-full min-h-[55vh] flex items-center overflow-hidden">

                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{backgroundImage: "url('/contact-hero.avif')"}}
                />

                {/* Assombrissement global léger */}
                <div className="absolute inset-0 bg-black/40"/>

                <div className="relative z-10 w-[90%] xl:w-[70%] mx-auto text-white">

                    <FadeIn>
                        <h1 className="text-4xl md:text-6xl font-semibold leading-tight max-w-2xl">
                            Parlons de votre projet.
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="text-lg md:text-xl mt-6 text-white/90 max-w-xl">
                            Un échange clair et structuré pour comprendre vos objectifs
                            et identifier la solution adaptée.
                        </p>
                    </FadeIn>

                </div>
            </section>


            {/* CONTENU */}
            <section className="py-20">
                <div className="w-[90%] xl:w-[65%] mx-auto grid lg:grid-cols-2 gap-16 items-start">

                    {/* TEXTE GAUCHE */}
                    <FadeIn>
                        <div className="space-y-8">

                            <h2 className="text-2xl font-semibold">
                                Une approche structurée et transparente
                            </h2>

                            <p className="text-text-medium leading-relaxed">
                                Chaque demande est analysée avec rigueur afin de proposer
                                une solution cohérente, adaptée à votre organisation
                                et à votre stade de développement.
                            </p>

                            <div className="space-y-6">

                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Échange sans engagement
                                    </h3>
                                    <p className="text-text-medium text-sm leading-relaxed">
                                        Un premier entretien pour comprendre vos enjeux
                                        et évaluer les pistes possibles.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Confidentialité assurée
                                    </h3>
                                    <p className="text-text-medium text-sm leading-relaxed">
                                        Vos informations sont traitées avec discrétion
                                        et professionnalisme.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Réponse sous 24–48h
                                    </h3>
                                    <p className="text-text-medium text-sm leading-relaxed">
                                        Nous revenons vers vous rapidement
                                        avec une première analyse.
                                    </p>
                                </div>

                            </div>

                        </div>
                    </FadeIn>


                    {/* FORMULAIRE */}
                    <FadeIn delay={0.1}>
                        <form className="space-y-6 border border-subtle shadow-soft-lg p-10 rounded-2xl">

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nom</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border border-neutral-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-white border border-neutral-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Type de projet
                                </label>
                                <select
                                    className="w-full bg-white border border-neutral-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition"
                                >
                                    <option>Modernisation / Refonte</option>
                                    <option>Création site</option>
                                    <option>Outil métier / Web app</option>
                                    <option>Accompagnement technique</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Budget estimatif
                                </label>
                                <select
                                    className="w-full bg-white border border-neutral-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition"
                                >
                                    <option>1 000 – 2 500 €</option>
                                    <option>2 500 – 5 000 €</option>
                                    <option>5 000 – 10 000 €</option>
                                    <option>10 000 € +</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Message
                                </label>
                                <textarea
                                    rows={5}
                                    className="w-full bg-white border border-neutral-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition"
                                />
                            </div>

                            <MotionButton
                                href="#"
                                className="w-full px-8 py-3 rounded-md bg-gold text-black font-medium shadow-soft hover:shadow-soft-lg transition"
                            >
                                Envoyer la demande
                            </MotionButton>

                        </form>
                    </FadeIn>

                </div>
            </section>


            {/* CTA FINAL */}
            <section className="py-20 bg-deep text-white text-center">
                <div className="w-[90%] xl:w-[60%] mx-auto">

                    <FadeIn>
                        <h2 className="text-3xl font-semibold mb-6">
                            Une question avant de vous lancer ?
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="text-white/80 mb-8">
                            Nous sommes disponibles pour clarifier vos interrogations
                            et vous orienter vers la solution adaptée.
                        </p>
                    </FadeIn>

                    <MotionButton
                        href="/solutions"
                        className="px-10 py-3 rounded-md bg-gold text-black font-medium transition"
                    >
                        Découvrir nos solutions
                    </MotionButton>

                </div>
            </section>

        </main>
    );
}