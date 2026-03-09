"use client"

import Container from "@/components/ui/container"
import ScrollTitle from "@/components/animations/scrolltitle"

import {motion, Variants} from "framer-motion"

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

    const container: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.45
            }
        }
    }

    const card: Variants = {
        hidden: {
            opacity: 0,
            y: 60,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1] as const
            }
        }
    }

    return (
        <section className="py-24 bg-surface">

            <Container className="xl:w-[75%]">

                <ScrollTitle>
                    <h2 className="text-3xl font-semibold mb-20 text-center">
                        Nos expertises
                    </h2>
                </ScrollTitle>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: false, margin: "-120px"}}
                    className="grid md:grid-cols-2 xl:grid-cols-3 gap-12"
                >

                    {expertises.map((item, index) => (

                        <motion.div
                            key={index}
                            variants={card}
                            className="h-full"
                        >

                            <div
                                className="h-full bg-background p-10 rounded-2xl border-subtle shadow-soft hover:shadow-soft-lg transition flex flex-col justify-between">

                                <div>

                                    <h3 className="text-xl font-semibold mb-4">
                                        {item.title}
                                    </h3>

                                    <p className="text-text-medium leading-relaxed">
                                        {item.desc}
                                    </p>

                                </div>

                            </div>

                        </motion.div>

                    ))}

                </motion.div>

            </Container>

        </section>
    )
}