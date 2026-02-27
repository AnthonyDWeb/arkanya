"use client";

import {Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTrigger,} from "@/components/ui/drawer";
import {siteConfig} from "@/configs/navigation";
import Link from "next/link";
import {MenuIcon} from "lucide-react";
import LogoBrand from "./LogoBrand";

export default function MobileDrawer() {
    return (
        <Drawer direction="right">
            <DrawerTrigger>
                <div className="p-5">
                    <MenuIcon/>
                </div>
            </DrawerTrigger>

            <DrawerContent>
                <DrawerHeader>
                    <div className="flex flex-col items-center pb-4">
                        <LogoBrand/>
                    </div>
                </DrawerHeader>

                <div className="px-4 flex flex-col gap-6 pb-10 text-lg">
                    {siteConfig.navItems.map((item) =>
                        item.label !== "Services" ? (
                            <DrawerClose asChild key={item.href}>
                                <Link
                                    href={item.href}
                                    className="text-center hover:text-[#809877] transition-colors text-xl"
                                >
                                    {item.label}
                                </Link>
                            </DrawerClose>
                        ) : null
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
