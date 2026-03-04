import Link from "next/link";
import {siteConfig} from "@/configs/navigation";

export default function NavLinks() {
    return (
        <div className="flex gap-12 text-[#444444] text-xl font-medium items-center">
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
                    className="shine-button px-5 py-2.5 rounded-md bg-gold text-white font-medium shadow-soft hover:shadow-soft-xl transition-all"
                >
                    Prendre contact
                </Link>
            )}
        </div>
    );
}
