# Testing

Write _positive_ tests for the "happy flows" and _negative_ tests for the "unhappy flows".

### Positive tests

Positive tests are the tests you are most likely already familiar with. These tests verify that some functionality is delivering as per expectations. Simple as that!

{% code title="code/Analytics/SlotAnalytics/__tests__/usecases/AddRecord.test.ts" lineNumbers="true" %}
```typescript
import test from 'ava';

import { AddRecordUseCase } from '../../src/application/usecases/AddRecordUseCase';

import { setupDependencies } from '../../src/infrastructure/utils/setupDependencies';

// @ts-ignore
const dependencies = setupDependencies(true);

/**
 * POSITIVE TESTS
 */

test('It should add a record', async (t) => {
  const { repository } = dependencies;
  const data = {
    id: 'abc1234',
    correlationId: 'qwerty3901',
    event: 'CHECKED_IN',
    slotId: 'ldkj2h921',
    startsAt: '20220501',
    hostName: 'Somebody'
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
test('It should accept that 1 is 1', async (t) => {
  t.is(1, 1);
});
```

Frankly you could even remove the `async` bit, but you get the point.

Essentially what happens inside of the test is whatever required setup to actually perform our test. This might look different depending on the nature of what you are doing. I sometimes hear that testing would be hard or messy, but in the majority of cases I find the following to be true:

* A developer makes for an excellent tester, in terms of skills needed to perform the job. The opposite is not true.
* Well-structured and well-written code takes trivial effort to test.
* Certain types of tests may be harder to verify. An example: Checking that `console.log()` was called. To deal with this we can:
  * Accept that not everything is important to verify. A test (and its reported coverage) can be good enough without having to "extract" verification out into the test scope. Basically, if it ran without breaking, that might sometimes be good enough.
  * Accept that you might need to implement more complicated test types like [spies](https://blog.bitsrc.io/unit-testing-deep-dive-what-are-stubs-mocks-spies-and-dummies-6f7fde21f710). I believe that these should be avoided as often as possible, since 1) Either make your code easier to verify (i.e. rethink, redesign, refactor) or 2) Do it this time and don't do it again.

### Negative tests

Every non-trivial function, method or class that is tested should throw a controlled error, ideally a unique one so that you can easily separate them and find out where something went wrong. This should also imply that your user gets that same information, making their life easier too.

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
A useful related pattern that deserves to be mentioned and be inspired by is the "[guard clause](https://refactoring.com/catalog/replaceNestedConditionalWithGuardClauses.html)", a pattern in which we return early on pre-conditions and can effectively cut back on `if-else` statements. The reason I am bringing it up is that we should strive to keep functions and methods as flat (on the left margin) as possible, meaning more readable (and possibly testable!) code.
{% endhint %}



\--

explain testing and what the approach has been

depend on abstractions (interfaces), not concretions
