---
description: >-
  Shuffling around data can be a mess. The DTO concept helps us tidy things up
  so they won't look like a toddler's birthday party.
---

# The Data Transfer Object

A bit of a misunderstood gold nugget, which gets a more nuanced use in a DDD context.

Example:

```typescript
const myExampleSlotDto = {
  startTime: "10:00",
  host: "Mikael"
}
```

What we don't want with the DTO is to make it other than a basic transferable representation.

I have seen examples of where pulling in an ORM or similar to make managing these easier, but it has only driven up complexity instead. Since the DTO is a trivial object to create, just maintaining the definition of the particular DTO and creating it should not be a significant work investment.

Working in a class-oriented fashion, we want to pass around classes representing our object as long as possible.

It might be worthwhile to consider some of the obvious problems of POJOs (Plain Old Javascript Objects; or POCOs or whatever that pertains to your language). At this point you are well-aware that what we are working towards are _domain driven microservices_. Contrary to being domain driven is being _anemic_. Wikipedia has this terse and good description:

> The **Anemic domain model** is a programming [Anti-pattern](https://en.wikipedia.org/wiki/Anti-pattern) where the [domain objects](https://en.wikipedia.org/wiki/Domain\_objects) contain little or no [business logic](https://en.wikipedia.org/wiki/Business\_logic) like validations, calculations, rules, and so forth. The business logic is thus baked into the architecture of the program itself, making refactoring and maintenance more difficult and time-consuming.
>
> — Source: [https://en.wikipedia.org/wiki/Anemic\_domain\_model](https://en.wikipedia.org/wiki/Anemic\_domain\_model)

Let's look at that a bit more in the words of Martin Fowler:

> The basic symptom of an Anemic Domain Model is that at first blush it looks like the real thing. There are objects, many named after the nouns in the domain space, and these objects are connected with the rich relationships and structure that true domain models have. **The catch comes when you look at the behavior, and you realize that there is hardly any behavior on these objects, making them little more than bags of getters and setters**. Indeed often these models come with design rules that say that you are not to put any domain logic in the domain objects. Instead there are a set of service objects which capture all the domain logic, carrying out all the computation and updating the model objects with the results. These services live on top of the domain model and use the domain model for data.
>
> **The fundamental horror of this anti-pattern is that it's so contrary to the basic idea of object-oriented design; which is to combine data and process together**. The anemic domain model is really just a procedural style design, exactly the kind of thing that object bigots like me (and Eric) have been fighting since our early days in Smalltalk. What's worse, many people think that anemic objects are real objects, and thus completely miss the point of what object-oriented design is all about.
>
> Now object-oriented purism is all very well, but I realize that I need more fundamental arguments against this anemia. **In essence the problem with anemic domain models is that they incur all of the costs of a domain model, without yielding any of the benefits**. The primary cost is the awkwardness of mapping to a database, which typically results in a whole layer of O/R mapping.
>
> — Source: [https://martinfowler.com/bliki/AnemicDomainModel.html](https://martinfowler.com/bliki/AnemicDomainModel.html)

### Data vs behavior and JavaScript

As is probably very clear, we can't really push a class through our API, but we can push out a serialized representation of a plain object. So the need to, at some point, boil our classes with data and behaviors and our domain logic into a representation does exist and that's fine.

On the blog [The Domain Driven Design we find a set of useful tips](https://thedomaindrivendesign.io/anemic-model/):

> * Use private setters. If your properties are defined by the Client directly you will lose the chance to use Domain Events and you will have to validate your Entities by external methods.
> * Always validate the status of your entities, your Entities must self validate.
> * Avoid constructors without parameters. Certainly your objects will need some initialization data to maintain a valid state.
> * Think long before you create a Domain Services, they are used as real Silver Bullets by the developers, but end up being the biggest causes of the _Anemic Model_.
> * Be careful with ORM, they are responsible for creating Domain Objects automatically, producing real containers of public setters and public getters, which leads to an _Anemic Model_.

Let's not steal the thunder from the later sections on Entities, but maybe you are seeing a pattern here: Really do avoid objects that are mutable and that separate data from behavior, at least internally and logically within your own system or service.

Prefer passing instances of classes of entities or value objects rather than DTOs. DTOs do make it easier to do "dumb objects" and are much more portable (the portability is the reason we want them in the first place), especially if you are integrating, say with APIs, but then you lose the behavior. What is the driving need: The data or the behavior? Choose wisely.

### In closing

The Data Transfer Object is an excellent way to transport data. The battle is around using DTOs at the strategic places where it makes sense. We'll see more use of it later, but as some heuristics that make sense to me we can find that the DTO is used as early (example: API input), and as late (as the response going back to the Lambda handler i.e. adapter layer) as possible.
