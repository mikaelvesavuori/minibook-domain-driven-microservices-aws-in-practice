---
description: >-
  The secret sauce for building domain-driven microservices is highly dependent
  on the "use case" layer.
---

# Domain driven Lambdas with a use case approach

How to effectively decompose applications into microservices and bounded contexts is a design exercise that may be challenging and sometimes counter-intuitive, at least if one has been beaten on the head with "FaaS is for single-purpose functions" one too many times. Here, I'll teach you an approach I've found to be well suited to writing testable and good implementations.

{% hint style="danger" %}
On this page I will attempt to dispell some misunderstandings and problematic interpretations of structuring work with microservices. Primarily I am concerned about "microservices dogmatism" which is easy to get extra coked-up on when combined with functions-as-a-service.

Keeping it super short:

* If you build a "flat landscape" using only Lambdas, then you are close to the "single purpose function" situation. While this is convenient and locally completely suitable in many solutions, as a way to structure an entire organization's landscape you are in for hell. Some reasons include having to deal with chattiness, latency, many surfaces that need to interact and suboptimal logical cohesion.
* This dogmatism is unrealistic and trivializes the complexity of developing for non-trivial implementation. It also practically eliminates all logical reuse of code and patterns as it cannot be colocated.
* The infrastructure needed for a service is never just Lambda. You need S3 to store the Lambda code, IAM roles, quite realistically an API Gateway and then whatever assortment of candy on top you need to do the work. You need to have a concise notion of what the deployment process is, and what resources it will contain. The "wrapping" on top of that single function is considerable.

You might be interested in [Setting boundaries in your serverless application](https://serverlessfirst.com/setting-boundaries/) also.
{% endhint %}

Features of my approach will mean that:

* We aim for simplicity and clarity of execution using a "one function per use case" type of microservice organization
* Hence, we prefer a functional or procedural style for _most_ of the code
* We can use microservices through an API Gateway to expose our well-defined use cases as URL paths
* We use a rich, powerful object-oriented approach for all _complex_ components (i.e. entities and aggregates) to get the benefits of classic "real engineering master race" (insert meme)
* We'll get the expressive Clean Architecture-style layering
* We set everything in order so we can use the tactical patterns in DDD (which we will come to later)
* We can easily test our application using best practices and a "[classicist](https://martinfowler.com/articles/mocksArentStubs.html#ClassicalAndMockistTesting)" approach, meaning it scales well without any test doubles, "test-speak jargon" or other bullshit
* The approach should be able to translate fluidly into any similar language like C# or Java

{% hint style="info" %}
Compared to [Khalil Stemmler's excellent DDD approach](https://khalilstemmler.com/articles/categories/domain-driven-design/) the approach presented here is intentionally _simpler_ in terms of technical implementation.

Something I _have_ borrowed from Khalil is [his objection to using Dependency Injection containers](https://khalilstemmler.com/articles/software-design-architecture/coding-without-di-container/). Again: We simplify and make the code better for it.

You may certainly want to look at his work when, or if, you feel inspired to accelerate my way of doing things. I know I learned a lot from reading his stuff!
{% endhint %}

TODO

{% hint style="info" %}
You may also find various Node + DDD projects out in the wild. Without mentioning any names or details (since I've never used them; just inspected them), this approach is better suited to the serverless microservices context (also of course being directly adapted for such a context) and I personally believe my Clean Architecture/DDD-layering stays truer and more conceptually steadfast than what at least I have seen in various projects.
{% endhint %}

TODO

> From a system complexity standpoint, a deep module reduces the system's global complexity, while a shallow module increases it by introducing a component that doesn't encapsulate its local complexity.
>
> Shallow services are also the reason why so many microservices-oriented projects fail. The mistaken definition of a microservice as a service having no more than X lines of code, or as a service that should be easier to rewrite than to modify, concentrate on the individual service while missing the most important aspect of the architecture: the system.
>
> The threshold upon twhich a system can be decomposed into microservices is defined by the use cases of the system that the microservices are a part of.
>
> — Source: Learning Domain Driven Design p.224, Khononov

TODO

> Both microservices and bounded contexts are physical boundaries. Microservices, as bounded contexts, are owned by a single team. As in bounded contexts, conflicting models cannot be implemented in a microservice, resulting in complex interfaces. Microservices are indeed bounded contexts. \[...]
>
> \[T]he relationship between microservices and bounded contexts is not symmetric. Although microservices are bounded contexts, not every bounded context is a microservice. Bounded contexts, on the other hand, denote the boundaries of the largest valid monolith. \[...]
>
> \[I]f the system is not decomposed into proper bounded contexts or is decomposed past the microservices threshold, it will result in a big ball of mud or a distributed big ball of mud, respectively.&#x20;
>
> — Source: Learning Domain Driven Design p.226-227, Khononov

## How do we size and relate microservices in serverless DDD?

There are some number of different takes on how one would relate and size Lambdas, deployments, and how they map to DDD concepts.

The below is what I've come to find is the most lucid and rational way to do this when we are building and designing our own system.

{% hint style="info" %}
For a deeper dive by Eric Evans on different types of bounded contexts and some critique on how one microservice _is not necessarily_ one bounded context (which I think it should be), see [Language in Context - Eric Evans - DDD Europe 2019](https://www.youtube.com/watch?v=xyuKx5HsGK8).
{% endhint %}



| One...                                               | ...represents                                                                                                                                 |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Git repository (classic, single-repo)                | A single microservice                                                                                                                         |
| Git repository (mono-repo)                           | One or more microservices                                                                                                                     |
| Serverless Framework configuration (.yml) or similar | Definition for a single microservice                                                                                                          |
| Microservice                                         | <p>A single <em>bounded context</em><br><em></em><br><em></em><strong>Note</strong>: <em>"</em>Microservice" is used as a logical concept</p> |
| Lambda function                                      | <p>A single <em>use case</em><br><em></em></p><p><strong>Note</strong>: <em>"</em>Function" is used as an infrastructual concept</p>          |
| API gateway                                          | The exposure point for the _functions_                                                                                                        |

This table, in plain text, could be summarized as:

> A **Git repository** contains (typically) one **microservice that fully represents a single bounded context**. Each microservice is defined by a **single authoritative definition/configuration** and may contain **one or multiple functions that each represent a use case in the bounded context**. An API gateway is the typical way to expose (and protect) the functions.

Let's say that again: A microservice is not the individual function, it's the bounded context with all of its functions. "Microservices", hence, refers to the granular style and explicit scope of each bounded context together with the tiny, decoupled deployment artifacts (functions).

Continuing with some of the features I listed at the start of this page:

* Functions are truly independent
* We can use any number of functions that may or may not interact with each other (or other systems)
* We have colocation of code that is logically shared (i.e. bounded context)
* You have the option of atomically deploying (i.e. individual functions) or update the whole microservice (bounded context)
* We have complete isolation from code and artifacts from other bounded contexts
* The approach is logically and technically scalable

TODO
