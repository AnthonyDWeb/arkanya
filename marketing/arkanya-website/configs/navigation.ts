export type SiteConfig = typeof siteConfig;

/*
|--------------------------------------------------------------------------
| NAVIGATION PRINCIPALE
|--------------------------------------------------------------------------
*/

const navList = [
  {
    label: "Accueil",
    href: "/",
    title: "Arkanya - Studio digital spécialisé en solutions web sur mesure pour PME",
    description:
      "Arkanya accompagne les PME dans la conception, la modernisation et l’évolution de solutions web et applications sur mesure.",
  },
  {
    label: "Solutions",
    href: "/solutions",
    title: "Arkanya - Solutions digitales pour entreprises",
    description:
      "Création de sites web, refonte, développement sur mesure et accompagnement technique pour structurer durablement vos outils digitaux.",
  },
  {
    label: "Services",
    href: "/services",
    title: "Arkanya - Services et solutions digitales",
    description:
      "Découvrez l’ensemble des services proposés par Arkanya : création de site web, refonte, développement sur mesure et accompagnement technique.",
  },
  {
    label: "Réalisations",
    href: "/realisations",
    title: "Arkanya - Réalisations et projets digitaux",
    description:
      "Découvrez plusieurs projets réalisés : refontes de sites, plateformes web et solutions digitales sur mesure.",
  },
  {
    label: "À propos",
    href: "/a-propos",
    title: "Arkanya - À propos d’Arkanya et de son approche",
    description:
      "Découvrez la vision d’Arkanya et l’approche adoptée pour concevoir des solutions digitales durables.",
  },
  {
    label: "Contact",
    href: "/contact",
    title: "Arkanya - Discuter de votre projet digital",
    description:
      "Besoin d’un site web, d’une refonte ou d’une application sur mesure ? Échangeons sur votre projet.",
  },
];

/*
|--------------------------------------------------------------------------
| PAGES SERVICES
|--------------------------------------------------------------------------
*/

const servicesList = [
  {
    label: "Création de site web",
    href: "/services/creation-site-web",
    title: "Création de site web professionnel",
    description:
      "Création de landing pages, sites vitrines et plateformes e-commerce modernes, performantes et optimisées.",
  },
  {
    label: "Refonte de site web",
    href: "/services/refonte-site-web",
    title: "Refonte et modernisation de site web",
    description:
      "Modernisation de sites existants : refonte visuelle, optimisation technique et amélioration des performances.",
  },
  {
    label: "Développement sur mesure",
    href: "/services/developpement-sur-mesure",
    title: "Développement d'applications web sur mesure",
    description:
      "Création d’applications web, outils métier et plateformes adaptées aux besoins spécifiques des entreprises.",
  },
  {
    label: "Accompagnement",
    href: "/services/accompagnement",
    title: "Accompagnement technique et maintenance",
    description: "Maintenance, optimisation et évolution de vos solutions digitales dans la durée.",
  },
];

/*
|--------------------------------------------------------------------------
| CONFIGURATION SITE
|--------------------------------------------------------------------------
*/

export const siteConfig = {
  name: "Arkanya",
  description:
    "Arkanya conçoit des solutions digitales : sites web, plateformes et applications sur mesure pour entreprises ambitieuses.",

  navItems: navList,
  navMenuItems: navList,

  services: servicesList,

  links: {
    website: "https://arkanya.fr",
    email: "mailto:contact@arkanya.fr",
    phone: "tel:+33600000000", // à remplacer
    linkedin: "https://linkedin.com/in/anthony-delforge",
  },
};
