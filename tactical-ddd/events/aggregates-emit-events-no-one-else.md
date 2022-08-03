# Aggregates emit events, no one else



Only aggregates must emit events since they enforce business rules. In practice this should be done post-fact as a result of an operation, for example like:

1. User makes a request to our system/service (“aggregate”)
2. Our system instantiates a class for our aggregate and fulfils the operation (if valid)
3. Our system emits an event to notify that the operation has occurred

From [![](https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196)DDD: Handle domain events directly in aggregate?](https://stackoverflow.com/a/67309855) :

> An aggregate has the responsibility of maintaining the [invariants](https://domaincentric.net/blog/modelling-business-rules-invariants-vs-corrective-policies) required by the business logic (e.g. limits on how many pallets are in a given location or a prohibition on pallets containing certain items from being placed in a given location).
>
> However, a domain event represents a fact about the world which the aggregate cannot deny (an aggregate could ignore events if they have no meaning to it (which is not a question of validation, but of the type of event: the aggregate's current state cannot enter into it)). If an aggregate handles domain events, it therefore should do so unconditionally: if the business rule the location aggregate enforces is that there cannot be more than 20 pallets in a location, then a domain event which effectively leads to there being 20 thousand pallets in a location means that you have 20 thousand pallets in that location.

See:

* [https://www.jamesmichaelhickey.com/domain-driven-design-aggregates/](https://www.jamesmichaelhickey.com/domain-driven-design-aggregates/)
* [![](https://martinfowler.com/favicon.ico)bliki: DDD\_Aggregate](https://martinfowler.com/bliki/DDD\_Aggregate.html)
* [![](https://img.alicdn.com/tfs/TB1ugg7M9zqK1RjSZPxXXc4tVXa-32-32.png)An In-Depth Understanding of Aggregation in Domain-Driven Design](https://www.alibabacloud.com/blog/an-in-depth-understanding-of-aggregation-in-domain-driven-design\_598034)
* [![](https://cdn.sstatic.net/Sites/softwareengineering/Img/favicon.ico?v=c4f35a1e3900)Can an aggregate only ever consume commands and produce events?](https://softwareengineering.stackexchange.com/questions/368358/can-an-aggregate-only-ever-consume-commands-and-produce-events)
