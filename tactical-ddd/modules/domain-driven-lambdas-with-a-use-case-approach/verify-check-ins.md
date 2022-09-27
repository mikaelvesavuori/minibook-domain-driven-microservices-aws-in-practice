# Unattend no-shows

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 7.png" alt=""><figcaption></figcaption></figure>

Friday:

{% code title="code/Reservation/Reservation/serverless.yml" %}
```yaml
UnattendSlots:
    handler: src/infrastructure/adapters/web/UnattendSlots.handler
    description: Check if any slots are unattended at 10 minutes past the hour
    events:
      # You can activate this to allow for HTTP-based calls
      - http:
          method: GET
          path: /UnattendSlots
      - schedule: cron(10 6-16 ? * MON-FRI *)
```
{% endcode %}

The use case itself doesn't do much other than defer to the `ReservationService` to create the slots.

```typescript
export async function UnattendSlotsUseCase(dependencies: Dependencies) {
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slots = await slotLoader.loadSlots();

  const reservationService = new ReservationService(dependencies);
  await reservationService.checkForUnattended(slots);
}
```

asdf