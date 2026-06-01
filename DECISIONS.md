# DECISIONS.md

## Decision: Fastify over Express

**Context:** Selecting the backend HTTP framework for the API server.

**Options Considered:**
- Option A: Express - most popular, large ecosystem
- Option B: Fastify - schema-based validation, better TypeScript support

**Choice:** Option B - Fastify

**Why:** Fastify provides schema-based request/response validation out of the box, better TypeScript support, and significantly faster performance than Express. The plugin architecture also makes it easier to organize and test middleware.

## Decision: pnpm workspaces + Turborepo

**Context:** Setting up the monorepo structure and build tooling.

**Options Considered:**
- Option A: npm/yarn workspaces with individual package scripts
- Option B: pnpm workspaces + Turborepo for cache-aware builds

**Choice:** Option B - pnpm workspaces + Turborepo

**Why:** pnpm's strict dependency resolution prevents phantom dependencies, while Turborepo provides cache-aware task execution across the monorepo. The shared `packages/shared` package serves as a single source of truth for TypeScript types used by both frontend and backend.

## Decision: In-memory singleton store

**Context:** Choosing the data persistence layer for the application.

**Options Considered:**
- Option A: Database (PostgreSQL/MongoDB) for persistent storage
- Option B: In-memory Map-based singleton store

**Choice:** Option B - In-memory singleton store

**Why:** A simple Map-based singleton store is sufficient for this application since it runs as a single Node.js process. Thread safety is not a concern. The store includes a `reset()` method for test isolation.

## Decision: Price stored in cents (integer)

**Context:** How to represent monetary values in the application.

**Options Considered:**
- Option A: Float/decimal numbers (e.g., 19.99)
- Option B: Integers in cents (e.g., 1999)

**Choice:** Option B - Integers in cents

**Why:** All monetary values are stored as integers in cents to avoid floating-point arithmetic errors inherent in JavaScript. This is a standard practice in financial applications.

## Decision: Session-based cart (no auth)

**Context:** How to manage user shopping carts without requiring user accounts.

**Options Considered:**
- Option A: Full user authentication with registration/login
- Option B: Anonymous sessions with UUID in localStorage
- Option C: Cookie-based session tracking

**Choice:** Option B - Anonymous sessions with UUID

**Why:** Anonymous sessions use a UUID stored in `localStorage` and passed via the `x-session-id` header. This avoids the complexity of user registration while still providing persistent cart state per browser session.

## Decision: Admin-triggered discount code generation

**Context:** How to handle discount code creation when order milestones are reached.

**Options Considered:**
- Option A: Auto-generate codes on checkout when nth-order condition is met
- Option B: Admin must explicitly trigger generation after condition is met
- Option C: Scheduled batch generation at fixed intervals

**Choice:** Option B - Admin-triggered generation

**Why:** Instead of auto-generating discount codes on checkout, the admin must explicitly call the generate API after the nth-order condition is met. This gives business control over code distribution and mimics a real-world workflow where a merchant decides when to release promotional codes.

## Decision: Admin authentication via API key header

**Context:** How to secure admin endpoints from unauthorized access.

**Options Considered:**
- Option A: JWT-based authentication with login flow
- Option B: Simple API key passed via custom header (`x-admin-key`)
- Option C: HTTP Basic Auth

**Choice:** Option B - API key via custom header

**Why:** The admin dashboard is a single-user internal tool. JWT adds unnecessary complexity (token refresh, expiration handling). HTTP Basic Auth requires browser credential prompts which degrade UX. A simple API key stored in `sessionStorage` provides sufficient security for this scope while keeping implementation minimal.

## Decision: Discount code format with embedded percentage

**Context:** How to structure discount codes for clarity and traceability.

**Options Considered:**
- Option A: Random string only (e.g., `A1B2C3D4`)
- Option B: Sequential numbering (e.g., `DISCOUNT-001`)
- Option C: Embedded percentage with random suffix (e.g., `SAVE10-A1B2`)

**Choice:** Option C - `SAVE{percentage}-{RANDOM_4_CHARS}`

**Why:** Embedding the discount percentage makes the code self-documenting for both admins and customers. The random suffix prevents guessing other valid codes. The format is short enough to communicate verbally and memorable for users.

## Decision: Environment-based discount configuration

**Context:** How to configure discount rules (frequency and percentage) without code changes.

**Options Considered:**
- Option A: Hardcoded constants
- Option B: Database/config table
- Option C: Environment variables with defaults

**Choice:** Option C - Environment variables (`DISCOUNT_EVERY_NTH_ORDER`, `DISCOUNT_PERCENTAGE`) with sensible defaults

**Why:** Hardcoded values require redeployment for changes. A config table is overkill for an in-memory store. Environment variables allow per-environment configuration (dev, staging, prod) without code changes, while defaults ensure the app works out of the box.

## Decision: SessionStorage for admin key persistence

**Context:** Where to persist the admin API key on the client side.

**Options Considered:**
- Option A: localStorage (persists across browser sessions)
- Option B: sessionStorage (clears on tab close)
- Option C: In-memory state only (requires re-entry on refresh)

**Choice:** Option B - sessionStorage

**Why:** Admin sessions are typically short-lived. sessionStorage provides convenience during an active session but automatically clears when the tab closes, reducing the window for unauthorized access if the device is shared. localStorage would persist indefinitely, increasing security risk.
