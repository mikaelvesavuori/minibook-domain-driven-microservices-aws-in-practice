# Cancel a slot

TODO

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 5.png" alt=""><figcaption><p>Friday:</p></figcaption></figure>

asdf

{% code title="code/Reservation/Reservation/serverless.yml" %}
```yaml
CancelSlot:
    handler: src/infrastructure/adapters/web/CancelSlot.handler
    description: Cancel a slot
    events:
      - http:
          method: POST
          path: /CancelSlot
          authorizer:
            name: Authorizer
            resultTtlInSeconds: ${self:custom.config.apiGatewayCachingTtlValue}
            identitySource: method.request.header.Authorization
            type: request
          request:
            schemas:
              application/json: ${file(schema/Id.validator.json)}
```
{% endcode %}

The use case itself doesn't do much other than defer to the `ReservationService` to create the slots.

```typescript
export async function CreateSlotsUseCase(dependencies: Dependencies): Promise<string[]> {
  const reservationService = new ReservationService(dependencies);

  return await reservationService.makeDailySlots();
}
```

asdf
