export type ImageAsset = {
  src: string;
  alt: string;
};

export type SiteConfig = {
  _id: string;

  meta: {
    name: string;
    logo: ImageAsset;
  };

  contact: {
    phone: string;
    whatsapp: {
      url: string;
      label: string;
    };
  };

  hero: {
    mobile: ImageAsset[];
    desktop: ImageAsset[];
    interval?: number;
  };

  video?: {
    url: string;
    title?: string;
    description?: string;
  };

  navigation: {
    label: string;
    href: string;
    icon?: string;
    external?: boolean;
  }[];

  textSections: {
    heading: string;
    paragraph: string;
    bgColor?: string;
    textColor?: string;
    buttonText?: string;
    buttonLink?: string;
    className?: string;
    boldText?: string;
  }[];

  socials: {
    type: "instagram" | "facebook" | "youtube";
    url: string;
  }[];

  // Free-form long-tail settings (per tenant) that don't have a typed field.
  preferences?: Record<string, unknown>;
};
