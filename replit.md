# HolaCupid Dating Platform

## Overview
HolaCupid is a full-stack dating platform connecting users with Dominican women. It features user profile browsing, a shopping cart for contact information, and secure payments via Stripe. The platform aims to provide a reliable and authentic way for users to find connections, emphasizing verified profiles and a culturally immersive experience. Its business vision includes expanding to a broader market, leveraging a robust technical architecture, and offering a seamless user experience for dating and cultural exchange.

## Recent Changes (January 2025)
- **PayPal Smart Payment Buttons - Phase 1 Completed (Jan 17, 2025)**: Enhanced PayPal backend infrastructure for in-context checkout:
  - Implemented PayPal Orders API v2 for Smart Payment Buttons
  - Enhanced order creation with customer information, items, and application context
  - Added comprehensive order capture with detailed payment information extraction
  - Created new endpoints: `/api/paypal/orders` and `/api/paypal/orders/:orderID/capture`
  - Backend testing confirmed: Order creation and capture working successfully in sandbox
  - Preserved backward compatibility with legacy endpoints during transition
- **PayPal Migration Completed (Jan 17, 2025)**: Successfully migrated from Stripe to PayPal as the primary payment processor. Completed full 4-phase migration with zero downtime:
  - Phase 1: Integrated PayPal alongside Stripe
  - Phase 2: Made PayPal the default payment method
  - Phase 3: Removed Stripe from frontend UI while maintaining backend compatibility
  - Phase 4: Complete removal of all Stripe routes and references from backend and frontend
  - Enhanced PayPal button descriptions across all 6 languages to show "PayPal, Credit/Debit Card, Apple Pay, Google Pay"
  - Fixed TypeScript cookie configuration issues
  - Preserved existing database fields (stripePaymentIntentId, paymentProvider) for data integrity
- **Google Analytics 4 Integration**: GA4 tracking implemented with measurement ID G-EJ8GKBRN3G in HTML head for comprehensive user analytics
- **Contact Page Redesign**: Streamlined to email-only contact method (admin@holacupid.com), removed contact form, updated common questions section with customer service focus (replacements, refunds, information currency), converted to single-column layout for better user experience
- **Enhanced User Experience**: Hero section with success story collage background, dual measurement system (feet/inches + centimeters) for international users, consistent profile name display across all pages
- **Browse Featured Fix (Jan 13, 2025)**: Resolved critical bug where "Browse Featured Only" button showed all 96 profiles instead of 13 featured profiles. Fixed Wouter router query parameter issue by switching from useLocation() to window.location.search for URL parameter parsing.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: Zustand (cart), TanStack Query (server state)
- **UI Components**: Radix UI primitives, shadcn/ui
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM (Neon serverless PostgreSQL)
- **Payment Processing**: PayPal integration (migrated from Stripe January 2025)
- **Session Management**: PostgreSQL session store
- **Media Storage**: Google Cloud Storage

### Key Features & Design Decisions
- **Database Schema**: Structured for users, comprehensive dating profiles (personal info, attributes, lifestyle, media, pricing), orders, and order items.
- **API Structure**: RESTful endpoints for public profile browsing (featured, all, individual), profile submission, and comprehensive admin management (dashboard stats, profile approval, editing).
- **Authentication & Authorization**: Basic username/password authentication, session-based management, and a robust Role-Based Access Control (RBAC) system for Super Admin, Admin, and User roles with audit logging.
- **Content Moderation**: Profiles require approval by administrators before public display.
- **E-commerce Flow**: Users browse profiles, add to cart, purchase contact information via Stripe, and gain immediate access post-payment.
- **UI/UX Decisions**:
    - Responsive design for desktop and mobile.
    - Horizontal filter layout on desktop for browse profiles; vertical for mobile.
    - Enhanced photo carousel with full-screen viewing, zoom controls, and aspect ratio preservation.
    - Professional media experience with video player controls (play/pause, volume, seek bar, fullscreen).
    - Streamlined profile submission form with consolidated consent checkboxes.
    - Dual measurement system (feet/inches & centimeters) for height selection.
    - Simplified browse page filters (search, location only).
    - Multi-selection checkbox system for "children" field.
    - Consistent profile name display across pages.
- **Internationalization (i18n)**: Comprehensive multilingual support for 6 languages (English, Spanish, German, Italian, Portuguese, Dutch) with:
    - Dedicated translation files for all UI elements and content.
    - Language-aware URL routing.
    - Full localization of homepage, browse, profile, and legal pages.
- **SEO & Performance**:
    - Dynamic sitemap.xml generation including multilingual profile URLs.
    - Comprehensive robots.txt.
    - Enhanced structured data (JSON-LD schemas for Organization, Website, Profile).
    - Dynamic meta tag management (react-helmet-async) with hreflang tags for international SEO.
    - SEO-friendly URL structure (e.g., `/:lang/:slug`).
    - Lazy loading for images, WebP support, and performance resource hints.
    - Analytics framework with Google Analytics 4 readiness and Core Web Vitals monitoring.
    - Static meta tags in `index.html` for immediate crawler visibility.
    - Optimized Open Graph images (JPG format) for social media previews.

## External Dependencies

- **@neondatabase/serverless**: Neon PostgreSQL driver
- **drizzle-orm**: Type-safe ORM
- **@stripe/stripe-js**, **@stripe/react-stripe-js**: Stripe payment processing
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **wouter**: Lightweight React router
- **zustand**: State management
- **Google Cloud Storage**: For media file storage and serving
- **Vite**: Build tool
- **TypeScript**: Language
- **Tailwind CSS**: Styling
- **ESBuild**: Backend bundling
- **Drizzle Kit**: Database migrations