# Check in

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 3.png" alt=""><figcaption></figcaption></figure>

TODO

{% code title="code/Reservation/Reservation/serverless.yml" %}
```yaml
CheckIn:
    handler: src/infrastructure/adapters/web/CheckIn.handler
    description: Check in to slot
    events:
      - http:
          method: POST
          path: /CheckIn
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
export async function CheckInUseCase(dependencies: Dependencies, slotId: SlotId) {
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slotDto = await slotLoader.loadSlot(slotId);

  const reservationService = new ReservationService(dependencies);
  await reservationService.checkIn(slotDto);
}
```

TODO
