"use client";

import {useState} from "react";
import {Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTrigger,} from "@/components/ui/drawer";

import {siteConfig} from "@/configs/navigation";
import Link from "next/link";
import {ChevronDown, MenuIcon, X} from "lucide-react";

export default function MobileDrawer() {

    const [servicesOpen, setServicesOpen] = useState(false);

    return (
        <Drawer direction="right">
            <DrawerTrigger>
                <div className="p-5">
                    <MenuIcon color="white"/>
                </div>
            </DrawerTrigger>

            <DrawerContent className="items-center">

                <DrawerHeader className="w-full">
                    <div className="px-5 self-end">
                        <DrawerClose>
                            <X color="red"/>
                        </DrawerClose>
                    </div>
                </DrawerHeader>

                <div className="flex flex-col gap-6 pb-10 text-lg w-full items-center">

                    {siteConfig.navItems.map((item) => {

                        if (item.label === "Services") {
                            return (
                                <div key={item.href} className="w-full flex flex-col items-center">

                                    {/* bouton services */}

                                    <button
                                        onClick={() => setServicesOpen(!servicesOpen)}
                                        className="flex items-center justify-center gap-2 goldenhover mobilegoldenhover"
                                    >
                                        {item.label}

                                        <ChevronDown
                                            size={18}
                                            className={`transition-transform ${
                                                servicesOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {/* liste services */}

                                    {servicesOpen && (
                                        <div className="flex flex-col items-center gap-4 mt-4 text-base">

                                            {siteConfig.services.map((service) => (

                                                <DrawerClose asChild key={service.href}>
                                                    <Link
                                                        href={service.href}
                                                        className="text-neutral-500 hover:text-gold transition"
                                                    >
                                                        {service.label}
                                                    </Link>
                                                </DrawerClose>

                                            ))}

                                        </div>
                                    )}

                                </div>
                            );
                        }

                        return (
                            <DrawerClose asChild key={item.href}>
                                <Link
                                    href={item.href}
                                    className="goldenhover mobilegoldenhover text-center"
                                >
                                    {item.label}
                                </Link>
                            </DrawerClose>
                        );
                    })}

                </div>

            </DrawerContent>
        </Drawer>
    );
}