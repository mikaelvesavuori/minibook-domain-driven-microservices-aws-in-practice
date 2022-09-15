---
description: "Numero uno when it comes to patterns —\_repositories are well-established as ways to separate implementation from interface."
---

# Repositories

Good old repositories! This is by my very unscientific gut-feeling maybe the most used and best-known of patterns. That's the good side, and the bad side is that I am probably not completely misled by this having some correlation to how many traditional back-end developers have been "data-oriented" in their work (often relational). As I've previously written, being only structurally data-focused rather than also similarly obsessed about the expected behavior (logic, business rules etc.) can quickly lead straight down the [anemic domain model](https://martinfowler.com/bliki/AnemicDomainModel.html) hole.

The primary use-case for Repositories is to persist, load, and reconstitute your data (i.e. Aggregates).

## How we use it in the project

Let's actually look at one of our repositories.

{% code title="code/Analytics/SlotAnalytics/src/infrastructure/repositories/DynamoDbRepository.ts" lineNumbers="true" %}
```typescript
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

import { Repository } from '../../interfaces/Repository';
import { AnalyticalRecord } from '../../interfaces/AnalyticalRecord';

import { MissingEnvVarsError } from '../../application/errors/MissingEnvVarsError';
import { FailureToAddError } from '../../application/errors/FailureToAddError';

/**
 * @description Factory function to create a DynamoDB repository.
 */
export function createNewDynamoDbRepository(): DynamoDbRepository {
  return new DynamoDbRepository();
}

/**
 * @description Concrete implementation of DynamoDB repository.
 * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html
 */
class DynamoDbRepository implements Repository {
  docClient: any;
  tableName: string;
  region: string;

  constructor() {
    this.region = process.env.REGION || '';
    this.tableName = process.env.TABLE_NAME || '';

    if (!this.region || !this.tableName)
      throw new MissingEnvVarsError(
        JSON.stringify([
          { key: 'REGION', value: process.env.REGION },
          { key: 'TABLE_NAME', value: process.env.TABLE_NAME }
        ])
      );

    this.docClient = new DynamoDBClient({ region: this.region });
  }

  /**
   * @description Add (create/update) a Record to the Analytics database.
   */
  public async add(record: AnalyticalRecord): Promise<void> {
    if (
      !record.id ||
      !record.correlationId ||
      !record.event ||
      !record.slotId ||
      !record.startsAt ||
      !record.hostName
    )
      throw new FailureToAddError('Missing required inputs when adding record');
    
    const { id, correlationId, event, slotId, startsAt, hostName } = record;
    const command = {
      TableName: this.tableName,
      Item: {
        event: { S: event }, // HASH
        id: { S: id }, // RANGE
        correlationId: { S: correlationId },
        slotId: { S: slotId },
        hostName: { S: hostName },
        startsAt: { S: startsAt }
      }
    };

    if (process.env.NODE_ENV === 'test') return;
    await this.docClient.send(new PutItemCommand(command));
  }
}
```
{% endcode %}

Typically you will find the requirement or recommendation that there is one repository per aggregate. Logically speaking this makes sense as the repository will have to be uniquely implemented based on the specific needs of the aggregate in question.

We `implement` the class based on a base class, allowing us to make a dedicated local test variant as well.

You'll see the the `add()` method on line 43 uses a "broader" term than the database-fixated neighbouring words like `create`, `read` and `update`. Like anywhere else in the DDD world, avoid terms that are technological and do not carry semantic meaning.

While it may seem like a weird anti-pattern with `if (process.env.NODE_ENV === 'test') return;` this enables actually testing the majority also of the actual, used repository.&#x20;

{% hint style="info" %}
Microsoft has a lot of good articles on microservices and DDD, for example [this article about repositories](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design).
{% endhint %}
