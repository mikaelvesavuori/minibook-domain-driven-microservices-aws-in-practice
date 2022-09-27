---
description: >-
  The secret sauce for building domain-driven microservices is highly dependent
  on the "use case" layer.
---

# Domain driven Lambdas with a use case approach

How to effectively decompose applications into microservices and bounded contexts is a design exercise that may be challenging and sometimes counter-intuitive, at least if one has been beaten on the head with "FaaS is for single-purpose functions" one too many times. Here, I'll teach you an approach I've found to be well suited to writing testable and good implementations.

{% hint style="danger" %}
On this page I will attempt to dispell some misunderstandings and problematic interpretations of structuring work with microservices. Primarily I am concerned about "microservices dogmatism" which is easy to get extra coked-up on when combined with functions-as-a-service.

Keeping it super short:

- If you build a "flat landscape" using only Lambdas, then you are close to the "single purpose function" situation. While this is convenient and locally completely suitable in many solutions, as a way to structure an entire organization's landscape you are in for hell. Some reasons include having to deal with chattiness, latency, many surfaces that need to interact and suboptimal logical cohesion.
- This dogmatism is unrealistic and trivializes the complexity of developing for non-trivial implementation. It also practically eliminates all logical reuse of code and patterns as it cannot be colocated.
- The infrastructure needed for a service is never just Lambda. You need S3 to store the Lambda code, IAM roles, quite realistically an API Gateway and then whatever assortment of candy on top you need to do the work. You need to have a concise notion of what the deployment process is, and what resources it will contain. The "wrapping" on top of that single function is considerable.

You might be interested in [Setting boundaries in your serverless application](https://serverlessfirst.com/setting-boundaries/) also.
{% endhint %}

Features of my approach will mean that:

- We aim for simplicity and clarity of execution using a "one function per use case" type of microservice organization
- Hence, we prefer a functional or procedural style for _most_ of the code
- We can use microservices through an API Gateway to expose our well-defined use cases as URL paths
- We use a rich, powerful object-oriented approach for all _complex_ components (i.e. Entities and Aggregates) to get the benefits of classic "real engineering master race" (insert meme)
- We'll get the expressive Clean Architecture-style layering
- We set everything in order so we can use the tactical patterns in DDD (which we will come to later)
- We can easily test our application using best practices and a "[classicist](https://martinfowler.com/articles/mocksArentStubs.html#ClassicalAndMockistTesting)" approach, meaning it scales well without any test doubles, "test-speak jargon" or other bullshit
- The approach should be able to translate fluidly into any similar language like C# or Java

{% hint style="info" %}
Compared to [Khalil Stemmler's excellent DDD approach](https://khalilstemmler.com/articles/categories/domain-driven-design/) the approach presented here is intentionally _simpler_ in terms of technical implementation.

Something I _have_ borrowed from Khalil is [his objection to using Dependency Injection containers](https://khalilstemmler.com/articles/software-design-architecture/coding-without-di-container/). Again: We simplify and make the code better for it.

You may certainly want to look at his work when, or if, you feel inspired to accelerate my way of doing things. I know I learned a lot from reading his stuff!
{% endhint %}

{% hint style="info" %}
You may also find various Node + DDD projects out in the wild. Without mentioning any names or details (since I've never used them; just inspected them), this approach is better suited to the serverless microservices context (also of course being directly adapted for such a context) and I personally believe my Clean Architecture/DDD-layering stays truer and more conceptually steadfast than what at least I have seen in various projects.
{% endhint %}

## How do we size and relate microservices in serverless DDD?

There are a number of different takes on how one would relate and size Lambdas, deployments, and how they map to DDD concepts. You will continuously want to question if decisions make

- **local complexity** (i.e. the bounded context or solution itself),
- **global complexity** (i.e. the total landscape),
- **integration complexit**y (i.e. how hard it is to make relevant solutions communicate with each other

better or worse. Your sizing of microservices vs Bounded Contexts vs Aggregates is all part of the same game. Vlad Khononov (and I) would recommend moving towards services that hide significant business logic (ultimately providing something very rich to the user) with the smallest possible surface area (API):

> From a system complexity standpoint, a **deep module** reduces the system's global complexity, while a shallow module increases it by introducing a component that doesn't encapsulate its local complexity.
>
> **Shallow services are also the reason why so many microservices-oriented projects fail**. The mistaken definition of a microservice as a service having no more than X lines of code, or as a service that should be easier to rewrite than to modify, concentrate on the individual service while missing the most important aspect of the architecture: the system.
>
> **The threshold upon which a system can be decomposed into microservices is defined by the use cases of the system that the microservices are a part of.**
>
> — Source: _Learning Domain Driven Design_ (Khononov 2021, p.224)

For me all of this spells out that use case-oriented APIs, rather than resource-based getter/setter APIs, are what we are aiming form. He also writes more on the actual sizing and boundaries:

> Both microservices and bounded contexts are physical boundaries. Microservices, as bounded contexts, are owned by a single team. As in bounded contexts, conflicting models cannot be implemented in a microservice, resulting in complex interfaces. Microservices are indeed bounded contexts. \[...]
>
> \[T]he relationship between microservices and bounded contexts is not symmetric. Although microservices are bounded contexts, not every bounded context is a microservice. Bounded contexts, on the other hand, denote the boundaries of the largest valid monolith. \[...]
>
> \[I]f the system is not decomposed into proper bounded contexts or is decomposed past the microservices threshold, it will result in a big ball of mud or a distributed big ball of mud, respectively.&#x20;
>
> — Source: _Learning Domain Driven Design_ (Khononov 2021, p.226-227)

Finally, when it comes to heuristics he writes that:

> A more balanced heuristic for designing microservices is to **align the services with the boundaries of business subdomains**. \[S]ubdomains are correlated with fine-grained business capabilities. These are the business building blocks required for the company to compete in its business domain(s). \[...]
>
> Aligning microservices with subdomains is a safe heuristic that produces optimal solutions for the majority of microservices. That said, there will be cases where other boundaries will be more efficient.
>
> — Source: Vlad Khononov, _Learning Domain Driven Design_ (p.228-229)

In our case we will see that we did not have to fully follow this advice, however I do see it being a powerful way of closing the loop between:

- The Bounded Context, which is our "designed" and smallest component of the solution
- The subdomain, which acts as the logical container for related components in the domain

If nothing else makes sense, then a sufficiently well-understood subdomain could be packed into a single solution. The beauty of microservices in Lambda, as we will see, is that we can speak of logical monoliths, while still having the individual Lambda functions to work for us.

{% hint style="info" %}
For a deeper dive by Eric Evans on different types of bounded contexts and some critique on how one microservice _is not necessarily_ one bounded context (which I think it should be), see [Language in Context - Eric Evans - DDD Europe 2019](https://www.youtube.com/watch?v=xyuKx5HsGK8).
{% endhint %}

Personally I find the above sections of Khononov's book very illuminating, but what in practice does that look like...? :thinking:

The below is what I've come to find is the most lucid and rational way to do this when we are building and designing our own system.

### Typical sizing table

{% hint style="warning" %}
I will use the broad word **service** to denote the actual code and extent of the "thing" that we are discussing so that we don't get conflicting terminology.
{% endhint %}

The way I've found to best encapsulate microservices and bounded contexts is that a single Git repository handles a single bounded context which is defined in one configuration file. It may use any number of microservices (i.e. Lambda functions).

| One...                                                                           | ...represents                                                                                                                                             |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <p>Git repository (classic, single-repo)<br>OR<br>Git repository (mono-repo)</p> | <p>All the code for a single <strong>service</strong><br><strong></strong><br><strong></strong>All the code for one or more <strong>services</strong></p> |
| Configuration (such as `serverless.yml)`                                         | Definition for a single **service**                                                                                                                       |
| Service                                                                          | <p>A single <strong>bounded context</strong> (typically)<br>OR<br>A single <strong>component</strong> of the bounded context</p>                          |
| Microservice (such as a Lambda function)                                         | A single **use case**                                                                                                                                     |
| API gateway                                                                      | The exposure point for the **microservices**                                                                                                              |

{% hint style="info" %}
This approach is valid as far as the bounded context truly is well-defined and self-contained without any excessive territorial encroachment on other contexts!
{% endhint %}

If the bounded context is wide or simply more coarsely defined, there is absolutely the possibility to relate your service to act as a **component** of the bounded context.

{% hint style="warning" %}
The word "component" isn't the best, I'm well aware of this, but there is a lack of more descriptive or self-explanatory words.
{% endhint %}

Of course, under no circumstances should bounded contexts compete about the same logical objects, Aggregates or constructs, nor any attached responsibilities. The bounded context is never bigger than the logical entirety of the context.

Remember that DDD and its terminology is a semantic and logical construct, whereas the code is a technical construct. Therefore any correlation must be handled logically and manually. Nothing forces you to make a single bounded context into a single deployable artifact.

This table, in plain text, could be summarized as:

> A **Git repository** contains (typically) one **microservice that fully represents a single bounded context**. Each microservice is defined by a **single authoritative definition/configuration** and may contain **one or multiple functions that each represent a use case in the bounded context**. An API gateway is the typical way to expose (and protect) the functions.

Let's say that again: A microservice is not the individual function, it's the bounded context with _all of its functions_. "Microservices", hence, refer to the granular style and explicit scope of each bounded context together with the tiny, decoupled deployment artifacts (functions).

Continuing with some of the features I listed at the start of this page, we can attain the following benefits:

- Functions that are truly independent
- Ability to use any number of functions that may or may not interact with each other (or other systems)
- Colocation of code that is logically shared (i.e. bounded context)
- Ability to atomically deploy (i.e. individual functions) or update the whole microservice (i.e. Bounded Context)
- Complete isolation from code and artifacts from other bounded contexts
- Logically and technically scalable solution

## Clean architecture-style use cases

We've already touched on structure several times. This time it's going to be both high-level of how Modules relate as a DDD concept but also how our project is actually divided.

{% hint style="info" %}
Read more at [https://www.culttt.com/2014/12/10/modules-domain-driven-design](https://www.culttt.com/2014/12/10/modules-domain-driven-design)
{% endhint %}

This far we have seen how these might work:

- The "blue" ring, as pure infrastructure
- The "green" ring, as our Lambda handler

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

{% code title="code/Reservation/Reservation/src/application/usecases/ReserveSlotUseCase.ts" lineNumbers="true" %}

```typescript
import { ReservationService } from "../../domain/services/ReservationService";

import { createVerificationCodeService } from "../services/VerificationCodeService";

import { Dependencies } from "../../interfaces/Dependencies";
import { ReserveOutput } from "../../interfaces/ReserveOutput";
import { SlotInput } from "../../interfaces/Slot";
import { createSlotLoaderService } from "../services/SlotLoaderService";

/**
 * @description Use case to handle reserving a slot.
 */
export async function ReserveSlotUseCase(
  dependencies: Dependencies,
  slotInput: SlotInput
): Promise<ReserveOutput> {
  const securityApiEndpoint = process.env.SECURITY_API_ENDPOINT_GENERATE || "";

  const { slotId, hostName } = slotInput;
  const slotLoader = createSlotLoaderService(dependencies.repository);
  const slotDto = await slotLoader.loadSlot(slotId);

  const verificationCodeService =
    createVerificationCodeService(securityApiEndpoint);
  const reservationService = new ReservationService(dependencies);

  return await reservationService.reserve(
    slotDto,
    hostName,
    verificationCodeService
  );
}
```

{% endcode %}

There's not that much going on here. We import and use interface definitions, take in dependencies and the record data, and then it's just two commands.

If you have been around the block, maybe you feel one or more of the below:

- "OK, this seems like just adding more chaff into the mix, doesn't it?"
- "Isn't this a _Transaction Script_... WTH mate?"

When it comes to the question of adding more (useless?) code and more layers of abstractions, rather we should see the benefits. Because we broke up the handler and its boilerplate from our business and use case, **the use case is the first meaningfully **_**testable**_** layer**. That is, the surface for our widest unit testing is the _use case_ as it effectively exercises the full flow and we can afford to be totally oblivious about anything in the handler itself. So, yes indeed, it does add a further layer but again we get something better back as a result for that minimal investment.

### Transaction Script is your friend...if done well

Now, let's consider first Martin Fowler's words on the Transaction Script pattern:

> Most business applications can be thought of as a series of transactions. A transaction may view some information as organized in a particular way, another will make changes to it. Each interaction between a client system and a server system contains a certain amount of logic. In some cases this can be as simple as displaying information in the database. In others it may involve many steps of validations and calculations.
>
> A Transaction Script organizes all this logic primarily as a single procedure, making calls directly to the database or through a thin database wrapper. Each transaction will have its own Transaction Script, although common subtasks can be broken into subprocedures.
>
> — Source: [https://martinfowler.com/eaaCatalog/transactionScript.html](https://martinfowler.com/eaaCatalog/transactionScript.html)

The gist I am trying to tell is that the use case itself should act essentially as a readable, easy-to-follow orchestration of the use case's mechanics. A key difference is that between a novice programmer and a seasoned one, the use case itself must not touch the details, concretions or infrastructure. Instead (as we see) we trust that our commands on abstractions work as intended:

```typescript
const { repository } = dependencies;
await repository.add(record);
```

This pattern scales well, as long as the deeper layers (entities etc.) are doing their job. For this particular case, there isn't an actual Aggregate or Entity involved, just the basic repository.

We can also look at how this scales to a much more complex case. In this case though, you will never see that complexity! It looks almost the same:

{% code title="code/Reservation/SlotReservation/src/application/usecases/CreateSlotsUseCase.ts" lineNumbers="true" %}

```typescript
import { Slot } from "../../domain/aggregates/Slot";
import { Dependencies } from "../../interfaces/Dependencies";

/**
 * @description Use case to handle creating the daily slots.
 */
export async function CreateSlotsUseCase(
  dependencies: Dependencies
): Promise<string[]> {
  const slot = new Slot(dependencies);
  return await slot.makeDailySlots();
}
```

{% endcode %}

You'll have to trust me on this one for now, but yes, the above _is_ more complex. However, the orchestration that we have to do is not. If the use case, for example, would demand several Entities to interact or connect somehow, or multiple operations to be done, then using the use case file/function/layer is the right place to string together the logic.

Fortunately, though, all the services in Get-A-Room are pretty orthodox to clean domain modelling and tight in their implementation, so they don't do any messy stuff, leaving the use case itself very straightforward.

### In closing

The use case is the first meaningfully testable layer. You should prioritize tests for this layer (if you aren't already doing TDD or such). Testing here gives you _a lot_ of bang for the buck.

Use cases are good examples of places where a well-working Transaction Script pattern can be used. I find it true that the less lines you have, the better the domain layer is functioning and the tighter you have been on understanding what your system should do.&#x20;
