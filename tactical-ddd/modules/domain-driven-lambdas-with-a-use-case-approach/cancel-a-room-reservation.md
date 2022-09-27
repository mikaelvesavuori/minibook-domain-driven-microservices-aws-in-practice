# Cancel a slot

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 5.png" alt=""><figcaption><p>We will now move into the territory of event-based side effects (and it's not a horror film!)</p></figcaption></figure>

Cancelling a slot is fun! Doing so means we have to do "event-based side effects" like opening it again, as a response to its cancellation.

Just as with checking in and out, we first need to verify and authorize the calling user. Also, again, we have API request validation active.

{% code title="code/Reservation/Reservation/serverless.yml" %}
```yaml
CancelSlot:
    handler: src/infrastructure/adapters/web/CancelSlot.handler
    description: Cancel a slot
    events:
      - http:
          method: POST
          path: /CancelSlot
          authorizer:
            name: Authorizer
            resultTtlInSeconds: ${self:custom.config.apiGatewayCachingTtlValue}
            identitySource: method.request.header.Authorization
            type: request
          request:
            schemas:
              application/json: ${file(schema/Id.validator.json)}
```
{% endcode %}

In our use case, we will again use the convenience service called `SlotLoaderService`, rather than the Reposi

{% code title="code/Reservation/Reservation/src/application/usecases/CancelSlotUseCase.ts" %}
```typescript
export async function CancelSlotUseCase(dependencies: Dependencies, slotId: SlotId): Promise<void> {
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slotDto = await slotLoader.loadSlot(slotId);

  const reservationService = new ReservationService(dependencies);
  await reservationService.cancel(slotDto);
}
```
{% endcode %}

The pattern should be quite familiar by now.
