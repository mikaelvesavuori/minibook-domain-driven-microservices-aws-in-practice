# Open slot

TODO diagram

TODO

{% code title="code/Reservation/Reservation/serverless.yml" %}
```yaml
OpenSlot:
    handler: src/infrastructure/adapters/web/OpenSlot.handler
    description: Open a slot
    events:
       # You can activate this to allow for HTTP-based calls
      - http:
          method: POST
          path: /OpenSlot
      - eventBridge:
          eventBus: ${self:custom.config.domainBusName} # Create new EventBridge bus
          pattern:
            source:
              - getaroom.reservation.cancelled
          deadLetterQueueArn:
            Fn::GetAtt:
              - ReservationBusDlq
              - Arn
          retryPolicy:
            maximumEventAge: 3600
            maximumRetryAttempts: 3
```
{% endcode %}

TODO

```typescript
export async function OpenSlotUseCase(dependencies: Dependencies, slotId: SlotId) {
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slotDto = await slotLoader.loadSlot(slotId);

  const reservationService = new ReservationService(dependencies);
  await reservationService.open(slotDto);
}
```

TODO
