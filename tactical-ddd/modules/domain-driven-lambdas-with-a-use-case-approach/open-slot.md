# Open slot

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 5.png" alt=""><figcaption><p>The slot opening happens in <code>9d</code> and <code>11</code>.</p></figcaption></figure>

Opening a slot is an intended side effect of cancelling the slot. You will see in the diagram at `9d` and `11` where the `OpenSlot` Lambda gets triggered. This is also clearly outlined in the configuration file:

{% code title="code/Reservation/Reservation/serverless.yml" %}
```yaml
OpenSlot:
    handler: src/infrastructure/adapters/web/OpenSlot.handler
    description: Open a slot
    events:
       # You can activate this to allow for HTTP-based calls
      #- http:
      #    method: POST
      #    path: /OpenSlot
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

And still another boring, but functional use case with no surprises.

{% code title="code/Reservation/Reservation/src/application/usecases/OpenSlotUseCase.ts" %}
```typescript
export async function OpenSlotUseCase(dependencies: Dependencies, slotId: SlotId) {
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slotDto = await slotLoader.loadSlot(slotId);

  const reservationService = new ReservationService(dependencies);
  await reservationService.open(slotDto);
}
```
{% endcode %}
