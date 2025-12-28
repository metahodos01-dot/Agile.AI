import { describe, it, expect } from 'vitest';
import { calculateTotalHours, calculateSprintsNeeded } from './estimations';

describe('Estimation Calculations', () => {
    it('calculates total hours correctly', () => {
        const estimates = { 1: 5, 2: 8, 3: 13 };
        expect(calculateTotalHours(estimates)).toBe(26);
    });

    it('returns 0 for empty estimates', () => {
        expect(calculateTotalHours({})).toBe(0);
        expect(calculateTotalHours(null)).toBe(0);
    });

    it('calculates sprints needed correctly', () => {
        // 100 hours, 2 devs, 6h/day, 10 days/sprint
        // Capacity per sprint = 2 * 6 * 10 = 120 hours
        // 100 / 120 = 0.83 -> 1 sprint
        expect(calculateSprintsNeeded(100, 2)).toBe(1);

        // 200 hours, 2 devs => 200 / 120 = 1.66 -> 2 sprints
        expect(calculateSprintsNeeded(200, 2)).toBe(2);
    });

    it('handles zero team size', () => {
        expect(calculateSprintsNeeded(100, 0)).toBe(0);
    });
});
