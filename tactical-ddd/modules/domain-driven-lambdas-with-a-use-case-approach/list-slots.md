# List slots

<figure><img src="../../../.gitbook/assets/Get-A-Room Solution 1.png" alt=""><figcaption></figcaption></figure>

TODO

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

TODO

```typescript
export async function GetSlotsUseCase(dependencies: Dependencies) {
  const { repository } = dependencies;
  return await repository.getSlots();
}
```

TODO
