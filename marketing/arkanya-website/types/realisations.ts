export type RealisationDisplay = "image" | "icon" | "metrics" | "text";

export type Realisation = {
  slug: string;
  title: string;
  description: string;

  image?: string;

  display?: RealisationDisplay;

  icon?: string;
  quote?: string;

  service?: string;
  serviceType?: string;

  visible?: boolean;
  highlight?: boolean;
  draft?: boolean;

  site?: string;
  type?: string;

  context?: string;
  challenge?: string;
  approach?: string[];
  results?: string;
  conclusion?: string;

  technologies?: string[];

  gallery?: {
    before?: string[];
    after?: string[];
  };

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
