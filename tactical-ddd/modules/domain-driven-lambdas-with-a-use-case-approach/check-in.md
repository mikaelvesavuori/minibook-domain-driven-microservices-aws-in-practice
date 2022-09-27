# Check in

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 3.png" alt=""><figcaption><p>Checking in means we have to use all four services.</p></figcaption></figure>

To check-in, we first need to verify and authorize the calling user, so no one else goes checking in to the room that you've waited so long for. You'll see this in the `authorizer` block. While the implementation of the authorizer itself is rudimentary, just having anything here makes the solution as a whole better.

{% code title="code/Reservation/Reservation/serverless.yml" %}

```yaml
CheckIn:
  handler: src/infrastructure/adapters/web/CheckIn.handler
  description: Check in to slot
  events:
    - http:
  method: POST
  path: /CheckIn
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

In the use case code, we will load the Slot DTO and pass it to the respective method.

{% code title="code/Reservation/Reservation/src/application/usecases/CheckInUseCase.ts" %}

```typescript
export async function CheckInUseCase(
  dependencies: Dependencies,
  slotId: SlotId
) {
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slotDto = await slotLoader.loadSlot(slotId);

  const reservationService = new ReservationService(dependencies);
  await reservationService.checkIn(slotDto);
}
```

{% endcode %}
