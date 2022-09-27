# Close slots

Friday:

{% code title="code/Reservation/Reservation/serverless.yml" %}
```yaml
CloseSlots:
    handler: src/infrastructure/adapters/web/CloseSlots.handler
    description: Close any slots that have passed their end times
    events:
       # You can activate this to allow for HTTP-based calls
      - http:
          method: GET
          path: /CloseSlots
      - schedule: cron(0 7-17 ? * MON-FRI *)
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
