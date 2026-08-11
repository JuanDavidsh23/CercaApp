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
pnpm install
pnpm mobile:start
```

Para Android Emulator (Windows), usa el script dedicado que apunta Metro a `10.0.2.2`:

```bash
pnpm mobile:android
```

Si Expo Go se queda en carga, ejecuta una vez:

```bash
adb reverse tcp:8081 tcp:8081
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
