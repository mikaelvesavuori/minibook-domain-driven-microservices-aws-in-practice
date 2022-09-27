# Close slots

TODO diagram

TODO

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
