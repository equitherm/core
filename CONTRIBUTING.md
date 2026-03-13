# Contributing to Equitherm Core

Thanks for your interest in contributing!

## Development Setup

```bash
# Clone the repo
git clone https://github.com/equitherm/core.git
cd core

# Install dependencies
pnpm install

# Start TypeScript in watch mode
pnpm dev
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start TypeScript compiler in watch mode |
| `pnpm build` | Build the package |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm typecheck` | TypeScript type check |

Using [Taskfile.yml](Taskfile.yml):
```bash
task dev        # Start watch mode
task build      # Build
task test       # Run tests
task ci         # Run full CI locally
```

## Project Structure

```
core/
├── src/
│   ├── curve.ts         # computeFlowTemperature()
│   ├── pid.ts           # computePID(), isInDeadband()
│   ├── types.ts         # Core type definitions
│   ├── index.ts         # Public exports
│   └── *.test.ts        # Unit tests
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Run `pnpm typecheck` and `pnpm test`
4. Open a PR with a clear description

## Code Style

- TypeScript strict mode
- Conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- Tests co-located with source files (`*.test.ts`)

## Questions?

Open an issue for bugs, features, or questions.
