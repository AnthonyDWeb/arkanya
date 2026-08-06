"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import LogoBrand from "./LogoBrand";
import NavLinks from "./NavLinks";
import MobileDrawer from "./MobileDrawer";

export default function Header() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? (
    <header className="w-full h-20 flex items-center px-8 shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <LogoBrand />

      <nav className="flex-1 flex justify-center">
        <NavLinks />
      </nav>
    </header>
  ) : (
    <header className="w-full flex justify-between items-center px-4 py-3 sticky top-0 z-50 bg-white">
      <LogoBrand />
      <MobileDrawer />
    </header>
  );
}
