import Image from "next/image";
import Link from "next/link";

export default function LogoBrand() {
    const logstyle = `text-lg font-medium tracking-[0.08em] uppercase text-white`;
    const logimg = "/logo/logo_white_black_v2.png";
    const imgstyle = "object-contain rounded-4xl";

    return (
        <Link href="/" className="flex items-center gap-3 flex-none">
            <Image src={logimg} alt="Arkanya" width={42} height={42} className={imgstyle} priority/>
            <span className={logstyle}>Arkanya</span>
        </Link>
    );
}