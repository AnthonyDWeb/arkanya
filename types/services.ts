export type ServiceItem = {
    title: string
    description: string
    features: string[]
    price: string
}

export type ServicePage = {
    hero: {
        image: string
        title: string
        subtitle: string
    }

    intro: {
        title: string
        text: string
    }

    services: ServiceItem[]

    cta: {
        title: string
        button: string
    }
}