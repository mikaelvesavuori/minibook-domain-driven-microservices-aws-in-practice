# Reserve a slot

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 2.png" alt=""><figcaption></figcaption></figure>

Friday:

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

TODO

{% code title="code/Reservation/Display/serverless.yml" %}
```yaml
UpdateSlot:
    handler: src/infrastructure/adapters/web/UpdateSlot.handler
    description: Update a room slot projection
    events:
      # Can be activated if you need to do HTTP-based calls or testing
      #- http:
      #    method: POST
      #    path: /update
      - eventBridge:
          eventBus: ${self:custom.aws.domainBusArn}
          pattern:
            detail-type:
              # User events
              - "Created"
              - "Cancelled"
              - "Reserved"
              - "CheckedIn"
              - "CheckedOut"
              - "Unattended"
              # System events
              - "Closed"
            source:
              - prefix: ""
    iamRoleStatements:
      - Effect: "Allow"
        Action:
          - dynamodb:PutItem
        Resource: ${self:custom.aws.databaseArn}
```
{% endcode %}

TODO

```typescript
export async function ReserveSlotUseCase(
  dependencies: Dependencies,
  slotInput: SlotInput
): Promise<ReserveOutput> {
  const securityApiEndpoint = process.env.SECURITY_API_ENDPOINT_GENERATE || '';

  const { slotId, hostName } = slotInput;
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slotDto = await slotLoader.loadSlot(slotId);

  const verificationCodeService = createVerificationCodeService(securityApiEndpoint);
  const reservationService = new ReservationService(dependencies);

  return await reservationService.reserve(slotDto, hostName, verificationCodeService);
}
```

asdf
