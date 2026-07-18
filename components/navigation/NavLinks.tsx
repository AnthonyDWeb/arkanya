"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {siteConfig} from "@/configs/navigation";
import Dropdown from "@/components/ui/Dropdown";

export default function NavLinks() {
    const pathname = usePathname();
    const isServicesActive = pathname.startsWith("/services");
    const isRealisationsActive = pathname.startsWith("/realisations");

    return (
        <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/[0.4] px-2 py-2 text-sm font-medium text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.76),0_18px_60px_rgba(8,17,31,0.1)] backdrop-blur-2xl">

            {siteConfig.navItems
                .filter((item) => item.href !== "/")
                .map((item) => {

                if (item.label === "Services") {
                    return (
                        <Dropdown
                            key={item.href}
                            label={
                                <span className={`premium-nav-link ${isServicesActive ? "is-active" : ""}`}>
                                    {item.label}
                                </span>
                            }
                            items={siteConfig.services}
                        />
                    );
                }

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`premium-nav-link ${
                            pathname === item.href || (item.href === "/realisations" && isRealisationsActive)
                                ? "is-active"
                                : ""
                        }`}
                    >
                        {item.label}
                    </Link>
                );
            })}

        </div>
    );
}
