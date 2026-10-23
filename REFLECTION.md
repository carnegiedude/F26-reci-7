# Reflection

**Name / Andrew ID:**
 Nathan Peters / npeters

**Recitation group members (Task 2):**
NA, did not get to group work.

---

### 1. Valid but weak

Pick a property you wrote that passes on the correct implementation but
kills few or no mutants. Why is it still a *valid* property? Describe a
concrete bug (not one of our mutants) that it *would* catch.

A property I wrote that passes on the correct implementation but kills few or no mutants is if the secret gets mutated and compared with the original secret, it will not result in a correct response. This is still a valid property because it makes sure that a wrong answer is not treated as correct. It would catch a bug as long as there is green it would be accepted.

### 2. A generator problem, not a property problem

Describe a mutant, from either task, that survived or was flaky because of
your **generator** rather than your property. What did the generator fail to
produce? How did you fix it? Paste the runner output from before and after.
A mutant that survived or was flaky was touchingNotMerged because of my generator. The generator failed to produce intervals where the edges were equal. I fixed it by creating another invariant with a new generator that made sure they overlapped every time.

Before:
~ touchingNotMerged       flaky: killed in 1/5 runs  by: The resulting intervals never overlap
      Counterexample: [[[0,26],[26,26]]]
      AssertionError: expected false to be true // Object.is equality
After:
touchingNotMerged       killed  by: The resulting intervals never overlap
      Counterexample: [[[0,0],[0,0]]]
      AssertionError: expected false to be true // Object.is equality


### 3. Reading a counterexample

Paste one counterexample that the mutation runner printed for a killed
mutant. In 2–3 sentences, explain using the *specification* why that input
exposes the bug.
One counterexample that the mutation runner printed for a killed mutant is Counterexample: [[[0,0],[1,1]]]. The specification states that consecutive intervals neither overlap nor touch. There is a gap between the numbers of 0 and one made up of all the real numbers between them. This means that they should not be merged because 0 is less than one.

### 4. Your project

Name one function or module in your team's project that would benefit from
property-based testing. State two properties in English, name the pattern of
each, and describe the generator you'd need, including anything about its
inputs that a naive generator would get wrong.

One function or module in my team's project that could benefit from property based testing is the /associate function. One property that could be tested is the metamorphic property of two different ways to name the same file will reach the same place. Another would be the invariant that one path maps to at most one file. The generator would need to be made up of different schema to get to a file path. The inputs would have to follow specific formats for file paths in order to ensure any positive response from the function. This is because file paths are very complicated and a naive generator would rarely reach a real file path.