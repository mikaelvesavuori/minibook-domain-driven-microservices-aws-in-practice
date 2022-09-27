# Cancel a slot

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 5.png" alt=""><figcaption><p>Friday:</p></figcaption></figure>

TODO

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

TODO

```typescript
export async function CancelSlotUseCase(dependencies: Dependencies, slotId: SlotId): Promise<void> {
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slotDto = await slotLoader.loadSlot(slotId);

  const reservationService = new ReservationService(dependencies);
  await reservationService.cancel(slotDto);
}
```

TODO
