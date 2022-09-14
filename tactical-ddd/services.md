---
description: >-
  "Service" is an overloaded concept and they're often over-used in non-DDD
  contexts. Let's find out how they are very selectively used in our context.
---

# Services

> When a significant process or transformation in the domain is not a natural responsibility of an ENTITY or VALUE OBJECT, add an operation to the model as standalone interface declared as a SERVICE. Define the interface in terms of the language of the model and make sure the operation name is part of the UBIQUITOUS LANGUAGE. Make the SERVICE stateless.
>
> —Source: Eric Evans, _Domain-Driven Design: Tackling Complexity in the Heart of Software_

While we haven't gotten to entities and aggregates yet, it's safe to say that **services** play in the next-highest league, metaphorically speaking.

In many projects you might see services being used very broadly and liberally. This is similar to how in many Node/JS/TS projects you will have tons of helpers, utilities or other functionally-oriented code. A problem with this way of structuring code is that you'll start witnessing a flattening of hierarchy: Everything is on the same plane, meaning it's hard to understand how pieces fit together and what operates in which way on what.

Using a more object-oriented approach we can start setting up a hierarchy like this:

* Aggregate Root (if needed)
* Aggregate
* Entity
* Domain Service
* Application Service
* Value Object

Let's read what Evans writes about our services.

> **Application Layer**: Defines the jobs the software is supposed to do and directs the expressive domain objects to work out problems. The tasks this layer is responsible for are meaningful to the business or necessary for interaction with the application layers of other systems. This layer is kept thin. It does not contain business rules or knowledge, but only coordinates tasks and delegates work to collaborations of domain objects in the next layer down. It does not have state reflecting the business situation, but it can have state that reflects the progress of a task for the user or the program.
>
> **Domain Layer**: Responsible for representing concepts of the business, information about the business situation, and business rules. State that reflects the business situation is controlled and used here, even though the technical details of storing it are delegated to the infrastructure. This layer is the heart of business software.
>
> — Source: Eric Evans (via [https://martinfowler.com/bliki/AnemicDomainModel.html](https://martinfowler.com/bliki/AnemicDomainModel.html))

TODO

### Application Services (or use-cases)

> Use Cases (a Clean Architecture term) are similar to **Application Services** in DDD. At least their _relative positioning_ is.
>
> In DDD, **Application Services** (application layer concerns, obviously) represent commands or queries (like `createComment` - COMMAND or `getCommentById` - QUERY) that:
>
> * Contain no domain-specific business logic.
> * Are used in order to fetch domain entities (and anything else) from persistence and the outside world.
> * Either passes off control to an Aggregate to execute domain logic by using a method of the Aggregate, or passes off several entities to a Domain Service to facilitate their interaction.
> * Have low-levels of [Cyclomatic Complexity](https://en.wikipedia.org/wiki/Cyclomatic\_complexity).
>
> — Source: [https://khalilstemmler.com/articles/software-design-architecture/domain-driven-design-vs-clean-architecture/](https://khalilstemmler.com/articles/software-design-architecture/domain-driven-design-vs-clean-architecture/)

The above should all be familiar, so the main takeaway is that we understand that use cases and application services function practically the same, and are positionally equal. You can, as I have, use so-called "use case interactors" if you'd want to stay consistent with the terminology. In practice however, I've actually only had to use such interactors (or if you'd rather: application services) in my most complex project, [Figmagic](https://github.com/mikaelvesavuori/figmagic). I've just never had to work on anything else that requires the abstraction, so don't go expecting that you need it for everything either.

{% code title="code/Reservation/SlotReservation/src/application/services/loadSlots.ts" lineNumbers="true" %}
```typescript
import { sanitizeInputData } from '../../domain/services/sanitizeInputData';

import { Repository } from '../../interfaces/Repository';
import { SlotDTO } from '../../interfaces/Slot';

/**
 * @description Utility to load and validate multiple items from repository.
 */
export async function loadSlots(repository: Repository): Promise<SlotDTO[]> {
  const items = await repository.loadSlots();
  return items.map((item: Record<string, any>) => sanitizeInputData(item));
}
```
{% endcode %}

TODO

### Domain Services

Domain services encapsulate, as expected, domain logic — you'll therefore want this to match the ubiquitous language of your domain. Domain services would be recommended in case you have to interact with multiple aggregates for example, otherwise keep it simple and let it be part of the aggregate itself.

TODO

{% code title="code/Reservation/SlotReservation/src/domain/services/sanitizeInputData.ts" lineNumbers="true" %}
```typescript
import { SlotDTO } from '../../interfaces/Slot';

import { MissingInputDataFieldError } from '../../application/errors/MissingInputDataFieldError';
import { MissingInputDataTimeError } from '../../application/errors/MissingInputDataTimeError';

/**
 * @description Validate and sanitize incoming input data.
 * @param onlyCheckReservationDataInput Used for reservations in which case we only have limited ingoing data.
 * @returns Validated and sanitized `SlotDTO`
 */
export function sanitizeInputData(
  data: Record<string, any>,
  onlyCheckReservationDataInput?: boolean
): SlotDTO {
  // Force data into a new object to get rid of anything dangerous that might have made it in
  const stringifiedData = JSON.stringify(data);
  const parsedData = JSON.parse(stringifiedData);

  // Verify presence of required fields
  const requiredFields = onlyCheckReservationDataInput
    ? ['slotId', 'hostName']
    : ['slotId', 'timeSlot', 'slotStatus', 'createdAt', 'updatedAt'];
  requiredFields.forEach((key: string) => {
    const value = parsedData[key];
    if (!value) throw new MissingInputDataFieldError();
    else if (key === 'timeSlot') {
      if (!parsedData['timeSlot']['startTime'] || !parsedData['timeSlot']['endTime'])
        throw new MissingInputDataTimeError();
    }
  });

  // Construct new Slot without any additional, non-required fields that might have been injected
  const reconstitutedSlot: Record<string, any> = {};
  Object.entries(data).forEach((entry: any) => {
    const [key, value] = entry;
    if (requiredFields.includes(key)) reconstitutedSlot[key] = value;
  });

  // Add `hostName` if one existed
  if (parsedData['hostName']) reconstitutedSlot['hostName'] = parsedData['hostName'];

  return reconstitutedSlot as SlotDTO;
}
```
{% endcode %}

TODO
