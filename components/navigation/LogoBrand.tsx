import Image from "next/image";
import Link from "next/link";

export default function LogoBrand() {
    return (
        <Link
            href={"/"} className="flex items-center gap-3 flex-none">
            <Image
                src="/logo/logo_transparent_v2.png"
                alt="Logo Les "
                width={50}
                height={100}
                className="object-contain"
            />
        </Link>
    );
}
