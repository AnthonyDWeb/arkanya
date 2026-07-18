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
            <DrawerTrigger aria-label="Ouvrir le menu">
                <div className="rounded-full border border-[#ebe4ca]/34 bg-[#0E1117]/72 p-3.5 text-[#ebe4ca] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_12px_34px_rgba(8,17,31,0.28),0_0_24px_rgba(235,228,202,0.16)] backdrop-blur-2xl transition hover:border-[#ebe4ca]/58 hover:bg-[#0E1117]/86 hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_16px_42px_rgba(8,17,31,0.34),0_0_34px_rgba(235,228,202,0.24)]">
                    <MenuIcon size={24} strokeWidth={2.4}/>
                </div>
            </DrawerTrigger>

            <DrawerContent className="items-center border-[#ebe4ca]/12 bg-[#0E1117]/96 text-white shadow-[0_0_90px_rgba(0,0,0,0.44)] backdrop-blur-xl">

                <DrawerHeader className="w-full">
                    <div className="px-5 self-end">
                        <DrawerClose aria-label="Fermer le menu">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ebe4ca]/12 bg-white/[0.04] text-white/70 transition hover:text-white">
                                <X size={18}/>
                            </span>
                        </DrawerClose>
                    </div>
                </DrawerHeader>

                <div className="flex flex-col gap-6 pb-10 text-lg w-full items-center px-8">

                    {siteConfig.navItems.map((item) => {

                        if (item.label === "Services") {
                            return (
                                <div key={item.href} className="w-full flex flex-col items-center">

                                    {/* bouton services */}

                                    <button
                                        onClick={() => setServicesOpen(!servicesOpen)}
                                        className="premium-mobile-link flex items-center justify-center gap-2"
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
                                        <div className="flex flex-col items-center gap-3 mt-4 text-base rounded-xl border border-[#ebe4ca]/10 bg-white/[0.03] p-4 w-full">

                                            {siteConfig.services.map((service) => (

                                                <DrawerClose asChild key={service.href}>
                                                    <Link
                                                        href={service.href}
                                                        className="text-white/58 transition hover:text-[#ebe4ca]"
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
                                    className="premium-mobile-link text-center"
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
