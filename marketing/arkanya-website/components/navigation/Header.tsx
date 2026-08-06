"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import LogoBrand from "./LogoBrand";
import NavLinks from "./NavLinks";
import MobileDrawer from "./MobileDrawer";

export default function Header() {
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

  const legalPages = ["/mentions-legales", "/politique-confidentialite", "/cgv"];

  const isLegalPage = legalPages.includes(pathname);

  const base = "fixed top-0 left-0 w-full z-50 bg-transparent transition-all duration-500";
  const elevated = scrolled || isLegalPage;

  return (
    <header
      className={`${base} flex items-center justify-between px-4 py-4 min-[1000px]:h-20 min-[1000px]:px-6 min-[1000px]:py-0 lg:px-10 xl:px-16`}
    >
      <LogoBrand elevated={elevated} />

      <nav className="hidden flex-1 justify-end min-[1000px]:flex">
        <NavLinks />
      </nav>

      <div className="min-[1000px]:hidden">
        <MobileDrawer />
      </div>
    </header>
  );
}
