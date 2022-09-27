# Close slots

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 8.png" alt=""><figcaption><p>To close a slot means we have to ensure the read-copy, or projection, in <code>Display</code> also knows what is going on.</p></figcaption></figure>

Closing slots is what we have to do when a slot is no longer reservable.

Practically speaking, we will run a scheduled Lambda after each open hour, which is to say: 0700-1700 GMT Monday through Friday. You may ask "what if the slot isn't actually closed at that time?" The answer is actually pretty simple—since Lambda will only happen _after_ the time you want it to run, plus an additional 5-20 seconds of delay before it actually executes at all, you can be sure that you are doing this when it makes logical sense: after the slot has ended.

{% hint style="success" %}
If we had a very time sensitive system this particular solution may have been unacceptably slow, but here it's not nearly an actual problem. &#x20;
{% endhint %}

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

Nothing new here... The `checkedForClosed()` will run an internal loop first to check that the provided loops are truly ended and then run the rest of the transactional logic for those slots that we no longer need.

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
