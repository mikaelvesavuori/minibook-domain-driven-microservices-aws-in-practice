---
layout: editorial
---

# Introduction

This online mini-book aims to explain and demonstrate how one might practically apply Domain Driven Design to a room-booking service we are building on Amazon Web Services.

## On Domain Driven Design

Domain Driven Design has grown in the 20-odd years it's been around to be a foundational part of modern software architecture and shaping the methodology with which many work in software. It seems to have been given an enormous upswing after the microservices pattern become more in vogue some 5-10 years ago.

For me, reading about Domain Driven Design—first through articles and then through the [blue book](https://www.domainlanguage.com/ddd/blue-book/) and [red book](https://kalele.io/books/)—made for an exciting summer some years back: It was really obvious (!) that we need to connect the "business" with the implementation. The explosive thing about the books, however, was that they went well and beyond the platitudes of the _statement_ (as you read it in the last sentence) to actually detailing patterns, strategies and ways to actually get there.

The "problem", if one can call it that, is that both of the books are big. Like really big. I think they fall squarely into the lap of certain types of folks who still enjoy the intellectual exercise and sometimes relatively abstract way of learning that goes with the territory.

## On design

As for me, who has worked in some way with computers since I was a kid but did not graduate in Computer Science, development is something that was learned on my own. While many years ago I might have understood what an architect did, I personally gradually learned more and more on that side as I started building my own software, distributing open source, and leading technical teams.

One side of the word "design" that I feel to be misunderstood is around how it relates to practices such as Agile and its various forms (which is something every company and context I've been at has talked about, but not really delivered on) as well as to how the architect(s) fit in within modern software development, the DevOps paradigm, and being generally allergic to upfront planning.

It's nice then to see that this is less a real issue than a perceived one. We can see this in how Agile framework co-founder Robert C. Martin tries to set the record straight in his [Clean Agile: Back to Basics](https://www.oreilly.com/library/view/clean-agile-back/9780135782002/) as well as in the humble "[connect the penthouse with the engine room](https://architectelevator.com)" metaphor stated by Gregor Hohpe. They both express that design is something that _must_ be done, Agile or not, and that modern circumstances do not have to pass on a golden key to some Ivory Tower dude to handle to design on their own.

## Audience

I am writing this for several intended audiences:

* **The curious Internet-wanderers**: Being an open book on the internet, I assume someone out there might be interested in learning what is taught here.
* **Colleagues**: Because we talk a lot about these things and since nothing beats actually showing what we mean.
* **Myself**: As a way to learn more and hone my didactic, communicative, and technical skills.

## Assumptions

You should be familiar with AWS and development in general, and if possible, it is ideal if you know TypeScript.

I will not assume that you are a certified AWS professional or an architect. My mission here is more to bring together all the things that make modern software what it is: DevOps, development, architecture and understanding of the cloud and how we deploy and run things there.

If anything, the **main** intent in this project is to spend more time discussing intellectual details such as the architecture rather than going all-out on code. The code _will_ be important as that's of course where we implement the things discussed, but in the end it's just one part of the big picture.

## Learning goals

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
