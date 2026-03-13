// packages/core/src/index.ts
// Public API for @equitherm-studio/core

// Types
export type {
  CurveParams,
  PIDState,
  PIDResult,
  DeadbandConfig,
} from './types';

// Main calculations
export { computeFlowTemperature } from './curve';
export { computePID, isInDeadband } from './pid';
