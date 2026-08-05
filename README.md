## Cerca

A marketplace for local services built with Expo SDK 57, React Native, and TypeScript.

### Architecture

This project follows Clean Architecture with four layers:

- **Domain** — Pure TypeScript business logic
- **Application** — Use cases and orchestration
- **Infrastructure** — HTTP client, storage, API adapters
- **Presentation** — React Native components and hooks

### Quick Start

```bash
npm install
npm run mobile:start
```

### Verification

```bash
./scripts/verify.sh
```

### Branching

- `main` — production
- `develop` — integration
- `feature/*` — new features
- `fix/*` — bug fixes
