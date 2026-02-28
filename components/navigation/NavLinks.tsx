import Link from "next/link";
import {siteConfig} from "@/configs/navigation";

export default function NavLinks() {
    return (
        <div className="flex gap-12 text-[#444444] text-lg font-medium">
            {siteConfig.navItems.map((item) =>
                item.label !== "Services" ? (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={"goldenhover"}
                    >
                        {item.label}
                    </Link>
                ) : null
            )}
        </div>
    );
}
