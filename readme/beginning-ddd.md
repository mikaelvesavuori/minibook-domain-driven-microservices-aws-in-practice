---
description: Let's take a quick overview of Domain Driven Design.
---

# DDD Lightning Tour

TODO

[Wikipedia](https://en.wikipedia.org/wiki/Domain-driven\_design) starts with this definition,

> **Domain-driven design** (**DDD**) is a [software design](https://en.wikipedia.org/wiki/Software\_design) approach focusing on modelling software to match a [domain](https://en.wikipedia.org/wiki/Domain\_\(software\_engineering\)) according to input from that domain's experts.
>
> In terms of [object-oriented programming](https://en.wikipedia.org/wiki/Object-oriented\_programming) it means that the structure and language of software code (class names, [class methods](https://en.wikipedia.org/wiki/Class\_method), [class variables](https://en.wikipedia.org/wiki/Class\_variable)) should match the [business domain](https://en.wikipedia.org/wiki/Business\_domain). For example, if a software processes loan applications, it might have classes like `LoanApplication` and `Customer`, and methods such as `AcceptOffer` and `Withdraw`.
>
> DDD connects the [implementation](https://en.wikipedia.org/wiki/Implementation) to an evolving model.
>
> Domain-driven design is predicated on the following goals:
>
> * placing the project's primary focus on the core [domain](https://en.wikipedia.org/wiki/Domain\_\(software\_engineering\)) and domain logic;
> * basing complex designs on a model of the domain;
> * initiating a creative collaboration between technical and [domain experts](https://en.wikipedia.org/wiki/Domain\_expert) to iteratively refine a conceptual model that addresses particular domain problems.

### The patterns of DDD

![How the patterns match up, as presented in Eric Evans's book (2003)](../.gitbook/assets/DomainDrivenDesignReference.png)

## Domain Driven Design overview

DDD was a game changer (and is still somewhat singular) in that it insists on software being not just the engineering part, but also how it logically connects the physical and very real business end to software to accurately represent those ideas. Therefore, DDD was from the start contingent on _language_ as a primary tool to create cohesion and allow for expressive and rich modeling. It also came with many prescriptive ideas divided between the higher-level "strategic DDD" and the implementation patterns part of the "tactical DDD".

Domain Driven Design has grown in the 20-odd years it's been around to be a foundational part of modern software architecture and shaping the methodology with which many work in software. It seems to have been given an enormous upswing after the microservices pattern become more in vogue some 5-10 years ago.

For me personally, reading about Domain Driven Design—first through articles and then through the [blue book](https://www.domainlanguage.com/ddd/blue-book/) and [red book](https://kalele.io/books/)—made for an exciting summer some years back: It was really obvious (!) that we need to connect the "business" with the implementation. The explosive thing about the books, however, was that they went well and beyond the platitudes of the _statement_ (as you read it in the last sentence) to actually detailing patterns, strategies and ways to actually get there.

The "problem", if one can call it that, is that both of the books are big. Like really big. I think they fall squarely into the lap of certain types of folks who still enjoy the intellectual exercise and sometimes relatively abstract way of learning that goes with the territory. Thankfully there are complementary resources to pad out your understanding—though as always with this type of literature, it is wise to understand the source material.
