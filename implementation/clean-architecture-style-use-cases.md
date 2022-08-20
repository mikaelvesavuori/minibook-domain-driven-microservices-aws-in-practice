# Clean architecture-style use cases

We have seen this diagram before, haven't we?

![](../.gitbook/assets/CleanArchitecture.jpg)

This far we have seen how these might work:

* The "blue" ring, as pure infrastructure
* The "green" ring, as our Lambda handler

Now, the "red" ring—use cases—is next up!

### What is a use case?

> The software in this layer contains _application specific_ business rules. It encapsulates and implements all of the use cases of the system. These use cases orchestrate the flow of data to and from the entities, and direct those entities to use their _enterprise wide_ business rules to achieve the goals of the use case.
>
> We do not expect changes in this layer to affect the entities. We also do not expect this layer to be affected by changes to externalities such as the database, the UI, or any of the common frameworks. This layer is isolated from such concerns.
>
> We _do_, however, expect that changes to the operation of the application _will_ affect the use-cases and therefore the software in this layer. If the details of a use-case change, then some code in this layer will certainly be affected.
>
> — Source: [https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

It should sound logical enough. If we look at a very, very basic example it should look like this:

{% code title="code/Analytics/SlotAnalytics/src/application/usecases/AddRecordUseCase.ts" lineNumbers="true" %}
```typescript
import { Dependencies } from '../../interfaces/Dependencies';
import { AnalyticalRecord } from '../../interfaces/AnalyticalRecord';

/**
 * @description Add record to database.
 */
export async function AddRecordUseCase(dependencies: Dependencies, record: AnalyticalRecord) {
  const { repository } = dependencies;
  await repository.add(record);
}
```
{% endcode %}

There's not that much going on here. We import and use interface definitions, take in dependencies and the record data, and then it's just two commands.

If you have been around the block, maybe you feel one or more of the below:

* "OK, this seems like just adding more chaff into the mix, doesn't it?"
* "Isn't this a _Transaction Script_... WTH mate?"
* TODO

When it comes to the question of adding more (useless?) code and more layers of abstractions, rather we should see the benefits. Because we broke up the handler and its boilerplate from our business and use case, **the use case is the first meaningfully **_**testable**_** layer**. That is, the surface for our widest unit testing is the _use case_ as it effectively exercises the full flow and we can afford to be totally oblivious about anything in the handler itself. So, yes indeed, it does add a further layer but again we get something better back as a result for that minimal investment.

### Transaction Script is your friend...if done well

Now, let's consider first Martin Fowler's words on the Transaction Script pattern:

> Most business applications can be thought of as a series of transactions. A transaction may view some information as organized in a particular way, another will make changes to it. Each interaction between a client system and a server system contains a certain amount of logic. In some cases this can be as simple as displaying information in the database. In others it may involve many steps of validations and calculations.
>
> A Transaction Script organizes all this logic primarily as a single procedure, making calls directly to the database or through a thin database wrapper. Each transaction will have its own Transaction Script, although common subtasks can be broken into subprocedures.
>
> — Source: [https://martinfowler.com/eaaCatalog/transactionScript.html](https://martinfowler.com/eaaCatalog/transactionScript.html)

TODO: Add "Learning DDD" quotes on transaction script

The gist I am trying to tell is that the use case itself should act essentially as a readable, easy-to-follow orchestration of the use case's mechanics. A key difference is that between a novice programmer and a seasoned one, the use case itself must not touch the details, concretions or infrastructure. Instead (as we see) we trust that our commands on abstractions work as intended:

```typescript
const { repository } = dependencies;
await repository.add(record);
```

This pattern scales well, as long as the deeper layers (entities etc.) are doing their job. For this particular case, there isn't an actual aggregate or entity involved, just the basic repository. (TODO?)

We can also look at how this scales to a much more complex case. In this case though, you will never see that complexity! It looks almost the same:

{% code title="code/Reservation/SlotReservation/src/application/usecases/CreateSlotsUseCase.ts" lineNumbers="true" %}
```typescript
import { Slot } from '../../domain/aggregates/Slot';
import { Dependencies } from '../../interfaces/Dependencies';

/**
 * @description Use case to handle creating the daily slots.
 */
export async function CreateSlotsUseCase(dependencies: Dependencies): Promise<string[]> {
  const slot = new Slot(dependencies);
  return await slot.makeDailySlots();
}
```
{% endcode %}

You'll have to trust me on this one for now, but yes, the above _is_ more complex. However, the orchestration that we have to do is not. If the use case, for example, would demand several entities to interact or connect somehow, or multiple operations to be done, then using the use case file/function/layer is the right place to string together the logic.

Fortunately, though, all the services in Get-A-Room are pretty orthodox to clean domain modelling and tight in their implementation, so they don't do any messy stuff, leaving the use case itself very straightforward.

### In closing

The use case is the first meaningfully testable layer. You should prioritize tests for this layer (if you aren't already doing TDD or such). Testing here gives you _a lot_ of bang for the buck.

Use cases are good examples of places where a well-working Transaction Script pattern can be used. I find it true that the less lines you have, the better the domain layer is functioning and the tighter you have been on understanding what your system should do.
