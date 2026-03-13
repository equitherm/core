<div align="center">

# @equitherm/core

**Pure calculation library for equitherm heating curves and PID control**

[![npm version](https://img.shields.io/npm/v/@equitherm/core.svg)](https://www.npmjs.com/package/@equitherm/core)
[![CI](https://github.com/equitherm/core/actions/workflows/ci.yml/badge.svg)](https://github.com/equitherm/core/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

Zero-dependency TypeScript library for computing heating curve flow temperatures and PID control outputs. Works in any JavaScript environment — Node.js, browser, or embedded runtimes.

## Installation

```bash
npm install @equitherm/core
# or
pnpm add @equitherm/core
```

## Usage

### Heating Curve Calculation

```typescript
import { computeFlowTemperature } from '@equitherm/core';
import type { CurveParams } from '@equitherm/core';

const flow = computeFlowTemperature({
  tTarget: 21,      // Room setpoint (°C)
  tOutdoor: -5,     // Current outdoor temperature (°C)
  hc: 0.9,          // Heat curve coefficient
  n: 1.25,          // Curve exponent
  shift: 0,         // Temperature offset (°C)
  minFlow: 20,      // Minimum flow temperature (°C)
  maxFlow: 70,      // Maximum flow temperature (°C)
});
// → 48.3
```

### PID Control

```typescript
import { computePID, isInDeadband } from '@equitherm/core';
import type { PIDState, PIDResult } from '@equitherm/core';

const pid: PIDState = {
  integral: 0,
  lastError: 0,
};

// Check if temperature is in deadband
if (!isInDeadband(19, 21, { high: 0.5, low: -0.5 })) {
  // Compute PID correction
  const result: PIDResult = computePID(
    pid,
    21,     // Setpoint (°C)
    19,     // Actual temperature (°C)
    { kp: 1.0, ki: 0.0, kd: 0.0 }
  );
  // → { total: 2.0, p: 2.0, i: 0, d: 0 }
}
```

---

## Heating Curve Formula

```
t_flow = t_target + shift + hc × (t_target - t_outdoor)^(1/n)
```

| Parameter | Description | Range | Default |
|-----------|-------------|-------|---------|
| `tTarget` | Room setpoint | 16 – 26 °C | 21 °C |
| `hc` | Heat curve coefficient | 0.5 – 3.0 | 0.9 |
| `n` | Curve exponent | 1.0 – 2.0 | 1.25 |
| `shift` | Constant offset | −15 to +15 °C | 0 °C |
| `minFlow` | Minimum flow temperature | 15 – 35 °C | 20 °C |
| `maxFlow` | Maximum flow temperature | 50 – 90 °C | 70 °C |

The result is clamped to `[minFlow, maxFlow]`.

---

## API Reference

### `computeFlowTemperature(params)`

Calculates the heating curve flow temperature.

**Parameters:**
- `params: CurveParams` — Curve configuration object

**Returns:** `number` — Flow temperature in °C

### `computePID(state, setpoint, actual, gains)`

Computes PID correction.

**Parameters:**
- `state: PIDState` — PID state (integral, lastError)
- `setpoint: number` — Target value
- `actual: number` — Current value
- `gains: { kp, ki, kd }` — PID gains

**Returns:** `PIDResult` — `{ total, p, i, d }`

### `isInDeadband(setpoint, actual, config)`

Checks if the error is within the deadband.

**Parameters:**
- `setpoint: number` — Target value
- `actual: number` — Current value
- `config: { high, low }` — Deadband thresholds

**Returns:** `boolean`

---

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Test
pnpm test

# Type check
pnpm typecheck
```

Or via [Task](https://taskfile.dev): `task build`, `task test`, `task ci`.

---

## Related

- [ESPHome `equitherm` component](https://github.com/P4uLT/esphome) — the climate component this library supports
- [equitherm/web](https://github.com/equitherm/web) — visual configuration tool
- [ESPHome documentation](https://esphome.io/components/climate/equitherm/)

---

## License

[MIT](LICENSE) © P4uLT
