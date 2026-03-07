import Link from "next/link";
import {siteConfig} from "@/configs/navigation";

export default function NavLinks() {
    return (
        <div className="flex gap-12 text-white/[80%] text-xl font-medium items-center">
            {siteConfig.navItems.map((item) => {
                    const navstyle = item.label === "Contact" ? navbutt : "goldenhover";
                    const navlabel = item.label === "Contact" ? "Prendre contact" : item.label;
                    return (
                        <Link key={item.href} href={item.href} className={navstyle}>
                            {navlabel}
                        </Link>
                    )
                }
            )}
        </div>
    );
}
const navbutt = "shine-button px-4 py-1.5 rounded-3xl bg-gold text-white font-medium shadow-soft hover:shadow-soft-xl transition-all duration-500";
