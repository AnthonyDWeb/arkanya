"use client";

import {useMediaQuery} from "@/hooks/use-media-query";
import LogoBrand from "./LogoBrand";
import NavLinks from "./NavLinks";
import MobileDrawer from "./MobileDrawer";

export default function Header() {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return isDesktop ? (
        <header
            className="w-full h-16 flex items-center px-6 lg:px-10 xl:px-16 bg-white backdrop-blur-md goldenborderbottom">
            <LogoBrand/>

            <nav className="flex-1 flex justify-center">
                <NavLinks/>
            </nav>
        </header>
    ) : (
        <header className="w-full flex justify-between items-center px-4 py-3 goldenborderbottom">
            <LogoBrand/>
            <MobileDrawer/>
        </header>
    );
}