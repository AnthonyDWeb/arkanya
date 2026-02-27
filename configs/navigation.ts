export type SiteConfig = typeof siteConfig;

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
        title: "Arkanya - Solutions web et applications sur mesure",
        description:
            "Découvrez les solutions proposées par Arkanya : création et refonte de sites web, e-commerce, applications métier et accompagnement technique.",
    },
    {
        label: "Réalisations",
        href: "/realisations",
        title: "Arkanya - Réalisations et projets digitaux",
        description:
            "Explorez les réalisations d’Arkanya : refontes de sites, projets sur mesure et solutions digitales pour PME.",
    },
    {
        label: "À propos",
        href: "/a-propos",
        title: "Arkanya - Studio digital fondé par Anthony Delforge",
        description:
            "Découvrez la vision d’Arkanya et l’approche adoptée pour accompagner durablement les PME dans leurs projets digitaux.",
    },
    {
        label: "Contact",
        href: "/contact",
        title: "Arkanya - Discuter de votre projet digital",
        description:
            "Besoin d’un site web, d’une refonte ou d’une application sur mesure ? Contactez Arkanya pour échanger sur votre projet.",
    },
];

export const siteConfig = {
    name: "Arkanya",
    description:
        "Studio digital spécialisé en solutions web et applications sur mesure pour PME ambitieuses.",
    navItems: navList,
    navMenuItems: navList,

    links: {
        website: "https://arkanya.fr",
        email: "mailto:contact@arkanya.fr",
        phone: "tel:+33600000000", // à remplacer
        linkedin: "https://linkedin.com/in/anthony-delforge",
    },
};