"use client";

import Link from "next/link";
import {siteConfig} from "@/configs/navigation";
import Dropdown from "@/components/ui/Dropdown";

export default function NavLinks() {

    return (
        <div className="flex gap-12 text-white/[80%] text-xl font-medium items-center">

            {siteConfig.navItems.map((item) => {

                if (item.label === "Services") {
                    return (
                        <Dropdown
                            key={item.href}
                            label={
                                <span className="goldenhover">
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
                        className="goldenhover"
                    >
                        {item.label}
                    </Link>
                );
            })}

        </div>
    );
}