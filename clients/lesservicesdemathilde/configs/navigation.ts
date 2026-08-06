export type SiteConfig = typeof siteConfig;

const navList = [
  {
    label: "Accueil",
    href: "/",
    title: "Les Services de Mathilde - Aide à domicile et entretien en Seine-et-Marne",
    description:
      "Services d’entretien du domicile, aide à la personne et surveillance de maison proposés par Les Services de Mathilde.",
  },
  {
    label: "Services",
    href: "/services",
    title: "Les Services de Mathilde - Prestations d’aide à domicile",
    description:
      "Découvrez les prestations d’entretien du domicile, d’aide à la personne et de surveillance proposées par Les Services de Mathilde.",
  },
  {
    label: "Tarifs",
    href: "/tarifs",
    title: "Les Services de Mathilde - Tarifs des prestations à domicile",
    description:
      "Consultez les tarifs simples et transparents des prestations d’aide à domicile avec crédit d’impôt de 50%.",
  },
  {
    label: "Contact",
    href: "/contact",
    title: "Les Services de Mathilde - Demande de devis et contact",
    description:
      "Contactez Les Services de Mathilde pour un devis personnalisé ou toute demande d’information.",
  },
  {
    label: "FAQ",
    href: "/faq-credit-impot",
    title: "Les Services de Mathilde - Crédit d’impôt et services à domicile",
    description:
      "Comprenez comment fonctionne le crédit d’impôt de 50% pour les services à domicile.",
  },
];

export const siteConfig = {
  name: "Les Services de Mathilde",
  description:
    "Entretien du domicile, aide à la personne et surveillance à domicile en Seine-et-Marne.",
  navItems: navList,
  navMenuItems: navList,

  links: {
    website: "https://lesservicesdemathilde.fr",
    email: "mailto:contact@lesservicesdemathilde.fr",
    phone: "tel:+33600000000",
    instagram: "https://instagram.com/lesservicesdemathilde",
  },
};
