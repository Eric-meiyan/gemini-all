# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development Commands
- `pnpm dev` - Start development server with Next.js App Router
- `pnpm build` - Build the application for production
- `pnpm start` - Start production server
- `pnpm lint` - Run Next.js linting
- `pnpm analyze` - Build with bundle analyzer enabled

### Database Commands
- `pnpm db:generate` - Generate Drizzle database migrations
- `pnpm db:migrate` - Apply database migrations
- `pnpm db:studio` - Open Drizzle Studio for database management
- `pnpm db:push` - Push database schema changes

### Docker Commands
- `pnpm docker:build` - Build Docker image

## Architecture Overview

This is a Next.js TypeScript application using App Router, built as an AI SaaS boilerplate with internationalization, authentication, and payment features.

### Key Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth v5 (beta)
- **UI Framework**: React 19 with Shadcn UI components
- **Styling**: Tailwind CSS v4
- **Internationalization**: next-intl
- **Payment**: Stripe integration
- **AI SDK**: Vercel AI SDK with multiple provider support

### Directory Structure
- `src/app/`: App Router pages and API routes
  - `[locale]/`: Locale-specific pages with i18n routing
  - `api/`: API endpoints (checkout, auth, user management)
- `src/components/`: React components
  - `blocks/`: Landing page layout blocks (header, footer, hero, etc.)
  - `ui/`: Reusable Shadcn UI components
- `src/contexts/`: React Context providers for global state
- `src/i18n/`: Internationalization configuration and translations
- `src/models/`: Data models and database operations
- `src/services/`: Business logic and API services
- `src/types/`: TypeScript type definitions
- `src/aisdk/`: AI SDK integrations with custom providers (Kling video generation)

### Key Features
- Multi-language support with next-intl
- User authentication and session management
- Stripe payment integration with webhooks
- Admin dashboard for user/order management
- Blog/news system with MDX support
- AI-powered features with multiple model providers
- Custom AI SDK extensions for video generation

### Environment Setup
Copy `.env.example` to `.env.development` for local development. Key environment variables include database connection, authentication providers, Stripe keys, and AI provider API keys.

### Code Conventions
- Use functional React components with TypeScript
- Follow Tailwind CSS for styling with Shadcn UI components
- Maintain internationalization structure in `src/i18n/`
- Use Drizzle ORM for database operations
- Component names in CamelCase
- Use React Context for state management