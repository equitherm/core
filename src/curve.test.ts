import { describe, it, expect } from 'vitest';
import { computeFlowTemperature } from './curve';

describe('computeFlowTemperature', () => {
  const defaultParams = {
    tTarget: 21,
    tOutdoor: 5,
    hc: 0.9,
    n: 1.25,
    shift: 0,
    minFlow: 20,
    maxFlow: 70,
  };

  describe('basic calculations', () => {
    it('should compute flow temperature correctly', () => {
      const result = computeFlowTemperature(defaultParams);
      expect(result).toBeGreaterThan(20);
      expect(result).toBeLessThan(70);
    });

    it('should return 0 when outdoor > target (WWS)', () => {
      const result = computeFlowTemperature({
        ...defaultParams,
        tOutdoor: 25,
      });
      expect(result).toBe(0);
    });

    it('should return 0 when deltaT is zero (outdoor == target)', () => {
      const result = computeFlowTemperature({
        ...defaultParams,
        tOutdoor: 21,
      });
      expect(result).toBe(0);
    });

    it('should return 0 regardless of shift in WWS', () => {
      const result = computeFlowTemperature({
        ...defaultParams,
        tOutdoor: 25,
        shift: 5,
      });
      expect(result).toBe(0);
    });

    it('should distinguish WWS (0) from clamped-to-minFlow', () => {
      const wws = computeFlowTemperature({
        ...defaultParams,
        tOutdoor: 25, // deltaT < 0 → WWS → 0
        minFlow: 25,
      });
      const clamped = computeFlowTemperature({
        ...defaultParams,
        tOutdoor: 20, // deltaT = 1, small demand → clamped to minFlow
        hc: 0.1,
        n: 1.0,
        shift: -10,
        minFlow: 25,
      });
      expect(wws).toBe(0);
      expect(clamped).toBe(25);
    });

    it('should apply shift correctly', () => {
      const base = computeFlowTemperature(defaultParams);
      const shifted = computeFlowTemperature({
        ...defaultParams,
        shift: 5,
      });
      expect(shifted).toBeCloseTo(base + 5, 1);
    });

    it('should apply hc coefficient correctly', () => {
      const lowHc = computeFlowTemperature({ ...defaultParams, hc: 0.5 });
      const highHc = computeFlowTemperature({ ...defaultParams, hc: 1.5 });
      expect(highHc).toBeGreaterThan(lowHc);
    });

    it('should apply exponent n correctly', () => {
      const n1 = computeFlowTemperature({ ...defaultParams, n: 1.0 });
      const n2 = computeFlowTemperature({ ...defaultParams, n: 2.0 });
      expect(n1).not.toBe(n2);
    });
  });

  describe('clamping', () => {
    it('should clamp to maxFlow', () => {
      const result = computeFlowTemperature({
        tTarget: 21,
        tOutdoor: -40,
        hc: 3.0,
        n: 1.0,
        shift: 15,
        minFlow: 20,
        maxFlow: 70,
      });
      expect(result).toBe(70);
    });

    it('should clamp to minFlow', () => {
      const result = computeFlowTemperature({
        tTarget: 21,
        tOutdoor: 20, // deltaT = 1, very small
        hc: 0.1,
        n: 1.0,
        shift: -10,
        minFlow: 20,
        maxFlow: 70,
      });
      expect(result).toBe(20);
    });
  });

  describe('input validation', () => {
    it('should return minFlow for NaN tTarget', () => {
      const result = computeFlowTemperature({
        ...defaultParams,
        tTarget: NaN,
      });
      expect(result).toBe(20);
    });

    it('should return minFlow for NaN tOutdoor', () => {
      const result = computeFlowTemperature({
        ...defaultParams,
        tOutdoor: NaN,
      });
      expect(result).toBe(20);
    });

    it('should return minFlow for NaN hc', () => {
      const result = computeFlowTemperature({
        ...defaultParams,
        hc: NaN,
      });
      expect(result).toBe(20);
    });

    it('should return minFlow for NaN n', () => {
      const result = computeFlowTemperature({
        ...defaultParams,
        n: NaN,
      });
      expect(result).toBe(20);
    });

    it('should return minFlow for n <= 0', () => {
      const result = computeFlowTemperature({
        ...defaultParams,
        n: 0,
      });
      expect(result).toBe(20);
    });

    it('should return minFlow for negative n', () => {
      const result = computeFlowTemperature({
        ...defaultParams,
        n: -1,
      });
      expect(result).toBe(20);
    });

    it('should handle inverted min/max gracefully', () => {
      const result = computeFlowTemperature({
        ...defaultParams,
        minFlow: 70,
        maxFlow: 20, // Inverted
      });
      // Should still work, just with swapped min/max
      expect(result).toBeGreaterThanOrEqual(20);
      expect(result).toBeLessThanOrEqual(70);
    });

    it('should return default 20 when minFlow is undefined', () => {
      const result = computeFlowTemperature({
        tTarget: NaN,
        tOutdoor: 5,
        hc: 0.9,
        n: 1.25,
        shift: 0,
      });
      expect(result).toBe(20);
    });
  });
});
