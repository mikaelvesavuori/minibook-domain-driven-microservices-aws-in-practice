---
description: >-
  Don't get me wrong but your code will break, so let's just aggressively
  prepare for handling errors and exceptions rather pulling out the ukulele and
  singing Kumbaya.
---

# Error handling

{% hint style="info" %}
Since we are using TypeScript, which is a superset of JavaScript, I'll just take a moment to note that in this language an Error and an Exception are for all intents and purposes the same. If you use another language, feel free to translate the advice "generally" back into your context.

Read more at [https://stackoverflow.com/questions/16142583/whats-the-difference-between-error-and-exception-in-javascript](https://stackoverflow.com/questions/16142583/whats-the-difference-between-error-and-exception-in-javascript)
{% endhint %}

If you are a JavaScript/TypeScript/Node developer, you are most certainly aware of `throw new Error("omg it broke again! :/")` — Throwing an error with an optional message.

In most languages there seems to be a more well-established convention to create special errors or exceptions that we can raise when something goes south. I have no hard numbers on this, but I am happy to support that we should indeed do the same our applications!

A pattern I am using is the one we can see examplified here:

{% code title="code/Analytics/SlotAnalytics/src/application/errors/MissingDataFieldsError.ts" lineNumbers="true" %}
```typescript
import { MikroLog } from 'mikrolog';

/**
 * @description Used when data input is missing required fields.
 */
export class MissingDataFieldsError extends Error {
  constructor() {
    super();
    this.name = 'MissingDataFieldsError';
    const message = `Missing one or more required fields!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
```
{% endcode %}

This basic variant can be copied as a foundation into other unique errors as well. I've kept them in the same file (`{folders}/application/errors/errors.ts`) as well as distinct files in that sort of structure. I have no heavy opinion and I've found that as long as we keep them in a clear application-level location it's all workable regardless.

For certain types of errors you may want to take in input, like so:

```typescript
constructor(inputMessage: string) {
  super(inputMessage);
  this.name = 'DemoError';
  const message = `Something went wrong: ${inputMessage}`;
  this.message = message;

  const logger = MikroLog.start();
  logger.error(message);
}
```

TODO
