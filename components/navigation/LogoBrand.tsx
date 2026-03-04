import Image from "next/image";
import Link from "next/link";

export default function LogoBrand() {
    return (
        <Link
            href="/"
            className="flex items-center gap-3 flex-none"
        >
            <Image
                src="/logo/logo_transparent_v2.png"
                alt="Arkanya"
                width={42}
                height={42}
                className="object-contain"
                priority
            />

            <span className="text-lg font-medium tracking-[0.08em] uppercase text-neutral-900">
                Arkanya
            </span>
        </Link>
    );
}