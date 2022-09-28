---
description: >-
  Our test strategy is confidence-based and builds on our system being highly
  intentional. What the hell does that mean? Let me show you.
---

# Testing

The testing approach used here is (for the theoretically minded) in the mostly ["classicist" testing camp](https://martinfowler.com/articles/mocksArentStubs.html#ClassicalAndMockistTesting), which means that we test behaviors and expected output, but nothing regarding the actual implementation details _within_ the thing we test.

Like much programming, **writing good tests should depend on abstractions (interfaces), not concretions**. We can use _test doubles_ (mocks, stubs, spies, fakes) to work for us, rather than using infrastructure and implementations that might be problematic. Examples of that could be external services, unfinished services, anything going over a network, persistence technologies, and so on.

Finally, our maxim is to: Write _positive_ tests for the "happy flows" and _negative_ tests for the "unhappy flows".

## Positive tests

Positive tests are the tests you are most likely already familiar with. These tests verify that some functionality is delivering as per expectations. Simple as that!

{% code title="code/Analytics/SlotAnalytics/__tests__/usecases/AddRecord.test.ts" lineNumbers="true" %}

```typescript
import test from "ava";

import { AddRecordUseCase } from "../../src/application/usecases/AddRecordUseCase";

import { setupDependencies } from "../../src/infrastructure/utils/setupDependencies";

// @ts-ignore
const dependencies = setupDependencies(true);

/**
 * POSITIVE TESTS
 */

test("It should add a record", async (t) => {
  const { repository } = dependencies;
  const data = {
    id: "abc1234",
    correlationId: "qwerty3901",
    event: "CHECKED_IN",
    slotId: "ldkj2h921",
    startsAt: "20220501",
    hostName: "Somebody",
  };

  await AddRecordUseCase(dependencies, data);

  // @ts-ignore
  const result = repository.dataStore[0];

  t.deepEqual(result, data);
});
```

{% endcode %}

Most testing libraries are somewhat similar, and while AVA is a less-used framework than say Jest, it retains the same general flow. The top level is for the imports we need, and we'll also call `import test from 'ava';` so that we have access to AVAs utilities.

Let's understand what we are doing by seeing a minimal test in AVA and what that would be:

```typescript
test("It should verify that 1 is 1", (t) => {
  t.is(1, 1);
});
```

It's pretty basic—The above just verifies that the left-side value (`1`) is the right-side value (`2`). For many tests, using `is()` or `deepEqual()` (for comparing objects) will be enough.

{% hint style="info" %}
Refer to [https://github.com/avajs/ava/blob/main/docs/01-writing-tests.md](https://github.com/avajs/ava/blob/main/docs/01-writing-tests.md) for more detailed instructions on how to use AVA.
{% endhint %}

Remember, unit tests should be easy to understand, stable, and fast to run, and both of those methods make that possible. At the heart of good code and good tests are deterministic input and output. Depending on the exact thing you are testing the nature of the input/output will be somewhat fluid. For a use case, the input is a set of dependencies and the required input data. The output is the Data Transfer Object that represents the data that will be pushed through the physical API (our Lambda handler, in terms of layers).

### What happens within the test?

Essentially what happens inside of the test itself is whatever is required setup to actually perform our test. This might look different depending on the nature of what you are doing. I sometimes hear that testing would be hard or messy, but in the majority of cases I find the following to be true:

- A developer makes for an excellent tester, in terms of skills needed to perform the job. The opposite is not true.
- Well-structured and well-written code takes trivial effort to test.
- Certain types of tests may be harder to verify. An example: Checking that `console.log()` was called. To deal with this we can:
- Accept that not everything is important to verify. A test (and its reported coverage) can be good enough without having to "extract" verification out into the test scope. Basically, if it ran without breaking, that might sometimes be good enough.
- Accept that you might need to implement more complicated test types like [spies](https://blog.bitsrc.io/unit-testing-deep-dive-what-are-stubs-mocks-spies-and-dummies-6f7fde21f710). I believe that these should be avoided as often as possible, since 1) Either make your code easier to verify (i.e. rethink, redesign, refactor) or 2) Do it this time and don't do it again.

## Negative tests

Every non-trivial function, method, or class that is tested should throw a controlled error, ideally a unique one so that you can easily separate them and find out where something went wrong. This should also imply that your user gets that same information, making their life easier too.

The negative tests should map at least to each unique error thrown. For example, given the following...

```typescript
function MessagePrinter(message: string) {
  if (!message) throw new MissingMessageError();
  if (message.length <= 5) throw new MessageLengthTooShortError();
  console.log(message);
}
```

...it would be advisable to add two separate tests for these "unique" errors in the _negative_ section.

{% hint style="info" %}
A useful related pattern that deserves to be mentioned and inspired by is the "[guard clause](https://refactoring.com/catalog/replaceNestedConditionalWithGuardClauses.html)", a pattern in which we return early on pre-conditions and can effectively cut back on `if-else` statements. The reason I am bringing it up is that we should strive to keep functions and methods as flat (on the left margin) as possible, meaning more readable (and possibly testable!) code.
{% endhint %}

## In closing

Testing starts at 100%. After you get to—our near 100%—you'll begin to see the outlines of some of the additional, less obvious checks and tests you have to have.

More importantly for the current context, writing code in a DDD + CA project is going to accelerate your journey to good, testable code because it's already practically in the same territory as ATDD (acceptance test-driven design).

Ensuring that you structure code in a way that cannot be misunderstood and misused, as well as having complex domain classes (like Entities) that can never be in invalid states is going to be a complete game-changer for developers who are frustrated with poor quality and testing practices.

If good code is what you want, DDD is one very concrete way to get there.
