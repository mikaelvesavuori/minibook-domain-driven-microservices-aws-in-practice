# Check out

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 4.png" alt=""><figcaption><p>Oddly similar to check in? Yep, I feel the same.</p></figcaption></figure>

Same as with checking in, for checking it we need the authorization of the user and call.

{% code title="code/Reservation/Reservation/serverless.yml" %}

```yaml
CheckOut:
  handler: src/infrastructure/adapters/web/CheckOut.handler
  description: Check out from slot
  events:
    - http:
  method: POST
  path: /CheckOut
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

The use case itself is practically copy-paste from the check-in case.

{% code title="code/Reservation/Reservation/src/application/usecases/CheckOutUseCase.ts" %}

```typescript
export async function CheckOutUseCase(
  dependencies: Dependencies,
  slotId: SlotId
) {
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slotDto = await slotLoader.loadSlot(slotId);

  const reservationService = new ReservationService(dependencies);
  await reservationService.checkOut(slotDto);
}
```

{% endcode %}
