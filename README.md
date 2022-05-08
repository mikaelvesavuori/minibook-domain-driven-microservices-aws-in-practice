---
layout: editorial
---

# DDD microservice example

Description.

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
