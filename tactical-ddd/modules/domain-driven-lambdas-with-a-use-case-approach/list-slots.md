# Get slots

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 1.png" alt=""><figcaption><p>The UI-facing <code>Display</code> service can read the projected slots from its own persistence.</p></figcaption></figure>

The `Display` service is also not very complicated; it simply returns the current set of slots from its own persistence (DynamoDB). Because it keeps its own projection of slots the data may be eventually consistent, but that won't be a real issue in the type of circumstance we have here.

{% code title="code/Reservation/Display/serverless.yml" %}
```yaml
GetSlots:
    handler: src/infrastructure/adapters/web/GetSlots.handler
    description: Get room time slots
    events:
      - http:
          method: GET
          path: /slots
    iamRoleStatements:
      - Effect: "Allow"
        Action:
          - dynamodb:Query
        Resource: ${self:custom.aws.databaseArn}
```
{% endcode %}

The use case is so basic we can fully conduct everything we need in the application-layer use case with the help of our injected Repository.

{% code title="code/Reservation/Display/src/application/usecases/GetSlotsUseCase.ts" %}
```typescript
export async function GetSlotsUseCase(dependencies: Dependencies) {
  const { repository } = dependencies;
  return await repository.getSlots();
}
```
{% endcode %}
