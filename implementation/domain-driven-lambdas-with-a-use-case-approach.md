---
description: >-
  The secret sauce for building domain-driven microservices is highly dependent
  on the "use case" layer.
---

# Domain driven Lambdas with a use case approach

We are going to use an approach I've found to be well suited to writing testable and good implementations.

Some features of my approach include:

* We aim for simplicity and clarity of execution, prefering functions and a functional or procedural style for _most_ of the code (enabled by the directness and relative lack of fluff in JS/TS)
* We use a rich, powerful object-oriented approach for all complex components (i.e. entities and aggregates) to get the benefits of classic "real engineering master race" (insert meme)
* We get the expressive Clean Architecture-style layering
* We can easily use the tactical patterns in DDD (which we will come to soon)
* We can use microservices through an API Gateway to expose well-defined use cases as URL paths
* We can easily test our application using best practices and a "classicist" approach, meaning it scales well without any "test-speak" or bullshit
* The approach should be able to translate fluidly into any similar languages like C# or Java

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

TODO
