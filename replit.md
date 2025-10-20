# Stormers360 - 3x3 Basketball Tournament Platform

## Overview

Stormers360 is a comprehensive web platform for managing 3x3 basketball tournaments in Toulouse. The application serves three distinct user roles: Players (who register for tournaments and track stats), Sponsors (who monitor brand engagement and merchandise sales), and Organizers (who create and manage tournaments). The platform features tournament management with bracket generation, live match scoring, a merchandise shop with shopping cart functionality, and role-based dashboards with performance analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing instead of React Router

**UI Component System**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS with custom design system based on Material Design principles
- CSS variables for theming with light/dark mode support
- Custom color palette featuring basketball orange (primary) and professional blue (secondary)
- Typography using Inter (primary), Poppins (display), and JetBrains Mono (monospace) fonts

**State Management**
- React Context API for global state (AuthContext, CartContext, ThemeContext)
- TanStack Query (React Query) for server state management and API caching
- Local storage for persistence of user sessions, cart items, and theme preferences

**Design Rationale**: The combination of Shadcn/ui and Tailwind provides a highly customizable component system while maintaining consistency. Material Design principles ensure information-dense dashboards remain readable. TanStack Query eliminates the need for Redux by handling async state, caching, and mutations declaratively.

### Backend Architecture

**Server Framework**
- Express.js running on Node.js
- RESTful API design with conventional HTTP methods (GET, POST, PATCH, DELETE)
- Middleware for JSON parsing, URL encoding, and request logging

**API Structure**
- Resource-based endpoints: `/api/tournaments`, `/api/teams`, `/api/players`, `/api/matches`, `/api/match-stats`, `/api/products`, `/api/orders`, `/api/courts`, `/api/media`, `/api/inquiries`, `/api/brand-assets`
- Nested routes for related resources (e.g., `/api/tournaments/:id/teams`)
- Standardized error handling with appropriate HTTP status codes
- Request/response logging middleware that tracks duration and captures JSON responses
- Zod validation on POST/PATCH endpoints for data integrity

**Data Layer**
- Storage abstraction layer (IStorage interface) separating business logic from data access
- Drizzle ORM for type-safe database queries and schema management
- Schema definitions shared between client and server via `@shared/schema`
- Zod schemas for runtime validation derived from Drizzle table definitions

**Design Rationale**: The storage abstraction allows swapping database implementations without changing route handlers. Using Drizzle with Zod provides end-to-end type safety from database to API to frontend. Express middleware architecture keeps concerns separated (logging, error handling, authentication).

### Database Schema

**Core Entities**
- **users**: Authentication with username/password (prepared for session management)
- **tournaments**: Tournament metadata including name, location, date, format, status, and team limits
- **teams**: Team registration tied to specific tournaments with win/loss records
- **players**: Individual player profiles with team assignments, jersey numbers, and positions
- **matches**: Game records linking two teams with scores, MVP designation, court assignments, and round information
- **matchStats**: Granular player statistics per match (points, assists, rebounds, steals, blocks)
- **products**: Merchandise catalog with name, price, category, stock status, and images
- **orders**: Customer orders tracking product purchases and quantities
- **courts**: Basketball court locations with availability, contact info, and sponsor visibility metrics
- **media**: Tournament videos and photos with tagging and tournament association
- **inquiries**: Corporate and B2B partnership inquiry forms from sponsors
- **brandAssets**: Sponsor logos, banners, and promotional materials

**Relationships**
- One tournament has many teams
- One team has many players
- One tournament has many matches
- One match involves two teams and has many player statistics
- Players can be designated as match MVPs

**Design Rationale**: The schema supports the full tournament lifecycle from registration through bracket generation to live scoring. Separating match statistics from matches allows detailed player analytics without bloating the match table. UUID primary keys enable distributed systems and avoid sequential ID guessing.

### Authentication & Authorization

**Current Implementation**
- Mock authentication system using React Context
- Email/password and Google OAuth login flows (mocked)
- Role selection dialog after authentication
- Session persistence via localStorage
- User object includes role (Player/Sponsor/Organizer) for UI customization

**Future Considerations**
- Real authentication should use JWT tokens or session cookies
- Password hashing with bcrypt before storage
- OAuth integration with actual Google APIs
- Role-based access control (RBAC) middleware on backend routes

**Design Rationale**: Starting with mock auth allows rapid frontend development. The role-based architecture is already in place (DashboardRouter switches on user.role), making it straightforward to add real authentication later without restructuring components.

### Module Organization

**Role-Based Dashboards**
- PlayerDashboard: Tournament browsing, stat tracking, registration
- SponsorDashboard: Engagement metrics, brand asset management, tournament monitoring
- OrganizerDashboard: Tournament creation, team/player management, match scheduling

**Shared Components**
- TournamentCard: Reusable tournament display with status badges
- StatCard: Metric display with trending indicators
- ProductCard: Merchandise item display for the shop
- Header: Navigation with role-specific menu items and cart indicator

**Tournament Management Features**
- TournamentForm: Create tournaments with validation
- TeamRegistrationForm: Register teams for tournaments
- PlayerRegistrationForm: Add players to teams
- BracketGenerator: Automatic bracket creation based on registered teams
- LiveMatchDashboard: Real-time score entry and MVP selection

**New MVP Modules (October 2025)**
- CourtsPage (Training Hall): Court directory with city/university filtering, availability status, and booking
- MediaHubPage: Video/photo upload and gallery with tagging and tournament filtering
- DevelopmentCenterPage: Player performance stats, skill progress tracking, and training schedule
- SponsorInquiryForm: Corporate and B2B partnership inquiry forms with email/phone/message fields
- MerchShop: Product catalog with shopping cart integration (6 seeded products)

**Design Rationale**: Component-based architecture with clear separation of concerns. Shared components reduce duplication while role-specific dashboards provide tailored experiences. Forms use react-hook-form with Zod validation for consistent error handling.

## External Dependencies

### Database
- **Neon Serverless PostgreSQL**: Serverless Postgres with WebSocket support for edge deployments
- Connection pooling via `@neondatabase/serverless`
- Database URL required via environment variable `DATABASE_URL`
- SSL configuration: Development mode disables certificate validation for Neon connection (NODE_TLS_REJECT_UNAUTHORIZED=0)

### Data Persistence System
- **JSON-based permanent storage**: All initial data stored in `server/data/*.json` files
- **Auto-seeding**: Server automatically loads JSON data into PostgreSQL on first startup
- **Version controlled**: Data changes tracked in Git for consistency across environments
- **Manual re-seed**: Run `npm run db:reseed` to clear database and reload from JSON files
- **Data modules**: products (6), courts (6), tournaments (3), teams (4), players (4), media (4), inquiries (3), brand assets (3)
- **Dynamic data**: Court visibility logs auto-generated for last 31 days based on sponsor metrics

### UI Libraries
- **Radix UI**: Unstyled, accessible component primitives (dialog, dropdown, tooltip, tabs, etc.)
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **React Icons**: Additional icon sets (used for social login icons)

### Form Management
- **React Hook Form**: Performant form state management with minimal re-renders
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Bridge between React Hook Form and Zod

### Data Fetching
- **TanStack Query**: Async state management with automatic caching, background refetching, and optimistic updates

### Development Tools
- **Drizzle Kit**: Database migrations and schema push
- **TypeScript**: Static type checking
- **esbuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution for development server

### Design Assets
- **Google Fonts**: Inter, Poppins, JetBrains Mono
- **Custom Logo**: Stored in `attached_assets/logowhite_1760998128625.png`

### Replit-Specific Plugins
- `@replit/vite-plugin-runtime-error-modal`: Development error overlay
- `@replit/vite-plugin-cartographer`: Code navigation tool
- `@replit/vite-plugin-dev-banner`: Development environment indicator

**Design Rationale**: Neon Serverless allows deployment without managing database servers. Radix UI provides accessible components out of the box, reducing WCAG compliance effort. TanStack Query eliminates boilerplate for API calls and provides offline support. Drizzle's TypeScript integration catches schema errors at compile time rather than runtime.