# HolaCupid Dating Platform

A full-stack dating platform connecting users with verified Dominican women profiles.

## Features

- React frontend with TypeScript
- Express.js backend with PostgreSQL database
- Stripe payment integration
- Profile browsing and filtering
- Shopping cart functionality
- Secure contact information purchasing
- Admin profile approval system

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, PostgreSQL
- **Database**: Neon serverless PostgreSQL with Drizzle ORM
- **Payments**: Stripe integration
- **Deployment**: Replit

## Setup

1. Install dependencies: `npm install`
2. Set up environment variables
3. Run database migrations: `npm run db:push`
4. Start development server: `npm run dev`

## Project Structure

- `client/` - React frontend application
- `server/` - Express backend API
- `shared/` - Shared types and database schema
- `replit.md` - Project documentation and architecture details

## Database Schema

Complete schema includes:
- Users table for authentication
- Profiles table with comprehensive member information
- Orders and order items for payment tracking
- Contact methods and media storage

Built with Replit - July 2025