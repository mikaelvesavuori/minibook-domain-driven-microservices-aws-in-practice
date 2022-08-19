# Introduction

This online mini-book aims to explain and demonstrate how one might practically apply [Domain Driven Design](https://en.wikipedia.org/wiki/Domain-driven\_design) (DDD) to a room-booking service using a microservices pattern that we will build on Amazon Web Services.

After having read—and coded, if you want—you will have a **hands-on feeling for how a project can go from a scenario to something that represents a well-structured, domain-oriented application**. Just like Vaughn Vernon's "Implementing Domain Driven Design" drove Eric Evans's book to a more practical level, my intent here is to maximize that push to the practical. You will be presented with lightweight descriptions of most of the core concepts while fast-tracking (and back-tracking) all the steps I did myself to create our demo application.

## Audience

I am writing this for several intended audiences:

* **The curious software developer**: Being an open book on the internet, I assume there are throngs of software developers out there who might be interested in learning what is taught here, if not by me, then at least the themes addressed here.
* **Colleagues**: Because we talk a lot about these things and since nothing beats actually showing what we mean.
* **Myself**: As a way to learn more and hone my didactic, communicative, and technical skills.

## Assumptions

You can call yourself or work as whatever, but you will most likely be some kind of developer. You should be familiar with AWS and development in general, and if possible, it is ideal if you know TypeScript. I will not assume that you are a certified AWS professional or an architect. My mission here is more to bring together all the things that make modern software what it is: DevOps, development, architecture and an understanding of the cloud and how we deploy and run things there.

If anything, the **primary** intent of this project is to spend more time discussing intellectual details such as the architecture rather than going all-out on code. The code _will_ be important as that's of course where we implement the things discussed, but in the end it's just one part of the big picture. TODO check

## Learning goals

First and foremost is of course to make you understood how you practically can produce a concrete, minimal but useful implementation of AWS-based serverless microservices using Domain Driven Design and Clean Architecture and developed with TypeScript.

### Understanding problems in common solutions

You will understand how trivial or simplistic implementations can be harmful:

* Self-implementing an API Gateway (_can_ be useful, but is most probably not)
* Distributed monolith
* Every function is its own bounded context (too large)
* Unclear API, contracts, and eventing
* Single point of failure and not understanding the "Fallacies of Distributed Computing"

### New skills to bring home

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

## Note about the reality of writing about something while doing the work at the same time

This is just a short disclaimer to be super-real about the fact that it is somewhat challenging to, on one's own:

* Concoct (out of thin air) a business case regarding a, to be honest, fictional need;
* Lay out a workshop and learning plan,
* Build the system according to the best of my abilities...
* ...while still doing it (literally) by the book I am writing...
* ...and then to live to write about all of that!

Doing all of the parts means that I also get more or less "perfect information", which is never the case in real life. We never know all there is to know and how best to approach it.

So with that said, reality in a real production context will pose other problems than those I had when making this material for you. What is hard on one's own is stuff like having no one to really ideate with, no one to do another part of the labor, no one to help you role play business owner etc. Working with others, however, will give you a somewhat realer problem set, such as discussing, arguing, teaching and learning with others. Never forget that the social side is _big_ for us as tech people.

I feel happy about what I _have_ made though, and I hope at the end of it, that you feel the same!
