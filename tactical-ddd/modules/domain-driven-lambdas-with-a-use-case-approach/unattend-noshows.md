# Unattend no-shows

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 7.png" alt=""><figcaption><p>Time again (pun intended) for a scheduled "cronjob"!</p></figcaption></figure>

If any slot is not checked in to within the grace period we need to make them bookable again. Once again a scheduled function can do the heavy lifting, combined with some glue logic on our end.

{% code title="code/Reservation/Reservation/serverless.yml" %}

```yaml
UnattendSlots:
  handler: src/infrastructure/adapters/web/UnattendSlots.handler
  description: Check if any slots are unattended at 10 minutes past the hour
  events:
    # You can activate this to allow for HTTP-based calls
    #- http:
    # method: GET
    # path: /UnattendSlots
    - schedule: cron(10 6-16 ? * MON-FRI *)
```

{% endcode %}

{% hint style="warning" %}
You will note that this logic is not fail-safe. If you were to book a slot at 10:11 for the 10-11 window nothing will "unattend" the slot if you did not check-in.

_Good enough_ is sometimes just that. And as the requirements are vague and this is no more than a demonstration project, we can leave it at that.
{% endhint %}

We'll use a service called `SlotLoaderService`, instead of directly perusing the Repository to load the complete set of today's Slots. Then, we are going to pass them into the `checkForUnattended()` method where the domain service will actually contain the business/domain logic to determine whether or not a slot is attended.

{% code title="code/Reservation/Reservation/src/application/usecases/UnattendSlotsUseCase.ts" %}

```typescript
export async function UnattendSlotsUseCase(dependencies: Dependencies) {
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slots = await slotLoader.loadSlots();

  const reservationService = new ReservationService(dependencies);
  await reservationService.checkForUnattended(slots);
}
```

{% endcode %}
