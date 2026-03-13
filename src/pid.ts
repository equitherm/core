// src/core/pid.ts
import type { DeadbandConfig, PIDResult, PIDState } from './types';

/**
 * Check if error is within deadband
 */
export function isInDeadband(error: number, deadband: DeadbandConfig | undefined): boolean {
  if (!deadband?.enabled) return false;
  const err = -error;
  return (deadband.thresholdLow < err && err < deadband.thresholdHigh);
}

/**
 * Compute PID output
 */
export function computePID(
  state: PIDState,
  setpoint: number,
  processValue: number
): PIDResult {
  const error = setpoint - processValue;

  let pTerm: number;

  if (state.deadband?.enabled) {
    if (isInDeadband(error, state.deadband)) {
      // In deadband: shallow the proportional term
      pTerm = state.kp * error * state.deadband.kpMultiplier;
    } else {
      // Outside deadband: add pdm_offset to prevent jump at boundary
      pTerm = state.kp * error;
      const threshold = (error < 0) ? state.deadband.thresholdHigh : state.deadband.thresholdLow;
      const pdmOffset = (threshold - (state.deadband.kpMultiplier * threshold)) * state.kp;
      pTerm += pdmOffset;
    }
  } else {
    pTerm = state.kp * error;
  }

  const iTerm = state.ki * error;

  // D-term based on error change (requires previous error tracking)
  // Currently disabled as state doesn't track previous error
  const dTerm = state.kd * 0;

  return {
    total: pTerm + iTerm + dTerm,
    p: pTerm,
    i: iTerm,
    d: dTerm
  };
}
