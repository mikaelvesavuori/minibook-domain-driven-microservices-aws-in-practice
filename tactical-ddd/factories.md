---
description: >-
  Factories enable efficient and simple production of (usually) complex objects.
  Let's use them to simply our implementation interfaces.
---

# Factories

Factories encapsulate the creation of, primarily, complex objects such as those in the domain layer. The pattern itself has nothing to do with DDD. In the context of DDD we gain even better enforcement of encapsulation, which is especially meaningful when we need to construct an entity or aggregate.

## An example

To be fair, there are no good uses of factories in Get-A-Room. Instead factories have been used to remove the ugly `new SomeClass()` calls. I'll happily use it whenever I want to avoid letting a user directly access a class, like this:

{% code title="code/Analytics/SlotAnalytics/src/infrastructure/repositories/DynamoDbRepository.ts" lineNumbers="true" %}
```typescript
/**
 * @description Factory function to create a DynamoDB repository.
 */
export function createNewDynamoDbRepository(): DynamoDbRepository {
  return new DynamoDbRepository();
}
```
{% endcode %}

We can also use it to package some important checks or validations we may have, like with the EventBridge emitter:

{% code title="code/Reservation/SlotReservation/src/infrastructure/emitters/EventBridgeEmitter.ts" lineNumbers="true" %}
```typescript
/**
 * @description Factory function to return freshly minted EventBridge instance.
 */
export const makeNewEventBridgeEmitter = (region: string) => {
  if (!region) throw new MissingEnvVarsError(JSON.stringify([{ key: 'REGION', value: region }]));

  return new EventBridgeEmitter(region);
};
```
{% endcode %}

{% hint style="info" %}
For an excellent and more in-depth article on factories, see [https://www.culttt.com/2014/12/24/factories-domain-driven-design](https://www.culttt.com/2014/12/24/factories-domain-driven-design) or [https://refactoring.guru/design-patterns/factory-method/typescript/example](https://refactoring.guru/design-patterns/factory-method/typescript/example).
{% endhint %}
