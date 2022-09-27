# Create slots

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 6.png" alt=""><figcaption><p>Creating slots is a scheduled ("cronjob") function call in the <code>Reservation</code> service.</p></figcaption></figure>

The root use case must be the slot creation, because without it we don't have much of anything. It's fair to call this an "under the hood" type of use case.

For it do something meaningful, Slots need to be created into the main DynamoDB table so these can be reproduced by the Display service.

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

## Updating the Display projection

What about that `Display` service? That one is independently subscribing to relevant Domain Events, so it will update the projection to match what is happening in the leading data source, or Aggregate, which is...`Reservation`!

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

As we will see many times, also here the use case is basic. Because our Repository uses an [upsert](https://en.wiktionary.org/wiki/upsert) pattern (update in place) it doesn't matter if the item already exists or not; so it's [idempotent](https://en.wikipedia.org/wiki/Idempotence) which is a good thing.

{% code title="code/Reservation/Display/src/application/usecases/UpdateSlotUseCase.ts" %}
```typescript
export async function UpdateSlotUseCase(dependencies: Dependencies, slot: Slot) {
  const { repository } = dependencies;
  await repository.add(slot);
}
```
{% endcode %}
