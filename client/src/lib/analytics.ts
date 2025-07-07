/**
 * ANALYTICS AND SEO TRACKING
 * 
 * Comprehensive tracking for SEO performance monitoring
 * Includes Google Analytics, Search Console integration readiness,
 * and performance metrics collection
 */

// Google Analytics 4 Configuration
export const initializeGA4 = (measurementId: string) => {
  if (typeof window === 'undefined') return;
  
  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
  
  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  
  gtag('js', new Date());
  gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
    custom_map: {
      custom_dimension_1: 'user_type',
      custom_dimension_2: 'profile_category',
      custom_dimension_3: 'search_terms',
    }
  });
  
  // Make gtag available globally
  (window as any).gtag = gtag;
};

// Enhanced event tracking for dating platform
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;
  
  (window as any).gtag('event', eventName, {
    event_category: parameters.category || 'user_interaction',
    event_label: parameters.label || '',
    value: parameters.value || 0,
    custom_parameter_1: parameters.custom1 || '',
    custom_parameter_2: parameters.custom2 || '',
    ...parameters
  });
};

// SEO-specific tracking events
export const seoEvents = {
  // Profile interactions
  profileView: (profileId: number, profileAge: number, profileLocation: string) => {
    trackEvent('profile_view', {
      category: 'profile_engagement',
      label: `profile_${profileId}`,
      profile_age: profileAge,
      profile_location: profileLocation,
      custom1: 'profile_interaction'
    });
  },
  
  // Search behavior
  searchPerformed: (searchTerm: string, resultsCount: number, filters: Record<string, any>) => {
    trackEvent('search', {
      category: 'search_behavior',
      label: searchTerm,
      search_term: searchTerm,
      results_count: resultsCount,
      filters_applied: JSON.stringify(filters),
      custom1: 'search_analytics'
    });
  },
  
  // Cart and conversion events
  addToCart: (profileId: number, profilePrice: number) => {
    trackEvent('add_to_cart', {
      category: 'ecommerce',
      currency: 'USD',
      value: profilePrice,
      items: [{
        item_id: `profile_${profileId}`,
        item_name: `Profile Contact Info ${profileId}`,
        category: 'contact_information',
        price: profilePrice,
        quantity: 1
      }]
    });
  },
  
  // Purchase completion
  purchase: (orderId: number, totalValue: number, profileIds: number[]) => {
    trackEvent('purchase', {
      category: 'ecommerce',
      transaction_id: orderId.toString(),
      value: totalValue,
      currency: 'USD',
      items: profileIds.map(id => ({
        item_id: `profile_${id}`,
        item_name: `Profile Contact Info ${id}`,
        category: 'contact_information',
        price: totalValue / profileIds.length,
        quantity: 1
      }))
    });
  },
  
  // User engagement metrics
  timeOnSite: (duration: number, pageType: string) => {
    trackEvent('engagement_time', {
      category: 'user_engagement',
      label: pageType,
      value: duration,
      engagement_time_msec: duration * 1000,
      custom1: 'time_tracking'
    });
  },
  
  // Form submissions
  profileSubmission: (profileCategory: string, submissionSuccess: boolean) => {
    trackEvent('form_submit', {
      category: 'profile_submissions',
      label: submissionSuccess ? 'success' : 'failure',
      form_type: 'profile_submission',
      profile_category: profileCategory,
      custom1: 'content_generation'
    });
  }
};

// Performance monitoring for Core Web Vitals
export const initializeWebVitals = () => {
  if (typeof window === 'undefined') return;
  
  // Largest Contentful Paint (LCP)
  const observeLCP = () => {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        trackEvent('web_vital_lcp', {
          category: 'performance',
          value: Math.round(lastEntry.startTime),
          metric_value: lastEntry.startTime,
          custom1: 'core_web_vitals'
        });
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP monitoring not supported');
    }
  };
  
  // First Input Delay (FID)
  const observeFID = () => {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          trackEvent('web_vital_fid', {
            category: 'performance',
            value: Math.round(entry.processingStart - entry.startTime),
            metric_value: entry.processingStart - entry.startTime,
            custom1: 'core_web_vitals'
          });
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID monitoring not supported');
    }
  };
  
  // Cumulative Layout Shift (CLS)
  const observeCLS = () => {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        trackEvent('web_vital_cls', {
          category: 'performance',
          value: Math.round(clsValue * 1000),
          metric_value: clsValue,
          custom1: 'core_web_vitals'
        });
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS monitoring not supported');
    }
  };
  
  // Initialize all observers
  observeLCP();
  observeFID();
  observeCLS();
};

// Page view tracking with enhanced SEO data
export const trackPageView = (pagePath: string, pageTitle: string, referrer?: string) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;
  
  (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
    page_path: pagePath,
    page_title: pageTitle,
    page_referrer: referrer || document.referrer,
    custom_map: {
      custom_dimension_1: getUserType(),
      custom_dimension_2: getPageCategory(pagePath),
      custom_dimension_3: getSearchSource(referrer)
    }
  });
};

// Helper functions for enhanced tracking
const getUserType = (): string => {
  // Determine user type based on session/auth state
  return 'anonymous'; // Would integrate with auth system
};

const getPageCategory = (path: string): string => {
  if (path.includes('/profile/')) return 'profile_detail';
  if (path.includes('/browse')) return 'profile_listing';
  if (path.includes('/admin')) return 'admin_panel';
  if (path === '/') return 'homepage';
  return 'other';
};

const getSearchSource = (referrer?: string): string => {
  if (!referrer) return 'direct';
  if (referrer.includes('google')) return 'google_search';
  if (referrer.includes('bing')) return 'bing_search';
  if (referrer.includes('facebook')) return 'facebook';
  if (referrer.includes('instagram')) return 'instagram';
  return 'other_referrer';
};

// Initialize analytics when DOM is ready
export const initializeAnalytics = (gaId?: string) => {
  if (gaId) {
    initializeGA4(gaId);
  }
  initializeWebVitals();
  
  // Track initial page view
  trackPageView(window.location.pathname, document.title);
};

// Export for global access
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}