# Domain events

Domain events exist to inform of something happening inside of our Domain. These events do not leak to other Domains, nor are they exposed directly. This is the primary mechanism with which most of our custom-built systems will communicate. Using this concept, we can make available any event to all parties in the Domain, decoupling us maximally from each other.

See the diagrams below from [Microsoft](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation) for visual clarification:

![Domain events to enforce consistency between multiple aggregates within the same domain](../../.gitbook/assets/domain-model-ordering-microservice.png)

![Handling multiple actions per domain](../../.gitbook/assets/aggregate-domain-event-handlers.png)

As seen in the diagrams, a typical domain event could be `OrderStarted` if we are in a commercial domain. This event would be sent to our domain’s event bus which all systems in scope of our domain may subscribe to.

### Naming, exactness and uniqueness of an event <a href="#naming-exactness-and-uniqueness-of-an-event" id="naming-exactness-and-uniqueness-of-an-event"></a>

Domain events should translate into clearly named and partitioned and non-overlapping names. Names are, as implied, domain-based and must use nomenclature and language that people understand in the particular domain. Key goals for us include:

* Removing **semantic ambiguity** (not understanding what something refers to)
* Removing **terminological contention** (many contexts claiming the same terms)
* Increasing and enforcing **domain language** (using the same terms that our domain stakeholders use and express)

Domain nomenclature is ultimately _only valid and meaningful within the domain_. Therefore, as a logical consequence, we should not spend time synchronizing nomenclature _across_ domains.

**Bad name example**

* `OrderUpdated`
* `ErrorOccurred`

**Why?**

Too broad term; very inspecific; easy to see that others may make claims to the same name; unclear what was actually done. “Order” may not be technically incorrect, but it’s also a term that might be highly contested or have other meanings when traveling across domains. A generic “Error” is not helpful.

**Good name examples**

* `SalesOrderDeliveryFieldChanged`
* `ManufacturingOrderDispatched`

**Why?**

Very clear demarcation on this being a “sales order” (not a _broad inspecific_ “order”); also communicates what exactly was changed.

`SalesOrder` would be a better example than `OrderUpdated` also because (we can assume in this fictional case) our system (or aggregate) controls and enforces this particular type of order.

Note that such work around naming is often more art than science.
