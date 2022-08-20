# Services

???

TODO

### Application Services (or use-case interactors)

TODO

> Use Cases (a Clean Architecture term) are similar to **Application Services** in DDD. At least their _relative positioning_ is.&#x20;
>
> In DDD, **Application Services** (application layer concerns, obviously) represent commands or queries (like `createComment` - COMMAND or `getCommentById` - QUERY) that:
>
> * Contain no domain-specific business logic.
> * Are used in order to fetch domain entities (and anything else) from persistence and the outside world.
> * Either passes of control to an Aggregate to execute domain logic by using a method of the Aggregate, or passes off several entities to a Domain Service to facilitate their interaction.
> * Have low-levels of [Cyclomatic Complexity](https://en.wikipedia.org/wiki/Cyclomatic\_complexity).
>
> — Source: [https://khalilstemmler.com/articles/software-design-architecture/domain-driven-design-vs-clean-architecture/](https://khalilstemmler.com/articles/software-design-architecture/domain-driven-design-vs-clean-architecture/)

The above should all be familiar, so the main takeaway is that we understand that use cases and application services function practically the same, and are positionally equal. You can, as I have, use so-called "use case interactors" if you'd want to stay consistent with the terminology. In practice however, I've actually only had to use such interactors (or if you'd rather: application services) in my most complex project, [Figmagic](https://github.com/mikaelvesavuori/figmagic). I've just never had to work on anything else that requires the abstraction, so don't go expecting that you need it for everything either.

### Domain Services

TODO

> Domain Services should encapsulate domain concepts/logic - as such, the the domain service method:
>
> ```
> domainService.persist(data)
> ```
>
> does not belong on a domain service, as `persist` is not a part of the _ubiquitious language_ and the operation of persistence is not part of the domain business logic.
>
> Generally, domain services are useful when you have business rules/logic that require coordinating or working with more than one aggregate. If the logic is only involving one aggregate, it should be in a method on that aggregate's entities.
>
> — Source: [https://softwareengineering.stackexchange.com/questions/330428/ddd-repositories-in-application-or-domain-service](https://softwareengineering.stackexchange.com/questions/330428/ddd-repositories-in-application-or-domain-service)

There are no Domain Services in Get-A-Room, and I've not had to write any of these either.