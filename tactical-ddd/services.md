---
description: >-
  "Service" is an overloaded concept and they're often over-used in non-DDD
  contexts. Let's find out how they are very selectively used in our context.
---

# Services

<figure><img src="../.gitbook/assets/undraw_Services_re_hu5n.png" alt=""><figcaption><p>Illustration from <a href="https://undraw.co/">Undraw</a></p></figcaption></figure>

{% hint style="success" %}
**TL;DR**

**Services** do things that don't quite fit in entities or other objects. They are completely stateless.

**Application services** are excellent for wrapping non-domain actions like retrieving data from external systems, while **domain services** extend the possibility of acting within the domain. A good example of **domain service** usage is when you need to orchestrate entities or aggregates, especially as in our example code we don't have higher-level aggregates that can hold such logic.
{% endhint %}

Services: An overloaded and problematic term. Still, we need them. What did Eric Evans himself actually think of them?

> When a significant process or transformation in the domain is not a natural responsibility of an ENTITY or VALUE OBJECT, add an operation to the model as standalone interface declared as a SERVICE. Define the interface in terms of the language of the model and make sure the operation name is part of the UBIQUITOUS LANGUAGE. Make the SERVICE stateless.
>
> —Source: Eric Evans, _Domain-Driven Design: Tackling Complexity in the Heart of Software_ (p. 106)

While we haven't gotten to entities and aggregates yet, it's safe to say that **services** play in the next-highest league, metaphorically speaking.

## Services in the DDD hierarchy

In many projects you might see services being used very broadly and liberally. This is similar to how in many Node/JS/TS projects you will find tons of helpers, utilities or other functionally-oriented code. Unwittingly, this way of structuring code will introduce a flattening of hierarchies: Everything is on the same plane, meaning it's hard to understand how pieces fit together and what operates in _which_ way on _what_.

Using a more object-oriented approach we can start enforcing a hierarchy like the below:

* Aggregate Root (if needed)
* Aggregate (if needed)
* Entity (if needed)
* Domain Service
* Application Service
* Value Object

{% hint style="info" %}
Some of the solutions in the example code are actually basic enough that they need no entity or higher-level constructs to deal with them (not even services!).

As said in the introduction, DDD is sometimes overkill.
{% endhint %}

Let's read what Evans writes about layering our services:

> **Application Layer**: Defines the jobs the software is supposed to do and directs the expressive domain objects to work out problems. The tasks this layer is responsible for are meaningful to the business or necessary for interaction with the application layers of other systems. This layer is kept thin. It does not contain business rules or knowledge, but only coordinates tasks and delegates work to collaborations of domain objects in the next layer down. It does not have state reflecting the business situation, but it can have state that reflects the progress of a task for the user or the program.
>
> **Domain Layer**: Responsible for representing concepts of the business, information about the business situation, and business rules. State that reflects the business situation is controlled and used here, even though the technical details of storing it are delegated to the infrastructure. This layer is the heart of business software.
>
> — Source: Eric Evans (via [https://martinfowler.com/bliki/AnemicDomainModel.html](https://martinfowler.com/bliki/AnemicDomainModel.html))

The intuitive difference should be clear, but I've found that it may take a refactoring or two to find the best balance, especially when balancing Domain Services and Aggregates.

## Application Services or use cases?

Application Services and (Clean Architecture) use cases are somewhat equivalent, and we are using both concepts in our example code.

Use cases, like application services, contain no domain-specific business logic; can be used to fetch other domain entities from external or internal (repository) soruces; may pass off control to Aggregates or Domain Services to execute domain logic; have low [cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic\_complexity). (See [https://khalilstemmler.com/articles/software-design-architecture/domain-driven-design-vs-clean-architecture/](https://khalilstemmler.com/articles/software-design-architecture/domain-driven-design-vs-clean-architecture/))

The way I come to accept both existing is like this:

* The use case is strictly equivalent to the first testable complete unit of code. This is where we separate the Lambda infrastructure from the real code itself. This need does not in any way counter the application service notion.
* You can still use application services within the use case as these operate on the same overall conceptual application level.

The main takeaway is that we understand that use cases and application services function practically the same, and are positionally equal. You can, as I have done in other projects, use so-called "use case interactors" if you'd want to stay consistent with the terminology. In practice however, I've actually only had to use such interactors (or if you'd rather: application services) in my most complex project, [Figmagic](https://github.com/mikaelvesavuori/figmagic). I've just never had to work on anything else that requires the abstraction, so don't go expecting that you need it for everything either.

## An application service example

The following is a concrete version of the `VerificationCodeService` used in the Reservation solution.

{% code title="code/Reservation/Reservation/src/application/services/VerificationCodeService.ts" lineNumbers="true" %}
```typescript
/**
 * @description The `OnlineVerificationCodeService` calls an online service
 * to retrieve and passes back a verification code.
 */
class OnlineVerificationCodeService implements VerificationCodeService {
  private readonly securityApiEndpoint: string;

  constructor(securityApiEndpoint: string) {
    this.securityApiEndpoint = securityApiEndpoint;
    if (!securityApiEndpoint) throw new MissingSecurityApiEndpoint();
  }

  /**
   * @description Connect to Security API to generate code.
   */
  async getVerificationCode(slotId: string): Promise<string> {
    const verificationCode = await fetch(this.securityApiEndpoint, {
      body: JSON.stringify({
        slotId: slotId
      }),
      method: 'POST'
    }).then((res: Response) => {
      if (res?.status >= 200 && res?.status < 300) return res.json();
    });

    if (!verificationCode) throw new FailedGettingVerificationCodeError('Bad status received!');

    return verificationCode;
  }
}
```
{% endcode %}

It has a single public method, `getVerificationCode()`. Using it, one can call an external endpoint and get the implied verification code. Because this as a straightforward and integration-oriented concern, and as we evidently can see there is no business logic here, it's safe to uncontroversially say that—indeed—we are dealing with an application service here.

## Domain Services

Domain services encapsulate, as expected, domain logic — you'll therefore want this to match the ubiquitous language of your domain. Domain services would be recommended in case you have to interact with multiple aggregates for example, otherwise keep it simple and let it be part of the aggregate itself.

Next up we are going to check out one of the most important and longest classes in the entire codebase: The `ReservationService`.&#x20;

{% code title="code/Reservation/SlotReservation/src/domain/services/ReservationService.ts" lineNumbers="true" %}
```typescript
import { MikroLog } from 'mikrolog';

// Aggregates/Entities
import { Slot } from '../entities/Slot';

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
import { SlotDTO, Status } from '../../interfaces/Slot';
import { Repository } from '../../interfaces/Repository';
import { Dependencies } from '../../interfaces/Dependencies';
import { ReserveOutput } from '../../interfaces/ReserveOutput';
import { MetadataConfigInput } from '../../interfaces/Metadata';
import { Event } from '../../interfaces/Event';
import { DomainEventPublisherService } from '../../interfaces/DomainEventPublisherService';
import { VerificationCodeService } from '../../interfaces/VerificationCodeService';

// Errors
import { MissingDependenciesError } from '../../application/errors/MissingDependenciesError';

/**
 * @description Acts as the aggregate for Slot reservations (representing rooms and
 * their availability), enforcing all the respective invariants ("statuses")
 * of the Slot entity.
 */
export class ReservationService {
  private readonly repository: Repository;
  private readonly metadataConfig: MetadataConfigInput;
  private readonly domainEventPublisher: DomainEventPublisherService;
  private readonly logger: MikroLog;

  constructor(dependencies: Dependencies) {
    if (!dependencies.repository || !dependencies.domainEventPublisher) throw new MissingDependenciesError();
    const { repository, domainEventPublisher, metadataConfig } = dependencies;

    this.repository = repository;
    this.metadataConfig = metadataConfig;
    this.domainEventPublisher = domainEventPublisher;
    this.logger = MikroLog.start();
  }

  /**
   * @description Utility to encapsulate the transactional boilerplate
   * such as calling the repository and event emitter.
   */
  private async transact(slotDto: SlotDTO, event: Event, newStatus: Status) {
    await this.repository
      .updateSlot(slotDto)
      .then(() => this.logger.log(`Updated status of '${slotDto.slotId}' to '${newStatus}'`));
    await this.repository.addEvent(event);
    await this.domainEventPublisher.publish(event);
  }

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
      slots.push(slot.toDto());
    }

    const dailySlots = slots.map(async (slotDto: SlotDTO) => {
      const slot = new Slot().fromDto(slotDto);
      const { slotId, hostName, slotStatus, timeSlot } = slot.toDto();

      const createdEvent = new CreatedEvent({
        event: {
          eventName: 'CREATED', // Transient state
          slotId,
          slotStatus,
          hostName,
          startTime: timeSlot.startTime
        },
        metadataConfig: this.metadataConfig
      });

      await this.transact(slot.toDto(), createdEvent, slotStatus);
    });

    await Promise.all(dailySlots);

    const slotIds = slots.map((slot: SlotDTO) => slot.slotId);
    return slotIds;
  }

  /**
   * @description Cancel a slot reservation.
   */
  public async cancel(slotDto: SlotDTO): Promise<void> {
    const slot = new Slot().fromDto(slotDto);
    const { event, newStatus } = slot.cancel();

    const cancelEvent = new CancelledEvent({
      event,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot.toDto(), cancelEvent, newStatus);
  }

  /**
   * @description Reserve a slot.
   */
  public async reserve(
    slotDto: SlotDTO,
    hostName: string,
    verificationCodeService: VerificationCodeService
  ): Promise<ReserveOutput> {
    const slot = new Slot().fromDto(slotDto);
    const { event, newStatus } = slot.reserve(hostName);

    const verificationCode = await verificationCodeService.getVerificationCode(slotDto.slotId);

    const reserveEvent = new ReservedEvent({
      event,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot.toDto(), reserveEvent, newStatus);

    return {
      code: verificationCode
    };
  }

  /**
   * @description Check in to a slot.
   */
  public async checkIn(slotDto: SlotDTO): Promise<void> {
    const slot = new Slot().fromDto(slotDto);
    const { event, newStatus } = slot.checkIn();

    const checkInEvent = new CheckedInEvent({
      event,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot.toDto(), checkInEvent, newStatus);
  }

  /**
   * @description Check out of a slot.
   */
  public async checkOut(slotDto: SlotDTO): Promise<void> {
    const slot = new Slot().fromDto(slotDto);
    const { event, newStatus } = slot.checkOut();

    const checkOutEvent = new CheckedOutEvent({
      event,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot.toDto(), checkOutEvent, newStatus);
  }

  /**
   * @description Re-open a slot.
   */
  public async open(slotDto: SlotDTO): Promise<void> {
    const slot = new Slot().fromDto(slotDto);
    const { event, newStatus } = slot.open();

    const openEvent = new OpenedEvent({
      event,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot.toDto(), openEvent, newStatus);
  }

  /**
   * @description Check for closed slots and set them as being in "closed" invariant state.
   *
   * This is only triggered by scheduled events.
   */
  public async checkForClosed(slotDtos: SlotDTO[]): Promise<void> {
    const updateSlots = slotDtos.map(async (slotDto: SlotDTO) => {
      const slot = new Slot().fromDto(slotDto);
      if (slot.isEnded()) return await this.close(slot);
    });

    await Promise.all(updateSlots);
  }

  /**
   * @description Close a slot.
   */
  private async close(slot: Slot): Promise<void> {
    const { event, newStatus } = slot.close();

    const closeEvent = new ClosedEvent({
      event,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot.toDto(), closeEvent, newStatus);
  }

  /**
   * @description Check for unattended slots.
   */
  public async checkForUnattended(slotDtos: SlotDTO[]): Promise<void> {
    const slotsToUpdate = slotDtos.filter(async (slotDto: SlotDTO) => {
      const slot = new Slot().fromDto(slotDto);
      if (slot.isGracePeriodOver()) return await this.unattend(slot);
    });

    await Promise.all(slotsToUpdate);
  }

  /**
   * @description Unattend a slot that has not been checked into.
   */
  private async unattend(slot: Slot): Promise<void> {
    const result = slot.unattend();
    if (!result) return;

    const { event, newStatus } = result;
    const unattendEvent = new UnattendedEvent({
      event,
      metadataConfig: this.metadataConfig
    });

    await this.transact(slot.toDto(), unattendEvent, newStatus);
  }
}
```
{% endcode %}

There's a lot happening there, but it's not quite a [God class](https://en.wikipedia.org/wiki/God\_object) either, thank...God?

First of all, the service, even just by glancing the method names, is clearly handling domain-specific concerns, such as `unattend()`, `cancel()`, and `makeDailySlots()`. When it gets constructed, it takes a number of dependencies to avoid creating its own imports and links to infrastructural objects.

We make properties of the class `private`, and if we can, also `readonly`. In this case it's no problem to do so. For methods that are called in the use cases they are made public, else they are private to discourage calling internal functionality from an unwitting outside party.

Most of the code handles roughly similar functionality. For a telling example of the orchestration you might sometimes need, look no further than `makeDailySlots()` on line 74: This is domain logic that would not make sense _inside_ the `Slot` but makes perfect sense here in the outer scope.

### Handling the cancellation

Let's look closer at a use case-oriented method, like `cancel()`. That one looks roughly similar to most of the other operations.

```typescript
public async cancel(slotDto: SlotDTO): Promise<void> {
  const slot = new Slot().fromDto(slotDto);
  const { event, newStatus } = slot.cancel();

  const cancelEvent = new CancelledEvent({
    event,
    metadataConfig: this.metadataConfig
  });

  await this.transact(slot.toDto(), cancelEvent, newStatus);
}
```

The method takes in the Data Transfer Object representation of the `Slot`. We reconstitute it by creating an actual `Slot` entity object from the DTO and then use the slot's own `cancel()` method, in turn encapsulating the relevant business and validation logic.

Given that nothing broke we can construct the `CancelledEvent` with the local metadata configuration and the event object we receive from the `Slot` itself.

Finally it's time to run the domain service's `transact()` method that wraps transactional boilerplate:

```typescript
private async transact(slotDto: SlotDTO, event: Event, newStatus: Status) {
  await this.repository
    .updateSlot(slotDto)
    .then(() => this.logger.log(`Updated status of '${slotDto.slotId}' to '${newStatus}'`));
  await this.repository.addEvent(event);
  await this.domainEventPublisher.publish(event);
}
```

The `domainEventPublisher` will be discussed in the Events section.

{% hint style="success" %}
It might have been even nicer, though more work, to inject some type of service rather than the repository but at some point we can just be "normal people" and accept the compromise of (in)directly using the repository in the domain layer.
{% endhint %}

TODO
