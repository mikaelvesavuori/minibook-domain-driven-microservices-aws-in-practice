---
description: >-
  The veritable gilded halls of DDD which, like the best songs in a concert,
  come in after quite a bit of build-up: This is the "Master of Puppets" of DDD
  patterns... "Master of Patterns"?
---

# Entities

Entities and aggregates are perhaps the most "prominent" of the tactical patterns. It's important to understand that the notion of entities in database-adjacent contexts and in implementation-oriented tools like Entity Framework _are not the same thing_.

Both of these concepts are very much related, and it probably makes sense to start with the more general of them: The entity.

Entities are object that may mutate (change) over time, and who all have distinct identities. We can think of a `BookClubMember` as something that feels quite right being an entity. Whereas a `Meeting` may be a simple value object, as it has neither a strict identity (perhaps just a simple identifier) nor will it change after the fact, the `BookClubMember` will be a much less simple construct. It will certainly involve both data and behavior, and it will likely have clear business rules attached to these, such as for renewing membership, refreshing the member's read books and more.

## The "anemic domain model"

The [anemic domain model](https://martinfowler.com/bliki/AnemicDomainModel.html) is one that represents objects as shells, or husks, of their true capabilities. They will often be CRUDdy and allow for direct mutations through public getters and setters.

Some find the criticism around "anemic domain models" academic and roundly wrong. They might argue that their experiences are that it's just as easy to get things to work, but with less hassle than going full-on with OOP. This becomes impossible to verify or prove without access to the code.

{% hint style="warning" %}
For my part, code quality and structure are paramount when building something myself, or when I work with, or coach, other engineers.

All this _is_ measurable, once you have access to the code and not just raving to some rando on an internet forum. Using competent tooling you will likely get recommendations to fix issues like this, too. OOP and refactoring practices are practically institutionalized so this not a "DDD thing".

The anemic type of objects will maybe _do the job_, but they will become liabilities too. They do not shield the objects from misuse, nor do they express the common language as succinctly
{% endhint %}

The opposite of all of this, no surprises, is the "rich domain model"—as someone on Stack Overflow remarked, really no more than your classic object-oriented programming. While that may not technically be the full truth, in our abbreviated version of DDD and the universe, then that explanation is good enough.

Compared to their anemic brethren, rich domain models (typically entities and aggregates) will be easier to understand, will be more resilient to change and disruptions, and are much better encapsulated; we can always know what object can operate on a set of data, and in which ways it does this. **We centralize the majority of our business logic to these domain models**, and we can entrust them with that because of this encapsulation and overall correctness of behavior.

**A rich model, in the context of our code, is expressive**. It will use a noun (such as a `Book`) and allows us to act on it. Typically this is verb-based — for example `book.recommend()`. As we've seen many times in this book, we want this to explain 1:1 in our common/ubiquitous language what we are doing.

## Invariants

TODO

The "always-valid" model. More at [https://enterprisecraftsmanship.com/posts/always-valid-domain-model/](https://enterprisecraftsmanship.com/posts/always-valid-domain-model/)

{% code title="code/Reservation/SlotReservation/src/domain/entities/Slot.ts" lineNumbers="true" %}
```typescript
import { randomUUID } from 'crypto';

import { sanitizeInputData } from '../services/sanitizeInputData';

import { SlotCreateInput, SlotDTO, Status } from '../../interfaces/Slot';
import { TimeSlotDTO } from '../../interfaces/TimeSlot';

/**
 * @description The `Slot` entity handles the lifecycle
 * and operations of the (time) slots that users can
 * reserve.
 */
export class Slot {
  private slotId: string;
  private hostName: string;
  private timeSlot: TimeSlotDTO;
  private slotStatus: Status;
  private createdAt: string;
  private updatedAt: string;

  constructor(input?: SlotCreateInput) {
    this.slotId = '';
    this.hostName = '';
    this.timeSlot = {
      startTime: '',
      endTime: ''
    };
    this.slotStatus = 'OPEN';
    this.createdAt = '';
    this.updatedAt = '';

    if (input) this.make(input);
  }

  /**
   * @description Create a valid, starting-state ("open") invariant of the Slot.
   */
  private make(input: SlotCreateInput): SlotDTO {
    const { startTime, endTime } = input;
    const currentTime = this.getCurrentTime();

    this.slotId = randomUUID().toString();
    this.hostName = '';
    this.timeSlot = {
      startTime,
      endTime
    };
    this.slotStatus = 'OPEN';
    this.createdAt = currentTime;
    this.updatedAt = currentTime;

    return this.get();
  }

  /**
   * @description Reconstitute a Slot from a DTO.
   */
  public from(input: SlotDTO): Slot {
    const cleanInput = sanitizeInputData(input);

    this.slotId = cleanInput['slotId'];
    this.hostName = cleanInput['hostName'];
    this.timeSlot = cleanInput['timeSlot'];
    this.slotStatus = cleanInput['slotStatus'];
    this.createdAt = cleanInput['createdAt'];
    this.updatedAt = cleanInput['updatedAt'];

    return this;
  }

  /**
   * @description Remove host name from data.
   */
  public removeHostName() {
    this.hostName = '';
  }

  /**
   * @description Update host name to new value.
   */
  public updateHostName(hostName: string) {
    this.hostName = hostName;
  }

  /**
   * @description Updates the common fields to reflect a new `Status`,
   * and also updates the `updatedAt` field. Finally it sanitizes
   * the input data.
   *
   */
  public updateStatus(status: Status) {
    this.slotStatus = status;
    this.updatedAt = this.getCurrentTime();

    sanitizeInputData(this.get());
  }

  /**
   * @description Return data as Data Transfer Object.
   */
  public get(): SlotDTO {
    return {
      slotId: this.slotId,
      hostName: this.hostName,
      timeSlot: this.timeSlot,
      slotStatus: this.slotStatus,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * @description Has the time slot's end time already passed?
   */
  public isEnded() {
    if (this.getCurrentTime() > this.timeSlot.endTime) return true;
    return false;
  }

  /**
   * @description Check if our 10 minute grace period has ended,
   * in which case we want to open the slot again.
   */
  public isGracePeriodOver() {
    if (this.getCurrentTime() > this.getGracePeriodEndTime(this.timeSlot.startTime)) return true;
    return false;
  }

  /**
   * @description Returns the end of the grace period until a reserved
   * slot is deemed unattended and returns to open state.
   */
  private getGracePeriodEndTime(startTime: string): string {
    const minutes = 10;
    const msPerMinute = 60 * 1000;

    return new Date(new Date(startTime).getTime() + minutes * msPerMinute).toISOString();
  }

  /**
   * @description Returns the current time as an ISO string.
   */
  private getCurrentTime(): string {
    return new Date().toISOString();
  }
}

```
{% endcode %}

TODO
