# CLAUDE.md

Guidance for Claude Code when working with this project.

## Requirements

- **Node.js**: ≥22
- **pnpm**: 10.x (use `corepack enable` or install globally)

## Project Overview

**@equitherm/core** - Pure calculation library for equitherm heating curves and PID control. Zero DOM/framework dependencies, works in any JavaScript environment.

## Commands

```bash
pnpm dev          # Start TypeScript in watch mode
pnpm build        # Build to dist/
pnpm test         # Run tests (Vitest)
pnpm test:watch   # Run tests in watch mode
pnpm typecheck    # TypeScript type check (strict mode)
```

Using [Taskfile.yml](Taskfile.yml):
```bash
task dev          # Start watch mode
task build        # Build
task test         # Run tests
task ci           # Run full CI locally
```

## Project Structure

```
core/
├── src/
│   ├── curve.ts         # computeFlowTemperature()
│   ├── pid.ts           # computePID(), isInDeadband()
│   ├── types.ts         # Core type definitions
│   ├── index.ts         # Public exports
│   └── *.test.ts        # Unit tests (co-located)
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .releaserc.json      # semantic-release config
└── .github/workflows/   # CI and release pipelines
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Package Manager | pnpm 10 |
| Language | TypeScript 5.9 (strict mode) |
| Build | tsc (ESM output) |
| Testing | Vitest |
| Release | semantic-release |

## Public API

```typescript
import {
  computeFlowTemperature,  // Main curve calculation
  computePID,              // PID output calculation
  isInDeadband,            // Check if error in deadband
} from '@equitherm/core';

import type {
  CurveParams,
  PIDState,
  PIDResult,
  DeadbandConfig,
} from '@equitherm/core';
```

## Heating Curve Formula

```
t_flow = t_target + shift + hc × (t_target - t_outdoor)^(1/n)
```

- Clamped to `[minFlow, maxFlow]`
- Returns `minFlow` for invalid inputs (NaN, n ≤ 0)

### Heating Curve Parameters

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| `tTarget` | 16-26°C | 21°C | Room setpoint temperature |
| `hc` | 0.5-3.0 | 0.9 | Heat curve coefficient (steepness) |
| `n` | 1.0-2.0 | 1.25 | Curve exponent (non-linearity) |
| `shift` | -15 to +15°C | 0°C | Constant temperature offset |
| `minFlow` | 15-35°C | 20°C | Minimum flow temperature |
| `maxFlow` | 50-90°C | 70°C | Maximum flow temperature |
| `tOutMin` | -30 to 5°C | -20°C | Outdoor temp range minimum |
| `tOutMax` | 0-30°C | 20°C | Outdoor temp range maximum |

## PID Control

### Modes

- **Offset Mode**: `roomTemp` is an offset from setpoint (-5 to +5°C)
- **Absolute Mode**: `roomTemp` is actual room temperature (10-30°C)

### Parameters

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| `kp` | 0-5 | 1.0 | Proportional gain |
| `ki` | 0-0.5 | 0.0 | Integral gain |
| `kd` | 0-2 | 0.0 | Derivative gain |

### Deadband

- `thresholdHigh`: 0-2°C (upper bound)
- `thresholdLow`: -2-0°C (lower bound)
- `kpMultiplier`: 0-1 (Kp reduction factor)

## Key Conventions

1. **Pure functions**: All exports are pure functions with no side effects
2. **TypeScript strict mode**: Full type safety
3. **Co-located tests**: Test files live next to source (`*.test.ts`)
4. **ESM only**: Package exports ES modules (`"type": "module"`)
5. **Conventional commits**: `feat:`, `fix:`, `docs:`, etc.

## Input Validation

The library handles edge cases gracefully:

- Invalid `n` (≤ 0) returns `minFlow`
- NaN inputs return `minFlow`
- Inverted min/max values are swapped automatically

## Testing

Tests are co-located with source files in `src/*.test.ts`.

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
```

## Release

Automated via semantic-release on push to `main`:
- Analyzes conventional commits
- Generates changelog
- Publishes to npm
- Creates GitHub release

Requires `APP_ID`, `APP_PRIVATE_KEY`, and `NPM_TOKEN` secrets.


## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/). Semantic-release
is configured to publish to npm only on `feat:` and `fix:` commits.

### Types that trigger a release (→ npm publish)

| Type                                  | Version bump |
| ------------------------------------- | ------------ |
| `feat:`                               | minor        |
| `fix:`                                | patch        |
| `feat!:` or `BREAKING CHANGE:` footer | major        |

### Types that do NOT trigger a release

- `ci:` — CI/CD workflow changes (pipelines, actions, runner config)
- `chore:` — maintenance (deps updates, tooling, config)
- `docs:` — documentation only
- `test:` — tests only
- `refactor:` — internal refactoring, no behavior change
- `style:` — formatting, whitespace

### Rule

If the published npm package (`dist/`) is identical before and after the commit,
use a non-releasing type. When in doubt: code change → `fix:`/`feat:`, everything
else → `ci:`/`chore:`/`docs:`/`test:`/`refactor:`.

### Examples

feat(curve): add outdoor temperature clamping
fix(pid): correct integral windup reset on mode change
ci(release): replace cycjimmy action with npx semantic-release
ci(release): remove @semantic-release/git plugin
chore(deps): update vitest to 3.1.0
docs: add tuning guide to README
test(curve): add edge cases for negative outdoor temps
refactor(pid): extract derivative smoothing into helper
