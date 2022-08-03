# Why events?

**Events are the result of operations**, typically done by “[aggregate](https://martinfowler.com/bliki/DDD\_Aggregate.html)” systems. In common parlance, an _aggregate_ is often the system that is the “owner” of certain data, objects, or entities.

![](blob:https://app.gitbook.com/89984297-45bc-4f06-a4b6-c002b7182c79)Splitting an over-sized “Member” model into multiple aggregates and seeing how they are represented in their various bounded contexts. From: [https://www.jamesmichaelhickey.com/domain-driven-design-aggregates/](https://www.jamesmichaelhickey.com/domain-driven-design-aggregates/)

At a high level, events and event-driven architecture means that we can—and should—decouple systems from each other. This enables us to practically build and sustain an intentional architecture, as promoted by Domain Driven Design, Clean Architecture and most serious software engineering principles today.

Ultimately, using event driven architecture optimises our IT landscape for decoupled data consumption, which is a cornerstone in modern cloud-based software development. This advice aligns with our 4th and 10th [IT principles](https://polestarjira.atlassian.net/wiki/spaces/digitaloffice/pages/2784231698):

> 4\. Decouple master data from business capability providers
>
> 10\. Optimize for data consumption

See more at:

* [![](https://docs.microsoft.com/favicon.ico)Best Practice - An Introduction To Domain-Driven Design](https://docs.microsoft.com/en-us/archive/msdn-magazine/2009/february/best-practice-an-introduction-to-domain-driven-design)
* [![](https://martinfowler.com/favicon.ico)bliki: DomainDrivenDesign](https://martinfowler.com/bliki/DomainDrivenDesign.html)
* [![](https://en.wikipedia.org/static/favicon/wikipedia.ico)Domain-driven design](https://en.wikipedia.org/wiki/Domain-driven\_design)
* [![](https://cdn.infoq.com/statics\_s1\_20220719070551/favicon.ico)Domain Driven Design and Development In Practice](https://www.infoq.com/articles/ddd-in-practice/)
* [![](https://blog.cleancoder.com/assets/clean\_code\_72\_color.png)Clean Coder Blog](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
* [https://betterprogramming.pub/the-clean-architecture-beginners-guide-e4b7058c1165](https://betterprogramming.pub/the-clean-architecture-beginners-guide-e4b7058c1165)

### Events are APIs and have contracts too

Events are "first class citizens", similar to requests and responses in a REST API world.

Events are—in practice—APIs. They drive transactions and make commands to systems in a distributed landscape. Therefore we should use similar hygiene around them as with any generic REST API (or other similar construct), using standardized schemas and envelopes, enabling event discovery, ensuring testability and all other concerns that we have in distributed systems.
