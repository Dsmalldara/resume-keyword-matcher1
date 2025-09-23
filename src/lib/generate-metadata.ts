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
    template: "%s | Resume Keyword Matcher - ATS Resume Optimizer",
    default:
      "Resume Keyword Matcher - ATS Resume Optimizer & Job Match Analyzer",
  },
  description:
    "Free ATS-friendly resume analyzer and keyword matcher. Optimize your resume for job applications, generate match scores, identify missing keywords, and create tailored cover letters. Beat applicant tracking systems with our AI-powered resume optimizer.",
  keywords: [
    // Primary keywords
    "resume matcher",
    "ATS resume checker",
    "resume analyzer",
    "job match score",
    "resume optimizer",

    // Long-tail keywords
    "ATS friendly resume",
    "resume keyword optimization",
    "applicant tracking system resume",
    "job description matcher",
    "resume vs job description",
    "cover letter generator",
    "resume scanner free",
    "ATS resume test",
    "resume keyword density",
    "job application optimizer",

    // Specific use cases
    "tech resume optimizer",
    "engineering resume matcher",
    "resume dashboard",
    "resume analytics",
    "career tools",
  ],

  // Essential SEO meta tags
  robots:
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",

  // Structured data hints
  category: "Business/Career Tools",

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

  // Additional metadata for better indexing
  other: {
    "google-site-verification": "your-google-verification-code", // Add your actual code
    "msvalidate.01": "your-bing-verification-code", // Add your actual code
  },
};

export function generateMetadata(props?: MetadataProps): Metadata {
  const finalTitle = props?.title
    ? `${props.title} | Resume Keyword Matcher - ATS Resume Optimizer`
    : baseMetadata.title;

  return {
    ...baseMetadata,
    title: finalTitle,
    description: props?.description || baseMetadata.description,
    keywords: props?.keywords || baseMetadata.keywords,

    // Canonical URL - crucial for SEO
    alternates: props?.canonical
      ? {
          canonical: props.canonical,
        }
      : undefined,

    // Enhanced OpenGraph for social sharing
    openGraph: {
      ...baseMetadata.openGraph,
      ...(props?.openGraph || {}),
      title:
        props?.openGraph?.title ||
        props?.title ||
        "Resume Keyword Matcher - Free ATS Resume Optimizer",
      description:
        props?.openGraph?.description ||
        props?.description ||
        baseMetadata.description ||
        undefined,
      images: props?.openGraph?.images ||
        props?.image || [
          {
            url: "/og-image.png",
            width: 1200,
            height: 630,
            alt: "Resume Keyword Matcher - ATS Resume Optimizer Tool",
          },
        ],
      url: props?.canonical || "https://your-domain.com", // Update with your actual domain
    },

    // Enhanced Twitter cards
    twitter: {
      ...baseMetadata.twitter,
      ...(props?.twitter || {}),
      title:
        props?.twitter?.title ||
        props?.title ||
        "Resume Keyword Matcher - Free ATS Optimizer",
      description:
        props?.twitter?.description ||
        props?.description ||
        baseMetadata.description ||
        undefined,
      images: props?.twitter?.image || props?.image || "/twitter-card.png",
    },
  };
}
