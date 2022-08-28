# Factories

_Factories_ are used to provide an abstraction in the construction of an Object, and can return an _Aggregate_ root, an _Entity_, or an _Value Object_. _Factories_ are an alternative for building objects that have complexity in building via the constructor method.

### Factories

_Factories_ are used to provide an abstraction in the construction of an Object, and can return an _Aggregate_ root, an _Entity_, or an _Value Object_. _Factories_ are an alternative for building objects that have complexity in building via the constructor method.

## In practice

Example:

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

The factory pattern may be used to simplify the creation of complex objects, but I'll happily use it whenever I want to avoid letting a user directly access a class, like this:

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
