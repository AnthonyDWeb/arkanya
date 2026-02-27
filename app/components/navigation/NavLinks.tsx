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
                        className="
                            relative
                            hover:text-[#809877]
                            transition-all duration-200
                            pb-1
                            after:absolute after:left-0 after:bottom-0 after:h-[2px]
                            after:w-0 after:bg-[#809877]
                            hover:after:w-full
                            after:transition-all after:duration-300
                        "
                    >
                        {item.label}
                    </Link>
                ) : null
            )}
        </div>
    );
}
