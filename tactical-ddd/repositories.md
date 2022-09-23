---
description: "Numero uno when it comes to patterns —\_repositories are well-established as ways to separate implementation from interface."
---

# Repositories

{% hint style="success" %}
**TL;DR**

When it's time to do the inevitable persisting or loading of data, it's a **Repository** you want. Similar to the Factory, a **Repository** makes its core actions (loading, saving) a deterministic and easy-to-use operation. By separating this logic out, we can avoid polluting actual domain logic with this low-level (though important) detail.
{% endhint %}

Good old Repositories! This is by my very unscientific gut-feeling maybe the most used and best-known of patterns. Well, at least in terms of its nominal recognition.

## Why Repositories?

Let's start by addressing the need for a Repository. Somehow you will need to **retrieve or store the reference to an Aggregate or Entity or some other domain object**. Using the language of the domain, the Repository will be able to retrieve and return the data. The data, in turn, is typically an Aggregate or Entity which can be _reconstituted_ into its programmatic shape (Entity class etc.) when you've gotten the data back.

The bad side of being a well-known pattern is that this may have been what has lead many traditional back-end developers to be "data-oriented" in their work; seemingly a typical child disease of having been in the "relational database school". As I've previously written, being only structurally data-focused rather than also similarly obsessed about the expected behavior (logic, business rules etc.) can quickly lead straight down the [anemic domain model](https://martinfowler.com/bliki/AnemicDomainModel.html) hole.

{% hint style="danger" %}
Remember that the biggest enemy of DDD is the anemic domain model. Repositories are therefore important in the technical sense to make object persistence work at all, but similarly important is the goal to make Repositories decoupled from any behaviour-altering mannerisms: The Repository is not smart, your domain objects are. So refrain from making big exercises in data modeling here beyond but is absolutely required to make object retrieval work in the domain model.&#x20;
{% endhint %}

The primary place for Repositories is therefore (as Evans writes; 2013, p.148) in the middle of the object's lifecycle: persisting, loading, and reconstituting the data. The Repository acts as **the only way to retrieve data** and this must not be bypassed.

The typical "by-the-book" way is to use one Repository per higher concept or Aggregate, say, `ReservationRepository` and `SlotRepository`, which would often mean we would need unique Repositories per object. Logically speaking this makes sense as the repository will have to be uniquely implemented based on the specific needs of the aggregate in question. However, I will now explain why that's _not the way_ I am dealing with it in our example code.

## How repositories are used in the project

Because I am choosing to understand and implement Repositories as an infrastructural feature, rather than as being part of a domain, I do not want Repositories to have knowledge of the actual entity classes (such as `Slot`) so I do not return the class instance, but the Data Transfer Object that the Aggregate (`Reservation`) can reconstitute itself.

{% hint style="info" %}
This model, as far as I know, therefore stays somewhat truer with Robert Martin and his Clean Architecture than with the classic DDD approach.
{% endhint %}

This opinion is contentious and debated, as witnessed in [this response by Subhash on Stack Overflow](https://softwareengineering.stackexchange.com/questions/396151/which-layer-do-ddd-repositories-belong-to):

> Repositories and their placement in the code structure is a matter of intense debate in DDD circles. It is also a matter of preference, and often a decision taken based on the specific abilities of your framework and ORM.
>
> The issue is also muddied when you consider other design philosophies like Clean Architecture, which advocate using an abstract repository in the domain layer while providing concrete implementations in the infrastructure layer.
>
> — [https://softwareengineering.stackexchange.com/questions/396151/which-layer-do-ddd-repositories-belong-to](https://softwareengineering.stackexchange.com/questions/396151/which-layer-do-ddd-repositories-belong-to)

In the spirit of pragmatism the approach I am using is more relaxed, going with one Repository per persistence mechanism—DynamoDB and local/mock use. Because the solution itself is one deployable artifact and because there are no overlapping concepts, this is not problematic since there is no confusion or logical overstepping happening.

First of all, let's see one of the use cases and understand where we are loading the Slot:

{% code title="code/Reservation/Reservation/src/application/usecases/CancelSlotUseCase.ts" lineNumbers="true" %}
```typescript
import { Reservation } from '../../domain/aggregates/Reservation';

import { createSlotLoaderService } from '../services/SlotLoaderService';

import { Dependencies } from '../../interfaces/Dependencies';
import { SlotId } from '../../interfaces/Slot';

/**
 * @description Use case to handle cancelling a slot.
 */
export async function CancelSlotUseCase(dependencies: Dependencies, slotId: SlotId): Promise<void> {
  const reservation = new Reservation(dependencies);
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slotDto = await slotLoader.loadSlot(slotId);

  await reservation.cancel(slotDto);
}

```
{% endcode %}

{% hint style="success" %}
We will discuss the `SlotLoaderService` on the next page. For now, know that it is a higher-order construct on top of the Repository itself.
{% endhint %}

You'll see that we use a Factory to vend a new `SlotLoaderService`, which we then use to load the `slotId` we have on hand. With the Slot's DTO retrieved we can call the appropriate Aggregate method, which itself then may reconstitute the data so that we can make use of the `Slot` Entity's functionality and logic before doing whatever other things it is expected to do.

```typescript
public async cancel(slotDto: SlotDTO): Promise<void> {
    const slot = new Slot().from(slotDto);
    // Rest of code...
}
```

This same pattern is used for all similar use cases.

Now for one of the actual repositories.

{% code title="code/Reservation/Reservation/src/infrastructure/repositories/DynamoDbRepository.ts" lineNumbers="true" %}
```typescript
import { randomUUID } from 'crypto';
import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { MissingEnvVarsError } from '../../application/errors/MissingEnvVarsError';

import { Repository } from '../../interfaces/Repository';
import { SlotDTO, SlotId } from '../../interfaces/Slot';
import { DynamoItems } from '../../interfaces/DynamoDb';
import { Event, EventDetail } from '../../interfaces/Event';

import { getCleanedItems } from '../utils/getCleanedItems';

import testData from '../../../testdata/dynamodb/testData.json';

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
   * @description Create and return expiration time for database item.
   */
  private getExpiryTime(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return Date.parse(tomorrow.toString()).toString().substring(0, 10);
  }

  /**
   * @description Load a Slot from the source database.
   */
  public async loadSlot(slotId: SlotId): Promise<SlotDTO> {
    const command = {
      TableName: this.tableName,
      KeyConditionExpression: 'itemType = :itemType AND id = :id',
      ExpressionAttributeValues: {
        ':itemType': { S: 'SLOT' },
        ':id': { S: slotId }
      },
      ProjectionExpression: 'id, hostName, timeSlot, slotStatus, createdAt, updatedAt'
    };

    const data: DynamoItems =
      process.env.NODE_ENV === 'test'
        ? testData
        : await this.docClient.send(new QueryCommand(command));

    return getCleanedItems(data)[0] as unknown as SlotDTO;
  }

  /**
   * @description Load all Slots for the day from the source database.
   */
  public async loadSlots(): Promise<SlotDTO[]> {
    const command = {
      TableName: this.tableName,
      KeyConditionExpression: 'itemType = :itemType',
      ExpressionAttributeValues: {
        ':itemType': { S: 'SLOT' }
      },
      ProjectionExpression: 'id, hostName, timeSlot, slotStatus, createdAt, updatedAt'
    };

    const data: DynamoItems =
      process.env.NODE_ENV === 'test'
        ? testData
        : await this.docClient.send(new QueryCommand(command));

    return getCleanedItems(data) as unknown as SlotDTO[];
  }

  /**
   * @description Add (create/update) a slot in the source database.
   */
  public async updateSlot(slot: SlotDTO): Promise<void> {
    // @ts-ignore
    const { slotId, hostName, timeSlot, slotStatus, createdAt, updatedAt } = slot;

    const expiresAt = this.getExpiryTime();
    const command = {
      TableName: this.tableName,
      Item: {
        itemType: { S: 'SLOT' },
        id: { S: slotId },
        hostName: { S: hostName || '' },
        timeSlot: { S: JSON.stringify(timeSlot) },
        slotStatus: { S: slotStatus },
        createdAt: { S: createdAt },
        updatedAt: { S: updatedAt },
        expiresAt: { N: expiresAt }
      }
    };

    if (process.env.NODE_ENV !== 'test') await this.docClient.send(new PutItemCommand(command));
  }

  /**
   * @description Add (append) an Event in the source database.
   */
  public async addEvent(event: Event): Promise<void> {
    const eventData = event.get();
    const detail: EventDetail = JSON.parse(eventData['Detail']);
    const data = typeof detail['data'] === 'string' ? JSON.parse(detail['data']) : detail['data'];

    const command = {
      TableName: this.tableName,
      Item: {
        itemType: { S: 'EVENT' },
        id: { S: randomUUID() },
        eventTime: { S: detail['metadata']['timestamp'] },
        eventType: { S: data['event'] },
        event: { S: JSON.stringify(eventData) }
      }
    };

    if (process.env.NODE_ENV !== 'test') await this.docClient.send(new PutItemCommand(command));
  }
}

```
{% endcode %}

We `implement` the class based on a base class (abstraction), allowing us to make a dedicated local test variant as well.

The "big two" methods here are `updateSlot()` on line 101 and `addEvent()` on line 126. Yet again, were we to be more orthodox we might have had two Repositories where we can set a clear split between both concerns. Because the `Event` is a technical construct, yet in the same domain, and because there is no problematic overlap, I'll happily take the trade-offs in order to have less code duplication and testing needed.

Notice that both methods are "upsert" behaviors where we never create the same item twice but overwrite in place.

{% hint style="success" %}
Like anywhere else in the DDD world, avoid terms that are technological and do not carry semantic meaning. Avoid database-fixated words like `create`, `read` and `update`.&#x20;
{% endhint %}

Finally, while it may seem like a weird anti-pattern on line 142 with

```typescript
if (process.env.NODE_ENV !== 'test') await this.docClient.send(new PutItemCommand(command));
```

this enables unit testing the majority of the "real" repository.&#x20;

{% hint style="info" %}
Microsoft has a lot of good articles on microservices and DDD, for example [this article about repositories](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design).
{% endhint %}
