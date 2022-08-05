# What we will be building

This example and workshop focuses on overall system design and the goal of setting up an event-driven architecture.

The format will be of a guided tour, meaning that I will write sequentially (post-fact) about the key parts involved in landing a solution I feel encompasses what this book is trying to tell.

In the interest of time and energy, certain features of a full solution are therefore excluded from the scope of this exercise. Also, we should spend less time on details like worrying for conflicting names of rooms, as that is not what we are focusing our cognitive effort on.

Also, the code's "mono repo" structure is more for convenience than a "decision" as such.

## Structure

The root of the GitHub code repository will contain the following pertinent bits: (TODO)

* `code`: Source code
* `data-modeling`: JSON files to use when starting to model the data
* `diagrams`: Diagrams for the solution

## Data modeling

The `data-modeling` folder contains various forms of data which we can model and fill in for our use case.

We can skip any envelope level here and just focus on the original data contents instead.

For dynamic values, set the field similar to the format `"<Some description here>"`.

## Goals

Two domains Three bounded contexts (2+1 in domains)

* Show concrete, minimal (but useful) implementation of DDD and CA in TypeScript
* Understand how trivial or simplistic implementations can be harmful
  * Self-implementing an API Gateway (_can_ be useful, but is most probably not)
  * Distributed monolith
  * Every function is its own bounded context (too large)
  * Unclear API, contracts, and eventing
  * Single point of failure and not understanding the "Fallacies of Distributed Computing"
* Answer questions like:
  * How to do strategic DDD (bounded context, context maps, domain model, ubiquitous language...)
  * How to map bounded contexts/subdomains etc. into a serverless/microservices implementation
  * Deciding on Published Language, Anti-Corruption Layer, Shared Kernel, Open Host Service, Customer/Supplier, Conformist, or Partnership for interacting/relating/integrating with/between bounded contexts (Vaughn Vernon, IDDD)
  * Implement tactical DDD with value objects, entities, aggregates, (application and domain) services, factories, and domain events
  * Ease and improve DDD structure with Clean Architecture
  * Understand event patterns like 1:1 (send to topic owned by single, other bounded context), fan-out (and shared topics across bounded contexts), event bus (such as EventBridge), CQRS
  * How to do choreographed eventing
  * How to do orchestrated workflows (across multiple domains/bounded contexts) and transactional consistency plus rollbacks
  * Persisting data, and doing so across bounded contexts
  * Using ideas from Team Topologies to steer team interactions
  * Using TBD to increase productivity
  * Using branch-by-abstraction and other strategies for safe service evolution
  * Serverless/microservices testing strategies
* Display patterns and implementations like:
  * Domain Event Publisher
  * Deferring event publication (?)
  * Published Language (and API and event contracts...)
  * Event Sourcing using DynamoDB streams (?)
  * CQS and Command events
