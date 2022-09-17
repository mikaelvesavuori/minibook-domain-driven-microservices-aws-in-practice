---
description: >-
  The least-discussed but structurally most fundamental pattern concerns our
  Modules and the structure these put on our work.
---

# Modules

In the DDD context, we use Modules as a logical construct to segregate between concerns when we technically implement our domain model. Modules should precede the Bounded Contexts, because Modules typically reside in the same codebase and reflect the _logical model_ of our domain. Dividing logical wholes into separate Bounded Contexts can cause problems (Vernon 2013, p. 344). One example of a valid use is to reach for Modules if you need to create a second model in the same Bounded Context (Vernon 2016, p.50).

Again, Modules are local to the code, while Bounded Contexts may constitute one or more logical solutions. Yet these both (in particular Modules) share the common trade-offs of public interfaces:

> \[E]ffective modules are deep: a simple public interface encapsulates complex logic. Ineffective modules are shallow: a shallow module's public interface encapsulates much less complexity than a deep module.
>
> — Khononov, p.223

This is the most basic tactical pattern, yet it at heart is all about classic programming concepts like "[high cohesion, low coupling](https://enterprisecraftsmanship.com/posts/cohesion-coupling-difference/)" and, as per DDD, expressing the Domain through the naming and functionality.

With all this said, though, the Module pattern itself is not descended from DDD; it is a common pattern that has been around probably since the start of at least object-oriented programming. We use this pattern to **encapsulate** and, sometimes, **name** some part of our application. This can be done by language-specific mechanisms and/or by structuring our code in files and folders.

## Demystifying Modules

In terms of ontology, **a Module can be a namespace or a package, depending on the language** that you are using. For our example code, using TypeScript, [there do exist mechanisms to handle this](https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html), but they are not completely idiomatic to how the language is typically used. Instead we will have to do this only at the file and folder level. Generally, it does make sense that we should also see the structure and folders as a related effect of our Modules. Therefore Modules are not simply only a technical matter, but a logical matter.

{% hint style="info" %}
See for example [this article by DigitalOcean for more on how the Module pattern works](https://www.digitalocean.com/community/conceptual\_articles/module-design-pattern-in-javascript) in JavaScript/TypeScript.
{% endhint %}

Much of DDD wisdom and attempts at concretely structuring files in a DDD-leaning sense will address why one of the most basic tactical things we can implement is packaging by Module (or features) rather than by layers. You'll perhaps already have experience seeing how many trivial or common projects will use the layered, format-based approach, segmenting folders into their respective types (especially common in front-end projects) or use vague, non-descriptive categories such as `helpers`. This makes it very hard to understand how objects and functions relate and what their respective hierarchies are. It also becomes hard to discern the domain logic from the overall structure, the Module names, and their usage. All that becomes much easier with Modules.&#x20;

{% hint style="info" %}
For more, from a non-DDD angle, read [this article about why packaging by feature is better than packaging by layers](https://phauer.com/2020/package-by-feature/).
{% endhint %}

## Structuring for a Module pattern

There are several examples out in the wild that aim to present individual's takes on DDD, in particular, and some Clean Architecture, generally. Sometimes you may find these combined, like I have done, but that's typically not quite as common.

Reasons I don't necessarily like some of the other examples out there, include:

* Overbearing amount of folders.
* Related to the above: Over-modularization, where I believe microservices themselves should be the first module boundary.
* Use of decorators; something that is not (and will not be) supported in TypeScript. (TODO check)
* Use of inversion of control (IoC) libraries and dependency injection (DI) containers/libraries rather than using the language features provided plus using regular object-oriented programming. This can be handled without external library dependencies by using higher-order functions or passing in dependencies in a functional way.
* TODO

It's worth noting that DDD is not prescriptive at all regarding how to set your file structure. Quite obviously it makes sense to somehow reflect the "methodology" in how the actual code is organized, but DDD won't save you here, I'm sad to say. Clean Architecture, though, _will_ paint a much more exact idea, itself borrowing from the [Ports and Adapters](https://alistair.cockburn.us/hexagonal-architecture/) (or _hexagonal architecture_) notion.

Taken together, we get a pretty powerful toolbox. Three things to note here:

1. Many examples are based on monolithic applications, something I personally very rarely work on. The example here addresses a microservice perspective. The bounded context itself is the main feature, so to speak.
2. Clean Architecture changes the structure and naming a bit. We will base our core understanding on CA and its nomenclature, as it's more intuitive and still packs the same punch as regular DDD.
3. TODO

{% hint style="info" %}
As always, "Don't try to be clever". DDD is hard enough as it is, so it makes sense to be pragmatic and functional.
{% endhint %}

## Serverless project organization

In our case, the principal module structure (for code) is:

* `code/Analytics/SlotAnalytics`: TODO
* `code/Reservation/SlotReservation:` TODO
* `code/Reservation/SlotDisplay:` TODO
* `code/VerificationCode/VerificationCode:` TODO

Effectively, each microservice is bounded to one of `SlotAnalytics`, `SlotReservation`, `SlotDisplay` or `VerificationCode`.

## Clean architecture

asdf

Robert Martin writes about the "Dependency Rule" like this:

> The concentric circles represent different areas of software. In general, the further in you go, the higher level the software becomes. The outer circles are mechanisms. The inner circles are policies.
>
> The overriding rule that makes this architecture work is _The Dependency Rule_. This rule says that _source code dependencies_ can only point _inwards_. Nothing in an inner circle can know anything at all about something in an outer circle. In particular, the name of something declared in an outer circle must not be mentioned by the code in the an inner circle. That includes, functions, classes. variables, or any other named software entity.
>
> By the same token, data formats used in an outer circle should not be used by an inner circle, especially if those formats are generate by a framework in an outer circle. We don’t want anything in an outer circle to impact the inner circles.
>
> — Source: [https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

TODO

![From Robert C. Martin's blog. "The Clean Architecture", 10 August 2012.
https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html](../.gitbook/assets/CleanArchitecture.jpg)

The intention with all of these ideas for how to structure an application are all well-meaning, but I've also see and reflected on how a higher level of "layers" or "circles" can complicate things quite quickly.

Let's at least look at the levels.

### Entities

TODO

> Entities encapsulate Enterprise wide business rules. An entity can be an object with methods, or it can be a set of data structures and functions. It doesn’t matter so long as the entities could be used by many different applications in the enterprise.
>
> If you don’t have an enterprise, and are just writing a single application, then these entities are the business objects of the application. They encapsulate the most general and high-level rules. They are the least likely to change when something external changes. For example, you would not expect these objects to be affected by a change to page navigation, or security. No operational change to any particular application should affect the entity layer.

### Use Cases

TODO

> The software in this layer contains application specific business rules. It encapsulates and implements all of the use cases of the system. These use cases orchestrate the flow of data to and from the entities, and direct those entities to use their enterprise wide business rules to achieve the goals of the use case.
>
> We do not expect changes in this layer to affect the entities. We also do not expect this layer to be affected by changes to externalities such as the database, the UI, or any of the common frameworks. This layer is isolated from such concerns.
>
> We do, however, expect that changes to the operation of the application will affect the use-cases and therefore the software in this layer. If the details of a use-case change, then some code in this layer will certainly be affected.

### Interface adapters

TODO

> The software in this layer is a set of adapters that convert data from the format most convenient for the use cases and entities, to the format most convenient for some external agency such as the Database or the Web. It is this layer, for example, that will wholly contain the MVC architecture of a GUI. The Presenters, Views, and Controllers all belong in here. The models are likely just data structures that are passed from the controllers to the use cases, and then back from the use cases to the presenters and views.
>
> Similarly, data is converted, in this layer, from the form most convenient for entities and use cases, into the form most convenient for whatever persistence framework is being used. i.e. The Database. No code inward of this circle should know anything at all about the database. If the database is a SQL database, then all the SQL should be restricted to this layer, and in particular to the parts of this layer that have to do with the database.
>
> Also in this layer is any other adapter necessary to convert data from some external form, such as an external service, to the internal form used by the use cases and entities.

### Frameworks and Drivers

> The outermost layer is generally composed of frameworks and tools such as the Database, the Web Framework, etc. Generally you don’t write much code in this layer other than glue code that communicates to the next circle inwards.
>
> This layer is where all the details go. The Web is a detail. The database is a detail. We keep these things on the outside where they can do little harm.

TODO

## How the concepts/levels map across DDD, CA, and our project

Let's also make it clear that there is very little about the practicalities of code or folder structure in Eric Evans' original book. Many have simply tried to infer the concepts and their ordering into models that work for them.

For me part, I've found that Robert C. Martin's "clean architecture" is a better (and simpler!) elaboration of where so many developers have tried to find a way. It's not magic, just a very nice mapping (and blog article, and book for that matter!).

| DDD  | Clean Architecture                            | Mikael                                   |
| ---- | --------------------------------------------- | ---------------------------------------- |
| asdf | Frameworks & Drivers (DB, Devices...)         | infrastructure/{relevant-directory-name} |
| asdf | Interface Adapters (Controllers, Gateways...) | infrastructure/adapters                  |
| asdf | Application Business Rules (Use Cases)        | application                              |
| asdf | Enterprise Business Rules (Entities)          | domain                                   |

TODO

## Infrastructure

The "grown up" way to think about infrastructure is that they are generic functions, classes and objects that help set up non-domain-related functionality. Good examples of this include repositories, very generic utility functions, Lambda event handlers (the outer layer), and anything else that has no (or very little) unique value in the specific context.

I've been totally happy with not using Clean Architecture's "frameworks and drivers" nomenclature here, but keeping it very flat and simple instead. Those terms didn't really stick with me or become communicated very well. It's fine that frameworks and drivers are _part_ of the infrastructure, but I've personally abandoned packaging under that name.

For me, a useful heuristic has been "Can I move this thing without making essentially no changes and still get it working?". That does however maybe also say something about the desired level of quality, too...&#x20;

## Application

In the application layer we put anything that is not core to the business, but which _does have_ unique value. This should be the first layer where something "new" happens while all the code running before this layer could theoretically be basic boilerplate.&#x20;

## Domain

Now for the crème de la crème, the secret sauce, and [the figurative room where the magic happens](https://www.urbandictionary.com/define.php?term=this%20is%20where%20the%20magic%20happens). This is, as expected, where all the snazzy unique business logic and domain-orientation truly happens.

## Interfaces

This collects the types and interfaces. The reason I set this as a root-level item is so that we can effectively do things like:

* Exclude the folder when rendering dependencies
* Put them in the least nested and separate part of the overall structure, as practically every file will have to use some interface or another

## Clean architecture-style use cases

We've already touched on structure several times. This time it's going to be both high-level of how Modules relate as a DDD concept but also how our project is actually divided.

{% hint style="info" %}
Read more at [https://www.culttt.com/2014/12/10/modules-domain-driven-design](https://www.culttt.com/2014/12/10/modules-domain-driven-design)
{% endhint %}

asdf

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

Use cases are good examples of places where a well-working Transaction Script pattern can be used. I find it true that the less lines you have, the better the domain layer is functioning and the tighter you have been on understanding what your system should do.&#x20;
