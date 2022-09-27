# Reserve a slot

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 2.png" alt=""><figcaption><p>Perhaps the most complex use case, passing through all four services.</p></figcaption></figure>

The big one: Reserve a slot.

It's very important that when we build anything like this, we stay clear on the Bounded Contexts and relationships we mapped previously. Now is not the time to lump together everything in a big box, shake it around, and confuse the borders of our responsibility! Because this happens in the `Reservation` service, the primary concern we have is to ensure correct functionality within that box.

We need to respect, and use, the API contract provided by the `VerificationCode` service, as well as ensure that the event pushed to the event buses is correct to the analytics context (because we have promised to give them a specific shape of it). We "own" the event we pass to `Display` as that just makes more sense. So, those were the responsibilities.

For the actual configuration file, there's not too much going on, besides enforcing a schema on our API so people won't be calling it willy-nilly.

{% code title="code/Reservation/Reservation/serverless.yml" %}

```yaml
ReserveSlot:
  handler: src/infrastructure/adapters/web/ReserveSlot.handler
  description: Reserve a slot
  events:
    - http:
  method: POST
  path: /ReserveSlot
  request:
  schemas:
  application/json: ${file(schema/ReserveSlot.validator.json)}
```

{% endcode %}

This time, the use case _is_ a bit bigger as we need to load a lot more services before passing them to our domain service, `ReservationService`, to actually conduct any business logic.

{% code title="code/Reservation/Reservation/src/application/usecases/ReserveSlotUseCase.ts" %}

```typescript
export async function ReserveSlotUseCase(
  dependencies: Dependencies,
  slotInput: SlotInput
): Promise<ReserveOutput> {
  const securityApiEndpoint = process.env.SECURITY_API_ENDPOINT_GENERATE || "";

  const { slotId, hostName } = slotInput;
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slotDto = await slotLoader.loadSlot(slotId);

  const verificationCodeService =
    createVerificationCodeService(securityApiEndpoint);
  const reservationService = new ReservationService(dependencies);

  return await reservationService.reserve(
    slotDto,
    hostName,
    verificationCodeService
  );
}
```

{% endcode %}

With that, it's still not _a lot_, to be honest. It's always nice being able to do more with less (code)!
