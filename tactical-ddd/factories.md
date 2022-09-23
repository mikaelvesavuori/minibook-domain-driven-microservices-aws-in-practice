---
description: >-
  Factories enable efficient and simple production of (usually) complex objects.
  Let's use them to simply our implementation interfaces.
---

# Factories

{% hint style="success" %}
**TL;DR**

The **Factory** pattern is a classic creational pattern. Some important reasons to use the pattern include that it appropriately encapsulates creation logic, as well as provides a structured way of creating objects in a deterministic manner.
{% endhint %}

Factories encapsulate the creation of, primarily, complex objects such as those in the domain layer. The pattern itself has nothing to do with DDD (instead, please see [_Design Patterns: Elements of Reusable Object-Oriented Software_](https://www.goodreads.com/book/show/85009.Design\_Patterns)). In the context of DDD we gain even better enforcement of encapsulation, which is especially meaningful when we need to construct an entity or aggregate.

Factories help us to hide implementation and construction logic and always returns valid invariants of the class ("product") that we have created. However, invariant logic and validation should as far as possible be deferred to the product being created itself, which makes perfect sense if we are using Factories to create complex objects like Entities and Aggregates that already such logic baked-in.&#x20;

You can probably imagine a case where the setup of an aggregate will require pulling lots of parameters, checking validity, and other such stuff—this is a perfect case of hiding that with a Factory. I've used factories several times when I need to create an object that requires complicated asynchronous setups. By using the factories we can avoid leaking out any of that complexity onto the user.

The way Factories are used in the example are very basic. There is nothing blocking you from applying the Factory pattern to creational methods on Aggregates or Services themselves (see for example Vernon 2013, p.391/397).

## Examples of the pattern

To be fair, there are no good uses of "proper" and complex factories in Get-A-Room.

{% hint style="success" %}
Often you will find factories in an object-oriented class shape, but here we will use a more TypeScript-idiomatic way using functions.
{% endhint %}

Several factories have been used to remove some of the ugly `new SomeClass()` calls. I'll happily use it whenever I want to avoid letting a user directly access a class, like this:

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

This also works well on creating concrete instances of services that need some values for setting them up:

{% code title="code/Reservation/Reservation/src/application/services/VerificationCodeService.ts" lineNumbers="true" %}
```typescript
export function createVerificationCodeService(securityApiEndpoint: string) {
  return new ConcreteVerificationCodeService(securityApiEndpoint);
}
```
{% endcode %}

More on the `VerificationCodeService` later.

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

While very basic, all of these (especially the two last ones) get the point across: A factory can hide some of the ugly details involved in creating important objects.

{% hint style="info" %}
For an excellent and more in-depth article on factories, see [https://www.culttt.com/2014/12/24/factories-domain-driven-design](https://www.culttt.com/2014/12/24/factories-domain-driven-design) or [https://refactoring.guru/design-patterns/factory-method/typescript/example](https://refactoring.guru/design-patterns/factory-method/typescript/example).

Overall, see the creational patterns at [https://refactoring.guru/design-patterns/creational-patterns](https://refactoring.guru/design-patterns/creational-patterns).
{% endhint %}
