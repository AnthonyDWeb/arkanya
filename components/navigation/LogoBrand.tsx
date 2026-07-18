import Image from "next/image";
import Link from "next/link";

type LogoBrandProps = {
    elevated?: boolean;
};

export default function LogoBrand({elevated = false}: LogoBrandProps) {
    const logstyle = "text-sm font-semibold tracking-[0.18em] uppercase text-[#08111F]";
    const logimg = "/arkanya.webp";
    const imgstyle = "object-contain rounded-full";

    return (
        <Link
            href="/"
            className={`flex flex-none items-center gap-3 rounded-full transition-all duration-500 ${
                elevated
                    ? "border border-white/60 bg-white/[0.44] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_18px_60px_rgba(8,17,31,0.11)] backdrop-blur-2xl"
                    : "border border-white/48 bg-white/[0.28] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.58),0_14px_44px_rgba(8,17,31,0.08)] backdrop-blur-xl"
            }`}
        >
            <span className={`rounded-full transition-all duration-500 ${elevated ? "shadow-[0_0_26px_rgba(184,157,82,0.22)]" : "shadow-[0_0_18px_rgba(184,157,82,0.12)]"}`}>
                <Image src={logimg} alt="Arkanya" width={42} height={42} className={imgstyle} priority/>
            </span>
            <span className={logstyle}>Arkanya</span>
        </Link>
    );
}
