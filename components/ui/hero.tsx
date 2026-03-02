import Image from "next/image";
import {Children} from "@/types";
import FadeUp from "@/components/animations/fadeup";

interface HeroProps {
    image: string;
    title?: string;
    subtitle?: string;
    height?: string;
    children?: Children;
}

export default function Hero({image, title, subtitle, height = "60vh", children}: HeroProps) {
    const sectionstyle = "relative w-full flex items-center overflow-hidden bg-deep";
    const heroclassname = "object-cover opacity-0 animate-heroFade";

    return (
        <section className={sectionstyle} style={{height}}>
            <Image src={image} alt={title ?? ""} fill priority sizes="100vw" className={heroclassname}/>
            <div className="absolute inset-0 bg-black/40"/>
            <div className="relative z-10 w-[90%] xl:w-[75%] mx-auto text-left text-white">
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
                {children && children}
            </div>
        </section>
    );
}