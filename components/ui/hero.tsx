import Image from "next/image";

interface HeroProps {
    image: string;
    title?: string;
    subtitle?: string;
    height?: string; // ex: "60vh" | "70vh"
}

export default function Hero({
                                 image,
                                 title,
                                 subtitle,
                                 height = "60vh",
                             }: HeroProps) {
    return (
        <section
            className="relative w-full flex items-center overflow-hidden bg-deep"
            style={{height}}
        >
            {/* Image optimisée */}
            <Image
                src={image}
                alt={title ?? ""}
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-0 animate-heroFade"
            />

            {/* Overlay lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-r from-deep/90 via-deep/75 to-deep/40"/>

            {/* Contenu */}
            <div className="relative z-10 w-[90%] xl:w-[75%] mx-auto text-white">
                <h1 className="text-4xl md:text-6xl font-semibold leading-tight max-w-3xl drop-shadow-md">
                    {title}
                </h1>

                {subtitle && (
                    <p className="text-xl mt-6 text-white/95 max-w-2xl drop-shadow-sm">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}