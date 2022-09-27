# Close slots

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 8.png" alt=""><figcaption><p>To close a slot means we have to ensure the read-copy, or projection, in <code>Display</code> also knows what is going on.</p></figcaption></figure>

Closing slots is what we have to do when a slot is no longer reservable.

{% code title="code/Reservation/Reservation/serverless.yml" %}
```yaml
CloseSlots:
    handler: src/infrastructure/adapters/web/CloseSlots.handler
    description: Close any slots that have passed their end times
    events:
       # You can activate this to allow for HTTP-based calls
      #- http:
      #    method: GET
      #    path: /CloseSlots
      - schedule: cron(0 7-17 ? * MON-FRI *)
```
{% endcode %}

TODO

{% code title="code/Reservation/Reservation/src/application/usecases/CloseSlotsUseCase.ts" %}
```typescript
export async function CloseSlotsUseCase(dependencies: Dependencies) {
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slots = await slotLoader.loadSlots();

  const reservationService = new ReservationService(dependencies);
  await reservationService.checkForClosed(slots);
}
```
{% endcode %}

TODO
