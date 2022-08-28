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
