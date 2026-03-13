// src/types/core.ts

// Curve calculation parameters
export interface CurveParams {
  tTarget: number;
  tOutdoor: number;
  hc: number;
  n: number;
  shift: number;
  minFlow?: number;
  maxFlow?: number;
}

// Deadband configuration
export interface DeadbandConfig {
  enabled: boolean;
  thresholdHigh: number;
  thresholdLow: number;
  kpMultiplier: number;
}

// PID computation result
export interface PIDResult {
  total: number;
  p: number;
  i: number;
  d: number;
}

// PID state for computation (accepts either nested or flat structure)
export interface PIDState {
  kp: number;
  ki: number;
  kd: number;
  deadband?: DeadbandConfig;
}
