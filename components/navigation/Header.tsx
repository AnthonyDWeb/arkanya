"use client";

import {useMediaQuery} from "@/hooks/use-media-query";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";

import LogoBrand from "./LogoBrand";
import NavLinks from "./NavLinks";
import MobileDrawer from "./MobileDrawer";

export default function Header() {

    const isDesktop = useMediaQuery("(min-width: 1000px)");
    const pathname = usePathname();

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {

        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);

    }, []);

    // pages légales

    const legalPages = [
        "/mentions-legales",
        "/politique-confidentialite",
        "/cgv",
    ];

    const isLegalPage = legalPages.includes(pathname);

    const base =
        "fixed top-0 left-0 w-full z-50 transition-all duration-300";

    const state =
        scrolled || isLegalPage
            ? "bg-black/80 backdrop-blur-md shadow-soft"
            : "bg-transparent";

    return isDesktop ? (
        <header className={`${base} ${state} h-16 flex items-center px-6 lg:px-10 xl:px-16`}>

            <LogoBrand/>

            <nav className="flex-1 flex justify-end mr-10">
                <NavLinks/>
            </nav>

        </header>
    ) : (
        <header className={`${base} ${state} flex justify-between items-center px-4 py-3`}>
            <LogoBrand/>
            <MobileDrawer/>
        </header>
    );
}