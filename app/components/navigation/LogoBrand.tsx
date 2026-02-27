import Image from "next/image";
import Link from "next/link";

export default function LogoBrand() {
    return (
        <Link
            href={"/"} className="flex items-center gap-3 flex-none">
            <Image
                src="/images/lsm.png"
                alt="Logo Les Services de Mathilde"
                width={52}
                height={52}
                className="object-contain"
            />

            <p
                className="text-[#444444] font-semibold text-lg"
                style={{fontFamily: "Poppins, sans-serif"}}
            >
                Les Services de Mathilde
            </p>
        </Link>
    );
}
