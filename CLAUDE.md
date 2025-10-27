# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Rock Paper Scissors game built with Next.js 15, TypeScript, and Tailwind CSS. The game allows a host to make their choice first, generate a shareable link, and then have another player make their choice to determine the winner.

## Architecture

The application follows a client-server architecture:

- **Frontend**: Next.js app using the App Router pattern
- **Backend API**: External service hosted on val.town (configured via `API_URL` and `API_BEARER_TOKEN` environment variables)

### Key Components Structure

- **Game Flow**:
  - Host makes choice on homepage (`/`) → Creates game via `/api/create` → Gets shareable link (`/[gameId]`)
  - Player receives link → Makes choice → Submits via `/api/play/[id]` → Results displayed

- **View State Management**: Uses localStorage to determine if user is HOST or PLAYER based on game ID expiry
- **Real-time Updates**: Uses `router.refresh()` to update game state after moves are submitted

### Core Types (`src/types.ts`)

```typescript
type Move = "ROCK" | "PAPER" | "SCISSORS";
type Game = {
  id: string;
  winner: "HOST" | "PLAYER" | "DRAW" | null;
  date_created: string;
  date_completed: string | null;
};
```

### API Routes

- `POST /api/create` - Creates new game with host's move
- `POST /api/play/[id]` - Submits player's move and completes game
- `GET /api/giphy/[id]` - Giphy integration for result GIFs

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server with Turbopack
pnpm run dev

# Production build
pnpm build

# Start production server
pnpm start

# Linting
pnpm run lint          # ESLint
pnpm run lint:ts       # TypeScript type checking only

# Code formatting
pnpm run format
```

## Environment Variables

Required for API communication with external backend:

- `API_URL` - Backend API endpoint
- `API_BEARER_TOKEN` - Authentication token for API

## Key Utilities (`src/lib/utils.ts`)

- `getGameResult()` - Determines win/loss messages and emojis based on winner and viewer perspective
- `setGameIdWithExpiry()` / `getGameIdWithExpiry()` - localStorage management for game ID persistence
- `getRandomGifForCase()` - Random GIF selection for game outcomes
- `cn()` - Tailwind CSS class name merging

## Component Patterns

- Uses Server Components by default, Client Components marked with `"use client"`
- Suspense boundaries for async operations (game loading)
- React transitions (`useTransition`) for optimistic UI updates
- Error handling with `notFound()` for invalid games
