export type Realisation = {
    slug: string
    title: string
    description: string
    image: string

    site?: string
    type?: string

    // --- Étude de cas ---
    context?: string
    challenge?: string
    approach?: string[]
    results?: string
    conclusion?: string

    // --- Données complémentaires ---
    technologies?: string[]

    gallery?: {
        before?: string[]
        after?: string[]
    }

    testimonial?: {
        author: string
        role?: string
        company?: string
        content: string
    }

    metrics?: {
        label: string
        value: string
    }[]

    seo?: {
        title?: string
        description?: string
        keywords?: string[]
    }
}