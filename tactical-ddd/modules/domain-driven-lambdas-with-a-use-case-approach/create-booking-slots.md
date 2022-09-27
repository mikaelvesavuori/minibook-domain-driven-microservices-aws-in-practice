# Create slots

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 6.png" alt=""><figcaption><p>Creating slots is a scheduled ("cronjob") function call.</p></figcaption></figure>

The root use case must be the slot creation, because without it we don't have much of anything.

Slots need to be created into the main DynamoDB table.

This particular solution is trivial, as we only need to allow it being called as a scheduled function. In our case we call it at 05:00 GMT every Monday through Friday:

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
