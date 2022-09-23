---
description: TODO
---

# Aggregates

{% hint style="success" %}
**TL;DR**

Description here TODO.
{% endhint %}

Revisiting our relations between aggregates and entities we see that:

* Entities are objects that have unique identity. They are closely connected to the domain and its business logic.
* Aggregates are objects that access and operate on entities. To be clear, an aggregate is always itself an entity, but the opposite is not necessarily true.
* An Aggregate Root is an object that can access the root object/entity collecting a group of entities. The Aggregate Root concept becomes more important and pronounced when you have a rich domain with relations between entities.

TODO

It is one of the most important and complex patterns of _Tactical Design_, _Aggregates_ are based on two other _Tactical Standards_, which are _Entities_ and _Value Objects_. An _Aggregate_ is a Cluster of one or more _Entities_, and may also contain _Value Objects_. The Parent _Entity_ of this Cluster receives the name of _Aggregate Root_.

aggregate root is a consistency boundary

> An aggregate is a cluster of associated objects that we treat as a unit for the purpose of data changes.
>
> — Source: Eric Evans

TODO

## The SlotReservation aggregate

I wouldn't be surprised if you already are aware that we'll be looking at the meatiest and most significant part of our codebase. This is good! If we have it this far, using the other tactical concepts, we are truly now at the core of the business logic.

Expect a much longer read this time. No worries, we are going to look at select parts in due course.

{% code title="code/Reservation/SlotReservation/src/domain/aggregates/SlotAggregate.ts" lineNumbers="true" %}
```typescript
import { MikroLog } from 'mikrolog';

// Entities
import { Slot } from '../entities/Slot';

// Application services
import { getVerificationCode } from '../../application/services/getVerificationCode';
import { loadSlot } from '../../application/services/loadSlot';
import { loadSlots } from '../../application/services/loadSlots';

// Events
import {
  CancelledEvent,
  CheckedInEvent,
  CheckedOutEvent,
  ClosedEvent,
  CreatedEvent,
  OpenedEvent,
  ReservedEvent,
  UnattendedEvent
} from '../events/Event';

// Value objects
import { TimeSlot } from '../valueObjects/TimeSlot';

// Interfaces
import { SlotDTO, SlotInput, SlotId, Status } from '../../interfaces/Slot';
import { Repository } from '../../interfaces/Repository';
import { EventEmitter } from '../../interfaces/EventEmitter';
import { Dependencies } from '../../interfaces/Dependencies';
import { ReserveOutput } from '../../interfaces/ReserveOutput';
import { MetadataConfigInput } from '../../interfaces/Metadata';
import { Event } from '../../interfaces/Event';

// Errors
import { MissingDependenciesError } from '../../application/errors/MissingDependenciesError';
import { MissingSecurityApiEndpoint } from '../../application/errors/MissingSecurityApiEndpoint';
import { CheckInConditionsNotMetError } from '../../application/errors/CheckInConditionsNotMetError';
import { CheckOutConditionsNotMetError } from '../../application/errors/CheckOutConditionsNotMetError';
import { CancellationConditionsNotMetError } from '../../application/errors/CancellationConditionsNotMetError';
import { ReservationConditionsNotMetError } from '../../application/errors/ReservationConditionsNotMetError';
import { FailedGettingVerificationCodeError } from '../../application/errors/FailedGettingVerificationCodeError';
import { MissingEnvVarsError } from '../../application/errors/MissingEnvVarsError';

/**
 * @description Acts as the aggregate for Slot reservations (representing rooms and
 * their availability), enforcing all the respective invariants ("statuses")
 * of the Slot entity.
 */
export class SlotReservation {
  private readonly repository: Repository;
  private readonly eventEmitter: EventEmitter;
  private readonly metadataConfig: MetadataConfigInput;
  private readonly logger: MikroLog;
  private readonly analyticsBusName: string;
  private readonly domainBusName: string;
  private readonly securityApiEndpoint: string;

  constructor(dependencies: Dependencies) {
    if (!dependencies.repository || !dependencies.eventEmitter)
      throw new MissingDependenciesError();
    const { repository, eventEmitter, metadataConfig } = dependencies;

    this.repository = repository;
    this.eventEmitter = eventEmitter;
    this.metadataConfig = metadataConfig;
    this.logger = MikroLog.start();

    this.analyticsBusName = process.env.ANALYTICS_BUS_NAME || '';
    this.domainBusName = process.env.DOMAIN_BUS_NAME || '';
    this.securityApiEndpoint = process.env.SECURITY_API_ENDPOINT_GENERATE || '';

    if (!this.analyticsBusName || !this.domainBusName)
      throw new MissingEnvVarsError(
        JSON.stringify([
          { key: 'DOMAIN_BUS_NAME', value: process.env.DOMAIN_BUS_NAME },
          { key: 'ANALYTICS_BUS_NAME', value: process.env.ANALYTICS_BUS_NAME }
        ])
      );
  }

  /**
   * PRIVATE METHODS
   */

  /**
   * @description Convenience method to emit an event to the domain bus
   * and optionally to the analytics bus.
   */
  private async emitEvents(event: Event): Promise<void> {
    const source = event.get().Source;

    await this.eventEmitter.emit(event.get());
    this.logger.log(`Emitted '${source}' to '${this.domainBusName}'`);

    await this.eventEmitter.emit(event.getAnalyticsVariant(this.analyticsBusName));
    this.logger.log(`Emitted '${source}' to '${this.analyticsBusName}'`);
  }

  /**
   * @description Utility to encapsulate the transactional boilerplate
   * such as calling the repository and event emitter.
   */
  private async transact(slot: Slot, event: Event, newStatus: Status) {
    slot.updateStatus(newStatus);
    const dto = slot.get();

    await this.repository
      .updateSlot(dto)
      .then(() => this.logger.log(`Updated status of '${dto.slotId}' to '${newStatus}'`));

    await this.repository.addEvent(event);
    await this.emitEvents(event);
  }

  /**
   * USE CASES ETC.
   */

  /**
   * @description Make all the slots needed for a single day (same day/"today").
   *
   * "Zulu time" is used, where GMT+0 is the basis.
   *
   * @see https://time.is/Z
   */
  public async makeDailySlots(): Promise<string[]> {
    const slots: SlotDTO[] = [];

    const startHour = 6; // Zulu time (GMT) -> 08:00 in CEST
    const numberHours = 10;

    for (let slotCount = 0; slotCount < numberHours; slotCount++) {
      const hour = startHour + slotCount;
      const timeSlot = new TimeSlot().startingAt(hour);
      const slot = new Slot(timeSlot.get());
      slots.push(slot.get());
    }

    const dailySlots = slots.map(async (slot: SlotDTO) => {
      const { slotId, hostName, slotStatus, timeSlot } = slot;
      const event = new CreatedEvent({
        event: {
          eventName: 'CREATED', // Transient state
          slotId,
          slotStatus,
          hostName,
          startTime: timeSlot.startTime
        },
        eventBusName: this.domainBusName,
        metadataConfig: this.metadataConfig
      });

      // This does not use the local `transact()` method since
      // we want to use `repository.updateSlot()` directly here
      await this.repository.updateSlot(slot);
      await this.repository.addEvent(event);
      await this.emitEvents(event);
    });

    await Promise.all(dailySlots);

    const slotIds = slots.map((slot: SlotDTO) => slot.slotId);
    return slotIds;
  }

  /**
   * @description Updates a Slot to be in `OPEN` invariant state by cancelling the current state.
   *
   * Can only be performed in `RESERVED` state.
   *
   * @emits `CANCELLED`
   */
  public async cancel(slotId: SlotId): Promise<void> {
    const slotDto = await loadSlot(this.repository, slotId);
    const slot = new Slot().from(slotDto);

    const { slotStatus, hostName, timeSlot } = slot.get();
    const { startTime } = timeSlot;
    if (slotStatus !== 'RESERVED') throw new CancellationConditionsNotMetError(slotStatus);

    const newStatus = 'OPEN';

    slot.removeHostName();

    const event = new CancelledEvent({
      event: {
        eventName: 'CANCELLED', // Transient state
        slotId,
        slotStatus,
        hostName,
        startTime
      },
      eventBusName: this.domainBusName,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot, event, newStatus);
  }

  /**
   * @description Updates a Slot to be in `RESERVED` invariant state.
   *
   * Can only be performed in `OPEN` state.
   *
   * @emits `RESERVED`
   */
  public async reserve(slotInput: SlotInput): Promise<ReserveOutput> {
    // TODO: Create special sanitizer for slotInput
    const { slotId, hostName } = slotInput;

    const slotDto = await loadSlot(this.repository, slotId);
    const slot = new Slot().from(slotDto);

    const { slotStatus, timeSlot } = slot.get();
    const { startTime } = timeSlot;
    if (slotStatus !== 'OPEN') throw new ReservationConditionsNotMetError(slotStatus);

    // We do the verification code stuff before committing to the transaction
    if (!this.securityApiEndpoint) throw new MissingSecurityApiEndpoint();
    const verificationCode = await getVerificationCode(this.securityApiEndpoint, slotId);
    if (!verificationCode) throw new FailedGettingVerificationCodeError('Bad status received!');

    const newStatus = 'RESERVED';

    const event = new ReservedEvent({
      event: {
        eventName: newStatus,
        slotId,
        slotStatus: newStatus,
        hostName,
        startTime
      },
      eventBusName: this.domainBusName,
      metadataConfig: this.metadataConfig
    });

    slot.updateHostName(hostName || '');

    await this.transact(slot, event, newStatus);

    return {
      code: verificationCode
    };
  }

  /**
   * @description Updates a Slot to be in `CHECKED_IN` invariant state.
   *
   * Can only be performed in `RESERVED` state.
   *
   * @emits `CHECKED_IN`
   */
  public async checkIn(slotId: SlotId): Promise<void> {
    const slotDto = await loadSlot(this.repository, slotId);
    const slot = new Slot().from(slotDto);

    const { slotStatus, hostName, timeSlot } = slot.get();
    const { startTime } = timeSlot;
    if (slotStatus !== 'RESERVED') throw new CheckInConditionsNotMetError(slotStatus);

    const newStatus = 'CHECKED_IN';

    const event = new CheckedInEvent({
      event: {
        eventName: newStatus,
        slotId,
        slotStatus: newStatus,
        hostName,
        startTime
      },
      eventBusName: this.domainBusName,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot, event, newStatus);
  }

  /**
   * @description Updates a Slot to be in `OPEN` invariant state by checking out from the current state.
   *
   * Can only be performed in `CHECKED_IN` state.
   *
   * @emits `CHECKED_OUT`
   */
  public async checkOut(slotId: SlotId): Promise<void> {
    const slotDto = await loadSlot(this.repository, slotId);
    const slot = new Slot().from(slotDto);

    const { slotStatus, hostName, timeSlot } = slot.get();
    const { startTime } = timeSlot;
    if (slotStatus !== 'CHECKED_IN') throw new CheckOutConditionsNotMetError(slotStatus);

    const newStatus = 'OPEN';

    slot.removeHostName();

    const event = new CheckedOutEvent({
      event: {
        eventName: 'CHECKED_OUT', // Transient state
        slotId,
        slotStatus: newStatus,
        hostName,
        startTime
      },
      eventBusName: this.domainBusName,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot, event, newStatus);
  }

  /**
   * @description Updates a Slot to be in "open" invariant state.
   *
   * @emits `OPENED`
   */
  public async open(slotId: SlotId): Promise<void> {
    const slotDto = await loadSlot(this.repository, slotId);
    const slot = new Slot().from(slotDto);

    const { timeSlot } = slot.get();
    const { startTime } = timeSlot;

    const newStatus = 'OPEN';

    const event = new OpenedEvent({
      event: {
        eventName: 'OPENED',
        slotId,
        slotStatus: newStatus,
        hostName: '',
        startTime
      },
      eventBusName: this.domainBusName,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot, event, newStatus);
  }

  /**
   * @description Check for closed slots and set them as being in "closed" invariant state.
   *
   * This is only triggered by scheduled events.
   */
  public async checkForClosed(): Promise<void> {
    const slots = await loadSlots(this.repository);

    const updateSlots = slots.map(async (slotDto: SlotDTO) => {
      const slot = new Slot().from(slotDto);
      if (slot.isEnded()) return await this.close(slot);
    });

    await Promise.all(updateSlots);
  }

  /**
   * @description Updates a Slot to be in "closed" invariant state.
   *
   * @emits `CLOSED`
   */
  private async close(slot: Slot): Promise<void> {
    const { slotId, hostName, timeSlot } = slot.get();
    const { startTime } = timeSlot;
    const newStatus = 'CLOSED';

    const event = new ClosedEvent({
      event: {
        eventName: newStatus,
        slotId,
        slotStatus: newStatus,
        hostName,
        startTime
      },
      eventBusName: this.domainBusName,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot, event, newStatus);
  }

  /**
   * @description Check for unattended slots.
   */
  public async checkForUnattended(): Promise<void> {
    const slots = await loadSlots(this.repository);

    const slotsToUpdate = slots.filter(async (slotDto: SlotDTO) => {
      const slot = new Slot().from(slotDto);
      if (slot.isGracePeriodOver()) return await this.unattend(slot);
    });

    await Promise.all(slotsToUpdate);
  }

  /**
   * @description Set a slot as being in `OPEN` invariant state if it is unattended.
   *
   * State change can only be performed in `RESERVED` state.
   *
   * This is only triggered by scheduled events.
   *
   * @emits `UNATTENDED`
   */
  private async unattend(slot: Slot): Promise<void> {
    const { slotId, slotStatus, hostName, timeSlot } = slot.get();
    const { startTime } = timeSlot;

    if (slotStatus !== 'RESERVED') return;

    const newStatus = 'OPEN';

    slot.removeHostName();

    const event = new UnattendedEvent({
      event: {
        eventName: 'UNATTENDED', // Transient state
        slotId,
        slotStatus: newStatus,
        hostName,
        startTime
      },
      eventBusName: this.domainBusName,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot, event, newStatus);
  }
}

```
{% endcode %}

## Stepping through the code

As expected, there's the standard imports, but there is no Factory function. I just don't often find it very helpful to encapsulate an aggregate using one.

The code in the class is in two major chunks: Private methods and the public ("API") methods.

The examples will be presented in "roughly" sequential order, though logically reservation comes before the check-in. Those are switched in order because I want to gradually progress on their relative complexity (what little there is).

### Importing services

{% hint style="danger" %}
Hold on to your feelings, if I've converted you to a Mini-Me version of Uncle Bob or Eric Evans!
{% endhint %}

At the top of the file we are making a whole bunch of imports. Some of them are unreasonable to not import (at least in TypeScript) like types/interfaces, errors (and other "global" functionality), and similar.

**When it comes to services, this importing may be pretty contentious to purists.**

In DDD (and Googling or reading on Stack Overflow) you'll hear a lot of arguments against importing outer-level objects (such as services) in deeper-level objects, such as aggregates. This is sound advice, generally speaking. If we start importing left-right-and-center without discipline we will end up in a really bad place.

Our particular case, however, is sensible. Let me present some of my arguments:

* **Aggregates are one of the most important objects that express our business logic in the language of the domain**. The aggregate is very big, and _was_ even bigger. At an earlier stage it included quite a few private methods that are now imported from the application and domain layer after a bit of refactoring. To actually do these things we need bits and bobs to help with sometimes menial tasks. It is reasonable to refactor those parts into functional services.
* **Refactoring them from private methods to functional services means that their testability is improved**, should we want to write function/class-specific tests for these.
* **Extracting these methods into services also allow better reuse**, though to be frank, right now there is no such need.
* OK, so with them refactored to services, why don't we inject them instead? This too is sensible. **However, I decided against injecting them becomes this would create significant up-front bloat** across the use cases, or worse (but more pure), in the web adapters. This will carry down to affecting many of the tests as well. At this stage it is simply more pragmatic to accept the direct importing of services. The tests already cover enough to guarantee that any mischievous work in the services would be caught.

And with no more than that, to each his own, but it's a realistic as well as solid approach, without compromising too much on the integrity of the Clean Architecture and DDD principles.

\++++

### Why is this not a service or something else?

You might have noticed that our `SlotReservation` aggregate was indeed called an _aggregate_, yet it has no ID or similar (as per expectations on aggregates), nor did it carry state on itself. Well spotted.

My reasons for doing it this way include:

* Services are something we try to avoid in DDD, and the uses I understand them to be best for include typical "heavy lifting", not necessarily being important orchestrators. The `SlotReservation` aggregate has quite a bit of such orchestration happening on the `Slot` entity and more.
* It's not an entity because it does not handle something, on its own, concrete.
* It's not reduced to orchestration bits-and-bobs in the use case either. This for me seems right, coming from the Clean Architecture angle, though there is too much domain logic and entity operations for me to feel that would be right.
* Finally: It _does_ act like an aggregate as it functions as the "entry point" to the value object (generation) and the `Slot` entity that we actually operate on and persist. We also send the domain events from here: It is the transaction boundary.

And that's how we ended up in this compromise. Don't let DDD become dogma. Be humble and realistic and if it makes sense to you and you can explain the reasoning, at the very least we are dealing with considered and deliberate design which after all is the real goal.

\++++

### Constructor

The constructor had to evolve through a few iterations and it ultimately ended up taking in quite a bit of dependencies and configuration; all in all a good thing since it makes the `SlotAggregate` less coupled to any infrastructural concerns.

We also have several custom errors that may be thrown if conditions are not valid.&#x20;

```typescript
private repository: Repository;
private eventEmitter: EventEmitter;
private metadataConfig: MetadataConfigInput;
private logger: MikroLog;
private analyticsBusName: string;
private domainBusName: string;
private securityApiEndpoint: string;

constructor(dependencies: Dependencies) {
  if (!dependencies.repository || !dependencies.eventEmitter)
    throw new MissingDependenciesError();
  const { repository, eventEmitter, metadataConfig } = dependencies;

  this.repository = repository;
  this.eventEmitter = eventEmitter;
  this.metadataConfig = metadataConfig;
  this.logger = MikroLog.start();

  this.analyticsBusName = process.env.ANALYTICS_BUS_NAME || '';
  this.domainBusName = process.env.DOMAIN_BUS_NAME || '';
  this.securityApiEndpoint = process.env.SECURITY_API_ENDPOINT_GENERATE || '';

  if (!this.analyticsBusName || !this.domainBusName)
    throw new MissingEnvVarsError(
      JSON.stringify([
        { key: 'DOMAIN_BUS_NAME', value: process.env.DOMAIN_BUS_NAME },
        { key: 'ANALYTICS_BUS_NAME', value: process.env.ANALYTICS_BUS_NAME }
      ])
    );
  if (!this.securityApiEndpoint) throw new MissingSecurityApiEndpoint();
}
```

### Use case #1: Make daily slots

The first publicly accessible use case is making the daily slots. This one is also one of the longer ones as it has to deal with more setup than the other ones.

```typescript
/**
 * @description Make all the slots needed for a single day (same day/"today").
 *
 * "Zulu time" is used, where GMT+0 is the basis.
 *
 * @see https://time.is/Z
 */
public async makeDailySlots(): Promise<void> {
  const slots: SlotDTO[] = [];

  const timeSlot = new TimeSlot();
  const currentTime = this.getCurrentTime();
  const numberHours = 10;
  const startHour = 8;

  for (let slotCount = 0; slotCount < numberHours; slotCount++) {
    const hour = startHour + slotCount;
    const { startTime, endTime } = timeSlot.startingAt(hour);
    const newSlot = this.makeSlot({ currentTime, startTime, endTime });
    slots.push(newSlot);
  }

  const addSlots = slots.map(async (slot: SlotDTO) => {
    await this.repository.updateSlot(slot);

    const { slotId, hostName, slotStatus, timeSlot } = slot;

    const event = new CreatedEvent({
      event: {
        eventName: 'CREATED', // Transient state
        slotId,
        slotStatus,
        hostName,
        startTime: timeSlot.startTime
      },
      eventBusName: this.domainBusName,
      metadataConfig: this.metadataConfig
    });

    await this.emitEvents(event);
  });

  await Promise.all(addSlots);
}
```

### Use case #2: Check in

The rest of the use cases have a format that resembles the one we look at here, the "check in" case.

We load a slot based on the ID we have received, destructure some fields, verify that we have the correct slot status (it must be `RESERVED` to work), and then call our private `updateSlot()` method with the slot data and new status. When that's done it's time to make the correct event (here, the `CheckedInEvent`) and emit that with our private `emitEvents()` method.

All in all, we have ensured the state satisfies our business needs, the new invariant is correctly shaped, made the update, and informed our domain of the change via an event.

```typescript
/**
 * @description Updates a Slot to be in `CHECKED_IN` invariant state.
 *
 * Can only be performed in `RESERVED` state.
 *
 * @emits `CHECKED_IN`
 */
public async checkIn(slotId: SlotId): Promise<void> {
  const slot = await this.loadSlot(slotId);
  const { slotStatus, hostName, timeSlot } = slot;
  const { startTime } = timeSlot;
  if (slotStatus !== 'RESERVED') throw new CheckInConditionsNotMetError(slotStatus);

  const newStatus = 'CHECKED_IN';
  await this.updateSlot(slot, newStatus);

  const event = new CheckedInEvent({
    event: {
      eventName: newStatus,
      slotId,
      slotStatus: newStatus,
      hostName,
      startTime
    },
    eventBusName: this.domainBusName,
    metadataConfig: this.metadataConfig
  });

  await this.emitEvents(event);
}
```

### Use case #3: Reserve slot

Because this one has to take in a user's input data it becomes very important that we validate the input and sanitize it. That becomes the first thing we do.

Next, we load the slot data for the requested slot, destructure the data for use, verify that the slot status is correct or else we throw an error. Then we get a verification code using a private method that will get it from an external service in another (sub)domain. If something goes awry, we throw an error.

Now it's just the home stretch: Update the slot with the correct shape and data, build a `ReservedEvent` and emit it to our domain. Finally, return the `ReserveOutput` object with the verification code we received so that the user can jot it down and use it when the time comes to check in.

```typescript
/**
 * @description Updates a Slot to be in `RESERVED` invariant state.
 *
 * Can only be performed in `OPEN` state.
 *
 * @emits `RESERVED`
 */
public async reserve(slotInput: SlotInput): Promise<ReserveOutput> {
  this.validateInputData(slotInput, true);
  const { slotId, hostName } = slotInput;

  const slot = await this.loadSlot(slotId);
  const { slotStatus, timeSlot } = slot;
  const { startTime } = timeSlot;
  if (slotStatus !== 'OPEN') throw new ReservationConditionsNotMetError(slotStatus);

  // We do the verification code stuff before committing to the transaction
  const verificationCode = await this.getVerificationCode(slotId);
  if (!verificationCode) throw new FailedGettingVerificationCodeError('Bad status received!');

  const newStatus = 'RESERVED';

  await this.updateSlot(
    {
      ...slot,
      hostName: hostName || ''
    },
    newStatus
  );

  const event = new ReservedEvent({
    event: {
      eventName: newStatus,
      slotId,
      slotStatus: newStatus,
      hostName,
      startTime
    },
    eventBusName: this.domainBusName,
    metadataConfig: this.metadataConfig
  });

  await this.emitEvents(event);

  return {
    code: verificationCode
  };
}
```

asdf
