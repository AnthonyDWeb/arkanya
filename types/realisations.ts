export type Realisation = {
    slug: string;
    title: string;
    description: string;
    image: string;

    site?: string;
    type?: string;

    // --- Étude de cas ---
    context?: string;      // 5–10 lignes métier
    challenge?: string;    // problématique stratégique
    approach?: string[];   // plan d’action détaillé
    results?: string;      // résultats + impacts
    conclusion?: string;   // synthèse finale (1–5 lignes)

    // --- Données complémentaires ---
    technologies?: string[];
    gallery?: string[];

    beforeImage?: string;
    afterImage?: string;

    testimonial?: {
        author: string;
        role?: string;
        company?: string;
        content: string;
    };

    metrics?: {
        label: string;
        value: string;
    }[];

    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };
};