"use client";

import Image from "next/image";
import {motion, useReducedMotion, useScroll, useTransform} from "framer-motion";

import FadeUp from "@/components/animations/fadeup";
import {Children} from "@/types";

interface HeroProps {
    title?: string;
    subtitle?: string;
    height?: string;
    children?: Children;
}

export default function HeroParallax({title, subtitle, height = "92vh", children}: HeroProps) {
    const reduceMotion = useReducedMotion();
    const {scrollY} = useScroll();
    const y = useTransform(scrollY, [0, 520], [0, -70]);
    const opacity = useTransform(scrollY, [0, 520], [1, 0.32]);

    return (
        <motion.section
            style={{y, opacity}}
            className="ark-hero relative overflow-hidden px-4 pb-20 pt-32 sm:px-6"
        >
            <div className="ark-hero__ambient" aria-hidden="true"/>
            <div className="ark-hero__grid" aria-hidden="true"/>
            <div className="ark-hero__noise" aria-hidden="true"/>
            <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]" style={{minHeight: height}}>
                <div className="relative z-10 text-[#08111F]">
                    <FadeUp delay={0.06}>
                        <h1 className="max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[0em] md:text-7xl">
                            {title}
                        </h1>
                    </FadeUp>
                    {subtitle && (
                        <FadeUp delay={0.14}>
                            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                                {subtitle}
                            </p>
                        </FadeUp>
                    )}
                    {children}
                </div>

                <motion.div
                    aria-hidden="true"
                    className="ark-hero-visual relative hidden min-h-[520px] lg:block"
                    initial={{opacity: 0, y: 22, rotate: 0.35}}
                    animate={{opacity: 1, y: 0, rotate: 0.35}}
                    transition={{duration: 0.9, ease: [0.22, 1, 0.36, 1]}}
                >
                    <div className="ark-hero-visual__shadow"/>
                    <motion.div
                        className="ark-glass-plate ark-glass-plate--front"
                        animate={reduceMotion ? undefined : {y: [0, 2, 0], rotate: [0, 0, 0]}}
                        transition={{duration: 20, repeat: Infinity, ease: "easeInOut"}}
                    />
                    <div className="ark-glass-plate__logo-frame">
                        <div className="ark-glass-plate__logo absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                            <Image
                                src="/arkanya.webp"
                                alt=""
                                width={360}
                                height={360}
                                className="rounded-full object-contain"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}
