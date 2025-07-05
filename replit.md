# HolaCupid Dating Platform

## Overview

HolaCupid is a full-stack dating platform specifically designed for connecting people with Dominican women. The application features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence. The platform allows users to browse verified profiles, add contacts to a shopping cart, and purchase access to contact information through Stripe integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: Zustand for cart management, TanStack Query for server state
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Payment Processing**: Stripe integration for secure payments
- **Session Management**: PostgreSQL session store

## Key Components

### Database Schema
The application uses a well-structured PostgreSQL schema with the following main entities:

1. **Users Table**: Basic user authentication (username/password)
2. **Profiles Table**: Comprehensive dating profiles with:
   - Personal information (name, age, gender, location)
   - Physical attributes (height, body type, appearance)
   - Lifestyle information (education, occupation, relationship status)
   - Preferences and interests
   - Photo galleries
   - Contact methods (WhatsApp, Instagram, email, etc.)
   - Approval and featured status flags
   - Pricing information

3. **Orders Table**: Payment transactions with customer information
4. **Order Items Table**: Links orders to specific profiles purchased

### API Structure
RESTful API endpoints include:
- `GET /api/profiles/featured` - Retrieve featured profiles
- `GET /api/profiles` - Browse all approved profiles with filtering
- `POST /api/profiles` - Submit new profiles for approval
- Payment processing endpoints for Stripe integration

### Authentication & Authorization
- Basic username/password authentication system
- Profile approval workflow for content moderation
- Session-based authentication with PostgreSQL session store

## Data Flow

1. **Profile Submission**: Users submit profiles through a comprehensive form
2. **Content Moderation**: Profiles require approval before appearing publicly
3. **Browse & Discovery**: Users can browse approved profiles with filters
4. **Cart Management**: Selected profiles are added to a persistent shopping cart
5. **Payment Processing**: Stripe handles secure payment transactions
6. **Access Granted**: After payment, users receive contact information

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: Type-safe database ORM
- **@stripe/stripe-js & @stripe/react-stripe-js**: Payment processing
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **wouter**: Lightweight React router
- **zustand**: State management for cart functionality

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the application
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: JavaScript bundler for production
- **Drizzle Kit**: Database migration and management

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds the React application to `dist/public`
2. **Backend**: ESBuild bundles the Express server to `dist/index.js`
3. **Database**: Drizzle Kit manages schema migrations

### Environment Configuration
- **Development**: `npm run dev` - runs both frontend and backend with hot reload
- **Production**: `npm run build` followed by `npm start`
- **Database**: `npm run db:push` for schema deployment

### Infrastructure Requirements
- Node.js runtime environment
- PostgreSQL database (Neon serverless recommended)
- Stripe account for payment processing
- File storage for profile images

## Changelog

- July 05, 2025. Initial setup and complete platform development
  - Built full-stack e-commerce platform for Dominican women profiles
  - Integrated PostgreSQL database with complete schema
  - Added Stripe payment processing for contact information purchases
  - Created responsive UI with React, Tailwind CSS, and shadcn/ui components
  - Implemented cart functionality with persistent storage
  - Added sample profiles for demonstration
  - All core features functional and ready for deployment

## User Preferences

Preferred communication style: Simple, everyday language.