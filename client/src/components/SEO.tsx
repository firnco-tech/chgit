/**
 * SEO COMPONENT
 * 
 * Dynamic meta tag management using react-helmet-async
 * Implements Dominican-focused SEO strategy with structured data
 */

import { Helmet } from 'react-helmet-async';
import { pageSEOConfig } from '@shared/seo-strategy';
import { getCurrentLanguage, type SupportedLanguage } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';

interface SEOProps {
  page: keyof typeof pageSEOConfig;
  customTitle?: string;
  customDescription?: string;
  customKeywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
  profileData?: {
    name?: string;
    age?: number;
    location?: string;
    photos?: string[];
  };
}

// Multilingual SEO configurations
const multilingualSEOConfig: Record<SupportedLanguage, Record<string, { title: string; description: string; keywords: string[] }>> = {
  en: {
    browse: {
      title: "Browse Dominican Women Profiles | Find Your Perfect Match",
      description: "Discover authentic profiles of beautiful Dominican women seeking international relationships. Browse verified profiles with photos and contact information.",
      keywords: ["dominican women", "dating profiles", "international dating", "latin dating", "dominican singles"]
    },
    profile: {
      title: "Meet {name} from {location} | Dominican Dating Profile",
      description: "Connect with {name}, a {age}-year-old Dominican woman from {location}. View authentic photos and get instant contact information.",
      keywords: ["dominican woman", "dating profile", "{location}", "international romance", "latin connection"]
    }
  },
  es: {
    browse: {
      title: "Perfiles de Mujeres Dominicanas | Encuentra tu Pareja Perfecta",
      description: "Descubre perfiles auténticos de hermosas mujeres dominicanas que buscan relaciones internacionales. Explora perfiles verificados con fotos e información de contacto.",
      keywords: ["mujeres dominicanas", "perfiles de citas", "citas internacionales", "citas latinas", "solteras dominicanas"]
    },
    profile: {
      title: "Conoce a {name} de {location} | Perfil de Citas Dominicana",
      description: "Conéctate con {name}, una mujer dominicana de {age} años de {location}. Ve fotos auténticas y obtén información de contacto al instante.",
      keywords: ["mujer dominicana", "perfil de citas", "{location}", "romance internacional", "conexión latina"]
    }
  },
  de: {
    browse: {
      title: "Profile Dominikanischer Frauen | Finde Deine Perfekte Partnerin",
      description: "Entdecke authentische Profile wunderschöner dominikanischer Frauen auf der Suche nach internationalen Beziehungen. Durchsuche verifizierte Profile mit Fotos und Kontaktinformationen.",
      keywords: ["dominikanische frauen", "dating profile", "internationale dating", "lateinische dating", "dominikanische singles"]
    },
    profile: {
      title: "Lerne {name} aus {location} kennen | Dominikanisches Dating-Profil",
      description: "Verbinde dich mit {name}, einer {age}-jährigen dominikanischen Frau aus {location}. Betrachte authentische Fotos und erhalte sofortige Kontaktinformationen.",
      keywords: ["dominikanische frau", "dating profil", "{location}", "internationale romanze", "lateinische verbindung"]
    }
  },
  it: {
    browse: {
      title: "Profili di Donne Dominicane | Trova la Tua Compagna Perfetta",
      description: "Scopri profili autentici di bellissime donne dominicane in cerca di relazioni internazionali. Sfoglia profili verificati con foto e informazioni di contatto.",
      keywords: ["donne dominicane", "profili di appuntamenti", "incontri internazionali", "incontri latini", "single dominicane"]
    },
    profile: {
      title: "Incontra {name} da {location} | Profilo di Appuntamenti Dominicano",
      description: "Connettiti con {name}, una donna dominicana di {age} anni da {location}. Visualizza foto autentiche e ottieni informazioni di contatto istantanee.",
      keywords: ["donna dominicana", "profilo di appuntamenti", "{location}", "romanticismo internazionale", "connessione latina"]
    }
  },
  pt: {
    browse: {
      title: "Perfis de Mulheres Dominicanas | Encontre Sua Parceira Perfeita",
      description: "Descubra perfis autênticos de belas mulheres dominicanas procurando relacionamentos internacionais. Navegue pelos perfis verificados com fotos e informações de contato.",
      keywords: ["mulheres dominicanas", "perfis de namoro", "namoro internacional", "namoro latino", "solteiras dominicanas"]
    },
    profile: {
      title: "Conheça {name} de {location} | Perfil de Namoro Dominicano",
      description: "Conecte-se com {name}, uma mulher dominicana de {age} anos de {location}. Veja fotos autênticas e obtenha informações de contato instantâneas.",
      keywords: ["mulher dominicana", "perfil de namoro", "{location}", "romance internacional", "conexão latina"]
    }
  },
  nl: {
    browse: {
      title: "Profielen van Dominicaanse Vrouwen | Vind Je Perfecte Partner",
      description: "Ontdek authentieke profielen van prachtige Dominicaanse vrouwen die op zoek zijn naar internationale relaties. Bekijk geverifieerde profielen met foto's en contactinformatie.",
      keywords: ["dominicaanse vrouwen", "dating profielen", "internationale dating", "latijnse dating", "dominicaanse singles"]
    },
    profile: {
      title: "Ontmoet {name} uit {location} | Dominicaans Dating Profiel",
      description: "Maak contact met {name}, een {age}-jarige Dominicaanse vrouw uit {location}. Bekijk authentieke foto's en krijg directe contactinformatie.",
      keywords: ["dominicaanse vrouw", "dating profiel", "{location}", "internationale romantiek", "latijnse connectie"]
    }
  }
};

export function SEO({
  page,
  customTitle,
  customDescription,
  customKeywords,
  ogImage = 'https://holacupid.com/og-image.jpg',
  canonicalUrl,
  structuredData,
  profileData
}: SEOProps) {
  const currentLanguage = getCurrentLanguage();
  const config = pageSEOConfig[page];
  
  // Get multilingual SEO content
  const multilingualConfig = multilingualSEOConfig[currentLanguage]?.[page];
  
  let title = customTitle || multilingualConfig?.title || config.title;
  let description = customDescription || multilingualConfig?.description || config.description;
  let keywords = customKeywords || multilingualConfig?.keywords || config.keywords;
  
  // Dynamic content replacement for profile pages
  if (profileData && page === 'profile') {
    title = title.replace('{name}', profileData.name || 'Dominican Woman')
                 .replace('{location}', profileData.location || 'Dominican Republic')
                 .replace('{age}', profileData.age?.toString() || '');
    description = description.replace('{name}', profileData.name || 'Beautiful Dominican Woman')
                            .replace('{location}', profileData.location || 'Dominican Republic')
                            .replace('{age}', profileData.age?.toString() || '');
    keywords = keywords.map(keyword => 
      keyword.replace('{location}', profileData.location || 'Dominican Republic')
    );
  }
  
  const currentUrl = canonicalUrl || `https://holacupid.com${window.location.pathname}`;
  
  // Alternative language URLs for SEO
  const alternateLanguages = ['en', 'es', 'de', 'it', 'pt', 'nl'] as SupportedLanguage[];
  const basePath = window.location.pathname.replace(/^\/[a-z]{2}\//, '/').replace(/^\/[a-z]{2}$/, '/');
  
  // Enhanced structured data for multilingual content
  const enhancedStructuredData = structuredData ? {
    ...structuredData,
    "@context": "https://schema.org",
    "inLanguage": currentLanguage,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://holacupid.com/${currentLanguage}/browse?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  } : null;

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
      <meta httpEquiv="Content-Language" content={currentLanguage} />
      <meta name="content-language" content={currentLanguage} />
      
      {/* Hreflang Tags for Multilingual SEO */}
      {alternateLanguages.map(lang => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`https://holacupid.com/${lang}${basePath === '/' ? '' : basePath}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`https://holacupid.com/en${basePath === '/' ? '' : basePath}`} />
      
      {/* Performance and Resource Hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//analytics.google.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      
      {/* Enhanced Open Graph Locale */}
      <meta property="og:locale" content={`${currentLanguage}_${currentLanguage.toUpperCase()}`} />
      {alternateLanguages.filter(lang => lang !== currentLanguage).map(lang => (
        <meta key={lang} property="og:locale:alternate" content={`${lang}_${lang.toUpperCase()}`} />
      ))}
      
      {/* Mobile Web App Meta Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="HolaCupid" />
      
      {/* Schema.org Structured Data */}
      {enhancedStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(enhancedStructuredData)}
        </script>
      )}
      
      {/* Performance Optimizations */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//api.stripe.com" />
      <link rel="dns-prefetch" href="//checkout.stripe.com" />
      
      {/* Mobile App Meta Tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="HolaCupid" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Website Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "HolaCupid",
          "description": "Premium Dominican dating platform connecting international men with verified Dominican women",
          "url": "https://holacupid.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://holacupid.com/logo.png",
            "width": 200,
            "height": 60
          },
          "sameAs": [
            "https://facebook.com/holacupid",
            "https://instagram.com/holacupid",
            "https://twitter.com/holacupid"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "availableLanguage": ["English", "Spanish"],
            "areaServed": "Worldwide"
          }
        })}
      </script>
      
      {/* Website Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "HolaCupid",
          "alternateName": "Hola Cupid Dating",
          "url": "https://holacupid.com",
          "description": "Find your perfect Dominican match with verified profiles, authentic connections, and secure communication",
          "inLanguage": "en-US",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://holacupid.com/browse?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
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