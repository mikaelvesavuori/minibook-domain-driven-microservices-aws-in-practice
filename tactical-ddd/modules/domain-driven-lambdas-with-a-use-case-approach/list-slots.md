# List slots

TODO

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 1.png" alt=""><figcaption></figcaption></figure>

Friday:

{% code title="code/Reservation/Reservation/serverless.yml" %}
```yaml
CreateSlots:
    handler: src/infrastructure/adapters/web/CreateSlots.handler
    description: Create new slots
    events:
      # You can activate this to allow for HTTP-based calls
      - http:
          method: GET
          path: /CreateSlots
      - schedule: cron(0 5 ? * MON-FRI *)
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
