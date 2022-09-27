# Check out

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 4.png" alt=""><figcaption></figcaption></figure>

TODO

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

TODO

```typescript
export async function CheckOutUseCase(dependencies: Dependencies, slotId: SlotId) {
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slotDto = await slotLoader.loadSlot(slotId);

  const reservationService = new ReservationService(dependencies);
  await reservationService.checkOut(slotDto);
}
```

TODO
