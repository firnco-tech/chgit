/**
 * ADVANCED ANALYTICS AND PERFORMANCE MONITORING
 * 
 * Comprehensive analytics framework for HolaCupid platform
 * Includes Google Analytics 4, Core Web Vitals, and conversion tracking
 */

import { useEffect } from 'react';
import { getCurrentLanguage } from '@/lib/i18n';

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
    dataLayer: any[];
  }
}

// Core Web Vitals monitoring
export function initCoreWebVitals() {
  if (typeof window === 'undefined') return;

  // Import web-vitals library dynamically for performance
  import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
    // Largest Contentful Paint
    onLCP((metric: any) => {
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_action: 'LCP',
        value: Math.round(metric.value),
        custom_map: { metric_id: 'lcp' },
      });
    });

    // Interaction to Next Paint (replaces FID in modern web-vitals)
    onINP((metric: any) => {
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_action: 'INP',
        value: Math.round(metric.value),
        custom_map: { metric_id: 'inp' },
      });
    });

    // Cumulative Layout Shift
    onCLS((metric: any) => {
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_action: 'CLS',
        value: Math.round(metric.value * 1000),
        custom_map: { metric_id: 'cls' },
      });
    });

    // First Contentful Paint
    onFCP((metric: any) => {
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_action: 'FCP',
        value: Math.round(metric.value),
        custom_map: { metric_id: 'fcp' },
      });
    });

    // Time to First Byte
    onTTFB((metric: any) => {
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_action: 'TTFB',
        value: Math.round(metric.value),
        custom_map: { metric_id: 'ttfb' },
      });
    });
  });
}

// Google Analytics 4 configuration
export function initGoogleAnalytics(measurementId: string) {
  if (typeof window === 'undefined') return;

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // Define gtag function
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  // Configure Google Analytics
  window.gtag('js', new Date() as any);
  window.gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
    language: getCurrentLanguage(),
    custom_map: {
      'metric_id': 'custom_metric_1'
    }
  });
}

// Enhanced event tracking functions
export const analytics = {
  // Page view tracking with language context
  pageView: (page: string, title?: string) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    window.gtag('event', 'page_view', {
      page_title: title || document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      language: getCurrentLanguage(),
      event_category: 'Navigation',
    });
  },

  // Profile interactions
  profileView: (profileId: number, profileName: string, location: string) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    window.gtag('event', 'profile_view', {
      event_category: 'Profile Interaction',
      event_action: 'View Profile',
      profile_id: profileId,
      profile_name: profileName,
      profile_location: location,
      language: getCurrentLanguage(),
    });
  },

  // Cart and conversion tracking
  addToCart: (profileId: number, profileName: string, price: number) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    window.gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: price,
      items: [{
        item_id: profileId.toString(),
        item_name: profileName,
        category: 'Contact Information',
        price: price,
        quantity: 1
      }],
      event_category: 'E-commerce',
      language: getCurrentLanguage(),
    });
  },

  // Purchase completion
  purchase: (orderId: string, items: any[], totalValue: number) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      value: totalValue,
      currency: 'USD',
      items: items.map(item => ({
        item_id: item.profileId.toString(),
        item_name: item.name,
        category: 'Contact Information',
        price: item.price,
        quantity: 1
      })),
      event_category: 'E-commerce',
      language: getCurrentLanguage(),
    });
  },

  // Search and filtering
  search: (searchQuery: string, filters: any) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    window.gtag('event', 'search', {
      search_term: searchQuery,
      event_category: 'Search',
      search_filters: JSON.stringify(filters),
      language: getCurrentLanguage(),
    });
  },

  // Language switching
  languageSwitch: (fromLanguage: string, toLanguage: string) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    window.gtag('event', 'language_switch', {
      event_category: 'Localization',
      event_action: 'Language Change',
      from_language: fromLanguage,
      to_language: toLanguage,
    });
  },

  // User engagement
  engagementTime: (page: string, timeSpent: number) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    window.gtag('event', 'user_engagement', {
      event_category: 'Engagement',
      event_action: 'Time on Page',
      page_name: page,
      engagement_time_msec: timeSpent,
      language: getCurrentLanguage(),
    });
  },

  // Error tracking
  error: (errorMessage: string, errorPage: string) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    window.gtag('event', 'exception', {
      description: errorMessage,
      fatal: false,
      event_category: 'Error',
      page_name: errorPage,
      language: getCurrentLanguage(),
    });
  }
};

// Global analytics helper function
export function gtag(...args: any[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    (window.gtag as any)(...args);
  }
}

// Analytics component for initialization
export default function Analytics() {
  useEffect(() => {
    // Initialize Google Analytics (replace with actual measurement ID)
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
    initGoogleAnalytics(measurementId);
    
    // Initialize Core Web Vitals monitoring
    initCoreWebVitals();
    
    // Track initial page view
    analytics.pageView(window.location.pathname);
  }, []);

  return null; // This component doesn't render anything
}