import { siteConfig } from "@/configs/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const main = siteConfig.navItems;

  const legal = [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Confidentialité", href: "/confidentialite" },
    { label: "CGV", href: "/cgv" },
  ];

  return (
    <footer className="footer">
      <div className="container-main footer-top">
        <div className="footer-brand">
          <Image src="/logo.webp" alt={siteConfig.name} width={100} height={100} />

          <p className="footer-name">{siteConfig.name}</p>

          <p className="footer-desc">{siteConfig.description}</p>
        </div>

        <div className="footer-links">
          <div>
            <p className="footer-heading">Navigation</p>
            <ul>
              {main.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer-heading">Légal</p>
            <ul>
              {legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container-main footer-bottom-inner">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p>
            Créé par{" "}
            <Link
              href={"https://www.arkanya.fr"}
              target="_blank"
              className="text-green-800 font-extrabold"
            >
              Arkanya
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
