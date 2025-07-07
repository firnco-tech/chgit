/**
 * SEO COMPONENT
 * 
 * Dynamic meta tag management using react-helmet-async
 * Implements Dominican-focused SEO strategy with structured data
 */

import { Helmet } from 'react-helmet-async';
import { pageSEOConfig } from '@shared/seo-strategy';

interface SEOProps {
  page: keyof typeof pageSEOConfig;
  customTitle?: string;
  customDescription?: string;
  customKeywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

export function SEO({
  page,
  customTitle,
  customDescription,
  customKeywords,
  ogImage = 'https://holacupid.com/og-image.jpg',
  canonicalUrl,
  structuredData
}: SEOProps) {
  const config = pageSEOConfig[page];
  const title = customTitle || config.title;
  const description = customDescription || config.description;
  const keywords = customKeywords || config.keywords;
  const currentUrl = canonicalUrl || `https://holacupid.com${window.location.pathname}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="HolaCupid" />
      <meta name="robots" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="HolaCupid" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@holacupid" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#ec4899" />
      <meta name="msapplication-TileColor" content="#ec4899" />
      
      {/* Geo Tags for Dominican Focus */}
      <meta name="geo.region" content="DO" />
      <meta name="geo.placename" content="Dominican Republic" />
      <meta name="ICBM" content="18.7357, -70.1627" />
      
      {/* Language and Content Tags */}
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="content-language" content="en" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

// Predefined structured data schemas
export const structuredDataSchemas = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HolaCupid",
    "url": "https://holacupid.com",
    "logo": "https://holacupid.com/logo.png",
    "description": "Premier Dominican dating platform connecting singles worldwide with authentic Dominican women seeking meaningful relationships.",
    "sameAs": [
      "https://www.facebook.com/holacupid",
      "https://www.instagram.com/holacupid",
      "https://twitter.com/holacupid"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-HOLACUPID",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Spanish"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    }
  },

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "HolaCupid",
    "url": "https://holacupid.com",
    "description": "Connect with authentic Dominican women seeking meaningful relationships. Premium dating platform with verified profiles and secure messaging.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://holacupid.com/browse?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },

  service: {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Dominican Dating Service",
    "provider": {
      "@type": "Organization",
      "name": "HolaCupid"
    },
    "description": "Professional Dominican dating service connecting international singles with verified Dominican women.",
    "serviceType": "Dating Service",
    "areaServed": ["United States", "Germany", "Netherlands", "Italy", "Spain", "Brazil"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Dominican Dating Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Profile Verification"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Secure Messaging"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cultural Compatibility Matching"
          }
        }
      ]
    }
  },

  faqPage: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }),

  review: (reviews: Array<{ rating: number; author: string; text: string; date: string }>) => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HolaCupid",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
      "reviewCount": reviews.length,
      "bestRating": 5,
      "worstRating": 1
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "datePublished": review.date,
      "reviewBody": review.text,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5,
        "worstRating": 1
      }
    }))
  })
};

export default SEO;