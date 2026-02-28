import Card from "@/components/ui/card";

export default function Home() {
    return (
        <main className="min-h-screen">

            {/* HERO */}
            <section className="px-6 md:px-12 py-24 text-center max-w-5xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-semibold mb-6">
                    <span style={{color: "#d9ad45"}}>Arkanya</span>
                </h1>

                <p className="text-xl md:text-2xl font-light mb-6">
                    Solutions digitales pour entreprises.
                </p>

                <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Nous concevons, modernisons et faisons évoluer
                    des solutions web performantes et adaptées à vos besoins réels.
                </p>

                <div className="flex justify-center gap-4 flex-wrap">
                    <a
                        href="/contact"
                        className="px-8 py-4 bg-black text-white rounded-md hover:opacity-90 transition"
                    >
                        Discuter d’un projet
                    </a>

                    <a
                        href="/solutions"
                        className="px-8 py-4 border rounded-md transition"
                        style={{borderColor: "#d9ad45", color: "#d9ad45"}}
                    >
                        Découvrir nos solutions
                    </a>
                </div>
            </section>


            {/* SOLUTIONS */}
            <section className="mb-32">
                <div className="w-[90%] xl:w-[85%] mx-auto">

                    <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-3">

                        <Card
                            title="Modernisation & refonte"
                            description="Refonte complète de sites web avec une architecture moderne, rapide et optimisée pour la performance."
                        />

                        <Card
                            title="Applications sur mesure"
                            description="Conception d’outils digitaux adaptés à votre organisation et à vos besoins spécifiques."
                        />

                        <Card
                            title="Accompagnement technique"
                            description="Un partenaire fiable pour assurer l’évolution et la stabilité de vos solutions dans le temps."
                        />

                    </div>

                </div>
            </section>


            {/* APPROCHE */}
            <section className="px-6 md:px-12 mb-32 text-center max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6">
                    Une approche claire et structurée
                </h2>

                <p className="text-neutral-600 leading-relaxed">
                    Chaque projet débute par une compréhension précise de votre activité.
                    Nous concevons ensuite une solution performante, évolutive
                    et alignée avec vos objectifs.
                </p>
            </section>


            {/* CTA FINAL */}
            <section className="px-6 md:px-12 pb-24 text-center">
                <h2 className="text-2xl font-semibold mb-6">
                    Parlons de votre projet
                </h2>

                <a
                    href="/contact"
                    className="px-10 py-4 rounded-md text-white transition"
                    style={{backgroundColor: "#d9ad45"}}
                >
                    Prendre rendez-vous
                </a>
            </section>

        </main>
    );
}