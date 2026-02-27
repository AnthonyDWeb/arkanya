export type SiteConfig = typeof siteConfig;

const navList = [
    {
        label: "Accueil",
        href: "/",
        title: "Les Services de Mathilde - Ménage professionnel & garde d’enfants à domicile",
        description:
            "Découvrez les prestations de ménage et garde d’enfants proposées par Les Services de Mathilde.",
    },
    {
        label: "Services",
        href: "/services",
        title: "Les Services de Mathilde - Prestations de ménage et garde d’enfants",
        description:
            "Détail des services de ménage, entretien du domicile et garde d’enfants proposés par Les Services de Mathilde.",
    },
    {
        label: "Tarifs",
        href: "/tarifs",
        title: "Les Services de Mathilde - Tarifs des prestations de ménage et garde d’enfants",
        description:
            "Consultez les tarifs transparents et accessibles des prestations de ménage et de garde d’enfants.",
    },
    {
        label: "Contact",
        href: "/contact",
        title: "Les Services de Mathilde - Prendre contact",
        description:
            "Besoin d’un devis ou d’informations pour un service de ménage ou de garde d’enfants ? Contactez-moi facilement.",
    },

    // ⭐ FAQ déplacée après Contact
    {
        label: "FAQ",
        href: "/faq-credit-impot",
        title: "Les Services de Mathilde - Comprendre le crédit d’impôt de 50%",
        description:
            "Toutes les explications sur le crédit d’impôt de 50% applicable aux services de ménage et de garde d’enfants.",
    },
];

export const siteConfig = {
    name: "Les Services de Mathilde",
    description: "Ménage professionnel et garde d’enfants à domicile en Seine-et-Marne.",
    navItems: navList,
    navMenuItems: navList,

    links: {
        website: "https://lesservicesdemathilde.fr",
        email: "mailto:contact@lesservicesdemathilde.fr",
        phone: "tel:+33600000000",
        instagram: "https://instagram.com/lesservicesdemathilde",
    },
};
