# Cerca — Mandatory Project Rules

This document defines non-negotiable rules for all contributors and AI agents
working on the Cerca codebase.

---

## 1. Language

- All **code** (identifiers, comments, commit messages) must be in **English**.
- All **UI-facing text** must be defined in i18n translation files (`en.json`, `es.json`).
- No hardcoded user-facing strings in components.

## 2. No Secrets in the Client

- Never commit API keys, tokens, or credentials to the repository.
- Use environment variables and `expo-secure-store` for sensitive data.
- Photo upload uses pre-signed URLs from the backend — no cloud credentials in the app.

## 3. No `any`

- `any` is banned via ESLint (`@typescript-eslint/no-explicit-any: error`).
- Use `unknown` and narrow with type guards or Zod schemas.
- No exceptions without documented justification.

## 4. No `float` for Money

- All monetary values use the `Money` type: `{ amountMinor: number; currency: CurrencyCode }`.
- Format with `Intl.NumberFormat`, respecting minor units per currency (JPY=0, MXN=2, KWD=3).
- Never do `price / 100` generically.

## 5. Money is Mandatory

- Every price, rate, or monetary amount must use the `Money` interface.
- Never represent money as a bare `number` or `string`.

## 6. No `as` for API Responses

- Type assertions (`as SomeType`) are banned via ESLint.
- Always validate API responses with `schema.parse(response)`.
- The raw response type is always `unknown` until validated.

## 7. Zod at the Boundary

- Every API response passes through a Zod schema before entering the app.
- Zod error messages use i18n keys, not hardcoded strings.
- Schema validation happens in the infrastructure layer, never in screens.

## 8. Server is the Authority

- The backend is the single source of truth for data and permissions.
- Frontend authorization is for UX only (hide/disable controls).
- Never trust client-side checks as security measures.

## 9. Clean Architecture

- **Domain**: Pure TypeScript. No React, React Native, or Expo imports.
- **Application**: Use cases. May import domain only.
- **Infrastructure**: Adapters. May import domain + application.
- **Presentation**: UI. May import all layers.
- Dependencies point inward. Enforced by `eslint-plugin-boundaries`.

## 10. Domain is React-Free

- The `src/domain/` directory must never import:
  - `react`
  - `react-native`
  - `expo-*`
  - `@react-navigation/*`
- Enforced by ESLint `no-restricted-imports`.

## 11. TanStack Query for Server State

- All remote data fetching uses TanStack Query.
- No raw `useState` + `useEffect` for API calls.
- Use hierarchical query keys (`listingKeys.detail(id)`).
- Coordinate cache invalidation across related queries.

## 12. FlatList for Large Lists

- Never use `items.map(...)` for rendering lists that may grow.
- Use `FlatList` with `keyExtractor`, `getItemLayout`, and memoized render items.
- The app must handle 5,000+ items without mounting them all.

## 13. `verify.sh` is Mandatory

- All code must pass `./scripts/verify.sh` before merge.
- The script runs: typecheck → lint → format check → tests.
- CI must execute the same script.

## 14. Branching Strategy

- `main`: production-ready code only.
- `develop`: integration branch.
- `feature/*`: new features.
- `fix/*`: bug fixes.
- All changes go through: `feature → develop → PR → main`.
