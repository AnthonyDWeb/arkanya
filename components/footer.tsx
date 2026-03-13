import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="border-t border-neutral-200 bg-background text-foreground">
            <div className="w-[90%] max-w-7xl mx-auto py-16">

                <div className="grid md:grid-cols-4 gap-12">

                    <div className="space-y-6 flex flex-col items-center text-center">

                        <Link href="/">
                            <Image
                                src="/logo/logo_transparent.png"
                                alt="Arkanya"
                                width={120}
                                height={120}
                                className="object-contain"
                            />
                            <h2>Arkanya</h2>
                        </Link>
                        <p className="text-sm text-neutral-600 leading-relaxed max-w-xs">
                            Développement web sur mesure, modernisation digitale
                            et accompagnement technique pour les entreprises
                            souhaitant structurer leurs outils numériques.
                        </p>

                    </div>


                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm uppercase tracking-wide">
                            Navigation
                        </h4>

                        <ul className="space-y-2 text-sm text-neutral-600">

                            <li>
                                <Link href="/" className="hover:text-foreground transition">
                                    Accueil
                                </Link>
                            </li>

                            <li>
                                <Link href="/solutions" className="hover:text-foreground transition">
                                    Solutions
                                </Link>
                            </li>

                            <li>
                                <Link href="/services" className="hover:text-foreground transition">
                                    Services
                                </Link>
                            </li>

                            <li>
                                <Link href="/realisations" className="hover:text-foreground transition">
                                    Réalisations
                                </Link>
                            </li>

                            <li>
                                <Link href="/a-propos" className="hover:text-foreground transition">
                                    À propos
                                </Link>
                            </li>

                            <li>
                                <Link href="/contact" className="hover:text-foreground transition">
                                    Contact
                                </Link>
                            </li>

                        </ul>
                    </div>


                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm uppercase tracking-wide">
                            Services
                        </h4>

                        <ul className="space-y-2 text-sm text-neutral-600">

                            <li>
                                <Link href="/services/creation-site-web" className="hover:text-foreground transition">
                                    Création de site web
                                </Link>
                            </li>

                            <li>
                                <Link href="/services/refonte-site-web" className="hover:text-foreground transition">
                                    Refonte de site web
                                </Link>
                            </li>

                            <li>
                                <Link href="/services/developpement-sur-mesure"
                                      className="hover:text-foreground transition">
                                    Développement sur mesure
                                </Link>
                            </li>

                            <li>
                                <Link href="/services/accompagnement" className="hover:text-foreground transition">
                                    Accompagnement
                                </Link>
                            </li>

                        </ul>
                    </div>


                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm uppercase tracking-wide">
                            Contact
                        </h4>

                        <ul className="space-y-2 text-sm text-neutral-600">

                            <li>
                                <a
                                    href="mailto:contact@arkanya.fr"
                                    className="hover:text-foreground transition"
                                >
                                    contact@arkanya.fr
                                </a>
                            </li>

                            <li>La Ferté-Gaucher, France</li>

                        </ul>
                    </div>

                </div>


                <div
                    className="border-t border-neutral-200 mt-12 pt-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-neutral-500">

                    <p>
                        © {new Date().getFullYear()} Arkanya — Tous droits réservés
                    </p>

                    <div className="flex gap-6">

                        <Link
                            href="/mentions-legales"
                            className="hover:text-foreground transition"
                        >
                            Mentions légales
                        </Link>

                        <Link
                            href="/politique-confidentialite"
                            className="hover:text-foreground transition"
                        >
                            Politique de confidentialité
                        </Link>

                        <Link
                            href="/cgv"
                            className="hover:text-foreground transition"
                        >
                            CGV
                        </Link>

                    </div>

                </div>

            </div>
        </footer>
    );
}