---
description: >-
  Welcome to the fast track, taking you from DDD novice to actually
  understanding a real, modern application built with it in mind.
---

# Introduction

This online mini-book aims to explain and demonstrate how one might practically apply [Domain Driven Design](https://en.wikipedia.org/wiki/Domain-driven\_design) (DDD) to a room-booking service using a microservices pattern that we will build on Amazon Web Services.

**Domain Driven Design** is a software design approach that has been around for almost 20 years, and has gained massive attention with the surge of microservices and related technologies. DDD focuses on logical, semantic, and structural sides of software development (heavily leaning on the business end) more than on prescriptive implementation, though it does provide very clear design patterns. While our application will not be truly complex, it is complex enough to warrant a structured and business/domain-oriented approach.

**Microservice architecture** is a software architecture style that emphasizes _small, well-defined, loosely coupled services that interact together_ over singular, monolithic applications. Technologies like Kubernetes and serverless functions has accelerated the uptake of this style, as it may was hard and potentially expensive in older, non-cloud computing paradigms. Microservices are a good fit with our technology stack as well as helping us enforce clearer boundaries between system components as per DDD.

There is nothing extravagantly special in terms of reasons for choosing **AWS**. While the services and their particulars are certainly unique to AWS, there is nothing with the overall architecture that cannot be transported to Azure, Google Cloud Platform, or other clouds. The specific path we are walking here will be around [serverless technologies](https://en.wikipedia.org/wiki/Serverless\_computing) and a [cloud-native way of thinking](https://docs.microsoft.com/en-us/dotnet/architecture/cloud-native/definition). AWS provides excellent paths for us to build and run the application.

Throughout the book several other concepts and methodologies will be introduced to further extend our approach and implementation details of our project.

## What you'll learn and do

The project will demonstrate rich and powerful patterns—binding together serverless, microservices, DDD, Clean Architecture, TypeScript and more—presented in a digestible way. It will, as best as I can, hold back on some "mannerisms" and complexities in the DDD and tech world that may detract from the core learnings I have to impart.

After having read this minibook—and coded alongside the provided project, if you want—you will have a **hands-on feeling for how a project can go from a scenario (an "ask") to something that represents a well-structured, domain-oriented application**.

Just like [Vaughn Vernon's _Implementing Domain-Driven Design_](https://www.goodreads.com/book/show/15756865-implementing-domain-driven-design) (2013) drove the OG, [Eric Evans's _Domain-Driven Design: Tackling Complexity in the Heart of Software_](https://www.goodreads.com/book/show/179133.Domain\_Driven\_Design) (2003), to an even more practical level, my intent here is to maximize that kind of push towards an honest-to-God practical reference example. You will be presented with lightweight descriptions of most of the core concepts while fast-tracking (and back-tracking) all the steps I did myself to create our demo application.

I will also of course share resources and references throughout in case you are interested to go deeper in any particular aspect we are touching on.

## Why I'm writing this book

Part of the rationale for undertaking this project is because through the years in which I've encountered, learned, used, and encouraged DDD and Agile design, I have myself never really had a "full-size" springboard to examplify just how to do it. Also, because there are many components to this whole package, it's easy to kludge everything and spend too much time on details—sometimes techy stuff, sometimes the theory, or whatever else that felt most important that particular day.

Perhaps most importantly, I find it highly relevant in our day and age where there seems sometimes to exist a conflict between developer empowerment (such as expressed through DevOps and Agile) with the very concept of "design" altogether. More on that later.

## Out of scope

This is a book with a broad range. There is an incredible amount of specialist literature and resources to lean into for a multitude of areas that we'll raise here; I'm doing my best to be transparent and link to them. Don't necessarily expect all answers to be given here, you'll probably have better luck just continuing your research elsewhere.

The project itself won't be perfect either. There are always things to improve (or goldplate, if you wish) and more advanced patterns to bring in. That's OK. However, I feel confident in that the project should be well and good enough to demonstrate with clarity the primary concepts: DDD, microservices, and running it in AWS.

## Audience

I am writing this for several intended audiences:

* **The curious software developer**: Being an open book on the internet, I assume there are throngs of software developers out there who might be interested in learning what is taught here, if not by me, then at least the themes addressed here.
* **Colleagues**: Because we talk a lot about these things and since nothing beats actually showing what we mean.
* **Myself**: As a way to learn more and hone my didactic, communicative, and technical skills.

## Assumptions

My mission here is more to bring together all the things that make modern software what it is: DevOps, development, architecture and an understanding of the cloud and how we deploy and run things there.

You can call yourself whatever or work as whatever, but you will most likely be some kind of developer or engineer or architect.

You should be familiar with AWS and development in general, and if possible, it is ideal if you know TypeScript. I will not assume that you are a certified AWS professional or an architect.&#x20;

## Structure

You will find the `Introduction` section first, as expected, where (beyond this page) you'll also get a smooth ride into some of the questions and concerns I've had, and that you may have as well when it comes to the cloud, DDD, microservices, and how they mix. This is followed by some other meta-materials.

The book proper starts at `Scenario`. Here we will look at the requirements set out for our application, as well as inspecting the coded example to fit with those requirements, and how you can use it locally on your machine.

Next up is `Strategic DDD`. This section captures many of the core concepts of this first, less implementation-oriented, phase when we build domain-driven systems. You'll start seeing how we can describe a Ubiquitous Language, how we do domain modeling and context mapping, how we use EventStorming to better understand our system-to-be and its flows, and more.

At this point we may be rearing to go, but we'll first stop by the `Groundwork` section in which we will approach our cloud architecture and basic technical patterns. Since this isn't strictly related to the DDD parts of our implementation, we can instead zoom in on how to set up a cloud-native, serverless frame or boilerplate for our microservices that can be evolved with business logic and Clean Architecture patterns further down the line.

With that part done, finally we get to go knee-deep in detail in `Tactical DDD`. In this section we'll get to use the vital patterns that separates a decent application from a great one, seeing for example how we can write aggregates that make sense in microservices.

Throughout the book I'll do my best to reference good materials, either online or in literature. The last section, `References and resources`, does what it sounds like: Providing you with a compilation of further research.&#x20;

## Learning goals

First and foremost of the learning goals is of course to make you understand how to practically produce a concrete, minimal, but useful implementation of AWS-based serverless microservices using Domain Driven Design and Clean Architecture and develop it using TypeScript.

### New skills to bring home

You will be able to practically address questions like:

* How to do strategic DDD: Definining a domain model, outlining bounded contexts, making context maps, specifying a ubiquitous language...
* How to map bounded contexts/subdomains etc. into a serverless microservice implementation
* Deciding on the type of relationship and integrations between domains and contexts, including: Published Language, Anti-Corruption Layer, Shared Kernel, Open Host Service, Customer/Supplier, Conformist, and Partnership
* Implementing tactical DDD with value objects, entities, aggregates, (application and domain) services, factories, and domain events
* Ease and improve on DDD with a module structure inspired by Clean Architecture
* Understand event patterns like 1:1 (send to topic owned by single, other bounded context), fan-out (and shared topics across bounded contexts), event bus (such as EventBridge), CQRS
* How to do choreographed event messaging
* How to do orchestrated workflows (across multiple domains/bounded contexts) and transactional consistency plus rollbacks (TODO)
* Persisting data with Repositories and Aggregates, and doing so across bounded contexts
* Using serverless/microservices testing strategies to increase productivity and confidence

You will have seen patterns and implementations like:

* Domain Event Publisher
* Published Language (and API and event contracts...)
* Event Sourcing using DynamoDB streams (TODO)
* CQS and Command events (TODO)

### Understanding problems in common solutions

You will understand how trivial or simplistic implementations can be harmful:

* Self-implementing an API Gateway (_can_ be useful, but is most probably not)
* Distributed monolith
* Every function is its own bounded context (too large)
* Unclear APIs, contracts, and events
* Single point of failure and not understanding the "Fallacies of Distributed Computing"

## Note about the reality of writing about something while doing the work at the same time

This is just a short disclaimer to be super-real about the fact that it is somewhat challenging to (on one's own):

* Concoct (out of thin air) a business case regarding a, to be honest, fictional need;
* Lay out a workshop and learning plan,
* Build the system according to the best of my abilities...
* ...while still doing it (literally) by the book I am writing...
* ...and then to live to write about all of that!

Doing all of the parts means that I also get more or less "perfect information", which is never the case in real life. We never know all there is to know and how best to approach it.

So with that said, reality in a real production context will pose other problems than those I had when making this material for you. What is hard on one's own is stuff like having no one to really ideate with, no one to do another part of the labor, no one to help you role play business owner etc. Working with others, however, will give you a somewhat realer problem set, such as discussing, arguing, teaching and learning with others. Never forget that the social side is _big_ for us as tech people.

I feel happy about what I _have_ made though, and I hope at the end of it, that you feel the same!
