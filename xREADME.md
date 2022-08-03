---
layout: editorial
---

# DDD microservice example

Description.

## Goals

Two domains Three bounded contexts (2+1 in domains)

- Show concrete, minimal (but useful) implementation of DDD and CA in TypeScript
- Understand how trivial or simplistic implementations can be harmful
  - Self-implementing an API Gateway (_can_ be useful, but is most probably not)
  - Distributed monolith
  - Every function is its own bounded context (too large)
  - Unclear API, contracts, and eventing
  - Single point of failure and not understanding the "Fallacies of Distributed Computing"
- Answer questions like:
  - How to do strategic DDD (bounded context, context maps, domain model, ubiquitous language...)
  - How to map bounded contexts/subdomains etc. into a serverless/microservices implementation
  - Deciding on Published Language, Anti-Corruption Layer, Shared Kernel, Open Host Service, Customer/Supplier, Conformist, or Partnership for interacting/relating/integrating with/between bounded contexts (Vaughn Vernon, IDDD)
  - Implement tactical DDD with value objects, entities, aggregates, (application and domain) services, factories, and domain events
  - Ease and improve DDD structure with Clean Architecture
  - Understand event patterns like 1:1 (send to topic owned by single, other bounded context), fan-out (and shared topics across bounded contexts), event bus (such as EventBridge), CQRS
  - How to do choreographed eventing
  - How to do orchestrated workflows (across multiple domains/bounded contexts) and transactional consistency plus rollbacks
  - Persisting data, and doing so across bounded contexts
  - Using ideas from Team Topologies to steer team interactions
  - Using TBD to increase productivity
  - Using branch-by-abstraction and other strategies for safe service evolution
  - Serverless/microservices testing strategies
- Display patterns and implementations like:
  - Domain Event Publisher
  - Deferring event publication (?)
  - Published Language (and API and event contracts...)
  - Event Sourcing using DynamoDB streams (?)
  - CQS and Command events

## Idea

From https://medium.com/walmartglobaltech/building-domain-driven-microservices-af688aa1b1b8

```
1. Services have well-defined boundaries centered around business context, and not around arbitrary technical abstractions
2. Hide implementation detail and expose functionality through intention-revealing interfaces
3. Services don’t share their internal structures beyond their boundaries. For example, no sharing of databases.
4. Services are resilient to failures.
5. Teams own their functions independently and have the ability to release changes autonomously
6. Teams embrace a culture of automation. For example, automated testing, continuous integration and continuous delivery

In short, we can summarize this architecture style as below:
Loosely coupled service-oriented architecture, where each service is enclosed within a well-defined bounded context, enabling rapid, frequent, and reliable delivery of applications.
```

## Structure

Much of DDD wisdom and attempts at concretely structuring files in a DDD-oriented sense will address whether to go with an approach based on "package by layer" or "package by feature".

Three things to note here:

1. Many examples are based on monolithic applications, something I personally very rarely work on. The example here addresses a microservice perspective. The bounded context itself is the main feature, so to speak.
2. Clean Architecture changes the structure and naming a bit. We will base our core understanding on CA and its nomenclature, as it's more intuitive and still packs the same punch as regular DDD.
3. TODO

TODO

## Uncle Bob's "Clean Architecture"

```
The Dependency Rule

The concentric circles represent different areas of software. In general, the further in you go, the higher level the software becomes. The outer circles are mechanisms. The inner circles are policies.

The overriding rule that makes this architecture work is The Dependency Rule. This rule says that source code dependencies can only point inwards. Nothing in an inner circle can know anything at all about something in an outer circle. In particular, the name of something declared in an outer circle must not be mentioned by the code in the an inner circle. That includes, functions, classes. variables, or any other named software entity.

By the same token, data formats used in an outer circle should not be used by an inner circle, especially if those formats are generate by a framework in an outer circle. We don’t want anything in an outer circle to impact the inner circles.

Entities

Entities encapsulate Enterprise wide business rules. An entity can be an object with methods, or it can be a set of data structures and functions. It doesn’t matter so long as the entities could be used by many different applications in the enterprise.

If you don’t have an enterprise, and are just writing a single application, then these entities are the business objects of the application. They encapsulate the most general and high-level rules. They are the least likely to change when something external changes. For example, you would not expect these objects to be affected by a change to page navigation, or security. No operational change to any particular application should affect the entity layer.

Use Cases

The software in this layer contains application specific business rules. It encapsulates and implements all of the use cases of the system. These use cases orchestrate the flow of data to and from the entities, and direct those entities to use their enterprise wide business rules to achieve the goals of the use case.

We do not expect changes in this layer to affect the entities. We also do not expect this layer to be affected by changes to externalities such as the database, the UI, or any of the common frameworks. This layer is isolated from such concerns.

We do, however, expect that changes to the operation of the application will affect the use-cases and therefore the software in this layer. If the details of a use-case change, then some code in this layer will certainly be affected.

Interface Adapters

The software in this layer is a set of adapters that convert data from the format most convenient for the use cases and entities, to the format most convenient for some external agency such as the Database or the Web. It is this layer, for example, that will wholly contain the MVC architecture of a GUI. The Presenters, Views, and Controllers all belong in here. The models are likely just data structures that are passed from the controllers to the use cases, and then back from the use cases to the presenters and views.

Similarly, data is converted, in this layer, from the form most convenient for entities and use cases, into the form most convenient for whatever persistence framework is being used. i.e. The Database. No code inward of this circle should know anything at all about the database. If the database is a SQL database, then all the SQL should be restricted to this layer, and in particular to the parts of this layer that have to do with the database.

Also in this layer is any other adapter necessary to convert data from some external form, such as an external service, to the internal form used by the use cases and entities.

Frameworks and Drivers.

The outermost layer is generally composed of frameworks and tools such as the Database, the Web Framework, etc. Generally you don’t write much code in this layer other than glue code that communicates to the next circle inwards.

This layer is where all the details go. The Web is a detail. The database is a detail. We keep these things on the outside where they can do little harm.
```

## Revised Clean Architecture structure

| DDD  | CA                                            | Mikael |
| ---- | --------------------------------------------- | ------ |
| asdf | Frameworks & Drivers (DB, Devices...)         | asdf   |
| asdf | Interface Adapters (Controllers, Gateways...) | asdf   |
| asdf | Application Business Rules (Use Cases)        | asdf   |
| asdf | Enterprise Business Rules (Entities)          | asdf   |

## Sizing

| One...                     | ...represents?                                                  |
| -------------------------- | --------------------------------------------------------------- |
| Microservice               | No more than 1 bounded context                                  |
| Git repository (mono-repo) | 1 microservice (composed of 1 or more functions etc.)           |
| Lambda function            | 1 "feature" (aggregate, use case...)                            |
| API Gateway                | The usecase/business-oriented entrypoint to the bounded context |

See: https://serverlessfirst.com/setting-boundaries/

> Evans believes that microservices is the biggest opportunity, but also the biggest risk we have had for a long time. What we should be most interested in is the capabilities they give us to fulfil the needs of the business we are working with, but he also warns against the bandwagon effect. One problem he sees is that many believe that a microservice is a bounded context, but he thinks that’s an oversimplification. He instead sees four kinds of contexts involving microservices.

1. `Service Internal` ("Using only this type, we would end up with services that don’t know how to talk to each other")
2. `API of Service` ("One challenge here is how teams design and adapt to different APIs. Data-flow direction could determine development dependency with consumers always conforming to an upstream data flow, but Evans think there are alternatives")
3. `Cluster of codesigned services` ("When several services are designed to work with each other to accomplish something, they together form a bounded context. Evans notes that the internals of the individual services can be quite different with models different from the model used in the API")
4. `Interchange Context` ("There are no services in this context; it’s all about messages, schemas and protocols")

See: https://www.infoq.com/news/2019/06/bounded-context-eric-evans/

### Use cases

```
In Clean Architecture, Uncle Bob describes use cases as the main features of the application.

These are all the things our application can do.

And in a previous article, we discovered that use cases were either commands or queries.
```

## Subdomain vs bounded contexts

> One confusion that Evans sometimes notices in teams is differentiating between bounded contexts and subdomains. In an ideal world they coincide, but in reality they are often misaligned. He uses an example of a bank structured around cash accounts and credit cards. These two subdomains in the banking domain are also bounded contexts. After reorganising the business around business accounts and personal accounts, there are now two other subdomains, but the bounded contexts stay the same, which means they are now misaligned with the new subdomains. This often results in two teams having to work in the same bounded contexts with an increasing risk of ending up with a big ball of mud.

See: https://www.infoq.com/news/2019/06/bounded-context-eric-evans/

## Setting boundaries

```
Now we're ready to go from domain model to application design. Here's an approach that you can use to derive microservices from the domain model.

1. Start with a bounded context. In general, the functionality in a microservice should not span more than one bounded context. By definition, a bounded context marks the boundary of a particular domain model. If you find that a microservice mixes different domain models together, that's a sign that you may need to go back and refine your domain analysis.

2. Next, look at the aggregates in your domain model. Aggregates are often good candidates for microservices. A well-designed aggregate exhibits many of the characteristics of a well-designed microservice, such as:
- An aggregate is derived from business requirements, rather than technical concerns such as data access or messaging.
- An aggregate should have high functional cohesion.
- An aggregate is a boundary of persistence.
- Aggregates should be loosely coupled.

3. Domain services are also good candidates for microservices. Domain services are stateless operations across multiple aggregates. A typical example is a workflow that involves several microservices. We'll see an example of this in the Drone Delivery application.

4. Finally, consider non-functional requirements. Look at factors such as team size, data types, technologies, scalability requirements, availability requirements, and security requirements. These factors may lead you to further decompose a microservice into two or more smaller services, or do the opposite and combine several microservices into one.

After you identify the microservices in your application, validate your design against the following criteria:
- Each service has a single responsibility.
- There are no chatty calls between services. If splitting functionality into two services causes them to be overly chatty, it may be a symptom that these functions belong in the same service.
- Each service is small enough that it can be built by a small team working independently.
- There are no inter-dependencies that will require two or more services to be deployed in lock-step. It should always be possible to deploy a service without redeploying any other services.
- Services are not tightly coupled, and can evolve independently.
- Your service boundaries will not create problems with data consistency or integrity. Sometimes it's important to maintain data consistency by putting functionality into a single microservice.
That said, consider whether you really need strong consistency. There are strategies for addressing eventual consistency in a distributed system, and the benefits of decomposing services often outweigh the challenges of managing eventual consistency.
```

See: https://docs.microsoft.com/en-us/azure/architecture/microservices/model/microservice-boundaries

## Service communication

```
The Lambda Pinball is a Serverless anti-pattern highlighted by ThoughtWorks, in which “we lose sight of important domain logic in the tangled web of lambdas, buckets and queues as requests bounce around increasingly complex graphs of cloud services.”

This is often the result of a lack of clear Service boundaries. Moving to an EDA and adopting EventBridge can help massively — but this is not a standalone silver bullet.

What is needed is a focus on Services, identifying clear Bounded Contexts (to borrow from Domain-Driven Design) and sharing Event Schemas, not code, API interfaces or Data.
```

See: https://medium.com/serverless-transformation/eventbridge-storming-how-to-build-state-of-the-art-event-driven-serverless-architectures-e07270d4dee

## References

- [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Comparison of Domain-Driven Design and Clean Architecture Concepts](https://khalilstemmler.com/articles/software-design-architecture/domain-driven-design-vs-clean-architecture/)
- [Identify microservice boundaries](https://docs.microsoft.com/en-us/azure/architecture/microservices/model/microservice-boundaries)
- [Big Picture Event Storming](https://medium.com/@chatuev/big-picture-event-storming-7a1fe18ffabb)
- [Awesome Domain-Driven Design](https://github.com/heynickc/awesome-ddd)
- [Awesome Software Architecture](https://awesome-architecture.com)
- [The Bounded Context Canvas](https://github.com/ddd-crew/bounded-context-canvas)
- [Designing Cloud Native Microservices on AWS (via DDD/EventStormingWorkshop)](https://github.com/aws-samples/designing-cloud-native-microservices-on-aws)
- [EventBridge Storming — How to build state-of-the-art Event-Driven Serverless Architectures](https://medium.com/serverless-transformation/eventbridge-storming-how-to-build-state-of-the-art-event-driven-serverless-architectures-e07270d4dee)
- https://www.youtube.com/watch?app=desktop\&v=HWX6BbPV\_QA
- [TypeScript DDD Demo Application](https://github.com/yerinadler/typescript-ddd-boilerplate)
- [Using tactical DDD to design microservices](https://docs.microsoft.com/en-us/azure/architecture/microservices/model/tactical-ddd)
- https://medium.com/nick-tune-tech-strategy-blog/domains-subdomain-problem-solution-space-in-ddd-clearly-defined-e0b49c7b586c
- https://khalilstemmler.com/articles/software-design-architecture/domain-driven-design-vs-clean-architecture/
- http://www.plainionist.net/Implementing-Clean-Architecture-UseCases/
- https://khalilstemmler.com/articles/enterprise-typescript-nodejs/application-layer-use-cases/
- https://github.com/mirzaakhena/gogen
- https://bazaglia.com/clean-architecture-with-typescript-ddd-onion/
- https://khalilstemmler.com/articles/typescript-domain-driven-design/chain-business-logic-domain-events/
- [How to Design & Persist Aggregates - Domain-Driven Design w/ TypeScript](https://khalilstemmler.com/articles/typescript-domain-driven-design/aggregate-design-persistence/)
- https://khalilstemmler.com/articles/typescript-domain-driven-design/updating-aggregates-in-domain-driven-design/
- https://khalilstemmler.com/articles/domain-driven-design-intro/
- https://viktorkugay.medium.com/strategic-domain-driven-design-and-enterprise-architecture-daefc346835f
- https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation#domain-events-as-a-preferred-way-to-trigger-side-effects-across-multiple-aggregates-within-the-same-domain
- https://martinfowler.com/eaaDev/DomainEvent.html
- https://medium.com/swlh/the-domain-driven-designs-missing-pattern-319bf16dad91
- https://www.jamesmichaelhickey.com/how-do-i-persist-ddd-aggregates/
- https://khalilstemmler.com/articles/graphql/ddd/schema-design/
- https://dgraph.io/blog/post/ddd-with-graphql/
