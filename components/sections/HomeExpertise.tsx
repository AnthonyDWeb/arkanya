import Container from "@/components/ui/container"

import ScrollTitle from "@/components/animations/scrolltitle"
import ScrollCard from "@/components/animations/scrollcard"

export default function HomeExpertise() {

    const expertises = [
        {
            title: "Modernisation Digitale",
            desc: "Refonte stratégique et optimisation technique."
        },
        {
            title: "Développement sur Mesure",
            desc: "Applications et outils adaptés à votre réalité métier."
        },
        {
            title: "Structuration & Performance",
            desc: "Architecture pensée pour évoluer durablement."
        }
    ]

    return (
        <section className="py-24 bg-surface">

            <Container className="xl:w-[75%]">

                <ScrollTitle>
                    <h2 className="text-3xl font-semibold mb-20 text-center">
                        Nos expertises
                    </h2>
                </ScrollTitle>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-12">

                    {expertises.map((item, index) => (

                        <ScrollCard key={index}>

                            <div
                                className="bg-background p-10 rounded-2xl border-subtle shadow-soft hover:shadow-soft-lg transition">

                                <h3 className="text-xl font-semibold mb-4">
                                    {item.title}
                                </h3>

                                <p className="text-text-medium leading-relaxed">
                                    {item.desc}
                                </p>

                            </div>

                        </ScrollCard>

                    ))}

                </div>

            </Container>

        </section>
    )
}