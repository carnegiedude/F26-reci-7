import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { mergeIntervals, type Interval } from '../src/intervals';

// Recitation Part 2 (groups) and problem set Task 2.
// Read the spec in src/intervals/mergeIntervals.ts, then check your progress
// with `npm run mutants:intervals`.
//
// Label every property with its pattern, on the line above its `it(`:
//   // Pattern: invariant. The output is sorted.
// (invariant, algebraic, metamorphic, differential, or conditional)

const interval: fc.Arbitrary<Interval> = fc
  .tuple(fc.integer(), fc.integer())
  .map(([a, b]) => [Math.min(a, b), Math.max(a, b)]);
const intervalList = fc.array(interval);

//creates a list where it creates two tuples, one starting at 
// Creates two intervals where the second starts one integer after the first ends.
const intervaltouchList: fc.Arbitrary<Interval[]> = fc
  .tuple(
    fc.integer({ min: -1_000_000, max: 1_000_000 }),
    fc.integer({ min: -1_000_000, max: 1_000_000 }),
    fc.integer({ min: 0, max: 1_000_000 }),
  )
  .map(([a, b, secondLength]) => {
    const first: Interval = [Math.min(a, b), Math.max(a, b)];
    const secondStart = first[1] + 1;
    const second: Interval = [secondStart, secondStart + secondLength];
    return [first, second];
  });

describe('mergeIntervals', () => {
  // Pattern: invariant. Every input interval lies inside some output interval.
  it('every input interval lies inside some output interval', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const out = mergeIntervals(xs);
        const uncovered = xs.filter(([s, e]) => !out.some(([a, b]) => a <= s && e <= b));
        expect(uncovered).toEqual([]);
      }),
    );
  });

  // Add your properties here. Aim for at least one of each pattern:
  // invariant, algebraic, metamorphic, differential, conditional.

// Pattern: invariant. Resulting intervals never overlap or touch.
it('The resulting intervals never overlap', () => {
  fc.assert(
    fc.property(intervalList, xs => {
      const result = mergeIntervals(xs);
      expect(result.slice(1).every((current, i) => result[i][1] < current[0])).toBe(true);
    }),
  );
});
// Pattern: algebraic. Merging is idempotent.
it('merging again does not change the result', () => {
  fc.assert(
    fc.property(intervalList, xs => {
      const merged = mergeIntervals(xs);
      expect(mergeIntervals(merged)).toEqual(merged);
    }),
  );
});
it.todo('Metamorphic: Changing the order of the tuples in the array does not change the results');
it.todo('Differential: there is no difference between the coverage of the input and output');
// Pattern: conditional. Intervals separated by a gap do not merge.
it('does not merge intervals when the second starts one after the first ends', () => {
  fc.assert(
    fc.property(intervaltouchList, xs => {
      expect(mergeIntervals(xs)).toEqual(xs);
    }),
  );
});
});
