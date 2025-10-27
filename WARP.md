# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Interactive Rock Paper Scissors game built with Next.js 15, deployed at https://hardrockpaperscissors.app/. The game uses a unique link-sharing mechanism where the host makes a choice, gets a shareable link, and the second player visits that link to play.

## Key Commands

### Development

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start dev server with Turbopack at http://localhost:3000
pnpm run build        # Build for production
pnpm run start        # Start production server
```

### Code Quality

```bash
pnpm run lint         # Run Next.js ESLint
pnpm run lint:ts      # TypeScript type checking (tsc --noEmit)
pnpm run format       # Format code with Prettier
```

## Architecture

### Game Flow

1. **Host creates game** (`/` page) → selects move → calls `/api/create` → gets game ID → shares link
2. **Player joins** (`/[gameId]` page) → sees game state → selects move → calls `/api/play/[id]` → game resolves
3. **Result display** → shows winner with Giphy GIF → option to play again

### Backend Integration

External API hosted on Val.town (https://www.val.town/x/hypersnob/HardRockPaperScissors/code/gameAPI) handles:

- Game creation (`POST /create`)
- Move submission (`POST /play/:id`)
- Game state retrieval (`GET /game/:id`)

All API routes in `src/app/api/` are Next.js proxies that add authentication via `API_URL` and `API_BEARER_TOKEN` environment variables.

### State Management

- **Host identification**: Uses localStorage to track created games with 30-day expiry (`setGameIdWithExpiry`, `getGameIdWithExpiry`)
- **View determination**: GameLoader checks localStorage to determine if user is HOST or PLAYER
- **Game state**: Fetched server-side in `[gameId]/page.tsx`, passed as promise to client component

### SVG Handling

Custom webpack configuration in `next.config.ts` uses `@svgr/webpack` to import SVGs as React components (e.g., `import ArrowIcon from "@/icons/Arrow.svg"`). This applies to both webpack and Turbopack builds.

### Type System

Core types in `src/types.ts`:

- `Move`: "ROCK" | "PAPER" | "SCISSORS"
- `Game`: includes `id`, `winner`, `date_created`, `date_completed`
- `GameResponse`: discriminated union for API responses

### Styling

Tailwind CSS v4 with custom theme defined in `@theme` directive in `src/app/globals.css`:

- `--color-base-dark`: #0f1324 (dark backgrounds)
- `--color-base-light`: #dee1ed (text)
- `--color-accent`: #f2c40d (yellow highlights)

Use `cn()` utility from `src/lib/utils.ts` for conditional class merging.

### Component Patterns

- **Server Components**: `[gameId]/page.tsx` fetches data, passes promise to Suspense
- **Client Components**: Use `"use client"` directive, manage local state with `useState`/`useTransition`
- **Result handling**: `getRandomGifForCase()` selects from predefined Giphy IDs based on game outcome

## Environment Variables

Required in `.env.local`:

```
API_URL=https://your-backend-url.val.town
API_BEARER_TOKEN=your-token-here
```

## Path Aliases

`@/*` maps to `./src/*` (configured in `tsconfig.json`)
