import Link from "next/link";
import {siteConfig} from "@/configs/navigation";

export default function NavLinks() {
    return (
        <div className="flex gap-12 text-[#444444] text-lg font-medium items-center">
            {siteConfig.navItems.map((item) =>
                item.label !== "Contact" ? (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={"goldenhover"}
                    >
                        {item.label}
                    </Link>
                ) : <Link
                    key={item.href}
                    href={item.href}
                    className="px-5 py-2.5 rounded-md bg-gold text-black/70 font-medium shadow-soft hover:shadow-soft-lg transition"
                >
                    Prendre contact
                </Link>
            )}
        </div>
    );
}
