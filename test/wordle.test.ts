import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { matchGuess } from '../src/wordle';

// Recitation Part 1: follow along with your TA, filling in the todos below.
// Problem set Task 1: keep adding properties until `npm run mutants:wordle`
// kills every mutant. Read the spec in src/wordle/matchGuess.ts.
//
// Label every property with its pattern, on the line above its `it(`:
//   // Pattern: invariant. The result always has exactly five colors.
// (invariant, algebraic, metamorphic, differential, or conditional)

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Step 1: a generator for five-letter uppercase words.
// const word = ...

const wordFrom = (letters: string) =>
  fc.array(fc.constantFrom(...letters), {minLength: 5, maxLength: 5}).map(cs => cs.join(''));
//const word = wordFrom(ALPHABET);
const word = wordFrom('ABC');

describe('matchGuess', () => {
  //Pattern: invariant. The result always has exactly five colors.
  it('returns exactly five colors', () => {
    fc.assert(
      fc.property(word, word, (secret, guess) => {
        expect(matchGuess(secret, guess)).toHaveLength(5);
      }),
    );
  });
  //Pattern: invariant. Every color is G, Y, or B.
  it('only uses the colors G, Y, B', () => {
    fc.assert(
      fc.property(word, word, (secret, guess) => {
        for (const c of matchGuess(secret, guess)) expect(['G','Y', 'B']).toContain(c);
      }),
    );
  });
  //Pattern: conditional. if the guess is the secret, gives all greens.
  it('guessing the secret gives all greens',() => { 
    fc.assert(
      fc.property(word, w => {
        expect(matchGuess(w, w)).toEqual(['G','G','G','G','G']);
      }),
    );
  });
  //Pattern: invariant. No Letter is credited (G or Y) more times than the secret contains it
  it('never credits a letter more times than the secret contains it', () => {
    fc.assert(
      fc.property(word, word, (secret, guess) => {
        const result = matchGuess(secret, guess);
        for (const letter of new Set(guess)) {
          const credited = [...guess].filter((c, i) => c === letter && result[i] !== 'B').length;
          const inSecret = [...secret].filter(c => c ===letter).length;
          expect(credited).toBeLessThanOrEqual(inSecret)
        }
      }),
    );
  });
  //Pattern: metamorphic. Changing one secret letter makes the original secret an incorrect guess.
  it('if the secret gets mutated, it will not be correct', () => {
    fc.assert(
      fc.property(
        word,
        fc.integer({ min: 0, max: 4 }),
        fc.integer({ min: 1, max: ALPHABET.length - 1 }),
        (secret, index, offset) => {
          const replacement =
            ALPHABET[(ALPHABET.indexOf(secret[index]) + offset) % ALPHABET.length];
          const mutated =
            secret.slice(0, index) + replacement + secret.slice(index + 1);

          expect(matchGuess(mutated, secret)[index]).not.toBe('G');
        },
      ),
    );
  });
  //Pattern: metamorphic. Swapping two different secret letters makes those two positions yellow.
  it('if the secret switches two different letters, it will have 2 yellows when compared to the original secret', () => {
    fc.assert(
      fc.property(
        word,
        fc.integer({ min: 0, max: 4 }),
        fc.integer({ min: 0, max: 4 }),
        (secret, first, second) => {
          fc.pre(first !== second && secret[first] !== secret[second]);

          const switched = [...secret];
          [switched[first], switched[second]] = [switched[second], switched[first]];

          const result = matchGuess(switched.join(''), secret);
          expect(result[first]).toBe('Y');
          expect(result[second]).toBe('Y');
          expect(result.filter(color => color === 'Y')).toHaveLength(2);
        },
      ),
    );
  });
});
