export type Realisation = {
    slug: string;
    title: string;
    description: string;
    image: string;

    site?: string;
    type?: string;

    context?: string;
    challenge?: string;
    approach?: string[];
    results?: string;

    technologies?: string[];
    gallery?: string[];

    beforeImage?: string;
    afterImage?: string;

    testimonial?: {
        author: string;
        role: string;
        company: string;
        content: string;
    };

    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };
};