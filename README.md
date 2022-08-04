---
layout: editorial
---

# Introduction

This online mini-book aims to explain and demonstrate how one might practically apply Domain Driven Design to a room-booking service, using a microservices pattern, that we will build on Amazon Web Services.

As \[Chandra Ramalingan writes]\(https://medium.com/walmartglobaltech/building-domain-driven-microservices-af688aa1b1b8), microservices should be defined as: (TODO)

> Loosely coupled service-oriented architecture, where each service is enclosed within a well-defined bounded context, enabling rapid, frequent, and reliable delivery of applications.

Part of the rationale for undertaking this project is because through the years I've encountered, learned, used, and encouraged DDD and agile design, I have myself never really had a "full-size" springboard to examplify how to do it. Also, because there are many components to this it's easy to kludge everything and spend too much time on details—sometimes techy stuff, some times other things. Perhaps most importantly, I find it highly relevant in our day and age where there seems sometimes to exist a conflict between developer empowerment (such as DevOps) and Agile and various "agile tastes" with the concept of "design" altogether.

It is my highest recommendation that you also read the source materials, as those are some of the most excellent books and articles I (and I am sure, many) have read on software architecture. My work complements and illustrates some of the basics in a practical scenario, rather than extending them.

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

First and foremost is of course to make you understood how you practically can produce a concrete, minimal but useful implementation of AWS-based serverless microservices using Domain Driven Design and Clean Architecture and developed with TypeScript.

You will understand how trivial or simplistic implementations can be harmful:

* Self-implementing an API Gateway (_can_ be useful, but is most probably not)
* Distributed monolith
* Every function is its own bounded context (too large)
* Unclear API, contracts, and eventing
* Single point of failure and not understanding the "Fallacies of Distributed Computing"

You will be able to practically address questions like:

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

You will have seen patterns and implementations like:

* Domain Event Publisher
* Deferring event publication (?)
* Published Language (and API and event contracts...)
* Event Sourcing using DynamoDB streams (?)
* CQS and Command events
