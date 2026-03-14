import services from "@/data/services.json"
import {notFound} from "next/navigation"

import FadeIn from "@/components/animations/fadein"
import MotionButton from "@/components/animations/motionbutton"
import Hero from "@/components/ui/hero"

type Params = {
    params: Promise<{
        slug: string
    }>
}


export async function generateStaticParams() {

    return services.map((service) => ({
        slug: service.slug
    }))

}

export async function generateMetadata({params}: Params) {

    const {slug} = await params

    const service = services.find(
        (s) => s.slug === slug
    )

    if (!service) return {}

    return {
        title: `${service.hero.title} | Arkanya`,
        description: service.hero.subtitle,
        openGraph: {
            title: service.hero.title,
            description: service.hero.subtitle,
            images: [service.hero.image]
        }
    }
}

export default async function ServicePage({params}: Params) {
    const {slug} = await params;
    const service = services.find((s) => s.slug === slug)
    if (!service) return notFound()

    const basediv = "relative bg-surface border-subtle rounded-2xl shadow-soft-lg p-10 h-full flex flex-col transition-all duration-300 ease-out"
    const hoverdiv = "hover:scale-[1.035] hover:shadow-[0_0_35px_rgba(232,183,92,0.35)] hover:border-[#E8B75C]/40";
    const divStyle = `${basediv} ${hoverdiv}`;

    return (
        <main className="bg-background text-foreground">
            <Hero image={service.hero.image} title={service.hero.title} subtitle={service.hero.subtitle}/>

            <section className="py-24">
                <div className="w-[90%] xl:w-[60%] mx-auto text-center space-y-10">
                    <FadeIn>
                        <h2 className="text-3xl font-semibold">
                            {service.intro.title}
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="text-text-medium leading-relaxed">
                            {service.intro.text}
                        </p>
                    </FadeIn>
                </div>
            </section>

            <section className="pb-32">
                <div className="w-[90%] xl:w-[80%] mx-auto">
                    <div className="grid gap-10 [grid-template-columns:repeat(auto-fit,minmax(270px,1fr))] mx-auto">
                        {service.sections.map((section, index) => (
                            <FadeIn key={section.title} delay={index * 0.1}>
                                <div className={divStyle}>
                                    <h3 className="text-2xl font-semibold mb-4 text-center"> {section.title} </h3>
                                    <p className="text-text-medium mb-6 leading-relaxed"> {section.description} </p>
                                    <ul className="space-y-2 text-text-medium text-sm">
                                        {section.features.map((feature) => (<li key={feature}>• {feature}</li>))}
                                    </ul>
                                    {section.price &&
                                        <p className="text-gold font-medium mt-auto pt-6">{section.price} </p>
                                    }
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-28 bg-deep text-white text-center">
                <FadeIn>
                    <h2 className="text-3xl font-semibold mb-6">
                        {service.cta.title}
                    </h2>
                </FadeIn>

                <MotionButton href="/contact" className="px-10 py-4 rounded-md bg-gold text-black">
                    {service.cta.button}
                </MotionButton>
            </section>
        </main>
    )
}