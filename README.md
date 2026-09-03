# The Daemon Abyss

A personal technical journal and web log with a classic web aesthetic: serif body type, underlined links, thin borders, no nonsense, no tracking, and no cookies.

Reflections on Computer Engineering, Software Development, Systems Administration, and IT topics by **Moncef Mokrani**.

Built with **React 18**, **TypeScript**, **Tailwind CSS**, and backed by **Turso (libSQL)** with an automatic offline local cache fallback.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```

The app will run at `http://localhost:5173`.

### 3. Build for production
```bash
npm run build
npm run preview
```

---

## Database & Backend (Turso libSQL)

The blog connects directly to **Turso Database**:
- **Database URL**: `libsql://blog-moncef-mkrn-tkqxoj.aws-eu-west-1.turso.io`
- Configured via environment variables in `.env`:
  ```env
  VITE_TURSO_DATABASE_URL=libsql://blog-moncef-mkrn-tkqxoj.aws-eu-west-1.turso.io
  VITE_TURSO_AUTH_TOKEN=<your-turso-token>
  ```
- Uses `@libsql/client/web` for fast, edge-ready queries and inserts.
- If offline or unconfigured, falls back gracefully to `localStorage` caching.

---

## Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the production bundle in `dist/`.
- `npm run typecheck`: Runs TypeScript compiler check (`tsc --noEmit`).
- `npm run lint`: Runs ESLint check across all TypeScript and React files.
- `npm run preview`: Locally previews the production build.

---

## Architecture & Features

- **Personal Brand & Lore**: "The Daemon Abyss" by Moncef Mokrani, featuring custom sword emblem and profile imagery.
- **Hash-based Routing**: Lightweight client-side routing (`#/`, `#/writing`, `#/post/:id`, `#/about`, `#/links`, `#/login`, `#/new`).
- **Turso libSQL Integration**: Real-time querying of reflections from Turso cloud database.
- **Writer Authentication**: Public visitors read reflections; authenticated writers can compose and publish new entries.
# blog
