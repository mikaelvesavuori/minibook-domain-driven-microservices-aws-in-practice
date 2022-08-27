---
description: What made the concepts "click" together?
---

# So what's the deal with Domain Driven Design and microservices?

Why this combination of DDD and microservices? Both have become very popular for their own reasons.

DDD was a game changer (and is still somewhat singular) in that it insists on software being not just the engineering part, but also how it logically connects the physical and very real business end to software to accurately represent those ideas. Therefore, DDD was from the start contingent on _language_ as a primary tool to create cohesion and allow for expressive and rich modeling. It also came with many prescriptive ideas divided between the higher-level "strategic DDD" and the implementation patterns part of the "tactical DDD".

Microservices have grown in popularity as they, among other things, make it easier to build and represent distributed scenarios than building monoliths. As stated by [Amundsen, Nadareishvili, Mitra, and McLarty](https://www.oreilly.com/library/view/microservice-architecture/9781491956328/) and referenced at [O'Reilly](https://www.oreilly.com/content/a-quick-and-simple-definition-of-microservices/), microservices are:

> * Small in size
> * Messaging enabled
> * Bounded by contexts
> * Autonomously developed
> * Independently deployable
> * Decentralized
> * Built and released with automated processes
>
> — Source: [https://www.oreilly.com/content/a-quick-and-simple-definition-of-microservices/](https://www.oreilly.com/content/a-quick-and-simple-definition-of-microservices/)

{% hint style="info" %}
For more reading, see for example:

* [https://martinfowler.com/articles/microservices.html](https://martinfowler.com/articles/microservices.html)
* [https://samnewman.io/books/building\_microservices\_2nd\_edition/](https://samnewman.io/books/building\_microservices\_2nd\_edition/)
{% endhint %}

With the advent of Kubernetes and serverless functions, the practical operations around deploying them also significantly improved. Architects could finally _actually_ get those fine-grained services, and developers could finally build them faster and more neatly.

## The problem

I will quote `aryehof` on Reddit's thread "[Is Domain Driven Design still the recommended approach for enterprise applications or has any newer approach superseded it?](https://www.reddit.com/r/java/comments/n0kukj/is\_domain\_driven\_design\_still\_the\_recommended/)":

> Well what is in the original DDD book is not what tends to be written about or used in practice. The book is about how to successfully and repeatedly implement the plumbing to support a complex problem domain object model. It advocates that standard plumbing so you can _concentrate_ on object modeling the problem domain.
>
> > "The goal of domain-driven design is to create better software by focusing on a model of the domain rather than technology.", Eric Evans, Domain Driven Design p148.
>
> Unfortunately, very very few know how to object model a domain model independent of UI and persistence, so all sort of _alternatives_ have arisen. Most notably Event Sourcing/CQRS, or Data Table based object model architectures (aka Repository Driven Development), or "it's really just about boundaries and language" (lol). This is particularly the case in the .NET world where object modeling was never advocated by Microsoft or adopted by the community given its database tooling/wizard orientation.
>
> So DDD is popular in the same way that “Agile” is. In both cases their meanings have been corrupted in popular use, and in DDD's by a community that hasn't even read _the_ book ("but hey we read some articles or YouTube"). So something ambiguously labeled "DDD" is often recommended today, but does that really help?

TODO

### The "why"

Part of the rationale for undertaking this project is because through the years in which I've encountered, learned, used, and encouraged DDD and Agile design, I have myself never really had a "full-size" springboard to examplify just how to do it. Also, because there are many components to this whole package, it's easy to kludge everything and spend too much time on details—sometimes techy stuff, sometimes the theory, or whatever else that felt most important that particular day. Perhaps most importantly, I find it highly relevant in our day and age where there seems sometimes to exist a conflict between developer empowerment (such as expressed through DevOps and Agile) with the very concept of "design" altogether.

It is my highest recommendation that you also read the source materials, as those are some of the most excellent books and articles I—and I am sure, many out there in the software world—have read on software architecture. My work simply complements and illustrates some of those basics in a practical scenario, rather than extensively elaborating on them.

## When is DDD too much?

TODO

You can find deeper, but often somewhat similar, lines of though being presented in the serious literature around DDD, but for an online version see for example this one.

## When  should we not do microservices?

TODO
