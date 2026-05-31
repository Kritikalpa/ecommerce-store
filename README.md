# Ecommerce Store

A fullstack monorepo ecommerce application with a Node.js/TypeScript REST API backend and React/TypeScript frontend. Features cart management, checkout with discount codes, and an admin dashboard. All state is held in-memory (no database).

## Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Backend**: Node.js + TypeScript + Fastify
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **API Client**: Axios
- **Testing**: Vitest

## Project Structure

```
ecommerce-store/
├── packages/
│   ├── shared/          # Shared TypeScript types
│   ├── backend/         # Fastify REST API
│   └── frontend/        # React + Vite SPA
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Prerequisites

- Node.js 18+
- pnpm 9+

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Run development servers

```bash
pnpm dev
```

This starts:
- Backend on `http://localhost:3001`
- Frontend on `http://localhost:5173`

The frontend proxies `/api` requests to the backend automatically.

### Build for production

```bash
pnpm build
```

### Run tests

```bash
pnpm test
```

## Environment Variables

Create a `.env` file in `packages/backend/`:

```env
PORT=3001
ADMIN_API_KEY=admin-secret-key
DISCOUNT_EVERY_NTH_ORDER=5
DISCOUNT_PERCENTAGE=10
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Backend server port |
| `ADMIN_API_KEY` | `admin-secret-key` | API key for admin endpoints |
| `DISCOUNT_EVERY_NTH_ORDER` | `5` | Generate discount code every Nth order |
| `DISCOUNT_PERCENTAGE` | `10` | Discount percentage for generated codes |

## API Reference

### Customer APIs

| Method | Path | Description |
|---|---|---|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get a product by ID |
| GET | `/api/cart` | Get current session cart |
| POST | `/api/cart/items` | Add item to cart |
| PUT | `/api/cart/items/:productId` | Update item quantity |
| DELETE | `/api/cart/items/:productId` | Remove item from cart |
| DELETE | `/api/cart` | Clear cart |
| POST | `/api/orders/checkout` | Checkout (apply discount code) |
| GET | `/api/orders/:id` | Get order details |

All customer requests require `x-session-id` header (auto-injected by frontend).

### Admin APIs

| Method | Path | Description |
|---|---|---|
| POST | `/api/admin/discount-codes/generate` | Generate a discount code |
| GET | `/api/admin/stats` | Get store statistics |

All admin requests require `x-admin-key` header with the configured API key.

## Discount System

- After every Nth order (default: 5), a discount code becomes available for generation
- Admin calls the generate endpoint to create a code (format: `SAVE10-XXXX`)
- Discount codes are single-use globally
- Apply codes at checkout to reduce the order total
