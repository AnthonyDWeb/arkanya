import Link from "next/link";
import { ArkanyaBrand } from "@arkanya/brand";

export default function Footer() {
  return (
    <footer className="relative border-t border-[#ebe4ca]/10 bg-[#0E1117] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(235,228,202,0.12),transparent_28rem),radial-gradient(circle_at_88%_18%,rgba(235,228,202,0.06),transparent_24rem)]" />
      <div className="relative w-[90%] max-w-7xl mx-auto py-20">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="space-y-6 flex flex-col items-center text-center">
            <Link href="/">
              <ArkanyaBrand className="flex-col text-white" imageClassName="size-24" />
            </Link>
            <p className="text-sm text-white/58 leading-relaxed max-w-xs">
              Développement web sur mesure, modernisation digitale et accompagnement technique pour
              les entreprises souhaitant structurer leurs outils numériques.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-[0.16em] text-[#ebe4ca]">
              Navigation
            </h4>

            <ul className="space-y-2 text-sm text-white/56">
              <li>
                <Link href="/" className="hover:text-[#ebe4ca] transition">
                  Accueil
                </Link>
              </li>

              <li>
                <Link href="/solutions" className="hover:text-[#ebe4ca] transition">
                  Solutions
                </Link>
              </li>

              <li>
                <Link href="/services" className="hover:text-[#ebe4ca] transition">
                  Services
                </Link>
              </li>

              <li>
                <Link href="/realisations" className="hover:text-[#ebe4ca] transition">
                  Réalisations
                </Link>
              </li>

              <li>
                <Link href="/a-propos" className="hover:text-[#ebe4ca] transition">
                  À propos
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-[#ebe4ca] transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-[0.16em] text-[#ebe4ca]">
              Services
            </h4>

            <ul className="space-y-2 text-sm text-white/56">
              <li>
                <Link
                  href="/services/creation-site-web"
                  className="hover:text-[#ebe4ca] transition"
                >
                  Création de site web
                </Link>
              </li>

              <li>
                <Link href="/services/refonte-site-web" className="hover:text-[#ebe4ca] transition">
                  Refonte de site web
                </Link>
              </li>

              <li>
                <Link
                  href="/services/developpement-sur-mesure"
                  className="hover:text-[#ebe4ca] transition"
                >
                  Développement sur mesure
                </Link>
              </li>

              <li>
                <Link href="/services/accompagnement" className="hover:text-[#ebe4ca] transition">
                  Accompagnement
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-[0.16em] text-[#ebe4ca]">
              Contact
            </h4>

            <ul className="space-y-2 text-sm text-white/56">
              <li>
                <a href="mailto:contact@arkanya.fr" className="hover:text-[#ebe4ca] transition">
                  contact@arkanya.fr
                </a>
              </li>

              <li>La Ferté-Gaucher, France</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#ebe4ca]/10 mt-12 pt-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-white/44">
          <p>© {new Date().getFullYear()} Arkanya — Tous droits réservés</p>

          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-[#ebe4ca] transition">
              Mentions légales
            </Link>

            <Link href="/politique-confidentialite" className="hover:text-[#ebe4ca] transition">
              Politique de confidentialité
            </Link>

            <Link href="/cgv" className="hover:text-[#ebe4ca] transition">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
