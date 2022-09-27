# Check out

TODO

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 4.png" alt=""><figcaption></figcaption></figure>

Friday:

{% code title="code/Reservation/Reservation/serverless.yml" %}
```yaml
CheckOut:
    handler: src/infrastructure/adapters/web/CheckOut.handler
    description: Check out from slot
    events:
      - http:
          method: POST
          path: /CheckOut
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
