---
description: >-
  The least-discussed but structurally most fundamental pattern concerns our
  Modules and the structure these put on our work.
---

# Modules

<figure><img src="../.gitbook/assets/undraw_design_components_9vy6.png" alt=""><figcaption><p>Illustration from <a href="https://undraw.co/">Undraw</a></p></figcaption></figure>

{% hint style="success" %}
**TL;DR**

**Modules** use the ubiquitous language to express the technical side of the domain.

There is no "one way" to use **Modules**, it's all mostly about naming and organizing your code. Organize your code in **Modules** by using concepts like namespaces, classes, folder structure, and even how you split responsibilities across microservices. The goal is to accurately express the domain by the way you have structured and named things.
{% endhint %}

In the DDD context, we use Modules as a logical construct to segregate between concerns when we technically implement our domain model. Modules should precede the Bounded Contexts, because Modules typically reside in the same codebase and reflect the _logical model_ of our domain. Dividing logical wholes into separate Bounded Contexts can cause problems (Vernon 2013, p. 344). One example of a valid use is to reach for Modules if you need to create a second model in the same Bounded Context (Vernon 2016, p.50).

Again, Modules are local to the code, while Bounded Contexts may constitute one or more logical solutions. Yet these both (in particular Modules) share the common trade-offs of public interfaces:

> \[E]ffective modules are deep: a simple public interface encapsulates complex logic. Ineffective modules are shallow: a shallow module's public interface encapsulates much less complexity than a deep module.
>
> — Vlad Khononov, _Learning Domain Driven Design_ (p. 223)

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

In DDD (and Googling, or reading on Stack Overflow) you'll hear a lot of arguments against importing outer-level objects (such as services) in deeper-level objects, such as aggregates. This is sound advice, generally speaking. If we start importing left-right-and-center without discipline we will end up in a really bad place.

It's worth noting that DDD is not prescriptive at all regarding how to set your file structure. In fact there is practically nothing in Evans' book about this. Obviously it does makes sense to somehow reflect the "methodology" in how the actual code is organized, but DDD won't save you here, I'm sad to say. Clean Architecture, though, _will_ paint a much more exact idea, itself borrowing from the [Ports and Adapters](https://alistair.cockburn.us/hexagonal-architecture/) (or _onion/hexagonal architecture_) notion.

There are several examples out in the wild that aim to present various individuals' takes on DDD, in particular, and some Clean Architecture, generally. Sometimes you may find these combined, like I have done, but that's typically not quite as common.

Reasons I don't necessarily like some of the other examples out there, include:

* Overbearing amount of boilerplate and folders.
* Typically oriented toward monolithic use cases or indistinct deployment models.
* Related to the above: Over-modularization, where I believe microservices themselves should be the first module boundary.
* Use of decorators; something that is not standardized in TypeScript (Vandenkam 2021, p. 197-198).
* Use of inversion of control (IoC) libraries and dependency injection (DI) containers/libraries rather than using the language features provided, or simply using regular object-oriented programming. These needs can be handled without external library dependencies by using higher-order functions or passing in dependencies in a functional way.
* Intricate uses of more complex ideas like monads (such as `Either` and `Left`/`Right`) which adds a higher threshold than necessary for people to start getting value from tactical DDD.

{% hint style="info" %}
All of these are "taken care of" in the example code that goes with this book.
{% endhint %}

Taking DDD and CA together, we get a pretty powerful toolbox. You should understand that many examples are based on monolithic applications, something I personally very rarely work on. The example here addresses a microservice perspective. The bounded context itself is the main feature, so to speak.

Clean Architecture also changes the structure and naming a bit. We will base our core understanding of application structuring from CA and its respective nomenclature, as it's more prespcriptive than regular DDD.

{% hint style="warning" %}
As always, "Don't try to be clever". DDD is hard enough as it is, so it makes sense to be pragmatic and functional.
{% endhint %}

## High level project organization

In our case, the principal module structure for code is:

### Reservation (core subdomain)

* `code/Reservation/Reservation:` The reservation solution and Bounded Context (core subdomain)
* `code/Reservation/Display:` The display solution and Bounded Context (supporting subdomain)

### Analytics (generic subdomain)

* `code/Analytics/Analytics`: The analytics solution and Bounded Context

### Security (supporting subdomain)

* `code/VerificationCode/VerificationCode:` The verification code solution and Bounded Context

Here we've almost completely nailed the 1:1 relationship between Bounded Context and subdomain, as well as have a top-level modularization of solutions/code into these.

## Using Clean Architecture as our foundation

The "Clean Architecture" is a relatively well-known variant of the onion/hexagonal/ports-and-adapters school of architectures.&#x20;

Many have tried and many have failed when it comes to setting up a folder structure for DDD. For my part, I've found that Robert C. Martin's "clean architecture" is a better (and simpler!) elaboration of where so many developers have tried to find a way. It's not magic, just a very nice mapping (and [blog article](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html), and [book](https://www.goodreads.com/en/book/show/18043011-clean-architecture) for that matter!).

![From Robert C. Martin's blog. "The Clean Architecture", 10 August 2012.
https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html](../.gitbook/assets/CleanArchitecture.jpg)

I find it the most immediately effective and neat variants of these, as it:

* Introduces very little in terms of novel concepts;
* Is almost directly compatible with how DDD envisions structure in the software realm;
* Powerfully exploits the _dependency rule_ for well-working and testable software.

Robert Martin writes about the _dependency rule_ like this:

> The concentric circles represent different areas of software. In general, the further in you go, the higher level the software becomes. The outer circles are mechanisms. The inner circles are policies.
>
> The overriding rule that makes this architecture work is _The Dependency Rule_. This rule says that _source code dependencies_ can only point _inwards_. Nothing in an inner circle can know anything at all about something in an outer circle. In particular, the name of something declared in an outer circle must not be mentioned by the code in the an inner circle. That includes, functions, classes. variables, or any other named software entity.
>
> By the same token, data formats used in an outer circle should not be used by an inner circle, especially if those formats are generate by a framework in an outer circle. We don’t want anything in an outer circle to impact the inner circles.
>
> — Source: [https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

The intention with all of these ideas for how to structure an application are all well-meaning, but I've also seen and reflected on how a higher level of "layers" or "circles" can complicate things quite quickly.

Let's at least look at the levels and some examples of what would into them.

* **Entities**: "Business objects of the application"
* **Use cases**: "Use cases orchestrate the flow of data to and from the entities, and direct those entities to use their enterprise wide business rules to achieve the goals of the use case"
* **Interface adapters**: "A set of adapters that convert data from the format most convenient for the use cases and entities, to the format most convenient for some external agency such as the Database or the Web"
* **Frameworks and Drivers**: "Where all the details go. The Web is a detail. The database is a detail. We keep these things on the outside where they can do little harm"

The farther in something is, the less likely it is to change, and any inner layers must not depend on the outer layers. This

### Adapting the Clean Architecture

I will apply a set of small modifications to this just to juice it up even more. Some of the names from above are too narrow ("entities") and some are just weird when used in the everyday work ("frameworks and drivers"). We can also steer it a smidge towards the DDD nomenclature, and we would arrive at this concept:

<figure><img src="../.gitbook/assets/CA + DDD.png" alt=""><figcaption><p>Our adjusted model that will follow the overall Clean Architecture outline. Upper (bigger) names represent the layer name, and the lower (smaller) represents examples of what goes into the layer.</p></figcaption></figure>

Or in tabular form with the actual folder names too:

| Clean Architecture         | Our convention | Folder name               |
| -------------------------- | -------------- | ------------------------- |
| Frameworks & Drivers       | Infrastructure | infrastructure/{category} |
| Interface Adapters         | Adapter        | infrastructure/adapters   |
| Application Business Rules | Application    | application/              |
| Enterprise Business Rules  | Domain         | domain/                   |

{% hint style="info" %}
You will notice that here adapters are part of the infrastructure layer rather than being on their own.
{% endhint %}

If we use a tool like [Madge](https://github.com/pahen/madge) to generate a diagram of the code, we should be able to see the same [acyclic flow ](https://en.wikipedia.org/wiki/Directed\_acyclic\_graph)that we want (given that we actually also write the code in the "clean" way!). Below an example of the `Reservation` solution.

<figure><img src="../.gitbook/assets/Screenshot 2022-09-23 at 18.14.09.png" alt=""><figcaption><p>Code diagram of the <code>Reservation</code> solution, generated with <a href="https://github.com/pahen/madge">Madge</a>.</p></figcaption></figure>

{% hint style="warning" %}
Note that the above diagram excludes certain code paths—such as those which represent test data, utilities and interfaces—which can either be used across all levels (or "depths") or add no meaningful detail to the diagram. They just make the diagram overly busy and are an acceptable omission.
{% endhint %}

Now, this I am happy with!

### Some words about our layers

#### Infrastructure

The "grown up" way to think about infrastructure is that they are generic functions, classes and objects that help set up non-domain-related functionality. Good examples of this include repositories, very generic utility functions, Lambda event handlers (the outer layer), and anything else that has no (or very little) unique value in the specific context.

I've been totally happy with not using Clean Architecture's "frameworks and drivers" nomenclature here, but keeping it very flat and simple instead. Those terms didn't really stick with me or become communicated very well. It's fine that frameworks and drivers are _part_ of the infrastructure, but I've personally abandoned packaging under that name.

For me, a useful heuristic has been "Can I move this thing without making essentially no changes and still get it working?". That does however maybe also say something about the desired level of quality, too...&#x20;

**Adapters are part of the infrastructure layer**, because, well...they are infrastructure.

#### Application

In the application layer we put anything that is not core to the business, but which _does have_ unique value. This should be the first layer where something "new" happens while all the code running before this layer could theoretically be basic boilerplate.&#x20;

**We still use the concept of "use cases" and they go into this layer.**

#### Domain

Now for the crème de la crème, the secret sauce, and [the figurative room where the magic happens](https://www.urbandictionary.com/define.php?term=this%20is%20where%20the%20magic%20happens). This is, as expected, where all the snazzy unique business logic and domain-orientation truly happens.

#### BONUS: Interfaces

Bonus time: `Interfaces` is an additional folder that I tend to keep at the root—it just collects the types and interfaces. The reason I set this as a root-level item is so that we can effectively do things like:

* Exclude the folder when rendering dependencies
* Put them in the least nested and separate part of the overall structure, as practically every file will have to use some interface or another
* Get them out of the way while still actually putting these in their own place

