// src/core/curve.ts
import type { CurveParams } from './types';

/**
 * Compute flow temperature using equitherm curve formula
 * t_flow = t_target + shift + hc × (t_target - t_outdoor)^(1/n)
 */
export function computeFlowTemperature(params: CurveParams): number {
  const { tTarget, tOutdoor, hc, n, shift, minFlow, maxFlow } = params;

  // Default values for optional params
  const min = minFlow ?? 20;
  const max = maxFlow ?? 70;

  // Validate all required numeric parameters
  if (isNaN(tTarget) || isNaN(tOutdoor) || isNaN(hc) || isNaN(n) ||
      isNaN(shift) || isNaN(min) || isNaN(max)) {
    return min;
  }

  // Validate exponent is positive (required for power operation)
  if (n <= 0) {
    return min;
  }

  // Handle inverted min/max gracefully
  const effectiveMin = Math.min(min, max);
  const effectiveMax = Math.max(min, max);

  const deltaT = tTarget - tOutdoor;
  let tFlow = tTarget + shift;

  if (deltaT > 0) {
    tFlow += hc * Math.pow(deltaT, 1.0 / n);
  }

  // Clamp to min/max
  const clamped = Math.max(effectiveMin, Math.min(effectiveMax, tFlow));

  // Round to 0.1°C precision - aligns with OpenTherm convention
  return Math.round(clamped * 10) / 10;
}
