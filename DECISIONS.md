# DECISIONS.md

## 1. Fastify over Express

Fastify provides schema-based request/response validation out of the box, better TypeScript support, and significantly faster performance than Express. The plugin architecture also makes it easier to organize and test middleware.

## 2. pnpm workspaces + Turborepo

pnpm's strict dependency resolution prevents phantom dependencies, while Turborepo provides cache-aware task execution across the monorepo. The shared `packages/shared` package serves as a single source of truth for TypeScript types used by both frontend and backend.

## 3. In-memory singleton store

A simple Map-based singleton store is sufficient for this application since it runs as a single Node.js process. Thread safety is not a concern. The store includes a `reset()` method for test isolation.

## 4. Price stored in cents (integer)

All monetary values are stored as integers in cents to avoid floating-point arithmetic errors inherent in JavaScript. This is a standard practice in financial applications.

## 5. Session-based cart (no auth)

Anonymous sessions use a UUID stored in `localStorage` and passed via the `x-session-id` header. This avoids the complexity of user registration while still providing persistent cart state per browser session.

## 6. Admin-triggered discount code generation

Instead of auto-generating discount codes on checkout, the admin must explicitly call the generate API after the nth-order condition is met. This gives business control over code distribution and mimics a real-world workflow where a merchant decides when to release promotional codes.
