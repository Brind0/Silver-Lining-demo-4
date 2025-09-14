# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

The project uses Next.js with TypeScript. Available commands from package.json:

- **Development**: `npm run dev` - Start development server on port 3000
- **Build**: `npm run build` - Build production bundle  
- **Production**: `npm run start` - Start production server
- **Linting**: `npm run lint` - Run Next.js ESLint

No explicit test framework is configured in package.json, so check the project for testing approach before adding tests.
- **WebSocket Server**: `node websocket-server.js` - Start real-time server on port 3001

## Architecture Overview

This is a **luxury property management dashboard** with real-time cost tracking and RAG (Red/Amber/Green) project health monitoring system. It's designed as a demo platform showcasing business management capabilities.

### Core Technologies
- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS v4
- **UI Library**: shadcn/ui components with extensive Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens, animations, and CSS variables
- **Database**: SQLite with custom database services (`sqlite3` package)
- **Real-time**: Socket.io WebSocket server for live updates
- **Data Visualization**: Recharts for analytics and forecasting
- **OCR Processing**: Tesseract.js for receipt processing with WebAssembly
- **Forms**: React Hook Form with Zod validation and resolvers
- **HTTP Client**: Axios for API communications

### Project Structure

```
app/                    # Next.js App Router pages
├── api/                # API routes (REST endpoints)
│   ├── messages/       # Communication API endpoints
│   ├── receipts/       # Receipt processing endpoints
│   ├── rag-chat/       # RAG chat system endpoint
│   └── webhooks/       # External webhook handlers (Telegram)
├── projects/           # Project management pages
├── receipts/           # Receipt processing UI
├── costs/              # Cost tracking interface
├── messages/           # Communication system UI
├── reports/            # Analytics and reporting dashboard
├── users/              # User management pages
└── setup/              # Application setup and configuration

components/             # Reusable React components
├── ui/                 # shadcn/ui base components
├── professional-*.tsx  # Business analysis components
├── rag-*.tsx          # RAG status system components  
├── receipt-*.tsx      # Receipt processing components
└── *-modal.tsx        # Dialog/modal components

lib/
├── db/                # Database services (SQLite)
│   ├── messages-db.ts # Communication message storage
│   └── receipts-db.ts # Receipt data storage
├── services/          # Business logic services
│   ├── rag-service.ts # RAG chat system integration
│   ├── communication-service.ts # Message handling
│   └── office-agent-service.ts  # Agent automation
├── types/             # TypeScript type definitions
└── *.ts              # Utilities (OCR, calculations, formatters)

hooks/                 # Custom React hooks
```

### Key Business Features

**RAG Status System**: Core feature providing Red/Amber/Green project health indicators
- Status classification based on budget variance and timeline
- Visual indicators with colored borders, backgrounds, and badges
- Real-time status updates across dashboard and project views

**Project Management**: 
- Multi-business unit filtering (Golf Sim, Listed Buildings, Walpole Properties)
- Task management with trade categorization (Electrical, Plumbing, Carpenter, Other)
- Team assignment system with dropdown selectors
- Interactive task completion with visual feedback

**Budget Forecasting**:
- Predictive analytics with overrun warnings
- Weekly spending visualization with trend analysis
- Color-coded progress bars and confidence metrics
- Warning system with timeline predictions

**Receipt Processing**:
- OCR integration using Tesseract.js with multiple processor implementations
- Smart data extraction and validation with fallback systems
- Real-time WebSocket integration for processing updates
- SQLite database storage with structured data

**Communication System**:
- Message management with SQLite persistence
- RAG (Retrieval-Augmented Generation) chat integration
- Telegram webhook integration for external communication
- Email template system with automated generation

## Design System

The application follows a professional design language:

**Color Palette**:
- Navigation: Slate grays (#0F172A, #1E293B) 
- Primary Actions: Blue (#3B82F6)
- RAG Colors: Green (#10B981), Amber (#F59E0B), Red (#EF4444)
- Typography: Inter font family, 16px base size

**Component Patterns**:
- Cards with subtle gradients and shadows
- Color-coded borders for status indication
- Professional badge styling with proper contrast
- Responsive grid layouts with mobile-first approach

## Database Architecture

**SQLite Integration**:
- `lib/db/messages-db.ts` - Communication message storage
- `lib/db/receipts-db.ts` - Receipt data and processing results
- Custom database services with proper error handling

**WebSocket Server**:
- `websocket-server.js` - Real-time communication server on port 3001
- Built with Socket.io for real-time receipt processing and dashboard updates
- Rate limiting (10 connections per IP per minute) and security middleware
- CORS configuration for development (`localhost:3000`) and production
- Handles `new-receipt`, `receipt-processed`, and `test-receipt` events
- Automatic graceful shutdown with SIGTERM/SIGINT handlers

## Development Guidelines

**Component Development**:
- Use shadcn/ui components as base, extend with custom styling
- Follow existing color-coding patterns for status indicators
- Implement responsive design with Tailwind's grid system
- Use React Hook Form for form validation with Zod schemas

**State Management**:
- Local component state with useState for UI interactions
- Custom hooks for shared logic (see hooks/ directory)
- WebSocket integration for real-time features

**Data Processing**:
- OCR processing with multiple implementations:
  - `lib/ocr-processor.ts` - Main OCR interface
  - `lib/real-ocr-processor.ts` - Tesseract.js implementation
  - `lib/smart-demo-ocr.ts` - Demo data generator
  - `lib/fallback-ocr-processor.ts` - Fallback processor
- Business calculations in `lib/evm-calculations.ts` for budget variance analysis
- Xero integration formatting in `lib/xero-formatter.ts` for accounting exports
- Communication services in `lib/services/` directory

**Styling Conventions**:
- Use Tailwind's design tokens defined in tailwind.config.ts with CSS variables
- Follow 8-point grid system for spacing and container-centered layouts
- Professional appearance with subtle color accents and sidebar theming
- Consistent hover states and transitions with animation support
- Dark mode support via class-based theme switching

## Critical Implementation Notes

1. **Task Management**: The system uses custom tab implementation instead of Radix UI Tabs to avoid context errors
2. **RAG Status Logic**: Status determination based on percentage variance thresholds (≤5% green, ≤15% amber, >15% red)
3. **Real-time Features**: WebSocket connection required for live dashboard updates - start server with `node websocket-server.js`
4. **Mobile Support**: Responsive design with mobile-bottom-nav component for small screens
5. **Next.js Configuration**: Custom webpack config in `next.config.mjs` handles Tesseract.js worker files and WASM assets with fallback resolution
6. **Build Settings**: TypeScript and ESLint errors are ignored during builds (`ignoreBuildErrors: true`, `ignoreDuringBuilds: true`) for demo purposes
7. **Database Files**: SQLite databases (`receipts.db`, `messages.db`) are created in project root during development
8. **Image Optimization**: Images are unoptimized in Next.js config for demo deployment compatibility
9. **WebAssembly Support**: Custom webpack rules handle `.wasm` files as asset resources for Tesseract.js

## Development Context

This is a demo platform showcasing luxury property management capabilities. The current focus areas based on recent changes include:

- Professional analysis suite with variance calculation
- Budget forecasting with predictive analytics  
- Enhanced task management with trade categorization
- Receipt processing workflow optimization

When working on this codebase, maintain the professional business context and ensure all features align with the luxury property management theme.