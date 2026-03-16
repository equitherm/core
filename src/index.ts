// packages/core/src/index.ts
// Public API for @equitherm-studio/core

// Types
export type {
  CurveParams,
  PIDState,
  PIDResult,
  DeadbandConfig,
} from './types.js';

// Main calculations
export { computeFlowTemperature } from './curve.js';
export { computePID, isInDeadband } from './pid.js';
