# Error handling

{% hint style="info" %}
Since we are using TypeScript, which is a superset of JavaScript, I'll just take a moment to note that in this language an Error and an Exception are for all intents and purposes the same. If you use another language, feel free to translate the advice "generally" back into your context. Read more at [https://stackoverflow.com/questions/16142583/whats-the-difference-between-error-and-exception-in-javascript](https://stackoverflow.com/questions/16142583/whats-the-difference-between-error-and-exception-in-javascript)
{% endhint %}

Example:

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
