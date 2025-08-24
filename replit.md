# Replit Project Guide

## Overview

This is a full-stack chat application built with React and Express, featuring a modern UI component library and real-time messaging capabilities. The application uses a monorepo structure with shared TypeScript schemas and supports both development and production environments. The frontend is built with Vite and uses shadcn/ui components with Tailwind CSS, while the backend provides REST APIs for message handling with in-memory storage that can be easily migrated to PostgreSQL.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **Routing**: Wouter for client-side routing with a simple chat page and 404 handler
- **UI Components**: shadcn/ui component library with Radix UI primitives and Tailwind CSS styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design

### Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Structure**: RESTful endpoints under `/api` prefix for message operations (GET, POST)
- **Storage Layer**: Abstracted storage interface with in-memory implementation (MemStorage class)
- **Middleware**: JSON parsing, URL encoding, custom request logging, and error handling
- **Development Server**: Vite integration for hot module replacement in development mode

### Data Layer
- **Schema Definition**: Shared TypeScript schemas using Drizzle ORM with Zod validation
- **Database Configuration**: PostgreSQL setup with Drizzle Kit for migrations (currently using in-memory storage)
- **Data Models**: Simple message structure with id, content, and timestamp fields
- **Validation**: Zod schemas for runtime validation of API requests and responses

### Development Workflow
- **Build System**: Vite for frontend bundling, esbuild for backend compilation
- **Type Safety**: Strict TypeScript configuration with path mapping for clean imports
- **Hot Reload**: Development server with automatic reloading for both client and server changes
- **Error Handling**: Comprehensive error boundaries and API error handling with user feedback

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching for API calls
- **wouter**: Lightweight client-side routing library
- **express**: Web framework for the Node.js backend server

### UI and Styling
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Utility for creating component variants
- **clsx**: Utility for conditionally joining class names

### Database and Validation
- **drizzle-orm**: Type-safe ORM for PostgreSQL database operations
- **drizzle-zod**: Integration between Drizzle schemas and Zod validation
- **@neondatabase/serverless**: Serverless PostgreSQL driver for production deployment
- **zod**: TypeScript-first schema validation library

### Development Tools
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution environment for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay for better debugging experience