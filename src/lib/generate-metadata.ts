import { Metadata } from "next";

type MetadataProps = {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?: string | string[];
    url?: string;
    siteName?: string;
    locale?: string;
    type?: string;
  };
  twitter?: {
    card?: "summary" | "summary_large_image" | "app" | "player";
    title?: string;
    description?: string;
    image?: string;
    site?: string;
    creator?: string;
  };
};

const baseMetadata: Metadata = {
  title: {
    template: "%s | Resume Keyword Matcher",
    default: "Resume Keyword Matcher",
  } as { template: string; default: string },
  description:
    "Analyze resumes against job descriptions, generate match scores, highlight missing keywords, and create tailored cover letters — all in one dashboard.",
  keywords: [
    "resume matcher",
    "resume checker",
    "ATS resume",
    "job keyword analysis",
    "cover letter generator",
    "resume dashboard",
  ],
  openGraph: {
    type: "website",
    siteName: "Resume Keyword Matcher",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Dsmalldara",
    creator: "@Dsmalldara",
  },
};

export function generateMetadata(props?: MetadataProps): Metadata {
  return {
    ...baseMetadata,
    title: props?.title || baseMetadata.title,
    description: props?.description || baseMetadata.description,
    keywords: props?.keywords || baseMetadata.keywords,

    // Canonical URL
    alternates: props?.canonical
      ? {
          canonical: props.canonical,
        }
      : undefined,

    // OpenGraph
    openGraph: {
      ...baseMetadata.openGraph,
      ...(props?.openGraph || {}),
      title:
        props?.openGraph?.title ||
        props?.title ||
        (baseMetadata.title as { default: string }).default,
      description:
        props?.openGraph?.description ??
        props?.description ??
        baseMetadata.description ??
        undefined,
      images: props?.openGraph?.images || props?.image || "/og-image.png",
    },

    // Twitter
    twitter: {
      ...baseMetadata.twitter,
      ...(props?.twitter || {}),
      title:
        props?.twitter?.title ||
        props?.title ||
        (baseMetadata.title as { default: string }).default,
      description:
        props?.twitter?.description ??
        props?.description ??
        baseMetadata.description ??
        undefined,
      images: props?.twitter?.image || props?.image || "/og-image.png",
    },
  };
}
