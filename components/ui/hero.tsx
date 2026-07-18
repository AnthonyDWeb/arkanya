"use client";

import {motion, useReducedMotion} from "framer-motion";

import FadeUp from "@/components/animations/fadeup";
import {Children} from "@/types";

type HeroVariant = "services" | "solutions" | "contact" | "about" | "realisations" | "default";

interface HeroProps {
    image: string;
    title?: string;
    subtitle?: string;
    height?: string;
    variant?: HeroVariant;
    children?: Children;
}

const visualDensity: Record<HeroVariant, number> = {
    services: 12,
    solutions: 18,
    contact: 10,
    about: 8,
    realisations: 14,
    default: 12,
};

export default function Hero({title, subtitle, height, variant = "default", children}: HeroProps) {
    const reduceMotion = useReducedMotion();
    const currentVariant = variant in visualDensity ? variant : "default";

    return (
        <section
            className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 md:pb-24 md:pt-32"
            style={height ? {minHeight: height} : undefined}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(235,228,202,0.22),transparent_24rem),radial-gradient(circle_at_86%_20%,rgba(8,17,31,0.055),transparent_28rem)]"/>
            <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,0.98fr)_minmax(360px,0.74fr)]">
                <div className="relative z-10">
                    <FadeUp>
                        <div className="mb-8 flex items-center gap-3">
                            <span className="h-px w-16 bg-gradient-to-r from-[#A8873D] to-transparent"/>
                            <span className="h-1.5 w-1.5 rounded-full bg-[#A8873D] shadow-[0_0_18px_rgba(168,135,61,0.32)]"/>
                        </div>
                    </FadeUp>

                    <FadeUp delay={0.04}>
                        <h1 className="max-w-5xl text-4xl font-semibold leading-[1.02] tracking-[-0.01em] text-[#08111F] md:text-6xl lg:text-7xl">
                            {title}
                        </h1>
                    </FadeUp>

                    {subtitle && (
                        <FadeUp delay={0.12}>
                            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                                {subtitle}
                            </p>
                        </FadeUp>
                    )}

                    {children && (
                        <FadeUp delay={0.18}>
                            <div className="relative z-20">{children}</div>
                        </FadeUp>
                    )}
                </div>

                <motion.div
                    aria-hidden="true"
                    className="relative hidden min-h-[430px] lg:block"
                    initial={{opacity: 0, y: 24, rotate: -1.2}}
                    animate={{opacity: 1, y: 0, rotate: -1.2}}
                    transition={{duration: 0.9, ease: [0.22, 1, 0.36, 1]}}
                >
                    <motion.div
                        className="absolute inset-0 bg-[#08111F] shadow-[0_42px_120px_rgba(8,17,31,0.28)]"
                        style={{clipPath: "polygon(8% 0%, 92% 7%, 100% 76%, 78% 100%, 0% 88%, 4% 18%)"}}
                        animate={reduceMotion ? undefined : {y: [0, -8, 0], rotate: [-0.5, -0.15, -0.5]}}
                        transition={{duration: 12, repeat: Infinity, ease: "easeInOut"}}
                    />
                    <motion.div
                        className="absolute inset-5 border border-white/14 bg-white/[0.055] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl"
                        style={{clipPath: "polygon(4% 8%, 84% 0%, 100% 26%, 92% 88%, 16% 100%, 0% 68%)"}}
                        animate={reduceMotion ? undefined : {y: [0, 5, 0], rotate: [0.4, 0.05, 0.4]}}
                        transition={{duration: 10, repeat: Infinity, ease: "easeInOut"}}
                    />
                    <HeroVisualSystem density={visualDensity[currentVariant]} reduceMotion={Boolean(reduceMotion)}/>
                </motion.div>
            </div>
        </section>
    );
}

function HeroVisualSystem({density, reduceMotion}: { density: number; reduceMotion: boolean }) {
    const blocks = Array.from({length: density});

    return (
        <div className="absolute inset-0 overflow-hidden" style={{clipPath: "polygon(8% 0%, 92% 7%, 100% 76%, 78% 100%, 0% 88%, 4% 18%)"}}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(235,228,202,0.18),transparent_18rem),radial-gradient(circle_at_88%_72%,rgba(168,135,61,0.16),transparent_18rem)]"/>
            <div className="absolute inset-10 grid grid-cols-4 gap-3 opacity-75">
                {blocks.map((_, index) => (
                    <motion.span
                        key={index}
                        className="rounded-lg border border-white/10 bg-white/[0.045]"
                        animate={reduceMotion ? undefined : {opacity: [0.35, 0.72, 0.35]}}
                        transition={{duration: 5 + index * 0.12, repeat: Infinity, ease: "easeInOut"}}
                    />
                ))}
            </div>
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 700 460" fill="none">
                <path d="M92 326H230V172H392V92H604" stroke="rgba(235,228,202,.22)" strokeWidth="1"/>
                <path d="M146 112H310V258H508V366H642" stroke="rgba(235,228,202,.15)" strokeWidth="1"/>
                <path d="M118 386H348V298H538V178H664" stroke="rgba(235,228,202,.12)" strokeWidth="1"/>
                {[92, 230, 392, 604, 146, 310, 508, 642, 348, 538, 664].map((x, index) => (
                    <circle
                        key={`${x}-${index}`}
                        cx={x}
                        cy={[326, 326, 172, 92, 112, 258, 258, 366, 386, 298, 178][index]}
                        r={index % 3 === 0 ? 4 : 3}
                        fill="rgba(235,228,202,.42)"
                    />
                ))}
            </svg>
            <div className="absolute bottom-8 left-10 right-10 h-px bg-gradient-to-r from-transparent via-[#ebe4ca]/45 to-transparent"/>
            <div className="absolute right-10 top-10 h-28 w-28 rounded-full border border-[#ebe4ca]/20 bg-[#ebe4ca]/[0.04] shadow-[0_0_80px_rgba(235,228,202,0.16)]"/>
        </div>
    );
}
