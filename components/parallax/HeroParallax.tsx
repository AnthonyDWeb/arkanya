"use client"

import Image from "next/image"
import {motion, useScroll, useTransform} from "framer-motion"
import {Children} from "@/types"
import FadeUp from "@/components/animations/fadeup"

interface HeroProps {
    image: string
    title?: string
    subtitle?: string
    height?: string
    children?: Children
}

export default function HeroParallax({
                                         image,
                                         title,
                                         subtitle,
                                         height = "100vh",
                                         children
                                     }: HeroProps) {

    const {scrollY} = useScroll()

    const scale = useTransform(scrollY, [0, 400], [1, 0.75])
    const y = useTransform(scrollY, [0, 400], [0, -200])
    const opacity = useTransform(scrollY, [0, 350], [1, 0])

    return (
        <motion.section
            style={{scale, y, opacity}}
            className="relative w-full overflow-hidden"
        >

            <div
                className="relative w-full flex items-center"
                style={{minHeight: height}}
            >

                <Image
                    src={image}
                    alt={title ?? ""}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/40"/>

                <div className="relative z-10 flex items-center w-full">

                    <div className="w-[90%] xl:w-[75%] mx-auto text-left text-white py-24">

                        <FadeUp>
                            <h1 className="text-4xl md:text-6xl font-semibold leading-tight max-w-3xl drop-shadow-md">
                                {title}
                            </h1>
                        </FadeUp>

                        {subtitle && (
                            <FadeUp delay={0.1}>
                                <p className="text-xl mt-6 text-white/95 max-w-2xl drop-shadow-sm">
                                    {subtitle}
                                </p>
                            </FadeUp>
                        )}

                        {children}

                    </div>

                </div>

            </div>

        </motion.section>
    )
}