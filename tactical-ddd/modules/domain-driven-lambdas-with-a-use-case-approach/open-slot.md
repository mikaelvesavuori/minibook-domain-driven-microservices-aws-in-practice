# Open slot

Friday:

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

The use case itself doesn't do much other than defer to the `ReservationService` to create the slots.

```typescript
export async function CreateSlotsUseCase(dependencies: Dependencies): Promise<string[]> {
  const reservationService = new ReservationService(dependencies);

  return await reservationService.makeDailySlots();
}
```

asdf
