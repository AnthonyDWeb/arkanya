"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { navlinks } from "@/data/navlinks";
import ExternalLink from "@/components/ui/ExternalLink";
import Image from "next/image";
import { arkanyaBrandAssets } from "@arkanya/brand";
import { MoreVerticalIcon } from "@arkanya/icons";

export default function Navbar() {
  const [mobile, setMobile] = useState<undefined | boolean>(undefined);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const mobileMode = mobile || scrolled;

  const headerstylebase = "navbar relative transition-all duration-300";
  const headerScrolled = "bg-black/60 backdrop-blur-md border-b border-neutral-800";
  const headerModestyle = scrolled ? headerScrolled : "bg-transparent";
  const headerstyle = `${headerstylebase} ${headerModestyle}`;

  const desktopNavstylebase = "navbar-links transition-all duration-300";
  const desktopNavMobileMode = "opacity-0 pointer-events-none scale-95 w-0";
  const desktopNavModestyle = mobileMode ? desktopNavMobileMode : "bg-transparent w-full";
  const desktopNavstyle = `${desktopNavstylebase} ${desktopNavModestyle}`;

  const menubtnstylebase =
    "ml-auto text-white border-2 border-[#4ade80] mr-1 rounded-full p-1 cursor-pointer transition-all duration-300";
  const menubtnMobileMode = "opacity-100 scale-100";
  const menubtnModestyle = mobileMode
    ? menubtnMobileMode
    : "opacity-0 scale-90 pointer-events-none";
  const menubtnstyle = `${menubtnstylebase} ${menubtnModestyle}`;

  const mobileNavstylebase = "absolute left-0 top-full w-full transition-all duration-300 ease-out";
  const mobileNavMobileMode = "opacity-100 translate-y-0 pointer-events-auto";
  const mobileNavModestyle =
    open && mobileMode ? mobileNavMobileMode : "opacity-0 translate-y-4 pointer-events-none";
  const mobileNavstyle = `${mobileNavstylebase} ${mobileNavModestyle}`;

  const mobileNavContainer =
    "flex flex-col items-center gap-6 py-8 bg-black/80 backdrop-blur-md border-t border-neutral-800";

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 1000);
    };

    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

      setScrolled(scrollTop > 10);
    };

    handleResize();
    handleScroll();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const DesktopNav = (
    <div className={desktopNavstyle}>
      {navlinks.map((link, i) =>
        link.label === "Contact" ? (
          <Link
            key={"navlink" + i}
            href={link.navlink}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-link"
          >
            {link.label}
          </Link>
        ) : (
          <Link key={"navlink" + i} href={link.navlink} className="navbar-link">
            {link.label}
          </Link>
        ),
      )}
    </div>
  );

  const MenuButton = (
    <button className={menubtnstyle} onClick={() => setOpen(!open)}>
      <MoreVerticalIcon size={28} />
    </button>
  );

  const MobileNav = (
    <div className={mobileNavstyle}>
      <div className={mobileNavContainer}>
        {navlinks.map((link, i) =>
          link.label === "Contact" ? (
            <Link
              key={"navlink" + i}
              href={link.navlink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ) : (
            <Link key={"navlink" + i} href={link.navlink} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ),
        )}
      </div>
    </div>
  );

  return (
    mobile !== undefined && (
      <header className={headerstyle}>
        <nav className="navbar-container">
          <ExternalLink href="https://arkanya.fr" className="navbar-logo">
            <Image
              src={arkanyaBrandAssets.symbol.png}
              alt="Arkanya logo"
              width={50}
              height={50}
              priority
            />
          </ExternalLink>
          {DesktopNav}
          {MenuButton}
          {MobileNav}
        </nav>
      </header>
    )
  );
}
